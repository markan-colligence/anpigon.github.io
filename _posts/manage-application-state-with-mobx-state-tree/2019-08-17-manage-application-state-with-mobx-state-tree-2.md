---
layout: post
title: "[React] Mobx-state-tree #2 : Mobx-state-tree 모델에서 Actions을 사용하기"
comments: true
categories: react
tags:
- react
- mobxstatetree
---

2번째 레슨입니다. mobx-state-tree는 Model의 데이터를 수정하기 위해서는 반드시 actions를 정의하고 사용해야 합니다. 

이번 레슨에서 우리는 다음을 배웁니다.

* models에 actions을 정의하는 방법
* `self`를 사용하여 문제를 해결하는 방법
* Models은 오직 actions에서만 수정할 수 있는 읽기 전용입니다.

<br>

> 이 포스팅은 제가 학습한 내용을 기록한 글입니다. 이전글 [**"\[React\] Mobx-state-tree #1: Mobx-state-tree를 사용해서 Reat State 관리하기"**](/react/2019/08/16/manage-application-state-with-mobx-state-tree-1)에서 이어지는 내용입니다.

<br>

***

# Attach Behavior to mobx-state-tree Models Using Actions

> 강의 링크: [https://egghead.io/lessons/react-attach-behavior-to-mobx-state-tree-models-using-actions](https://egghead.io/lessons/react-attach-behavior-to-mobx-state-tree-models-using-actions)


## Models에 Actions 정의하기

WishList 모델에 `changeName()` 액션을 정의합니다.

`src/models/WishList.js`

```js
const WishListItem = types
  .model({
    name: types.string,
    price: types.number,
    image: types.optional(types.string, ""),
  })
  // 액션 추가
  .actions(self => {
    // name을 변경
    function changeName(newName) {
      self.name = newName; 
    }
    return {
      changeName
    }
  });
```

`actions`에 `changeName()` 함수를 입력하고 그 함수를 return 합니다. 사실 **ES6 Syntax**를 사용하면 다음과 같이 코드를 더 간단하게 작성할 수 있습니다.

```js
const WishListItem = types
  .model({
    name: types.string,
    price: types.number,
    image: types.optional(types.string, ""),
  })
  .actions(self => ({
    changeName(newName) {
      self.name = newName;
    }
  }));
```
<br>그다음 나머지 액션 `changePrice()`, `changeImage()` 도 정의합니다.

```js
const WishListItem = types
  .model({
    name: types.string,
    price: types.number,
    image: types.optional(types.string, ""),
  })
  .actions(self => ({
    changeName(newName) {
      self.name = newName;
    },
    changePrice(newPrice) {
      self.price = newPrice;
    },
    changeImage(newImage) {
      self.image = newImage;
    }
  }));
```

<br><br>

그다음 WishList 모델에는 `add()` 액션을 정의합니다.

```js
const WishList = types.model({
  items: types.optional(types.array(WishListItem), [])
})
.actions(self => ({
  add(item) {
    self.items.push(item);
  }
}));
```


## Actions 테스트 하기

테스트 파일 `WishList.test.js`에 다음을 입력하고 테스트 해봅시다.

`src/models/WishList.test.js`

```js
it("can add new items", () => {

  // WishList 모델 생성
  const list = WishList.create();
	
  // WishList에 아이템 추가
  list.add(
    WishListItem.create({
      name: "Chesterton",
      price: 10
    })
  );

  // 테스트
  expect(list.items.length).toBe(1); // true
  expect(list.items[0].name).toBe("Chesterton"); // true
  list.items[0].changeName("Book of G.K. Chesterton"); // 첫번째 항목이 이름 수정
  expect(list.items[0].name).toBe("Book of G.K. Chesterton"); // true
});
```

<br>
<br>

***

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 작성하였습니다.

`댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>
