---
title: "[React] Mobx-state-tree #15 : Use Volatile State and Lifecycle Methods to Manage Private State
"
comments: true
layout: post
categories: react
tags:
- react
- mobxstatetree
---

15번째 레슨입니다. MST에는 매우 유니크한 기능이 있습니다. It allows you to capture private state on models, and manage this state by using lifecycle hooks. For example by setting up a WebSocket connection and disposing of the connection automatically as soon as the instance gets removed from the store. In this lesson, we will leverage cancellable fetches to abort in-flight requests when appropriate

<br>우리는 이번 레슨에서 다음을 배우게 됩니다.

- `window.fetch` 요청을 중단하는 방법.
- Storing private, volatile, internal state in the function closure
- A second life-cycle hook: `beforeDestroy`

<br>

> 이 포스팅은 제가 학습한 내용을 기록한 글입니다. 이전글 ["\[React\] Mobx-state-tree #14 : 서버에서 데이터 가져오기"](/zzan/@anpigon/react-mobx-state-tree-14)에서 이어지는 내용입니다.

<br>

***

# Use Volatile State and Lifecycle Methods to Manage Private State

> 강의 링크: [https://egghead.io/lessons/react-use-volatile-state-and-lifecycle-methods-to-manage-private-state](https://egghead.io/lessons/react-use-volatile-state-and-lifecycle-methods-to-manage-private-state)

<br>
<br>

이번에는 새로고침 버튼을 추가하고, 새로고침 버튼을 누를 때마다 서버에서 데이터를 받아오도록 해보겠습니다.

<br>

`Group.js` 파일을 수정합니다. **Group** 모델에 `reload` 액션을 추가합니다.

`src/models/Group.js`

```js
import { types, flow, applySnapshot } from "mobx-state-tree";

export const User = types
  .model({ // (...) })})
  .actions(self => ({ // (...) }) }));

export const Group = types.model({
  users: types.map(User)
})
.actions(self => ({
  load: flow(function*() { // (...) }),

  // reload 액션 추가
  reload() {
    self.load();
  },
}));
```

<br>

그리고 화면에 Reload 버튼을 추가합니다. Reload을 누르면 group의 reaload 액션을 호출할 것입니다.

`src/components/App.js`

```js
import // (...)

class App extends React.Component {
  constructor(props) { // (...) }

  render() {
    const { group } = this.props;
    const selectedUser = group.users.get(this.state.selectUser);

    return (
      <div>
        <h1 className="App-title">WishList</h1>

        {/* Reload 버튼 추가 */}
        <button onClick={group.reload}>Reload</button>
        
        <select onChange={this.onSelectUser}>
          <option value="">- Select user -</option>
          {values(group.users).map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {selectedUser && <User user={selectedUser} />}
      </div>
    );
  }

  onSelectUser = event => { // (...) };
}

const User = observer(({ user }) => ( // (...) ));

export default App;
```

<br>

이제 **Reload** 버튼을 누르면 서버에서 데이터를 다시 로드 합니다. 개발자 도구에서 네트워크 요청을 살펴보면 데이터를 멋지게 가져 오는 것을 볼 수 있습니다.  사실 문제가 하나 있습니다. 리로드 버튼을 많이 클릭하면 많은 요청이 진행됩니다. 여러번 요청할 때는 이전 요청을 취소하는 것이 좋을 것입니다.

새로운 요청이 들어오면 현재 요청은 중단되어야합니다. Fetch API에는 이를 지원하는 라이브러리가 있습니다. 이를 수행하는 방법은 AbortController를 작성하는 것입니다.

fetch를 생성할 때 signal를 전달합니다. AbortController에서 나온 signal을 Fetch API에 바인딩합니다. 이제 AbortController에서 abort을 호출하면 Fetch API가 취소됩니다.

요청이 중단되면 에러가 발생할 것입니다. try / catch를 사용하여 요청이 중단되었음을 알 수 있습니다. 그렇지 않은 경우에만 성공으로 처리합니다.

다음과 같이 **AbortController** 를 사용합니다.

`src/models/Group.js`

```js
export const Group = types
  .model({
    users: types.map(User)
  })
  .actions(self => {
    let controller; // 컨트롤러

    return {
      afterCreate() {
        self.load();
      },

      // load 액션 수정
      load: flow(function*() {
        controller = window.AbortController && new window.AbortController();
        try {
          const response = yield window.fetch("http://localhost:3001/users", {
            signal: controller.signal
          });
          applySnapshot(self.users, yield response.json());
          console.log("success");
        } catch (e) {
          console.log("aborted", e.name);
        }
      }),

      reload() {
        // abort current request
        if (controller) controller.abort();
        self.load();
      }
    };
  });
```

<br>그리고 어떤 이유에서 group이 메모리에서 언로드되면 우리는 보류중인 요청을 중단 할 수 있어야 합니다. 여기에는 `beforeDestroy` 후크를 활용할 수 있습니다.

```js
export const Group = types
  .model({
    users: types.map(User)
  })
  .actions(self => {
    let controller;

    return {

      // (...)

      beforeDestory() {
        if (controller) controller.abort();
      }
  });
```

<br>

이제 많은 요청을 실행하면 마지막 요청만 완료되고 다른 요청들은 중단됩니다. 콘솔 로그를 확인하면 이것이 우리가 기대했던 동작을 확인할 수 있습니다. 새로운 요청이 발생하여 일부는 성공하고 일부는 중단된 것을 볼 수 있습니다.

![2.gif](https://files.steempeak.com/file/steempeak/anpigon/Zqr3LQV5-2.gif)

<br>

***

## axios에서 이전 요청 중단하기

axios에서 이전 요청을 중단하기 위해서는 `axios.CancelToken`를 사용합니다. 

```js
import axios from 'axios';

export const Group = types
  .model({
    users: types.map(User)
  })
  .actions(self => {
    let cancel; // 취소 컨트롤러

    return {
      afterCreate() {
        self.load();
      },

      load: flow(function*() {
        try {
          const response = yield axios.get('http://localhost:3001/users', {
            cancelToken: new axios.CancelToken(c => {
              cancel = c;
            })
          });
          applySnapshot(self.users, yield response.json());
          console.log("success");
        } catch (e) {
          if (axios.isCancel(e)) {
            console.log('request canceled', e.name);
          }
        }
      }),

      reload() {
        // abort current request
        if (cancel) cancel();
        self.load();
      }
    };
  });
```

<br>

***

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 작성하였습니다.

`댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>