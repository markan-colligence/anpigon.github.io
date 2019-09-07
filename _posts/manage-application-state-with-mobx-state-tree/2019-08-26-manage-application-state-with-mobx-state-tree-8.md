---
title: "[React] Mobx-state-tree #8 : Create an Entry Form to Add Models to the State Tree"
comments: true
layout: post
categories: react
tags:
- react
- mobxstatetree
---

8번째 레슨입니다. 위시 리스트에 새 항목을 추가 할 시간입니다. 우리는 지금까지 작성한 입력폼과 모델을 재사용할 것입니다.

우리는 다음을 배우게 됩니다.

*  MST는 단일 상태 트리(single state tree)로 제한되지 않습니다. 모든 모델은 자체적인 트리를 가질 수 있습니다
* 상태 트리(state tree)에 모델 인스턴스 추가하기

<br>

> 이 포스팅은 제가 학습한 내용을 기록한 글입니다. 이전글 [**"\[React\] Mobx-state-tree  #7 : Remove Model Instances from the Tree"**](/react/2019/08/25/manage-application-state-with-mobx-state-tree-7/)에서 이어지는 내용입니다.

<br>

***

# Create an Entry Form to Add Models to the State Tree

* 강의 링크: [https://egghead.io/lessons/react-create-an-entry-form-to-add-models-to-the-state-tree](https://egghead.io/lessons/react-create-an-entry-form-to-add-models-to-the-state-tree)

<br><br>

새 파일 `WishListItemEntry.js`을 생성합니다. 이 파일에서는 **WishListItemEdit** 컴포넌트를 재활용합니다. 그리고 Add 버튼을 만듭니다. 참고로 `WishList.add` 액션은 [Mobx-state-tree #2](/react/2019/08/17/manage-application-state-with-mobx-state-tree-2/) 강의에서 작성되었습니다.

이 화면에서는 입력 양식을 작성하고 Add 버튼을 누르면 WishList 모델에 새 항목을 추가하게 될 것입니다.

`src/components/WishListItemEntry.js`

```js
import React, { Component } from "react";
import { observer } from "mobx-react";

import WishListItemEdit from "./WishListItemEdit";

import { WishListItem, WishList } from "../models/WhishList";

class WishListItemEntry extends Component {
  constructor() {
    super();
    this.state = {
      entry: WishListItem.create({
        name: "",
        price: 0
      })
    };
  }

  render() {
    return (
      <div>
        <WishListItemEdit item={this.state.entry} />
        <button onClick={this.onAdd}>Add</button>
      </div>
    );
  }

  onAdd = () => {
    this.props.wishList.add(this.state.entry);
    this.setState({
      entry: WishListItem.create({
        name: "",
        price: 0
      })
    });
  };
}

export default WishListItemEntry;
```

<br><br>

그다음 `WishListView.js` 파일을 수정합니다. **WishListView** 컴포넌트에는 방금 만든 **WishListItemEntry** 컴포넌트를 추가하여 화면에 보여줍니다.

`src/components/WishListView.js`

```js
import React from "react";
import { observer } from "mobx-react";
import WishListItemView from "./WishListItemView";
import WishListItemEntry from './WishListItemEntry'; // add here

const WishListView = ({ wishList }) => (
  <div className="list">
    <ul>
      {wishList.items.map((item, idx) => (
        <WishListItemView key={idx} item={item} />
      ))}
    </ul>
   Total: {wishList.totalPrice} 💲
   <WishListItemEntry wishList={wishList} />
  </div>
);

export default observer(WishListView);
```

### 실행화면

이제 새로운 항목을 작성하고 Add 버튼을 눌러보세요.

![](https://files.steempeak.com/file/steempeak/anpigon/fGBLZ36K-2019-08-252017-12-49.2019-08-252017_13_29.gif)

***

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 작성하였습니다.

`댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>