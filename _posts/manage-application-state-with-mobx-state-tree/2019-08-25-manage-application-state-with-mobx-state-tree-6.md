---
title: "[React] Mobx-state-tree #6 : React에서 mobx-state-tree Models 수정하기"
comments: true
layout: post
categories: react
tags:
- react
- mobxstatetree
---

6번째 레슨입니다. 이번 레슨에서는 `observer` 래퍼를 사용하여, React 컴포넌트가 자동으로 업데이트되는 과정을 배웁니다.

우리는 다음을 배우게 됩니다.

*  컴포넌트(component)에서 모델 액션(model actions)을 호출하는 방법을 배웁니다.
* `clone`를 사용하여 모델 인스턴스(model instance)를 완전하게 복제하는 방법을 배웁니다.
* `applySnapshot`은 스냅샷에 제공된 모델 인스턴스의 상태(the state of a model instance)를 업데이트하는 데 사용합니다. 

<br>

> 이 포스팅은 제가 학습한 내용을 기록한 글입니다. 이전글 [**"\[React\] Mobx-state-tree #5 : React에서 mobx-state-tree 모델 렌더링하기"**](/react/2019/08/24/manage-application-state-with-mobx-state-tree-5/)에서 이어지는 내용입니다.

<br>

***

# Build Forms with React to Edit mobx-state-tree Models

> 강의 링크: [https://egghead.io/lessons/react-build-forms-with-react-to-edit-mobx-state-tree-models](https://egghead.io/lessons/react-build-forms-with-react-to-edit-mobx-state-tree-models)


## 수정 화면 만들기

먼저 `WishListItemEdit.js` 파일을 생성합니다. 정보를 수정할 수 있는 컴포넌트입니다.

`src/components/WishListItemEdit.js`

```js
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

그다음 `WishListItemView.js` 파일을 수정합니다. 그리고 방금 만든 `WishListItemEdit` 컴포넌트를 사용합니다. `onTooleEdit()` 함수를 호출하면 `WishListItemEdit` 컴포넌트 화면으로 전환됩니다.

`src/components/WishListItemView.js`

```js
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

<br>이제 수정 ✏️버튼을 누르면 수정 화면이 나타난다.

![](https://files.steempeak.com/file/steempeak/anpigon/EeHYDTo8-2019-08-242012-27-02.2019-08-242012_27_27.gif)

<br>

## 수정 취소 기능 만들기

그다음 취소 ❎버튼을 추가하겠습니다. 다시 `WishListItemView.js` 파일을 열어서 `renderEditable()` 함수를 수정합니다.

`src/components/WishListItemView.js`

```js
// (...)

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

// (...)
```

<br>이제 취소 ❎버튼을 누르면 원래 컴포넌트로 돌아갑니다. 하지만 한가지 **문제점**이 있습니다. 취소 ❎버튼을 눌렀는데 데이터가 변경되어 버립니다. 우리가 입력박스에 값을 입력할때마다 모델의 값을 직접 변경하기 때문입니다.

![20190824 123537.20190824 12_36_25.gif](https://files.steempeak.com/file/steempeak/anpigon/38PwTAth-2019-08-242012-35-37.2019-08-242012_36_25.gif)

<br>
<br>

이제 **mobx-state-tree**의 `clone`을 사용하여 원본 데이터가 변경되지 않도록 해봅시다. `onTooleEdit` 함수에서 `this.props.item`를 복제(clone)합니다. 그리고 `WishListItemEdit` 컴포넌트에는 복제한 아이템 `this.state.clone` 를 넘겨줍니다. 

다시 `WishListItemView.js` 파일을 열어서 `renderEditable()` 함수와 `onTooleEdit()` 함수를 수정합니다.

`src/components/WishListItemView.js`

```js
import { clone } from 'mobx-state-tree'; // add here

class WishListItemView extends Component {

  // (...)

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

`renderEditable`에 저장 💾 버튼을 추가합니다. 그리고 `onSaveEdit()` 함수를 추가합니다. `onSaveEdit`에서는 clone 스냅샷을 만들고(getSnapshot), 그 스넵샷을 모델에 적용(applySnapshot)합니다.

`src/components/WishListItemView.js`

```js
import { clone, getSnapshot, applySnapshot } from "mobx-state-tree"; // add here

class WishListItemView extends Component {

  // (...)

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

  // (...)

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

<br>
<br>

***

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 작성하였습니다.

 `댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>