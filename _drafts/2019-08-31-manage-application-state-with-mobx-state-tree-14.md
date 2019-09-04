---
title: "[React] Mobx-state-tree 학습하기 #14 : 서버에서 데이터 가져오기"
comments: true
layout: post
categories: react
tags:
- react
- mobxstatetree
---

이전글 ["\[React\] Mobx-state-tree 학습하기 #13 : References와 Identifiers를 사용하여 데이터에 Relationships 만들기"](/zzan/@anpigon/react-mobx-state-tree-13-references-identifiers-relationships)에서 이어지는 내용입니다. 참고로 이 포스팅은 제가 학습한 내용을 노트에 정리하듯이 기록하여 올리는 글이기 때문에 보팅 안해주셔서 됩니다.  많은 분들이 코딩에 흥미를  느꼈으면 좋겠습니다.  ㅋ

<br>

***

![](https://files.steempeak.com/file/steempeak/anpigon/sYISPibs-E1848CE185A6E18486E185A9E186A820E1848BE185A5E186B9E18482E185B3E186AB20E18483E185B5E1848CE185A1E1848BE185B5E186AB.png)
* 출처: https://egghead.io/courses/manage-application-state-with-mobx-state-tree

***

<br>

## Loading Data from the Server

* 강의 링크: https://egghead.io/lessons/react-loading-data-from-the-server

<br>14번째 레슨입니다. Let's stop hardcoding our initial state and fetch it from the server instead.

<br>우리는 이번 레슨에서 다음을 배우게 됩니다.

- Set up basic data fetching
- Leverage the afterCreate lifecycle hook to automatically run any setup logic a model instance needs to do after creation

<br>
***
<br>

우선 하드 코딩되어 있던 user 데이터를 코드에서 제거 합니다. 그리고 서버에서 받아오도록 수정해봅시다.

다음은 store에 액세스 할 수 있도록 하는 간단한 방법입니다.  group을 윈도우 전역 변수에 할당합니다.

```js
let group = window.group = Group.create(initialState);
```

<br>그럼 브라우저 개발자 콘솔에서 접근 가능합니다. 기본적으로 "스냅샷 가져 오기"호출과 동일합니다. 다음은 현재 state입니다.

![](https://files.steempeak.com/file/steempeak/anpigon/9mCnVAyF-_2019-08-29__7-c60f4804-0667-4427-83e1-e240ae8c2fc9.01.06.png)

`db.json` 파일을 수정합니다. 이 파일에 `users` 를 추가합니다.

`db.json`

 ```json
"users": {
    "a342": {
      "id": "a342",
      "name": "Homer",
      "gender": "m",
      "recipient": "ba32",
      "wishList": {
        "items": [
          {
            "name": "Machine Gun Preacher",
            "price": 7.35,
            "image": "https://image.tmdb.org/t/p/w185_and_h278_bestv2/1gEP9ZC7jpSiuMWNfbOfXTWWF5n.jpg"
          },
          {
            "name": "Avengers: Endgame",
            "price": 17.29,
            "image": "https://image.tmdb.org/t/p/w185_and_h278_bestv2/or06FN3Dka5tukK1e9sl16pB3iy.jpg"
          }
        ]
      }
    },
    // ...
  }
```

<br>
<br>

그다음 `Group.js` 파일을 수정합니다.

**Mobx-state-tree**의 내장 함수 `applySnapshot`를 사용합니다. `applySnapshot`은 매우 유용한 기능입니다. 이미 가지고 있는 state와 수신한 state를 비교합니다. 가능한 적은 변경 사항으로 업데이트를 시도합니다.

`src/models/Group.js`

```js
// applySnapshot를 import
import { types, flow, applySnapshot } from "mobx-state-tree";

// ...

// load actions을 추가
export const Group = types.model({
  users: types.map(User)
})
.actions(self => ({
  load: flow(function*() {
    const response = yield window.fetch('http://localhost:3001/users');
    applySnapshot(self.users, yield response.json());
  }),
}));
```

<br>

코드에서 `initialState`의 `users` 데이터를 삭제합니다. 그리고 **Group** 모델 인스턴스를 생성하고 나서 바로 `group.load()` 액션 를 호출해봅시다.

`src/index.js`

```js
// ...

// 이제 initialState는 비어있는 users 속성만 가지고 있다.
let initialState = { users: {} };

// ...

let group = (window.group = Group.create(initialState));
group.load();
```

<br>

하지만 Group을 만들 때 데이터를 로드하는 것은 항상 일어나야 할 일입니다. 이 경우에 life cycle hooks를 사용할 수 있습니다. 

MobX-state-tree에 미리 정의된 특별한 액션을 사용할 수 있습니다. 미리 정의된 특별한 액션 중에서 afterCreate를 사용해봅시다. afterCreate는 인스턴스가 생성되고 전체 객체가 셋팅될 때마다 항상 호출됩니다. 인스턴스 생성시에 자동으로 `self.load`를 호출 할 수 있습니다.

`src/models/Group.js`

```js
export const Group = types.model({
  users: types.map(User)
})
.actions(self => ({
  // afterCreate 후크 정의
  afterCreate() {
    self.load();
  },
  load: flow(function*() {
    const response = yield window.fetch('http://localhost:3001/users');
    applySnapshot(self.users, yield response.json());
  }),
}));
```

<br>
마지막으로 `src/index.js` 파일에서 `group.load();` 코드는 삭제합니다. 이제 Group은 인스턴스를 생성하고 나서 afterCreate 후크를 통해 자동으로 서버에서 데이터를 가져옵니다.

<br>
<br>

***

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 먼저 작성되었습니다.

 `댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>