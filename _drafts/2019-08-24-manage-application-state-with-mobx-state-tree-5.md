---
title: "[React] Mobx-state-tree 학습하기 #5 : React에서 mobx-state-tree 모델 렌더링하기"
comments: true
layout: post
categories: react
tags:
- react
- mobxstatetree
---

이전글 [**"\[React\] Mobx-state-tree 학습하기 #4 : Views를 사용하여 모델에서 정보 보여주기"**](/zzan/@anpigon/react-native-manage-application-state-with-mobx-state-tree-4)에서 이어지는 내용입니다. 참고로 이 포스팅은 제가 학습한 내용을 노트에 정리하듯이 기록하여 올리는 글이기 때문에 보팅 안해주셔서 됩니다.  많은 분들이 코딩에 흥미를  느꼈으면 좋겠습니다.  ㅋ

<br>

***

![](https://files.steempeak.com/file/steempeak/anpigon/sYISPibs-E1848CE185A6E18486E185A9E186A820E1848BE185A5E186B9E18482E185B3E186AB20E18483E185B5E1848CE185A1E1848BE185B5E186AB.png)
* 출처: https://egghead.io/courses/manage-application-state-with-mobx-state-tree

***

<br>

## Render mobx-state-tree Models in React

* 강의 링크: https://egghead.io/lessons/react-render-mobx-state-tree-models-in-react

<br>5번째 레슨입니다. 이번 레슨에서는 `observer` 래퍼를 사용하여, React 컴포넌트가 자동으로 업데이트되는 과정을 배웁니다.



<br>우리는 다음을 배우게 됩니다.

*  **mobx-react**의 옵저버(observer)를 사용하여, React 컴포넌트를 업데이트하고 재렌더링하는 방법을 알아보자.
* 컴포넌트에 모델을 사용하면 컴포넌트는 멍청해진다. 그래서 가끔 stateless function components처럼 된다.
* **mobx devtools**를 사용하여, mobx-react에서 자동으로 재렌더링 해야할 최소 컴포넌트 셋트를 찾는 것을 visualize하는 방법을 알아보자.

<br>

***



<br><br>

우선 몇가지 단일 컴포넌트를 만들어 보겠습니다. 

먼저 `WishListItemView.js` 파일을 생성합니다.

`src/components/WishListItemView.js`

```
import React from "react";

const WishListItemView = ({ item }) => (
  <li className="item">
    {item.image && <img src={item.image} alt="" />}
    <h3>{item.name}</h3>
    <span>{item.price}</span>
  </li>
);

export default WishListItemView;

```

<br>

그다음 `components/WishListView.js` 파일을 생성합니다. 

`src/components/WishListView.js`
```
import React from "react";

import WishListItemView from "./WishListItemView";

const WishListView = ({ wishList }) => (
  <div className="list">
    <ul>
      {wishList.items.map((item, idx) => (
        <WishListItemView key={idx} item={item} />
      ))}
    </ul>
   Total: {wishList.totalPrice} 💲
  </div>
);

export default WishListView;

```

<br>

그리고 나서 `components/App.js` 파일을 생성합니다. 

`src/components/App.js`
```
import React from "react";

import WishListView from "./WishListView";

function App(props) {
  return (
    <div>
      <h1 className="App-title">WishList</h1>
      <WishListView wishList={props.wishList} />
    </div>
  );
}

export default App;
```

<br>

<br>그리고 `index.js` 파일을 수정합니다.

`src/index.js`
```
import React from "react";
import ReactDOM from "react-dom";

import App from "./components/App";

import { WishList } from "./models/WhishList";

const wishList = WishList.create({
  items: [
    {
      name: "LEGO Mindstorems EV3",
      price: 349.95,
      image:
        "https://www.justbricks.com.au/images/thumbnails/280/229/detailed/14/31313LEGOMINDSTORMSNXTEV3.png"
    },
    {
      name: "Miracles - C.S. Lewis",
      price: 12.91,
      image:
        "https://store.vision.org.au/5438-large_default/miracles-do-they-really-happen-c-s-lewis-paperback.jpg"
    }
  ]
});

ReactDOM.render(<App wishList={wishList} />, document.getElementById("root"));
```

<br>

이제 앱을 실행하면 다음과 같이 보입니다.

![](https://files.steempeak.com/file/steempeak/anpigon/46y4Ng2j-E18489E185B3E1848FE185B3E18485E185B5E186ABE18489E185A3E186BA202019-08-182012.59.18.png)


<br><br>

***

<br><br>

## MobX observer 사용하기


`index.js` 파일에 다음 코드를 추가합니다. 1초마다 가격에 변화를 주는 코드입니다.

`src/index.js`

```
setInterval(() => {
  wishList.items[0].changePrice(wishList.items[0].price + 1);
}, 1000);
```
지금은 위에 코드를 입력하고 실행하면 화면에 아무런 변화가 없습니다. `observer`를 설정해서 컴포넌트의 데이터 변화를 감지해야합니다.

<br>

**WishListView** 모델에 `observer`를 설정합니다. `observer`는 모델의 데이터 변경을 감지하고 해당 컴포넌트를 재렌더링 할 것입니다.

`src/components/WishListView.js`

```
import { observer } from 'mobx-react'

// ...

export default observer(WishListView);
```

<br>아래 화면에서 LEGO 가격이 증가하는 것이 보이나요?

![](https://files.steempeak.com/file/steempeak/anpigon/XIh7Smjo-2019-08-182013-22-41.2019-08-182013_23_25.gif)


<br>
<br>

***

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 먼저 작성되었습니다.

 `댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>