---
title: "[React] Mobx-state-tree 학습하기 #2 : Mobx-state-tree 모델에서 Actions을 사용하기"
comments: true
layout: post
categories: react
tags:
- react
- mobxstatetree
---

이전글 [**"\[React\] Mobx-state-tree 학습하기 #1 : Mobx-state-tree를 사용해서 Reat State 관리하기"**](/zzan/@anpigon/react-native-manage-application-state-with-mobx-state-tree-1)에서 이어지는 내용입니다. 참고로 이 포스팅은 제가 학습한 내용을 노트에 정리하듯이 기록하여 올리는 글이기 때문에 보팅 안해주셔서 됩니다.  많은 분들이 코딩에 흥미를  느꼈으면 좋겠습니다.  ㅋ

<br>

***

![](https://files.steempeak.com/file/steempeak/anpigon/sYISPibs-E1848CE185A6E18486E185A9E186A820E1848BE185A5E186B9E18482E185B3E186AB20E18483E185B5E1848CE185A1E1848BE185B5E186AB.png)
* 출처: https://egghead.io/courses/manage-application-state-with-mobx-state-tree

<br>

2번째 레슨입니다. Model의 데이터를 수정하기 위해서는 actions를 정의하고 사용해야 합니다. 

<br>

우리는 다음을 배우게 됩니다.

* models에 actions을 정의하는 방법
* `self`를 사용하여 문제를 해결하는 방법
* Models은 오직 actions에서만 수정할 수 있는 읽기 전용입니다.

<br>

***

<br>

# Models에 Actions 정의하기

WhishList 모델에 `changeName()` actions를 정의합니다.

`src/models/WhishList.js`

```
const WishListItem = types
  .model({
    // ...
  })
  .actions(self => {
    function changeName(newName) {
      self.name = newName
    }
    return {
      changeName
    }
});
```
`actions`에 `changeName()` 함수를 입력하고 그 함수를 return 합니다. **ES6 Syntax**를 사용하면 다음과 같이 코드를 더 간단하게 작성할 수 있습니다.

```
const WishListItem = types
  .model({
    // ...
  })
  .actions(self => ({
    changeName(newName) {
      self.name = newName;
    }
  }));
```
<br>그다음 나머지 `changePrice()`, `changeImage()` actions도 추가로 입력합니다.

```
const WishListItem = types
  .model({
    // ...
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
그리고 WishList 모델에도 `add()` 액션을 정의합니다.

```
const WishList = types.model({
  items: types.optional(types.array(WishListItem), [])
})
.actions(self => ({
  add(item) {
    self.items.push(item);
  }
}));
````

<br><br>

## Actions 테스트 하기

테스트 파일에 다음을 입력하고 테스트 합니다.

`src/models/WhishList.test.js`

```
it("can add new items", () => {
  // WishList 모델 생
  const list = WishList.create();
  // WishList에 아이템 추가
  list.add(
    WishListItem.create({
      name: "Chesterton",
      price: 10
    })
  );

  expect(list.items.length).toBe(1); // 리스트 길이는 1
  expect(list.items[0].name).toBe("Chesterton"); // 첫번째 항목이 이름은 Chesterton
  list.items[0].changeName("Book of G.K. Chesterton"); 첫번째 항목이 이름 수정
  expect(list.items[0].name).toBe("Book of G.K. Chesterton"); 첫번째 항목이 이름은 Book of G.K. Chesterton
});

```


<br>
<br>

***

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 먼저 작성되었습니다.

 `댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>