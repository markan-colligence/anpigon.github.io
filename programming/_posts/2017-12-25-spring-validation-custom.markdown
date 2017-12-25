---
layout: post
title:  "Spring Validation (2)"
date:   2017-12-25 06:43:10 +0900
tag: spring
---

Custom Validation을 사용해보자.

### 1. validation에 사용할 annonation을 만들자.
- 우선 validation 패키지를 현재 패키지 아래 새로 하나 생성
![validation package](/assets/img/201712/2017-12-25.17.41.58.png)
    생성된 package에서 new - annotation 선택 후    

~~~java
@Constraint(validatedBy = CourseCodeConstraintValidator.class) // Helper class that contains business rules validation logic
@Target( { ElementType.METHOD, ElementType.FIELD }) // can apply our annotation to a method or field
@Retention(RetentionPolicy.RUNTIME) // retain this annotation in the java class file, process it at runtime
public @interface CourseCode {

	// define default course code
	public String value() default "LUV";

	// define default error message
	public String message() default "must start with LUV";

	// define default groups
	public Class<?>[] groups() default {}; // can group related constraints

	// define default payloads
	public Class<? extends Payload>[] payload() default {}; // provide custom details about validation failure (severity level, error code etc)
}
~~~

- value와 message는 annotation의 parameter로 사용된다.    
~~~java
@CourseCode(value="ABC", message="must start with ABC")
private String courseCode;
~~~

### 2. validation을 수행할 class를 만들자
- 역시 같은 패키지에 Custom ConstraintValidator class를 생성
~~~java
public class CourseCodeConstraintValidator implements ConstraintValidator<CourseCode, String> {
    // value를 받을 변수를 정의하고,
    // Override Method 를 구현
}
~~~

### 3. Override Method를 구현한다.
~~~java
private String coursePrefix;

@Override
public void initialize(CourseCode theCourseCode) {
    coursePrefix = theCourseCode.value();
}

@Override
public boolean isValid(String theCode, ConstraintValidatorContext theConstraintValidatorContext) {

    boolean result = false;

    if (theCode != null) {
        result = theCode.startsWith(coursePrefix);
    }		

    return result;
}
~~~

- isValid에서 Validation Logic을 구현

### 4. 생성된 annotation을 잘(?) 사용한다.
