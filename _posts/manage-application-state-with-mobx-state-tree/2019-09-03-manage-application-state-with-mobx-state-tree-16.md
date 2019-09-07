---
title: "[React] Mobx-state-tree #16 : Use Volatile State and Lifecycle Methods to Manage Private State
"
comments: true
layout: post
categories: react
tags:
- react
- mobxstatetree
---

16번째 레슨입니다. Let's make sure our changes get persisted. We will use the window.fetch api to store our changes in the json-server. And onSnapshot to do this automatically

<br>

> 이 포스팅은 제가 학습한 내용을 기록한 글입니다. 이전글 ["\[React\] Mobx-state-tree #15 : Use Volatile State and Lifecycle Methods to Manage Private State"](/react/2019/09/01/manage-application-state-with-mobx-state-tree-15/)에서 이어지는 내용입니다.

<br>

***


# Use Volatile State and Lifecycle Methods to Manage Private State

> 강의 링크: [https://egghead.io/lessons/react-automatically-send-changes-to-the-server-by-using-onsnapshot](https://egghead.io/lessons/react-automatically-send-changes-to-the-server-by-using-onsnapshot)

<br>

`Group.js`를 수정합니다. **User** 모델에 새로운 액션 `save`를 추가합니다. 이 액션은 async 이므로 flow를 사용합니다. 고유한 ID `${self.id}`로 User를 저장하는 API를 호출합니다.

`src/models/Group.js`

```js
import // (...)

export const User = types
  .model({ // (...) })
  .actions(self => ({
    getSuggestions: flow(function* getSuggestions() { // (...) }),

    // save 액션 추가
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
    })
  }));

export const Group = types
  .model({ // (...) })
  .actions(self => ({ // (...) }));
```

<br>

그 다음에는 save 액션을 언제 호출해야할지 고민해야합니다. 하지만 간단하게 할 수 있는 방법이 있습니다.

**life cycle hooks**인 `afterCreate`와 `onSnapshot`를 사용하면 됩니다. 인스턴스 생성 할 때, 후크를 사용하여 이 인스턴스에서 새 스냅샷이 생성될 때마다 save 액션을 실행하도록 해봅시다. 그러면 User 인스턴스가 변경 될 때마다 서버로 변경된 스냅샷 데이터를 보낼 것 입니다.

`src/models/Group.js`

```js
import // (...)

export const User = types
  .model({ // (...) })
  .actions(self => ({
    getSuggestions: flow(function* getSuggestions() { // (...) }),
    save: flow(function* save() { // (...) }),

    // 다음 액션 추가
    afterCreate() {
      onSnapshot(self, self.save);
    }
  }));

export const Group = types
  .model({ // (...) })
  .actions(self => ({ // (...) }));
```

<br>

***

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 작성하였습니다.

`댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>