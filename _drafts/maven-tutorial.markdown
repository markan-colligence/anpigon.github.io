---
layout: post
title:  "Maven Tutorial"
date:   2018-01-13 21:57:16 +0900
tag: spring
---

maven pom.xml

Group ID : Name of company, group, or organization

Artifact ID : Name for this project

Version :

해당 Project Page를 가던가

http://search.maven.org/ 먼저 방문

http://www.mvnrepository.com/ 그다음 방문

GAV 를 찾으면 된다.

Maven Archetypes == starter files (templates)

- maven-archetype-quickstart
- maven-archetype-webapp

Eclipse - New Maven project


Eclipse의 m2eclipse plugin을 사용

java system library 버전 수정
pom.xml 수정 후 update Maven
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.target>1.8</maven.compiler.target>
    <maven.compiler.source>1.8</maven.compiler.source>
 </properties>


- maven-archetype-webapp
을 사용해 프로젝트를 생성하는 경우
javax.servlet-api dependency가 없어서 에러가 난다.
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>3.1.0</version>
</dependency>

위 사이트에서 dependency 찾아서 설정

mac : ~/.m2/repository

atlassian-mail dependency 를 프로젝트에 넣어보자.
이 프로젝트는 maven central repo에 없다.
maven에서 pom.xml을 수정하여 Atlassian repository에 접속할 수 있도록 하자.

<repositories>
    <repository>
        <id>atlassian</id>
        <name>the atlassian repo</name>			
        <url>https://maven.atlassian.com/content/repositories/atlassian-public/</url>
    </repository>
</repositories>


SpringSecurity version과 SpringFramework버전이 다르다.


Private Maven Repository
Archiva
Artifactory
Nexus
이런걸 받아서 하면 된다.

Cloud Hosted Solutions
www.packagecloud.io
www.mymavenrepo.com


xml config to java config (No XML!!!)
web.xml
spring-mvc-demo-servlet.xml
=> spring @Configuration
Spring Dispatcher
Servlet Initializer


@EnableWebMvc <--> <mvc:annotation-driven />


Congrats for finishing the course.

A frequently asked question is "Where to go from here?" A lot of developers want to further their knowledge by learning advanced Spring topics and practicing projects.

I've compiled a list of resources that you can use to get more information on Spring advanced features. Enjoy!



Spring MVC and AngularJS CRUD

- http://websystique.com/springmvc/spring-4-mvc-angularjs-crud-application-using-ngresource/

Spring MVC and File Upload
- https://spring.io/guides/gs/uploading-files/

Spring RESTful web services

- https://spring.io/guides/gs/rest-service/

Spring Security for Web Apps

- https://spring.io/guides/gs/securing-web/

Spring and Facebook

- https://spring.io/guides/gs/accessing-facebook/

Spring and Twitter

- https://spring.io/guides/gs/accessing-twitter/

---

Creating a Blog System with Spring MVC, Thymeleaf, JPA and MySQL

http://www.nakov.com/blog/2016/08/05/creating-a-blog-system-with-spring-mvc-thymeleaf-jpa-and-mysql/

The post includes a tutorial that covers creatng the guts of a blogging system, leaving the implementation of several parts as an exercise for the reader. Thanks for Marc D. for suggesting this link. :-)


Project Sagan
This is a real-world app that powers the Spring.io website. It is in production and used by thousands of users each day.

You can get information about the project and get source code here:
- https://github.com/spring-io/sagan/wiki

---

Here is a realworld HealthCare platform
- https://healthservices.atlassian.net/wiki/display/HSPC/Java+Client+Tutorial%3A+Spring+MVC

---

Spring Petstore Example

This is an example project for the classic PetClinic / PetStore example.
https://github.com/spring-projects/spring-petclinic

---


Here's a free guide that walks you through the steps:

The Ultimate Guide to Hosting a Java Web App with Amazon Web Services (AWS)
http://coderscampus.com/ultimate-guide-hosting-java-web-app-amazon-web-services-aws/
