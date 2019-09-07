---
title: "[React] Mobx-state-tree 학습하기 #10 : Model Definitions Change되면 Hot Module Reloading를 사용하여 Model Tree State 복원하기"
comments: true
layout: post
categories: react
tags:
- react
- mobxstatetree
---

이전글 ["\[React\] Mobx-state-tree 학습하기 #9 : 로컬 저장소에 저장소 저장"](/zzan/@anpigon/react-mobx-state-tree-9)에서 이어지는 내용입니다. 참고로 이 포스팅은 제가 학습한 내용을 노트에 정리하듯이 기록하여 올리는 글이기 때문에 보팅 안해주셔서 됩니다.  많은 분들이 코딩에 흥미를  느꼈으면 좋겠습니다.  ㅋ

<br>

***

![](https://files.steempeak.com/file/steempeak/anpigon/sYISPibs-E1848CE185A6E18486E185A9E186A820E1848BE185A5E186B9E18482E185B3E186AB20E18483E185B5E1848CE185A1E1848BE185B5E186AB.png)
* 출처: https://egghead.io/courses/manage-application-state-with-mobx-state-tree

***

<br>

## Restore the Model Tree State using Hot Module Reloading when Model Definitions Change

* 강의 링크: https://egghead.io/lessons/react-restore-the-model-tree-state-using-hot-module-reloading-when-model-definitions-change

<br>10번째 레슨입니다. 이번 레슨에서는 HMR(Hot Module Reloading)을 설정하는 방법을 배웁니다. React components와 MST models를 새로 정의하면, HMR에서 이를 다시 로드하여 실행중인 애플리케이션에 적용하게 됩니다.

<br>우리는 다음을 배우게 됩니다.

- HMR(Hot Module Reloading) 설정 방법
- components의 변경 사항을 accept 하는 방법
- state를 유지하면서 changing model definitions의 변경 사항을 accept하는 방법

<br>

___

<br>

이전에 우리는 state를 보존하기 위해서 로컬 스토리지를 사용했습니다. 하지만 현재 개발 방식에는 단점이 있습니다. 무언가를 변경할 때 마다 앱을 다시 로드해야 한다는 것입니다. 

hot module reloading 라고 불리는 기술이 mobx-state-tree 에서 잘 작동하도록 설정할 수 있습니다. hot module reloading는 대략 다음과 같이 작동합니다. JS 파일을 수정하면 webpack은 변경 사항을 반환 application으로 보내고 메모리의 모듈을 대체합니다.

<br>이전에 개발했던 로컬 스토리지 구현을 제거합니다. 그런 다음 renderApp 함수를 작성합니다. renderApp는 단순히 initial render을 래핑한 함수입니다. 

우리는 핫 모듈 리로딩에서 두가지 변경의 경우를 처리해야 합니다. 첫번째는 컴포넌트가 변경되는 경우입니다. 이 경우에는 루트에서 application을 다시 렌더링하면 됩니다. 두번째는 모델이 변경된 경우입니다. 이 경우에는 스냅샷을 사용하여 현재 state tree가 유지되도록 해야 합니다.

`index.js` 파일을 다음과 같이 수정합니다.

`src/index.js`

```js
import React from "react";
import ReactDOM from "react-dom";

import { getSnapshot } from 'mobx-state-tree'; // add here

import App from "./components/App";

import { WishList } from "./models/WishList";

let initialState = {
  items: [
    // ...
  ]
}

let wishList = WishList.create(initialState);

function renderApp() {
  ReactDOM.render(<App wishList={wishList} />, document.getElementById("root"));
}

renderApp();

if(module.hot) {
  module.hot.accept(["./components/App"], () => {
    // new compoennts
    renderApp();
  });

  module.hot.accept(["./models/WishList"], () => {
    // new model definitions
    const snapshot = getSnapshot(wishList);
    wishList = WishList.create(snapshot);
    renderApp();
  });
}
```

이제는 모델을 수정해도 현재 작업하고 있던 state tree를 그대로 유지 할 수 있습니다.

<br>
<br>

***

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 먼저 작성되었습니다.

 `댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>