---
title: "[React] Mobx-state-tree #17 : Dynamic Types을 정의하고 Type Composition을 사용하여 공통 Functionality 추출하기
"
comments: true
layout: post
categories: react
tags:
- react
- mobxstatetree
---

17번째 마지막 레슨입니다. Let's make sure our changes get persisted. We will use the window.fetch api to store our changes in the json-server. And onSnapshot to do this automatically

Since MST offers a runtime type system, it can create and compose types on the fly, making it possible to reuse logic in new and powerful ways.

<br>우리는 이번 레슨에서 다음을 배우게 됩니다.

- That MST types are immutable and composed together behind the scenes
- How to compose types explicitly by using `types.compose`
- How to create dynamic, parameterized types by leveraging that MST types are first class javascript citizens

<br>

> 이 포스팅은 제가 학습한 내용을 기록한 글입니다. 이전글 ["\[React\] Mobx-state-tree #16 : Use Volatile State and Lifecycle Methods to Manage Private State"](/react/2019/09/03/manage-application-state-with-mobx-state-tree-16/)에서 이어지는 내용입니다. 

<br>

***


# Create Dynamic Types and use Type Composition to Extract Common Functionality

> 강의 링크: [https://egghead.io/lessons/react-create-dynamic-types-and-use-type-composition-to-extract-common-functionality](https://egghead.io/lessons/react-create-dynamic-types-and-use-type-composition-to-extract-common-functionality)


<br>

User 모델에서 데이터와 액션을 분리할 수 있습니다.

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
    getSuggestions: flow(function* getSuggestions() { // (...) }),
    save: flow(function* save() {// (...) }),
    afterCreate() { // ... }
  }));

// (...)
```

<br>

또는 `types.compose`를 사용하여 이렇게 작성도 가능합니다.

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

const UserActions = types.model({}).actions(self => ({
    getSuggestions: flow(function* getSuggestions() { // (...) }),
    save: flow(function* save() {// (...) }),
    afterCreate() { // (...) }
  }));

const User = types.compose(UserBase, UserActions);

// (...)
```

<br>

그다음 `Storable.js` 파일을 새로 생성한다. 여기서 REST-specific logic을 위한 dedicated type 소개하려고 한다.

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

다시 `Group.js` 파일을 수정한다. **UserAction**에서 `save`와 `afterCreate`를 제거한다. 그리고 `types.compose`를 사용하여 `UserBase`, `UserAction`, `Storable`를 병합한다.

`src/models/Group.js`

```js
import // (...)
import { Storable } from './Storable'; // add here

const UserBase = types.model({ // (...) });

const UserAction = types.model({}).actions(self => ({
  getSuggestions: flow(function* getSuggestions() {
    const response = yield window.fetch(`http://localhost:3001/suggestions_${self.gender}`);
    const suggestions = yield response.json();
    self.wishList.items.push(...suggestions);
  }),
  // save: flow(function* save() {// (...) }), // remove here
  // afterCreate() { // (...) } // remove here
}));

export const User = types.compose(
  UserBase,
  UserAction,
  Storable
);
```

<br>다음과 같이 액션을 일반화 할 수 있습니다. 그 다음 내용은 그냥 구글 번역기의 도움을 받았습니다. ㅋ

03:28 사실 이것은 아직 재사용 할 수 없습니다. 문제는 여기에 여전히 하드 코딩 된 정보가 있다는 것입니다.이 storable는 항상 users' collection에 stuff을 저장합니다.

03:38 항상 ID property 아래에 저장합니다. 애플리케이션의 모든 엔터티에 적용되지 않을 수 있습니다. 실제로, 나는 이 타입을 보다 일반적인 것으로 만들고 싶습니다.

03:49 여기 멋진 것이 있습니다. 이것은 모두 JavaScript 일 뿐이며 형식화되지 않은 시스템이며 컴파일러에 의해 강제 실행되므로 저장 가능한 함수를 생성하는 함수를 만드는 것과 같은 멋진 작업을 수행 할 수 있습니다.

04:01 `createStorable` 함수를 생성하고, 해당 컬렉션의 해당 attribute에 stuff을 저장해야 하도록 합니다. 

04:11 이제 이 함수를 export합니다.

`src/models/Storable.js`

```js
import { types } from 'mobx';
import { flow, getSnapshot, onSnapshot } from 'mobx-state-tree';

export function createStorable(collection, attribute) {
  return types.model({}).actions(self => ({
    save: flow(function* save() {
      try {
        yield window.fetch(`http://localhost:3001/users/${collection}/${self[attribute]}`, {
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
}
```

04:27 이제 이 기능은 완전히 일반화되었습니다. 

04:46 자,이 user type을 선언하면 즉시 새로운 유형이 생성됩니다. 여전히 동일한 동작을 하는 응용 프로그램이 있지만 이제는 매우 일반적인 논리를 가지므로이 유형과 같이 REST와 유사한 모든 유형에 대해 다른 유형에도 재사용 할 수 있습니다.

`src/models/Group.js`

```js
import // (...)
import { createStorable } from './Storable';

const User = types.compose(
  types
    .model({ // (...) }),
    .actions(self => ({
      getSuggestions: flow(function* getSuggestions() {
        const response = yield window.fetch(`http://localhost:3001/suggestions_${self.gender}`);
        self.wishList.items.push(...(yield response.json()));
      })
    })),
  createStorable("users", "id")
);
```

***

`댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>