---
title: "[React] Mobx-state-tree #7 : Remove Model Instances from the Tree"
comments: true
layout: post
categories: react
tags:
- react
- mobxstatetree
---

7번째 레슨입니다. 이번 레슨에서는 MST의 tree semantics에 대해서 좀더 깊이 배워봅니다.

우리는 다음을 배우게 됩니다.

*  액션(Actions) 자신의 하위트리(subtree)만 변경 가능합니다.
* `getParent`를 사용해서 현재 모델 인스턴스의 부모를 찾아봅니다.
* `destroy`를 사용하여 트리에서 현재 인스턴스를 완전히 제거해봅니다.

<br>

> 이 포스팅은 제가 학습한 내용을 기록한 글입니다. 이전글 [**"\[React\] Mobx-state-tree #6: React에서 mobx-state-tree Models 수정하기"**](/react/2019/08/25/manage-application-state-with-mobx-state-tree-6/)에서 이어지는 내용입니다.

<br>

***

# Remove Model Instances from the Tree

> 강의 링크: [https://egghead.io/lessons/react-remove-model-instances-from-the-tree](https://egghead.io/lessons/react-remove-model-instances-from-the-tree)

<br>

먼저 `WishListItemView.js` 파일을 수정합니다. `WishListItemView` 컴포넌트에 삭제 ❎ 버튼을 만듭니다.

`src/components/WishListItemView.js`

```js
import // (...)

class WishListItemView extends Component {
  constructor() { // (...) }

  render() {
    const { item } = this.props;
    return this.state.isEditing ? (
      this.renderEditable()
    ) : (
      <li className="item">
        {item.image && <img src={item.image} alt="" />}
        <h3>{item.name}</h3>
        <span>{item.price}</span><br/>
        <span>
          <button onClick={this.onTooleEdit}>✏️</button>
          <button onClick={item.remove}>❎</button>{/* add here */}
        </span>
      </li>
    );
  }

  renderEditable = () => { // (...) }
  onTooleEdit = () => { // (...) };
}

export default observer(WishListItemView);
```

<br>

앱을 실행하면 이제 항목에 삭제 ❎ 버튼이 보입니다. 하지만 지금은 삭제 ❎ 버튼을 눌러도 아무런 일도 발생하지 않습니다.

![](https://files.steempeak.com/file/steempeak/anpigon/euLD7P39-E18489E185B3E1848FE185B3E18485E185B5E186ABE18489E185A3E186BA202019-08-242020.33.33.png)


<br>
<br>

이제 **WishListItemView** 모델에 삭제 액션을 추가하겠습니다.

`WishList.js` 파일을 열고, `WishListItem` 모델을 수정합니다. 그리고 `WishListItem` 모델에 `remove()` 액션을 추가합니다. 자신(self)은 제거(remove) 할 수 없기 때문에, `remove()` 액션에서 다시 부모의 `remove()` 액션을 호출합니다. 부모를 찾기 위해서 `getParent`를 사용합니다.

`src/models/WishList.js`

```js
import { types, getParent } from "mobx-state-tree"; // add here

export const WishListItem = types
  .model({
    name: types.string,
    price: types.number,
    image: types.optional(types.string, ""),
  })
  .actions(self => ({
    changeName(newName) { // (...) },
    changePrice(newPrice) { // (...) },
    changeImage(newImage) { // (...) },
    // add here
    remove() {
      getParent(self, 2).remove(self); 
    }
  }));
```
> `getParent(self, 2)`에서 2번째 인자값 `2`의 의미는 `getParent(getParent(self))` 입니다.  현재 모델 트리구조가 `WishList: { items: [{ self }] }` 이기 때문에, WishList 모델에 접근하기 위해서 `Parent`를 2번 수행하였습니다.

<br>
<br>

그다음 `WishList` 모델을 수정합니다. 여기에도 `remove()` 액션을 추가합니다.

`src/models/WishList.js`

```js
export const WishList = types.model({
  items: types.optional(types.array(WishListItem), [])
})
.views(self => ({
  get totalPrice() { // (...) }
}))
.actions(self => ({
  add(item) { // (...) },
  // add here
  remove(item) {
    self.items.splice(self.items.indexOf(item), 1); 
  }
}));
```
> `splice`는 ES6에 추가된 문법입니다. 현재 인덱스의 1개 아이템을 제거합니다. 자세한 사용방법은 [mozilla 개발자 문서](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)를 참고하세요

<br> **mobx-state-tree**의 `destroy`를 사용하면, `remove()`를 더 간단하게 구현할 수 있습니다.

`src/models/WishList.js`

```js
import { types, getParent, destroy } from "mobx-state-tree"; // add here

export const WishList = types.model({
  items: types.optional(types.array(WishListItem), [])
})
.views(self => ({
  get totalPrice() { // (...) }
}))
.actions(self => ({
  add(item) { // (...) },
  remove(item) {
    // self.items.splice(self.items.indexOf(item), 1); // remove here
    destroy(item); // add here
  }
}));
```

### 실행결과
![](https://files.steempeak.com/file/steempeak/anpigon/yzhdzwBl-2019-08-242020-59-51.2019-08-242021_00_21.gif)

<br>
<br>

***

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 작성하였습니다.

`댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>