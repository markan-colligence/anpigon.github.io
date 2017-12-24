---
layout: post
title:  "Spring 배우면서.."
date:   2017-12-23 01:33:10 +0900
tag: spring
---

### Spring Validation
- [http://hibernate.org/validator/](http://hibernate.org/validator/) 로 이동
- latest stable 버전으로 zip 파일 다운받아서 압축 해제
- 아래 파일들 복사해서 Spring Project의 WEB-INF/lib 폴더에 복사

	![라이브러리들](/assets/img/201712/2017-12-25-3.05.37.png)


- Controller Class 안에 InitBinder 작성  
(앞뒤 공백 제거 및 공백만 입력된 값을 null로 바꿔줌)

~~~java
@InitBinder
public void initBinder(WebDataBinder dataBinder) {

	StringTrimmerEditor stringTrimmerEditor = new StringTrimmerEditor(true);

	dataBinder.registerCustomEditor(String.class, stringTrimmerEditor);
}
~~~

- Model Class에 사용할 validation을 annotation으로 정의함

~~~java
public class Customer {

    private String firstName;

	@NotNull(message="is required")
	@Size(min=1, message="size have to be 1")
	private String lastName;
    ...
~~~
