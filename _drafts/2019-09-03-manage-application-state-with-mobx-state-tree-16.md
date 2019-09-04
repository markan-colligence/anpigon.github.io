---
title: "[React] Mobx-state-tree 학습하기 #16 : Use Volatile State and Lifecycle Methods to Manage Private State
"
comments: true
layout: post
categories: react
tags:
- react
- mobxstatetree
---

이전글 ["\[React\] Mobx-state-tree 학습하기 #15 : Use Volatile State and Lifecycle Methods to Manage Private State"](/zzan/@anpigon/react-mobx-state-tree-15-use-volatile-state-and-lifecycle-methods-to-manage-private-state)에서 이어지는 내용입니다. 참고로 이 포스팅은 제가 학습한 내용을 노트에 정리하듯이 기록하여 올리는 글이기 때문에 보팅 안해주셔서 됩니다.  많은 분들이 코딩에 흥미를  느꼈으면 좋겠습니다.  ㅋ

<br>

***

![](https://files.steempeak.com/file/steempeak/anpigon/sYISPibs-E1848CE185A6E18486E185A9E186A820E1848BE185A5E186B9E18482E185B3E186AB20E18483E185B5E1848CE185A1E1848BE185B5E186AB.png)
* 출처: https://egghead.io/courses/manage-application-state-with-mobx-state-tree

***

<br>

## Use Volatile State and Lifecycle Methods to Manage Private State

* 강의 링크: https://egghead.io/lessons/react-automatically-send-changes-to-the-server-by-using-onsnapshot

<br>16번째 레슨입니다. Let's make sure our changes get persisted. We will use the window.fetch api to store our changes in the json-server. And onSnapshot to do this automatically

<br>

***

<br>

`Group.js`를 수정합니다. User에 새로운 액션 `save`를 추가합니다. 이 액션은 async 이므로 flow를 사용합니다. 고유한 ID `${self.id}`로 User를 저장하는 API를 호출합니다.

`src/models/Group.js`
```js
export const User = types
  .model({
    // (...)
  })
  .actions(self => ({
    getSuggestions: flow(function* getSuggestions() {
      // (...)
    }),

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
```

<br>

그 다음은 save액션을 언제 호출해야할지 고민해야합니다. 하지만 간단하게 할 수 있는 방법이 있습니다.

afterCreate와 onSnapshot를 사용하여, 인스턴스 생성 후, 이 인스턴스에서 새 스냅샷이 생성될 때마다 리스닝합니다. 그리고 새로운 스냅샷이 생성 될 때 save 액션을 실행합니다. 이제 User 인스턴스가 변경 될 때마다 서버로 데이터를 보낼 것 입니다.

`src/models/Group.js`
```js
export const User = types
  .model({
    // (...)
  })
  .actions(self => ({
    // (...)
  .actions(self => ({
    getSuggestions: flow(function* getSuggestions() {
      // (...)
    }),
    save: flow(function* save() {
     // (...)
    }),

    // 다음 액션 추가
    afterCreate() {
      onSnapshot(self, self.save);
    }
  }));
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