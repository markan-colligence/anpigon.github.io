---
title: "[React] Mobx-state-tree 학습하기 #7 : Remove Model Instances from the Tree"
comments: true
layout: post
categories: react
tags:
- react
- mobxstatetree
---

이전글 [**"\[React\] Mobx-state-tree 학습하기 #6 : Views를 사용하여 모델에서 정보 보여주기"**](/zzan/@anpigon/react-native-manage-application-state-with-mobx-state-tree-6)에서 이어지는 내용입니다. 참고로 이 포스팅은 제가 학습한 내용을 노트에 정리하듯이 기록하여 올리는 글이기 때문에 보팅 안해주셔서 됩니다.  많은 분들이 코딩에 흥미를  느꼈으면 좋겠습니다.  ㅋ

<br>

***

![](https://files.steempeak.com/file/steempeak/anpigon/sYISPibs-E1848CE185A6E18486E185A9E186A820E1848BE185A5E186B9E18482E185B3E186AB20E18483E185B5E1848CE185A1E1848BE185B5E186AB.png)
* 출처: https://egghead.io/courses/manage-application-state-with-mobx-state-tree

***

<br>

## Remove Model Instances from the Tree

* 강의 링크: https://egghead.io/lessons/react-remove-model-instances-from-the-tree

<br>7번째 레슨입니다. 이번 레슨에서는 MST의 tree semantics에 대해서 좀더 깊이 배워봅니다.

<br>우리는 다음을 배우게 됩니다.

*  액션(Actions) 자신의 하위트리(subtree)만 변경 가능합니다.
* `getParent`를 사용해서 현재 모델 인스턴스의 부모를 찾아봅니다.
* `destroy`를 사용하여 트리에서 현재 인스턴스를 완전히 제거해봅니다.

<br>

***

<br><br>

먼저 `WishListItemView.js` 파일을 수정합니다. `WishListItemView` 컴포넌트에 삭제 ❎ 버튼을 만듭니다.

`src/components/WishListItemView.js`

```
class WishListItemView extends Component {

  // ...

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
          {/* add here */}
          <button onClick={item.remove}>❎</button>
        </span>
      </li>
    );
  }

  // ...

}
```

<br>

앱을 실행하면 이제 항목에 삭제 ❎ 버튼이 보입니다. 하지만 지금은 삭제 ❎ 버튼을 눌러도 아무런 일도 일어나지 않습니다.

![](https://files.steempeak.com/file/steempeak/anpigon/euLD7P39-E18489E185B3E1848FE185B3E18485E185B5E186ABE18489E185A3E186BA202019-08-242020.33.33.png)


<br>
<br>

모델에 삭제 액션을 추가합니다.

먼저 `WishListItem` 모델을 수정합니다.  그리고 `WishListItem` 모델에 `remove()` 액션을 추가합니다. 자신(self)을 제거할 수 없기 때문에, `remove()` 액션에서 다시 부모의 `remove()` 액션을 호출합니다. 부모를 찾기 위해서 `getParent`를 사용합니다.

`src/models/WhishList.js`

```
import { types, getParent } from "mobx-state-tree"; // add here

export const WishListItem = types
  .model({
    // ...
  })
  .actions(self => ({
    // ...
    remove() {
      getParent(self, 2).remove(self); // add here
    }
  }));
```
> `getParent(self, 2)`에서 2번째 인자값 `2`의 의미는 `getParent(getParent(self))` 입니다.  현재 모델 트리구조가 `WishList: { items: [{ self }] }` 이기 때문에, WishList 모델에 접근하기 위해서 `Parent`를 2번 수행합니다.

<br>
<br>

그다음 `WishList` 모델을 수정합니다. 여기에도 `remove()` 액션을 추가합니다.

`src/models/WhishList.js`
```
export const WishList = types.model({
  // ...
})
.views(self => ({
  // ...
}))
.actions(self => ({
  // ...
  remove(item) {
    self.items.splice(self.items.indexOf(item), 1); // add here
  }
}));
```
> `splice`는 ES6에 추가된 문법입니다. 현재 인덱스의 1개 아이템을 제거합니다. 자세한 사용방법은 [mozilla 개발자 문서](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)를 참고하세요

<br> **mobx-state-tree**의 `destroy`를 사용하면, `remove()`를 더 간단하게 구현할 수 있습니다.

`src/models/WhishList.js`
```
import { types, getParent, destroy } from "mobx-state-tree"; // add here

export const WishList = types.model({
  // ...
})
.views(self => ({
  // ...
}))
.actions(self => ({
  // ...
  remove(item) {
    destroy(item); // add here
  }
}));
```

<br>

**실행결과**
![](https://files.steempeak.com/file/steempeak/anpigon/yzhdzwBl-2019-08-242020-59-51.2019-08-242021_00_21.gif)

<br><br>

***

<br><br>

## MobX observer 사용하기


`index.js` 파일에 다음 코드를 추가합니다. 1초마다 가격에 변화를 주는 코드입니다.

`src/index.js`

```
setInterval(() => {
  wishList.items[0].changePrice(wishList.items[0].price + 1);
}, 1000);
```
지금은 위에 코드를 입력하고 실행하면 화면에 아무런 변화가 없습니다. `observer`를 설정해서 컴포넌트의 데이터 변화를 감지해야합니다.

<br>

**WishListView** 모델에 `observer`를 설정합니다. `observer`는 모델의 데이터 변경을 감지하고 해당 컴포넌트를 재렌더링 할 것입니다.

`src/components/WishListView.js`

```
import { observer } from 'mobx-react'

// ...

export default observer(WishListView);
```

<br>아래 화면에서 LEGO 가격이 증가하는 것이 보이나요?

![](https://files.steempeak.com/file/steempeak/anpigon/XIh7Smjo-2019-08-182013-22-41.2019-08-182013_23_25.gif)


<br>
<br>

***

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 먼저 작성되었습니다.

 `댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>