---
title: "[React] Mobx-state-tree 학습하기 #6 : React에서 mobx-state-tree Models 수정하기"
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
    <div>이전글 ["\[React\] Mobx-state-tree 학습하기 #5 : React에서 mobx-state-tree 모델 렌더링하기"](/zzan/@anpigon/react-mobx-state-tree-5-react-mobx-state-tree)에서 이어지는 내용입니다. 참고로 이 포스팅은 제가 학습한 내용을 노트에 정리하듯이 기록하여 올리는 글이기 때문에 보팅 안해주셔서 됩니다.  많은 분들이 코딩에 흥미를  느꼈으면 좋겠습니다.  ㅋ

<br>

***

![](https://files.steempeak.com/file/steempeak/anpigon/sYISPibs-E1848CE185A6E18486E185A9E186A820E1848BE185A5E186B9E18482E185B3E186AB20E18483E185B5E1848CE185A1E1848BE185B5E186AB.png)
* 출처: https://egghead.io/courses/manage-application-state-with-mobx-state-tree

***

<br>

## Render mobx-state-tree Models in React

* 강의 링크: https://egghead.io/lessons/react-build-forms-with-react-to-edit-mobx-state-tree-models

<br>6번째 레슨입니다. 이번 레슨에서는 `observer` 래퍼를 사용하여, React 컴포넌트가 자동으로 업데이트되는 과정을 배웁니다.

<br>우리는 다음을 배우게 됩니다.

*  컴포넌트(component)에서 모델 액션(model actions)을 호출하는 방법을 배웁니다.
* `clone`를 사용하여 모델 인스턴스(model instance)를 완전하게 복제하는 방법을 배웁니다.
* `applySnapshot`은 스냅샷에 제공된 모델 인스턴스의 상태(the state of a model instance)를 업데이트하는 데 사용합니다. 

<br>

***

<br>
<br>

먼저 `WishListItemEdit.js` 파일을 생성합니다. 정보를 수정할 수 있는 컴포넌트입니다.

`src/components/WishListItemEdit.js`
```
import React, { Component } from 'react';
import { observer } from 'mobx-react';

class WishListItemEdit extends Component {
    render() {
        const { item } = this.props;
        return (
            <div classname="item-edit">
                Thing: <input value={item.name} onChange={this.onNameChange} />
                <br/>
                Price: <input value={item.price} onChange={this.onPriceChange} />
                <br/>
                Image: <input value={item.image} onChange={this.onImageChange} />
                <br/>
            </div>
        )
    }

    onNameChange = event => {
        this.props.item.changeName(event.target.value);
    }

    onPriceChange = event => {
        const price = parseInt(event.target.value);
        if(!isNaN(price)) this.props.item.changePrice(price);
    }

    onImageChange = event => {
        this.props.item.changeImage(event.target.value);
    }
}

export default observer(WishListItemEdit);
```

<br>
<br>

그다음 `WishListItemView.js` 파일을 수정합니다. 그리고 방금 만든 `WishListItemEdit` 컴포넌트를 사용합니다.

`src/components/WishListItemView.js`
```
import React, { Component } from "react";
import { observer } from "mobx-react";

import WishListItemEdit from "./WishListItemEdit";

class WishListItemView extends Component {
  constructor() {
    super();
    this.state = { isEditing: false };
  }

  render() {
    const { item } = this.props;
    return this.state.isEditing ? (
      this.renderEditable()
    ) : (
      <li className="item">
        {item.image && <img src={item.image} alt="" />}
        <h3>{item.name}</h3>
        <span>{item.price}</span>
        <span>
          <button onClick={this.onTooleEdit}>✏️</button>
        </span>
      </li>
    );
  }

  renderEditable = () => {
    return (
      <li className="item">
        <WishListItemEdit item={this.props.item} />
      </li>
    );
  };

  onTooleEdit = () => {
    this.setState({ isEditing: true });
  };
}

export default observer(WishListItemView);

```

<br>이제 수정 ✏️버튼을 누르면 `WishListItemEdit` 컴포넌트로 전환됩니다.

![](https://files.steempeak.com/file/steempeak/anpigon/EeHYDTo8-2019-08-242012-27-02.2019-08-242012_27_27.gif)

<br>
<br>

그다음 취소 ❎버튼을 추가합니다.
```
  renderEditable = () => {
    return (
      <li className="item">
        <WishListItemEdit item={this.props.item} />
        <span>
          <button onClick={this.onCancelEdit}>❎</button>
        </span>
      </li>
    );
  };
```

<br>이제 취소 ❎버튼을 누르면 원래 컴포넌트로 돌아갑니다. 하지만 한가지 **문제점**이 있습니다. 취소 ❎버튼을 눌렀는데 데이터가 변경됩니다.

![20190824 123537.20190824 12_36_25.gif](https://files.steempeak.com/file/steempeak/anpigon/38PwTAth-2019-08-242012-35-37.2019-08-242012_36_25.gif)

<br>
<br>

이제 **mobx-state-tree**의 `clone`을 사용하여 원본 데이터가 변경되지 않도록 해봅시다. `onTooleEdit` 함수에서 `this.props.item`를 복제(clone)합니다. 그리고 `WishListItemEdit` 컴포넌트에는 복제한 아이템 `this.state.clone` 를 넘겨줍니다.

```
import { clone } from 'mobx-state-tree'; // add here

class WishListItemView extends Component {

  // ...

  renderEditable = () => {
    return (
      <li className="item">
        <WishListItemEdit item={this.state.clone} />
        <span>
          <button onClick={this.onCancelEdit}>❎</button>
        </span>
      </li>
    );
  };

  onTooleEdit = () => {
    this.setState({
      isEditing: true,
      clone: clone(this.props.item) // add here
    });
  };

  // ...

}
```

<br>앱을 실행하고 다시 확인해 봅시다. 이제는 데이터를 수정하고 취소를 해도 원본 데이터가 변경되지 않습니다.

![](https://files.steempeak.com/file/steempeak/anpigon/8GfIGMGa-2019-08-242012-42-38.2019-08-242012_43_04.gif)

<br>
<br>

마지막입니다. 이제 변경된 clone 데이터를 mobx-state-tree Models에 적용해야합니다. 여기에는 **mobx-state-tree**의 `getSnapshot`, `applySnapshot`를 사용합니다.

`renderEditable`에 저장 💾 버튼을 추가합니다. 그리고 `onSaveEdit` 함수를 추가합니다. `onSaveEdit`에서는 clone 스냅샷을 만들고(getSnapshot), 그 스넵샷을 모델에 적용(applySnapshot)합니다.

```
import { clone, getSnapshot, applySnapshot } from "mobx-state-tree"; // add here

class WishListItemView extends Component {

  // ...

  renderEditable = () => {
    return (
      <li className="item">
        <WishListItemEdit item={this.state.clone} />
        <span>
        <button onClick={this.onSaveEdit}>💾</button>
          <button onClick={this.onCancelEdit}>❎</button>
        </span>
      </li>
    );
  };

  // ...

  onSaveEdit = () => {
    const snapshot = getSnapshot(this.state.clone);
    applySnapshot(this.props.item, snapshot);
    this.setState({ isEditing: false, clone: null });
  };
}
```
<br>

앱을 실행하고 취소 ❎, 저장 💾버튼을 눌러보면 잘 작동하는 것을 확인할 수 있습니다.

![](https://files.steempeak.com/file/steempeak/anpigon/kK3awEmf-2019-08-242012-48-32.2019-08-242012_49_03.gif)


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