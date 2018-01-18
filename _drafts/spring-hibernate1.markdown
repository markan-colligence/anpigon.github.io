---
layout: post
title:  "Spring Hibernate (1)"
date:   2017-12-25 22:40:10 +0900
tag: spring
---

hibernate를 사용해보자.  
실습용으로 eclipse의 plain java project를 생성한다.  
그리고 루트에서 lib 폴더를 생성하자.

1. Hibernate Configuration File, Library Copy
    - [www.hibernate.org](http://www.hibernate.org) 에서 Hibernate ORM  을 다운받는다.
    - 압축을 풀고 required에 있는 라이브러리를 모두 복사
    - 신규 프로젝트의 lib 폴더를 생성하고 그 안에 통째로 붙여넣기
    - [www.mysql.com/downloads](http://www.mysql.com/downloads) 에서   connect/J를 다운받고 역시 jar 파일을 복사하여 lib 폴더에 복사(하나밖에 없다)
    - Eclipse - Properties - Java Build Path - Library - ADd JARs...
    로 이동하여 lib안의 모든 라이브러리를 선택 후 OK 버튼
    - Referenced Libraries에 신규 추가한 라이브러리가 생긴다.
        ![Referenced Library](/assets/img/201712/2017-12-25-22.47.36.png)
    - src 폴더에 hibernate.cfg.xml파일을 만들고 다음 config를 붙여넣기 한다.

    <pre>
    &lt;!DOCTYPE hibernate-configuration PUBLIC
            "-//Hibernate/Hibernate Configuration DTD 3.0//EN"
            "http://www.hibernate.org/dtd/hibernate-configuration-3.0.dtd"&gt;
    &lt;hibernate-configuration&gt;
        &lt;session-factory&gt;
            &lt;!-- JDBC Database connection settings --&gt;
            &lt;property name="connection.driver_class"&gt;com.mysql.jdbc.Driver&lt;/property&gt;
            &lt;property name="connection.url"&gt;
            jdbc:mysql://localhost:3306/DB_NAME?useSSL=false
            &lt;/property&gt;
            &lt;property name="connection.username"&gt;username&lt;/property&gt;
            &lt;property name="connection.password"&gt;password&lt;/property&gt;

            &lt;!-- JDBC connection pool settings ... using built-in test pool --&gt;
            &lt;property name="connection.pool_size"&gt;1&lt;/property&gt;

            &lt;!-- Select our SQL dialect --&gt;
            &lt;property name="dialect"&gt;org.hibernate.dialect.MySQLDialect&lt;/property&gt;

            &lt;!-- Echo the SQL to stdout --&gt;
            &lt;property name="show_sql"&gt;true&lt;/property&gt;

    		&lt;!-- Set the current session context --&gt;
    		&lt;property name="current_session_context_class"&gt;thread&lt;/property&gt;

        &lt;/session-factory&gt;
    &lt;/hibernate-configuration&gt;
    </pre>

실제 프로젝트에서는 Maven을 사용하겠지만 지금은 하이버네이트에 집중하자.

2. DB에서 Table을 생성하고, 해당하는 매핑 Class 생성 (현재 Annotation사용. legacy는 xml 사용)
~~~ sql
CREATE TABLE `employee` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
~~~
테이블과 매핑되는 클래스를 정의한다.
~~~ java
@Entity
@Table(name="employee")
public class Employee {

	@Id
	@Column(name="id")
	private int id;

	@Column(name="first_name")
	private String firstName;

	@Column(name="last_name")
	private String lastName;

	@Column(name="email")
	private String email;

    public Employee(String firstName, String lastName, String email)
	{
		super();
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
	}
~~~
   이후 getter, setter 등 정의

3. Query를 실행하는 Java 코드 작성

~~~ java
// create session factory
SessionFactory factory = new Configuration()
                        .configure("hibernate.cfg.xml")
                        .addAnnotatedClass(Employee.class)
                        .buildSessionFactory();
// create session
Session session = factory.getCurrentSession();

try {
    // use the session object to save Java Object			

    // create a employee object
    System.out.println("Creating new employee object...");
    Employee tempEmployee = new Employee("stellar", "catchall", "stellarcatchall@xxx.com");

    // start a transaction
    session.beginTransaction();

    // save the Employee object
    System.out.println("Saveing the Employee ...");
    session.save(tempEmployee);			

    // commit transaction
    session.getTransaction().commit();

    System.out.println("Done!");
}
finally {
    factory.close();
}

~~~
