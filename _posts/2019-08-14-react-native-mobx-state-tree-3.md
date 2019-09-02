---
title: "[React Native] MobX State Tree 학습하기 #3"
comments: true
layout: post
categories: reactnative
tags:
- reactnative
- mobxstatetree
---

이전글 [**"\[React Native\] MobX State Tree 학습하기 #2"**](/reactnative/2019/08/12/react-native-mobx-state-tree-2/) 에서 이어지는 내용입니다.

<br>
<br><center>* * *</center><br>
<br>

본 포스팅은 아래 강의를 보면서 정리한 노트입니다.

[https://www.youtube.com/embed/snBvYS6eC2E](https://www.youtube.com/embed/snBvYS6eC2E)

<iframe width="560" height="315" src="https://www.youtube.com/embed/snBvYS6eC2E" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

***

<br><br>

# Book 읽음 표시 기능 구현하기

이제 우리는 해당 book에 대한 읽음 표시를 `Yes/No`로 토글 할 수 있는 기능을 구현할 것입니다.

### BookStore에 toogleRead 액션 등록하기

`BookStore.js` 파일을 수정합니다. 그리고 **Book** 에 `toogleRead` 액션을 추가합니다. `toogleRead` 은 해당 Book의 read 값을 `true/false` 로 값을 변경 해주 액션입니다.

```js
const Book = types
  .model('Book', {
    title: types.string,
    author: types.string,
    read: false,
  })
  // 액션 추가
  .actions(self => ({
    toggleRead() {
      self.read = !self.read;
    },
  }));
```

<br>

### 화면에 toggleRead 액션 붙이기

그다음 `App.js` 파일를 수정합니다. 그리고 **App 클래스**에 `toggleRead` 함수를 추가합니다. `toggleRead` 함수에서는 **Book**의 `toogleRead` 액션을 수행합니다.

```js
class App extends React.Component {

  // (...)

  toggleRead = book => {
    book.toggleRead();
  };
```

  
그다음 render에 **Read 여부**를 출력할 Text 컴포넌트를 추가합니다. 그리고 Read를 출력하는 `<Text>` 컴포넌트의 `onPress` 이벤트에는 `toggleRead` 함수를 등록합니다. 이제 Read Text를 누를 때마다 Read 값이 바뀌게 됩니다.

```js
class App extends React.Component {

  // (...)
	
  render() {
	
    // (...)

    return (
        ...
        {books.map((book, index) => (
          <React.Fragment key={index}>
            <Text>{book.title}</Text>
            <Text onPress={() => this.toggleRead(book)}>
              Read: {book.read ? 'Yes' : 'No'}
            </Text>
          </React.Fragment>
        ))}
				
// (...)
```

### 실행결과

화면에서 Read를 누르면 `Yes` 또는 `No` 값으로 변경됩니다.

![](https://files.steempeak.com/file/steempeak/anpigon/1wego6oz-2019-08-112022-46-01.2019-08-112022_47_05.gif)

<br>

***

<br>

# Book 삭제(delete) 기능 구현하기

Book을 등록을 했으니 이제 삭제 기능을 구현합시다.

### BookStore에 removeBook 액션 등록하기

`BookStore.js` 파일을 수정합니다. 그리고 **BookStore**에 `removeBook` 액션을 추가합니다. `removeBook` 액션을 수행하면 해당 Book을  **BookStore**에서 삭제할 것입니다.

```js
const BookStore = types
  .model('Books', {
    books: types.array(Book),
  })
  .actions(self => ({
    addBook(book) {
      self.books.push(book);
    },
    removeBook(book) {
      destroy(book);
    },
  }))
  
	// (...)
```

### 화면에 removeBook 기능 붙이기

App.js 파일를 수정합니다. **App** 클래스에 `delete` 함수를 추가합니다. `delete` 함수에서는 BookStore의 `removeBook` 액션을 실행합니다.

```js
class App extends React.Component {

	// (...)
	
  delete = book => {
    BookStore.removeBook(book);
  };
	
	// (...)
```

  
그다음 Text 컴포넌트를 사용하여 render에 삭제 버튼을 추가합니다. 그리고 삭제 버튼인 `<Text>` 컴포넌트의 onPress 이벤트에 `delete` 함수를 등록합니다. 이제 **Delete 텍스트**를 누르면 해당 book 데이터가 **BookStore**에서 삭제됩니다.

```
        {books.map((book, index) => (
          <React.Fragment key={index}>
            <Text>{book.title}</Text>
            <Text onPress={() => this.toogleRead(book)}>
              Read: {book.read ? 'Yes' : 'No'}
            </Text>
            <Text onPress={() => this.delete(book)}>Delete</Text>
          </React.Fragment>
        ))}

```

### 실행결과

새로운 Book을 추가합니다. 그리고 해당 Book의 Delete를 누르면 해당 Book이 삭제됩니다.

| ![](https://steemitimages.com/460x0/https://files.steempeak.com/file/steempeak/anpigon/pP2x9uYe-E18489E185B3E1848FE185B3E18485E185B5E186ABE18489E185A3E186BA202019-08-1120E1848BE185A9E18492E185AE2011.39.45.png) | ![](https://files.steempeak.com/file/steempeak/anpigon/x7UoCQiy-2019-08-112023-38-25.2019-08-112023_39_32.gif) |

  
  
  

# Mobx의 views 속성 사용하기

Mobx에서는 계산된 값(computed values)이나 필터된 값이 필요한 경우, 재렌더링하지 않게 하기 위해 views 속성을 제공합니다. 다음과 같이 사용합니다.

`BookStore.js` 파일을 수정합니다. 그리고 `BookStore`에 **views 속성**을 추가합니다. `get readBooks` 함수는 `read==true`인 Books 데이터를 리턴합니다. Books 데이터가 바뀌지 않으면 이전에 계산된 값을 바로 리턴합니다. 그리고 `booksByAuthor` 는 인자값으로 받은 Author에 해당하는 Books를 리턴합니다. 이 함수 또한 Books 데이터가 바뀌지 않으면 재렌더링하지 않습니다.

```
const BookStore = types
  .model('Books', {
    books: types.array(Book),
  })
  .views(self => ({
    get readBooks() {
      return self.books.filter(book => book.read);
    },
    booksByAuthor(author) {
      return self.books.filter(book => book.author === author);
    },
  }))

```

  
  
위 데이터는 컴포넌트를 사용하지 않고 **Console.log** 에 출력해보겠습니다.

```
class App extends React.Component {
  ...
  render() {
    const { books } = BookStore;
    console.log('readBooks:', BookStore.readBooks);
    console.log('booksByAuthor Anpigon:', BookStore.booksByAuthor('Anpigon'));

```

  
  
**실행결과**

다음과 같이 **Console.log** 에서 출력된 값을 확인 할 수 있습니다.

![](https://files.steempeak.com/file/steempeak/anpigon/Q4TM0IZG-2019-08-112023-55-06.2019-08-112023_59_55.gif)

<br>

동영상 강의 내용은 여기까지 입니다. 총 20분으로 짧은 강의였지만, 매우 훌륭한 MobX 튜토리얼 강의입니다. 

***

<br>

> 이 글은 [보상형 SNS 스팀잇](https://steemit.com/@anpigon)에서 먼저 작성하였습니다.

<br>

 `댓글`, `팔로우`, `좋아요` 해 주시는 모든 분께 감사합니다.

항상 행복한 하루 보내시길 바랍니다.

***

<center><img src='https://steemitimages.com/400x0/https://cdn.steemitimages.com/DQmQmWhMN6zNrLmKJRKhvSScEgWZmpb8zCeE2Gray1krbv6/BC054B6E-6F73-46D0-88E4-C88EB8167037.jpeg'><h5>vote, reblog, follow <code><a href='https://steemit.com/@anpigon'>@anpigon</a></code></h5></center>

<br>