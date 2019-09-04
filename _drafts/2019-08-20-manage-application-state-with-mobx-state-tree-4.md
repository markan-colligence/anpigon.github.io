---
title: "[React] Mobx-state-tree 학습하기 #4 : Views를 사용하여 모델에서 정보 보여주기"
comments: true
layout: post
categories: react
tags:
- react
- mobxstatetree
---

이전글 [**"\[React\] Mobx-state-tree 학습하기 #3 : Snapshots 또는 Patches를 Recording하여 mobx-state-tree 모델 테스트하기"**](/zzan/@anpigon/react-native-manage-application-state-with-mobx-state-tree-3)에서 이어지는 내용입니다. 참고로 이 포스팅은 제가 학습한 내용을 노트에 정리하듯이 기록하여 올리는 글이기 때문에 보팅 안해주셔서 됩니다.  많은 분들이 코딩에 흥미를  느꼈으면 좋겠습니다.  ㅋ

<br>

***

![](https://files.steempeak.com/file/steempeak/anpigon/sYISPibs-E1848CE185A6E18486E185A9E186A820E1848BE185A5E186B9E18482E185B3E186AB20E18483E185B5E1848CE185A1E1848BE185B5E186AB.png)
* 출처: https://egghead.io/courses/manage-application-state-with-mobx-state-tree
***

<br>

# Derive Information from Models Using Views

> 강의 링크: https://egghead.io/lessons/react-derive-information-from-models-using-views

4번째 레슨입니다. 이번 레슨에서는 데이터를 선언적으로 derive하고 캐싱하는 views 사용 방법에 대해 학습합니다.

<br>우리는 다음을 배우게 됩니다.

*  모델에서 views를  introduce하는 방법.
* 계산된 값(computed properties)은 Mobx computed fields에 의해 작동.
* `reaction ` 처럼 MST를 Mobx 유틸리티와 결합(combine)하는 방법

<br>

***

<br>

WhishList 모델에 총 가격(totalPrice) 필드를 추가합니다.

`src/models/WhishList.js`
```
const WishList = types
  .model({
    items: types.optional(types.array(WishListItem), []),
    totalPrice: types.number, // add here
  })
```

하지만 이렇게 사용하면 WishList 모델이 변경될 때마다 `totalPrice`를 매번 계산해야합니다. 

그래서 다음과 같이 views를 사용합니다. views 이미 계산된 값을 캐싱합니다. 그래서 `item`이 추가되거나 `price` 가 변경되지 않으면 `totalPrice`를 다시 계산하지 않고 캐싱하고 있는 값을 리턴합니다.  

```
export const WishList = types
  .model({
    items: types.optional(types.array(WishListItem), [])
    // totalPrice: types.number,
  })
  .views(self => ({
    get totalPrice() {
      return self.items.reduce((sum, entry) => sum + entry.price, 0);
    }
  }))
```

<br><br>

# 모델의 view 테스트 하기

다음과 같이 `WhishList.test.js`에 테스트 케이스를 작성합니다. 

`src/models/WhishList.test.js`

```
it("can calculate the total price of a wishlist", () => {
  const list = WishList.create({
    items: [
      {
        name: "Chesterton",
        price: 7.35
      },
      {
        name: "Book of G.K. Chesterton",
        price: 349.95
      }
    ]
  });

  expect(list.totalPrice).toBe(357.3);
});
```

<br><br>

# reaction 사용하여 모델의 view 테스트 하기

mobx에서 제공하는 `reaction` 유틸은 모델의 데이터 변화를 감지합니다. 모델에 변화가 발생하였을때 `totalPrice` 값의 변화를 살펴봅시다.

```
import { reaction } from 'mobx';

it("can calculate the total price of a wishlist", () => {
  // ...
 
  let changed = 0;
  // totalPrice 변화가 발생하면 changed 증가
  reaction(() => list.totalPrice, () => changed++); 
  
  expect(changed).toBe(0); // 변화 없음
  console.log(list.totalPrice);
  list.items[0].changeName("Test"); // 이름 변경
  expect(changed).toBe(0); // 변화 없음
  list.items[0].changePrice(10); // 가격 변경
  expect(changed).toBe(1); // 계산됨
});
```
위 테스트를 수행해보면 `price` 값에 변화가 발생하였을때만, `totalPrice`가 동작하는 것을 확인할 수 있습니다.

<br>
<br>

***

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 먼저 작성되었습니다.

 `댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>