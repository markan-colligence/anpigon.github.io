## React Native 릴리즈 빌드(안드로이드 편)

### 1. Icon을 준비하자.

안드로이드와 iOS에서 각각 다음과 같은 아이콘이 필요하다.
#### iOS Icons
* Set AppIcon in Images.xcassets.
* Add 9 different size icons:
    * 29pt
    * 29pt*2
    * 29pt*3
    * 40pt*2
    * 40pt*3
    * 57pt
    * 57pt*2
    * 60pt*2
    * 60pt*3.

#### Android Icons
* Put ic_launcher.png to folder [PrjDir]/android/app/src/main/res/mipmap-*.
    * 72*72 ic_launcher.png to mipmap-hdpi.
    * 48*48 ic_launcher.png to mipmap-mdpi.
    * 96*96 ic_launcher.png to mipmap-xhdpi.
    * 144*144 ic_launcher.png to mipmap-xxhdpi.
    * 192*192 ic_launcher.png to mipmap-xxxhdpi.

**1024이미지가 있다면 여기서 아이콘을 만들수 있다.**
[http://icon.angrymarmot.org/](http://icon.angrymarmot.org/)

### 2. signed APK를 만들자.

Google Play Store에 올릴려면 Signing Release APK를 만들어야한다.

- signing key를 만들자.
~~~
$ keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
~~~
생성된 my-release-key.keystore는 android/app 폴더로 이동시킨다.
keystore 파일이 커밋되서 version control system으로 올라가지 않도록 조심하자.
그리고 my-key-alias는 나중에 앱을 signing할 때 사용되니 잘 적어두자.

- gradle 변수를 설정하자.
    * my-release-key.keystore파일은 android/app 폴더안에 저장한다.
    * ~/.gradle/gradle.properties 또는 android/gradle.properties 파일을 열어서 다음과 같이 추가한다.

    > MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
    MYAPP_RELEASE_KEY_ALIAS=my-key-alias
    MYAPP_RELEASE_STORE_PASSWORD=*****
    MYAPP_RELEASE_KEY_PASSWORD=*****

#### 3. android/app/build.gradle 편집
~~~java
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
~~~

#### 4. release APK 파일 생성
~~~
$ cd android && ./gradlew assembleRelease
~~~

APK 파일은 android/app/build/outputs/apk/app-release.apk 여기 위치한다.


#### 5. Google Sign In 세팅
Android Google Sign In을 사용하고 있다면 [Google Developers Console](https://console.developers.google.com/apis) 로 이동하여
Production에서 사용할 Android 용 Client ID를 새로 만든다.

~~~
$ keytool -exportcert -alias MYAPP_RELEASE_KEY_ALIAS -keystore ~/projectfolder/android/app/my-release-key.keystore -list -v
~~~

명령어로 공개키를 추출한다.
SHA1 이라고 된 부분을 복사해서 가져오면 된다.

#### 6. Firebase Auth 세팅
Firebase Auth를 사용하고 있다면 [https://console.firebase.google.com/](https://console.firebase.google.com/)
프로젝트로 이동하여 세팅 - SHA1 인증서 지문에 google sign in할때와 동일하게 공개키를 추가한다.
