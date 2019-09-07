---
layout: post
title: "[React] Mobx-state-tree #1: Mobx-state-tree를 사용해서 Reat State 관리하기"
comments: true
categories: react
tags:
- react
- mobxstatetree
---

이 레슨은 위시리스트 앱을 만드는 과정을 안내합니다.  우리는 mobx-state-tree(MST)의 핵심 모델을 살펴볼 것입니다. 모델(Model)은 state를 정의하고 유효한지 검사합니다.

이번 레슨에서 우리는 다음을 배웁니다.

* `types.Model`를 사용하여 모델 정의하기
* `Model.create`를 사용하여 JSON에서 모델 인스턴스화하기
* Primitive types : `types.string` 와 `types.number`
* Type inference for primitive types
* `types.array`
* `types.optional`
* Composing models into a model tree
* Testing models using jest

<br>

> 이 포스팅은 아래 동영상 강의를 보고 학습한 내용을 기록한 글입니다.

![](https://files.steempeak.com/file/steempeak/anpigon/sYISPibs-E1848CE185A6E18486E185A9E186A820E1848BE185A5E186B9E18482E185B3E186AB20E18483E185B5E1848CE185A1E1848BE185B5E186AB.png)

![](https://files.steempeak.com/file/steempeak/anpigon/QYaZgRXD-scrnli_2019-208-2016-20E1848BE185A9E18492E185AE207-51-18.png)

<sup>* 출처: [https://egghead.io/courses/manage-application-state-with-mobx-state-tree](https://egghead.io/courses/manage-application-state-with-mobx-state-tree)</sup>

<br>

***

# Describe Your Application Domain Using mobx-state-tree(MST) Models

> 강의 링크: [https://egghead.io/lessons/react-describe-your-application-domain-using-mobx-state-tree-mst-models](https://egghead.io/lessons/react-describe-your-application-domain-using-mobx-state-tree-mst-models)


## wishlist 프로젝트 생성하기

우선 React App 프로젝트를 생성합니다.

```bash
$ npx create-react-app wishlist
```

<sup>([**npx**](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b)는 npm 5.2+ 이상 부터 사용가능합니다. 이전 버전을 사용중이라면 ["instructions for older npm versions"](https://gist.github.com/gaearon/4064d3c23a77c74a3614c498a8bb1c5f) 문서를 참고하세요.)</sup>

<br>아래와 같이 필요한 모듈이 설치되면서 프로젝트 디렉토리 `wishlist`가 생성됩니다.

![create-react-app wishlist](https://files.steempeak.com/file/steempeak/anpigon/qKbngEv5-E18489E185B3E1848FE185B3E18485E185B5E186ABE18489E185A3E186BA202019-08-1620E1848BE185A9E18492E185AE206.30.31.png)


## Mobx 모듈 설치하기

다음 명령어를 입력하여 mobx와 mobx-state-tree 모듈을 설치합니다.

```
$ yarn add mobx mobx-react mobx-state-tree
```

<br>아래 화면처럼 설치가 진행됩니다.
![](https://files.steempeak.com/file/steempeak/anpigon/vF5NPzrP-E18489E185B3E1848FE185B3E18485E185B5E186ABE18489E185A3E186BA202019-08-1620E1848BE185A9E18492E185AE206.37.25.png)

<br>

## model 생성하기

`./src` 폴더 아래에 `model` 폴더를 생성합니다.

![](https://files.steempeak.com/file/steempeak/anpigon/rCAs2zKU-E18489E185B3E1848FE185B3E18485E185B5E186ABE18489E185A3E186BA202019-08-1620E1848BE185A9E18492E185AE206.38.54.png)

<br>그리고 `WhishList.js` 파일을 생성합니다.

![](https://files.steempeak.com/file/steempeak/anpigon/SbF32haI-E18489E185B3E1848FE185B3E18485E185B5E186ABE18489E185A3E186BA202019-08-1620E1848BE185A9E18492E185AE206.40.18.png)

 <br>`WhishList.js` 파일에는 다음 내용을 입력합니다.


```js
// src/models/WhishList.js

import { types } from "mobx-state-tree";

// WishListItem 모델 정의
export const WishListItem = types.model({
  name: types.string,
  price: types.number,
  image: types.optional(types.string, ""),
});

// WishList 모델 정의
export const WishList = types.model({
  items: types.optional(types.array(WishListItem), [])
});

```

<br>`WishListItem`의 `image` 속성은 **optional**이며 기본값은 `""`입니다. 그리고 `image`는 `types.optional`을 사용하지 않고 `""`만 입력해도 같은 결과가 나타납니다.

```js
export const WishListItem = types.model({
  name: types.string,
  price: types.number,
  //  image: types.optional(types.string, ""), // 이렇게 입력해도 되고
  image: "" // 이렇게 입력해도 된다.
});
```

<br>
<br>

# WhishList 모델 테스트 하기

`WhishList.test.js` 파일을 새로 생성합니다.

![](https://files.steempeak.com/file/steempeak/anpigon/fKYB4AlR-E18489E185B3E1848FE185B3E18485E185B5E186ABE18489E185A3E186BA202019-08-1620E1848BE185A9E18492E185AE206.59.59.png)

<br>`WhishList.test.js` 파일에는 다음 내용을 입력합니다.

```js
import { WishListItem, WishList } from "./WhishList";

it("can create a instance of a model", () => {
  const item = WishListItem.create({
    name: "Reat Native - anpigon",
    price: 28.73
  });

  expect(item.price).toBe(28.73); // true
  expect(item.image).toBe(""); // true
});

it("can create a wishlist", () => {
  const list = WishList.create({
    items: [
      {
        name: "Reat Native - anpigon",
        price: 28.73
      }
    ]
  });
	
  expect(list.items.length).toBe(1); // true
  expect(list.items[0].price).toBe(28.73); // true
});
```

<br>
테스트 하기 위해서 `yarn test`를 입력합니다.

![yarn test](https://files.steempeak.com/file/steempeak/anpigon/7EeoobCu-E18489E185B3E1848FE185B3E18485E185B5E186ABE18489E185A3E186BA202019-08-1620E1848BE185A9E18492E185AE207.05.39.png)


테스트에 성공하면 다음과 같은 메세지가 콘솔에 출력됩니다.
![테스트 성공](https://files.steempeak.com/file/steempeak/anpigon/nJXkDAS6-E18489E185B3E1848FE185B3E18485E185B5E186ABE18489E185A3E186BA202019-08-1620E1848BE185A9E18492E185AE207.18.20.png)


<br>
<br>

***

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 작성하였습니다.

 `댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.


***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>
