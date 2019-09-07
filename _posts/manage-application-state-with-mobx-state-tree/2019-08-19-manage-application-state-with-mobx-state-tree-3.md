---
layout: post
title: "[React] Mobx-state-tree #3: Snapshots 또는 Patches를 Recording하여 mobx-state-tree
  모델 테스트하기"
comments: true
categories: react
tags:
- react
- mobxstatetree
---

3번째 레슨입니다. MST에서 모델을 테스트하는 것은 매우 간단합니다. 왜냐하면 MST는 state가 어떻게 변하는지 정확하게 추적 할 수 있는 도구를 제공하기 때문입니다. snapshots, 액션 호출 또는 patches를 추적하여 액션이 올바르게 작동하는 지를 확인 할 수 있습니다.

이번 레슨에서 우리는 다음을 배웁니다.

* `getSnapshot`를 사용하여 state의 immutable한 snapshots 얻기
* `onSnapshot`을 사용하여 snapshots 기록하기
* `onPatch`를 사용하여 시간의 흐름에 따른 변화을 저장하고 테스트하기
* Jest의 snapshots 테스트 기능을 사용하여 snapshots과 patches 검증하기
* That MST can infer the type of a snapshot for you

<br>

> 이 포스팅은 제가 학습한 내용을 기록한 글입니다. 이전글 ["\[React\] Mobx-state-tree #2: Mobx-state-tree 모델에서 Actions을 사용하기"](/react/2019/08/17/manage-application-state-with-mobx-state-tree-2)에서 이어지는 내용입니다.

<br>

***

# Test mobx-state-tree Models by Recording Snapshots or Patches

> 강의 링크: [https://egghead.io/lessons/react-test-mobx-state-tree-models-by-recording-snapshots-or-patches](https://egghead.io/lessons/react-test-mobx-state-tree-models-by-recording-snapshots-or-patches)


## `getSnapshot` 함수를 사용하여 모델 테스트 하기

Model의 전체 속성을 테스트하기 위해서 MST에서 제공하는 `getSnapshot` 함수를 사용합니다.  `getSnapshot`는 모델의 전체 트리 상태를 immutable하고 순수한 JSON 데이터로 만들어줍니다. 테스트 코드를 다음과 같이 작성합니다.
snapshots에 대해서는 [MST 깃북](https://mobx-state-tree.gitbook.io/docs/concepts/snapshots)에 추가 설명이 있습니다.

`src/models/WhishList.test.js`

```js
import { getSnapshot } from 'mobx-state-tree';

it("can add new items", () => {
  const list = WishList.create();
  list.add(
    WishListItem.create({
      name: "Chesterton",
      price: 10
    })
  );

  expect(getSnapshot(list)).toEqual({
    items: [
      {
        name: "Book of G.K. Chesterton",
        price: 10,
        image: ""
      }
    ]
  }); // false
});
```

그리고 `toMatchSnapshot` 함수를 사용하면 스냅샷을 기록합니다.

`src/models/WhishList.test.js`

```js
it("can add new items", () => {
  const list = WishList.create();
  list.add(
    WishListItem.create({
      name: "Chesterton",
      price: 10
    })
  );

  expect(getSnapshot(list)).toMatchSnapshot();
});
```

<br>위 테스트를 실행하면 다음과 같이 `__snapshots__` 폴더에 스냅샷 파일이 생성됩니다. 스냅샷 파일을 열어보면 아래와 같은 내용이 입력되어 있습니다.

![](https://files.steempeak.com/file/steempeak/anpigon/xLhaLw7g-E18489E185B3E1848FE185B3E18485E185B5E186ABE18489E185A3E186BA202019-08-182000.59.10.png)


## `onSnapshot` 함수를 사용하여 테스트하기

이제 `onSnapshot` 함수를 사용하여 모델이 변경될 때마다 스냅샷을 states에 저장하겠습니다. 그리고 `toMatchSnapshot` 함수를 사용하여 스냅샷이 어떻게 변화 했는지 기록합니다.

`src/models/WhishList.test.js`

```js
import { getSnapshot, onSnapshot } from "mobx-state-tree";

it("can add new items", () => {
  const list = WishList.create();

  const states = [];
  onSnapshot(list, snapshot => {
    states.push(snapshot);
  });

  //...

  expect(states).toMatchSnapshot();
}

```

<br>테스트를 수행하고 나서 스냅샷 기록을 보면 스냅샵이 어떻게 바뀌었는지를 살펴볼 수 있습니다.
![스냅샷 기록](https://files.steempeak.com/file/steempeak/anpigon/YLMLCCqQ-E18489E185B3E1848FE185B3E18485E185B5E186ABE18489E185A3E186BA202019-08-182001.10.34.png)


## `onPatch` 함수를 사용하여 테스트하기

`onPatch` 함수를 사용한 테스트를 수행하고 나서 기록을 보면 모델의 변화에 대해서 살펴볼 수 있습니다. 어떤 작업을 수행했는지, 몇번째 항목의 값이 어떻게 변경되었는지를 확인 할 수 있습니다.

`src/models/WhishList.test.js`

```js
import { getSnapshot, onSnapshot, onPatch } from "mobx-state-tree";

it("can add new items - 2", () => {
  const list = WishList.create();

  const patches = [];
  onPatch(list, patch => {
    patches.push(patch);
  })

  list.add(
    WishListItem.create({
      name: "Chesterton",
      price: 10
    })
  );

  list.items[0].changeName("Book of G.K. Chesterton");

  expect(patches).toMatchSnapshot();
});
```

![](https://files.steempeak.com/file/steempeak/anpigon/GFWYYwru-E18489E185B3E1848FE185B3E18485E185B5E186ABE18489E185A3E186BA202019-08-182001.17.54.png)

<br>
<br>

***

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 작성하였습니다.

 `댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>