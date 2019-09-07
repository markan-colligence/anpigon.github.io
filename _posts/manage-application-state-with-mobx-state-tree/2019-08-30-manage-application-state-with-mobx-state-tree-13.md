---
title: "[React] Mobx-state-tree #13 : References와 Identifiers를 사용하여 데이터에 Relationships 만들기"
comments: true
layout: post
categories: react
tags:
- react
- mobxstatetree
---

13번째 레슨입니다. MST stores all data in a tree, where each piece of data lives at one unique location. In most state management solutions, this means you need to introduce weakly typed, primitive 'foreign keys' to refer to other parts of the state tree. But in MST you can leverage the concepts of references and identifiers to relate model instances to each other. MST will do the normalization behind the scenes for you.

<br>우리는 이번 레슨에서 다음을 배우게 됩니다.

- `types.identifier`를 사용하여 특정 타입의 인스턴스를 유니크하게 식별한다.
- `types.reference`를 사용하여 다른 데이터를 참조하고 트리의 다른 부분과 상호 작용할 수 있다.
- `types.maybe`를 사용하여 ".. 또는 null" 타입을 만들 수 있다.
- `types.late`를 사용하여 circular 타입을 정의할 수 있다.


<br>


> 이 포스팅은 제가 학습한 내용을 기록한 글입니다. 이전글 ["\[React\] Mobx-state-tree #12 : Flow를 사용하여 비동기 프로세스 정의하기"](/react/2019/08/29/manage-application-state-with-mobx-state-tree-12/)에서 이어지는 내용입니다.

<br>

***


# Create Relationships in your Data with mobx-state-tree Using References and Identifiers

> 강의 링크: https://egghead.io/lessons/react-create-relationships-in-your-data-with-mobx-state-tree-using-references-and-identifiers




<br>

***

<br>

이제 누구를 위해 선물을 사야하고 어떤 선물을 사야하는지 확인할 수 있는 기능을 만들어 봅겠습니다. 

<br>

# types.reference  사용하기

`Group.js` 파일을 수정합니다. 그리고 **User** 모델에 `recipient` 필드를 추가합니다.  `recipient`에는 선물을 받는 사람을 저장할 것입니다.

모델 참조에는  `types.reference` 를 사용합니다. `recipient`는 User를 참조하도록 정의합니다. 일종의 재귀 모델의 형태를 가지게 됩니다. 

```js
recipient: types.reference(User)
```

<br>하지만 User 모델이 아직 정의되지 않았습니다. 그래서 User 상수가 아직 할당 되지 않았다는 오류가 발생합니다. `types.late`를 사용하면 유형 참조를 연기할 수 있습니다. `types.late` 를 사용하여 다시 정의합니다.

```js
recipient: types.reference(types.late(() => User))
```

<br>그리고 User 가 처음 생성될때는 `recipient`가 비어있을 것이기 때문에 `types.maybe`를 사용하여 문제를 해결합니다.

```js
recipient: types.maybe(types.reference(types.late(() => User)))
```

<br>그래서 최종 User 모델을 다음과 같이 작성합니다.

`src/models/Group.js`

```js
import // (...)

export const User = types
  .model({
    id: types.identifier, // add here
    name: types.string,
    gender: types.enumeration("gender", ["m", "f"]),
    wishList: types.optional(WishList, {}),
    recipient: types.maybe(types.reference(types.late(() => User))), // add here
  })
  .actions(self => ({
    getSuggestions: flow(function*() { // (...) })
  }));

export const Group = types.model({
  users: types.map(User)
});
```

> **[메모] types.optional과 types.maybe의 차이**<br>
`x : types.optional(types.number, 3)`에서 `x`는 항상 숫자이고, 제공되지 않으면 3임을 의미합니다. 반대로 `x : types.maybe(types.number)`는 `x`가 숫자 일 수도 있지만 "null"일 수도 있음을 의미합니다. 그리고 types.optional은 값이 스냅 샷에서 제외 될 수 있음을 의미합니다. 

<br>

## UI 수정하기

이제 UI 를 수정할 차례입니다. 다음과 같이 User 컴포넌트를 분리합니다.

`src/components/App.js`

```js
import // (...)
import { observer } from 'mobx-react'; // add here

class App extends React.Component {
  constructor(props) { // (...) }

  render() {
    const { group } = this.props;
    const selectedUser = group.users.get(this.state.selectUser);

    return (
      <div>
        <h1 className="App-title">WishList</h1>

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

const User = observer(({ user }) => (
  <div>
    <WishListView wishList={user.wishList} />
    <button onClick={user.getSuggestions}>Suggestions</button>
    <hr/>
    <h2>{user.recipient && user.recipient.name}</h2>
  </div>
));

export default App;
```

<br>그리고 선물 받을 사람(recipient)의 위시 리스트를 보여주기 위해 **User** 컴포넌트에 **WishListView** 컴포넌트를 추가합니다. **WishListView**에  `readonl` 속성을 추가합니다.

`src/components/App.js`

```js
// (...)

const User = observer(({ user }) => (
  <div>
    <WishListView wishList={user.wishList} />
    <button onClick={user.getSuggestions}>Suggestions</button>
    <hr/>
    <h2>{user.recipient && user.recipient.name}</h2>
    {user.recipient && <WishListView wishList={user.recipient.wishList} readonly />}
  </div>
));
```

<br>나머지 컴포넌트도 차례대로 수정합니다.

`src/components/WishListView.js`

```js
import // (...)

const WishListView = ({ wishList, readonly }) => (
  <div className="list">
    <ul>
      {wishList.items.map((item, idx) => (
        <WishListItemView key={idx} item={item} readonly={readonly} />
      ))}
    </ul>
    Total: {wishList.totalPrice} 💲
    {!readonly && <WishListItemEntry wishList={wishList} />}
  </div>
);

export default observer(WishListView);
```

<br>

`src/components/WishListItemView.js`

```js
import // (...)

class WishListItemView extends Component {
  constructor() { // (...) }

  render() {
    const { item, readonly } = this.props;
    return this.state.isEditing ? (
      this.renderEditable()
    ) : (
      <li className="item">
        {item.image && <img src={item.image} alt="" />}
        <h3>{item.name}</h3>
        <span>{item.price}</span><br/>
        {!readonly && (
          <span>
            <button onClick={this.onTooleEdit}>✏️</button>
            {/* add here */}
            <button onClick={item.remove}>❎</button>
          </span>
        )}
      </li>
    );
  }

  renderEditable = () => { // (...) }
  onTooleEdit = () => { // (...) };
}

export default observer(WishListItemView);
```

### 실행화면

이제 선택박스에서 사용자를 선택하면,  선물할 사람과 그 사람의 위시 리스트를 볼수 있습니다.

![](https://files.steempeak.com/file/steempeak/anpigon/XWjpkB0w-1-8ca257c2-e98b-4fda-833f-86dff5a70085.gif)

<br>
<br>

***

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 작성하였습니다.

`댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>