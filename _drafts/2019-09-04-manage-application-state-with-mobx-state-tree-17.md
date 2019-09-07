---
title: "[React] Mobx-state-tree 학습하기 #17 : Create Dynamic Types and use Type Composition to Extract Common Functionality
"
comments: true
layout: post
categories: react
tags:
- react
- mobxstatetree
---

이전글 ["\[React\] Mobx-state-tree 학습하기 #16 : Use Volatile State and Lifecycle Methods to Manage Private State"](/zzan/@anpigon/react-mobx-state-tree-15-use-volatile-state-and-lifecycle-methods-to-manage-private-state)에서 이어지는 내용입니다. 참고로 이 포스팅은 제가 학습한 내용을 노트에 정리하듯이 기록하여 올리는 글이기 때문에 보팅 안해주셔서 됩니다.  많은 분들이 코딩에 흥미를  느꼈으면 좋겠습니다.  ㅋ

<br>

***

![](https://files.steempeak.com/file/steempeak/anpigon/sYISPibs-E1848CE185A6E18486E185A9E186A820E1848BE185A5E186B9E18482E185B3E186AB20E18483E185B5E1848CE185A1E1848BE185B5E186AB.png)
* 출처: https://egghead.io/courses/manage-application-state-with-mobx-state-tree

***

<br>

## Create Dynamic Types and use Type Composition to Extract Common Functionality

* 강의 링크: https://egghead.io/lessons/react-create-dynamic-types-and-use-type-composition-to-extract-common-functionality

<br>17번째 마지막 레슨입니다. Let's make sure our changes get persisted. We will use the window.fetch api to store our changes in the json-server. And onSnapshot to do this automatically

Since MST offers a runtime type system, it can create and compose types on the fly, making it possible to reuse logic in new and powerful ways.

<br>우리는 이번 레슨에서 다음을 배우게 됩니다.

- That MST types are immutable and composed together behind the scenes
- How to compose types explicitly by using `types.compose`
- How to create dynamic, parameterized types by leveraging that MST types are first class javascript citizens

<br>

***

<br>



`src/models/Group.js`
```js
import { types, flow, applySnapshot, getSnapshot, onSnapshot } from "mobx-state-tree";
import { WishList } from "./WishList";

const UserBase = types
.model({
  id: types.identifier, // add here
  name: types.string,
  gender: types.enumeration("gender", ["m", "f"]),
  wishList: types.optional(WishList, {}),
  recipient: types.maybe(types.reference(types.late(() => User)))
});

const User = UserBase.actions(self => ({
    getSuggestions: flow(function* getSuggestions() {
      // ...
    save: flow(function* save() {
      // ...
    }),
    afterCreate() {
      // ...
    }
  }));
```

<br>


`src/models/Storable.js`
```js
const UserBase = types.model({
	// ...  
});

const UserAction = types.model({}).actions(self => ({
  getSuggestions: flow(function* getSuggestions() {
    // ...
  save: flow(function* save() {
    // ...
  }),
  afterCreate() {
    // ...
  }
}));

const User = types.compose(
  UserBase,
  UserAction
);
```

<br>
`src/models/Storable.js`
```js
import { types } from 'mobx';
import { flow, getSnapshot, onSnapshot } from 'mobx-state-tree';

export const Storable = types.model({}).actions(self => ({
  save: flow(function* save() {
    try {
      yield window.fetch(`http://localhost:3001/users/${self.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(getSnapshot(self))
      });
    } catch (e) {
      console.error("Uh oh, failed to save: " + e);
    }
  }),
  afterCreate() {
    onSnapshot(self, self.save);
  }
}));
```

<br>
`src/models/Group.js`
```js
// ...

import { Storable } from './Storable'

const UserBase = types.model({
	// ...  
});

const UserAction = types.model({}).actions(self => ({
  getSuggestions: flow(function* getSuggestions() {
    const response = yield window.fetch(`http://localhost:3001/suggestions_${self.gender}`);
    const suggestions = yield response.json();
    self.wishList.items.push(...suggestions);
  })
}));

export const User = types.compose(
  UserBase,
  UserAction,
  Storable
);
```

<br>

***

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 작성하였습니다.

`댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>