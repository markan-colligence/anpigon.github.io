---
title: "[React] Mobx-state-tree #11 : 더 많은 mobx-state-tree Types 배우기: map, literal, union, enumeration"
comments: true
layout: post
categories: react
tags:
- react
- mobxstatetree
---

11번째 레슨입니다. 이번 레슨에서는 그룹 및 사용자의 개념을 소개합니다. 그룹 내에 여러 사용자를 관리할 수 있습니다. 그리고 각 사용자들은 각각의 위시 리스트를 가질 수 ​​있습니다. 또한 union 타입과 타입 discrimination의 강력한 기능을 간단히 살펴볼 것입니다.

우리는 이번 레슨에서 다음을 배우게 됩니다.

- key로 데이터를 저장하기 위해 type map 사용하기
- single value types를 생성하기 위해  literals 사용하기
- type discrimination 하기 위해 literals 과 unions을 Combining 하기
- quick coding experiments를 위해 Quokka를 scratchpad로 사용하기
- enumerations 사용하기
- Enumerations는 literals의 union에 대한  just sugar 이다. 🤔

<br>

> 이 포스팅은 제가 학습한 내용을 기록한 글입니다. 이전글 ["\[React\] Mobx-state-tree #10 : Model Definitions Change되면 Hot Module Reloading를 사용하여 Model Tree State 복원하기"](/react/2019/08/28/manage-application-state-with-mobx-state-tree-10/)에서 이어지는 내용입니다.
<br>

***

# More mobx-state-tree Types: map, literal, union, and enumeration

