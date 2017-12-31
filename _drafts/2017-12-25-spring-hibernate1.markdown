---
layout: post
title:  "Spring Hibernate (1)"
date:   2017-12-25 22:40:10 +0900
tag: spring
---

hibernate를 사용해보자.

- [www.hibernate.org](http://www.hibernate.org) 에서 Hibernate ORM  을 다운받는다.
- 압축을 풀고 required에 있는 라이브러리를 모두 복사
- 신규 프로젝트의 lib 폴더를 생성하고 그 안에 통째로 붙여넣기
- [www.mysql.com/downloads](http://www.mysql.com/downloads) 에서   connect/J를 다운받고 역시 jar 파일을 복사하여 lib 폴더에 복사(하나밖에 없다)
- Eclipse - Properties - Java Build Path - Library - ADd JARs...
로 이동하여 lib안의 모든 라이브러리를 선택 후 OK 버튼
- Referenced Libraries에 신규 추가한 라이브러리가 생긴다.
    ![Referenced Library](/assets/img/201712/2017-12-25-22.47.36.png)
