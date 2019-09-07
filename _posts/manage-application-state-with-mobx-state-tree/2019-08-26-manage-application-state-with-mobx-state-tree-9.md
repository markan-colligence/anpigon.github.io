---
title: "[React] Mobx-state-tree #9 : 로컬 저장소에 저장소 저장"
comments: true
layout: post
categories: react
tags:
- react
- mobxstatetree
---

9번째 레슨입니다.  최적의 사용자 및 개발자 경험을 위해 로컬 스토리지에 상태(state)를 저장해야하는 경우가 있습니다.

이번 레슨에서 우리는 다음을 배우게 됩니다.

* `onSnapshot`를 사용하여 새 스냅 샷에 대한 알림을 받을 수 있습니다
* 로컬 스토리지에 스냅샷 저장하기
* 로컬 스토리지에서 상태 트리 복원하기
* `Model.is(...)`을 사용하여 스냅샷이 모델을 준수하는지 확인하기

<br>

> 이 포스팅은 제가 학습한 내용을 기록한 글입니다. 이전글 ["\[React\] Mobx-state-tree #8 : Create an Entry Form to Add Models to the State Tree"](/react/2019/08/26/manage-application-state-with-mobx-state-tree-8/)에서 이어지는 내용입니다.

<br>

***

# Store Store in Local Storage

> 강의 링크: https://egghead.io/lessons/react-store-store-in-local-storage


## 로컬 스토리지에 스냅샷 저장하고 가져오기

`index.js` 파일을 수정합니다. 그다음 초기 상태(initial state)를 담을 `initialState` 변수를 만듭니다. 그리고 로컬 스토리지에서 가져온 데이터를  `initialState` 에 담아 `WishList` 모델을 초기화합니다.

`src/index.js`

```js
import // (...)

// 초기 State 정의
let initialState = {
  items: [ // (...) ]
}

// 로컬 스토리지에 데이터가 있으면 가져와서 JSON 파싱하기
if(localStorage.getItem("wishlistapp")) {
  initialState = JSON.parse(localStorage.getItem("wishlistapp")); 
}

// initialState 로 WishList 모델 인스턴스 초기화하기
const wishList = WishList.create(initialState);

ReactDOM.render(<App wishList={wishList} />, document.getElementById("root"));
```

<br>
<br>

 그다음 **mobx-state-tree** 모듈의 `onSnapshot` 를 **import** 합니다. 그리고 `onSnapshot` 를 사용하여 스냅샷이 발생하면 스냅샷을 로컬 스토리지에 저장합니다. 
 
 `onSnapshot(model, callback)`는  새 스냅샷이 발생할 때 마다 이벤트 리스너가 생성됩니다. 자세한 내용은 [mobx-state-tree gitbook snapshots 문서](https://mobx-state-tree.gitbook.io/docs/concepts/snapshots)를 참고하세요.

`src/index.js`

```js
import // (...)

import { onSnapshot } from 'mobx-state-tree'; // add here

// (...)

onSnapshot(wishList, snapshot => {
  localStorage.setItem("wishlistapp", JSON.stringify(snapshot));
})
```

이제 새 스냅샷이 발생하면 onSnapshot 함수에서 현재 state를 가져와서 로컬 스토리지에 저장하게 됩니다.

<br> 
<br> 

그다음 로컬 스토리지에서 가져온 데이터가 **WishList** 모델의 데이터에 준수하는지 검증 코드를 입력합니다. 이런 코드를 보통 방어 로직이라고 합니다.

```js
if(localStorage.getItem("wishlistapp")) {
  const json = JSON.parse(localStorage.getItem("wishlistapp"));
  if( WishList.is(json) ) {
    initialState = json;
  }
}
```


### 실행 화면

이제 데이터를 입력하고 Add 버튼을 누르면 현재 State가 로컬 스토리이에 저장됩니다. 그래서 새로고침을 해도 등록한 데이터가 유지됩니다.  로컬 스토리지에 저장된 데이터는 개발자 브라우저 콘솔창에서 확인 가능합니다.

![1.gif](https://files.steempeak.com/file/steempeak/anpigon/zWYSnZOi-1.gif)

<br>
<br>

***

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 먼저 작성되었습니다.

 `댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>