> 강의 링크: [https://egghead.io/lessons/react-more-mobx-state-tree-types-map-literal-union-and-enumeration](https://egghead.io/lessons/react-more-mobx-state-tree-types-map-literal-union-and-enumeration)


<br>

이제 사용자 그룹을 만들고 각 사용자가 각자의 위시 리스트를 가지도록 모델을 개선해 봅시다.


## User 모델 만들기

`groups.js` 파일을 새로 생성합니다. 그리고 User 모델을 정의 합니다. User 모델은 `id` 와 `name`, 그리고 `gender` 속성을 가집니다.  

`src/models/Group.js`

```js
import { types } from 'mobx-state-tree';

const User = types.model({
  id: types.string,
  name: types.string,
  gender: types.union(types.literal('m'), types.literal('f'))
});
```

타입을 선택할 수 있는 유형을 일반적으로 union이라 합니다. 두 가지 타입을 결합하여 gender을 표현하게 됩니다. 여기서  `gender` 값은 반드시 `m` 또는 `f` 여야합니다.

<br>

## Quokka 사용하여 빠르게 테스트해보기

VSCode의 익스텐션 프로그램 **Quokka**를 사용하면 자바스크립트 또는 타입스크립트를 스크래치 패드에서 빠르게 만들고 실행할 수 있습니다. 

VSCode에 Quokka 익스텐션을 설치합니다.
- Quokka 익스텐션 설치 하기: [https://marketplace.visualstudio.com/items?itemName=WallabyJs.quokka-vscode](https://marketplace.visualstudio.com/items?itemName=WallabyJs.quokka-vscode)
![](https://files.steempeak.com/file/steempeak/anpigon/p96ntRsb-E18489E185B3E1848FE185B3E18485E185B5E186ABE18489E185A3E186BA202019-08-2920E1848BE185A9E18492E185AE202.37.02.png)

<br>그다음 단축키 `Cmd + Shift + P`를 눌러 Quokka에서 New File를 생성합니다.

![](https://files.steempeak.com/file/steempeak/anpigon/bxOzRmWy-E18489E185B3E1848FE185B3E18485E185B5E186ABE18489E185A3E186BA202019-08-2920E1848BE185A9E18492E185AE202.34.59.png)

위에서 작성한 코드를 Quokka에 복사&붙여넣기 합니다. 그리고 User 모델 인스턴스를 생성하고 `genger` 속성에 `m` 또는 `f` 외에 엉뚱한 값을 넣어보세요. 그럼 다음과 같이 잘못된 타입이라는 에러가 발생합니다.
![](https://files.steempeak.com/file/steempeak/anpigon/SaVyYpuM-_2019-08-25_20.10.49.png)

하지만 `genger`에 `m` 값을 입력하면 다음과 같이 에러가 발생하지 않습니다.
![](https://files.steempeak.com/file/steempeak/anpigon/dikK6ZBr-_2019-08-25_20.10.04.png)


이제 Man과 Woman 모델을 각각 정의하고, 이 두 모델을 다시 union하여 Human을 정의해봅시다. 그리고 나서 Human 인스턴스를 생성할때 `gender`에 `m`을 입력하여 `somebody`를 생성합니다. 우리는 `somebody`가 man인지 아닌지 간단히 확인할 수 있습니다. 

```js
import { types } from 'mobx-state-tree';

const Man = types.model({
	id: types.string,
	name: types.string,
	gender: types.literal('m')
});

const Woman = types.model({
	id: types.string,
	name: types.string,
	gender: types.literal('f')
});

const Human = types.union(Man, Woman);

const someone = Human.create({
	id: "123",
	name: "michel",
	gender: "m"
})

console.log(Man.is(someone))
console.log(Woman.is(someone))
```
`Man.is(someone)`은 **true**, 그리고 `Woman.is(someone)`는 **flase**가 출력됩니다.
![](https://files.steempeak.com/file/steempeak/anpigon/WFOjsL5m-_2019-08-25_20.15.04.png)

<br>

## enumeration 사용하기

literal을 union하는 방식인 `types.union(types.literal('m'), types.literal('f'))` 이 가장 일반적인 패턴입니다. 하지만 더 간단한 표기법이 있습니다. 이를 **enumeration**이라고 합니다. User 모델의 `gender` Type을 **enumeration**를 사용하여 표현하면 `types.enumeration("gender", ["m", "f"])`가 됩니다.

`src/models/Group.js`
```js
import { types } from 'mobx-state-tree';

export const User = types.model({
  id: types.string,
  name: types.string,
  // gender: types.union(types.literal('m'), types.literal('f')) // remove here
  gender: types.enumeration("gender", ["m", "f"]) // add here
});
```

<br>그다음 User 모델에 `wishList` 속성을 정의합니다. `wishList`는 **optional** 이며, 디폴트값은 비어있는 `Object {}`입니다.

`src/models/Group.js`
```js
import { types } from 'mobx-state-tree';

import { WishList } from "./WishList"; // add here

export const User = types.model({
  id: types.string,
  name: types.string,
  gender: types.enumeration("gender", ["m", "f"])
  wishList: types.optional(WishList, {}) // add here
});
```

<br>

## Group 모델 만들기

이제 Group을 정의 합니다. Group은 User 그룹이라고 할 수 있습니다. 여기에서는 Map를 사용하였습니다. 하지만 우리는 Array를 사용할 수도 있습니다. `Group.js` 파일 맨 아래에 다음 코드를 입력합니다.

`src/models/Group.js`

```js
// (...)

export const Group = types.model({
  users: types.map(User)
});
```


<br>

다음은 지금까지 작성된 Group.js 파일의 전체 내용입니다.

`src/models/Group.js`
```js
import { types } from "mobx-state-tree";
import { WishList } from "./WishList";

export const User = types.model({
  id: types.string,
  name: types.string,
  gender: types.enumeration("gender", ["m", "f"]),
  wishList: types.optional(WishList, {})
});

export const Group = types.model({
  users: types.map(User)
});
```

<br>

## UI 수정하기

모델을 재구성했으니 이제 UI를 수정해야합니다. `index.js` 파일을 편집합니다. 

**Group** 모델을 **import** 합니다. 그리고 간단한 작업을 위해 `initialState`에는 심슨 가족 데이터 셋트를 미리 준비했습니다. 그리고 이제 **App** 컴포넌트에는 `wishList`가 아닌 `group`을 전달합니다.

`src/index.js`

```js
import // (...)
import { Group } from "./models/Group"; // add here

let initialState = {
  usres: {
    "a342": {
      id: "a342",
      name: "Homer",
      gender: "m"
    },
    "5fc2": {
      id: "5fc2",
      name: "Marge",
      gender: "f"
    },
    "663b": {
      id: "663b",
      name: "Bart",
      gender: "m"
    },
    "65aa": {
      id: "65aa",
      name: "Maggie",
      gender: "f"
    },
    "ba32": {
      id: "ba32",
      name: "Lisa",
      gender: "f"
    }
  }
}

let group = Group.create(initialState);

function renderApp() {
  ReactDOM.render(<App group={group} />, document.getElementById("root"));
}

renderApp();

// (...)
```

<br>그다음 첫 화면을 수정해봅시다. 선택 박스에서 사용자를 선택하면 위시 리스트 목록, 편집 화면이 보이도록 고쳐보겠습니다. 다시 `App.js` 파일을 편집합니다. 

참고로 동영상 강의에서는 `group.users.values().map` 를 사용하고 있습니다. 하지만 Mobx 2에서 사용방법이 변경되었습니다. `Array.from(group.users.values()).map` 또는 `values(group.users).map` 를 사용해야합니다.

`src/components/App.js`

```js
import React from "react";
import { values } from 'mobx';
import "./App.css";

import WishListView from "./WishListView";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectUser: null
    };
  }

  render() {
    const { group } = this.props;
    const selectedUser = group.users.get(this.state.selectUser)
    return (
      <div>
        <h1 className="App-title">WishList</h1>

        <select onChange={this.onSelectUser}>
          <option>- Select user -</option>
          &#123;{values(group.users).map(user => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        {
          selectedUser && <WishListView wishList={selectedUser.wishList} />
        }
      </div>
    );
  }

  onSelectUser = event => {
    this.setState({
      selectUser: event.target.value
    })
  };
}

export default App;
```

### 실행화면

![](https://steemitimages.com/0x0/https://files.steempeak.com/file/steempeak/anpigon/wRrhfC49-2019-08-25_21-15-02.2019-08-25_21_16_57.gif)


***

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 작성하였습니다.

`댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>