## Reference Framework for Geo location, Push notification, Purchasing


### Geo location
> React native의 Geolocation API는 단순히 웹 사양의 확장입니다.
* [튜토리얼](https://hackernoon.com/react-native-basics-geolocation-adf3c0d10112)
* [웹 API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation)
* [RN API](https://facebook.github.io/react-native/docs/geolocation.html)


### Push notification
> 서버는 FCM이나 OneSignal을 많이 씁니다. 
클라이언트는 react-native-FCM, react-native-onesignal, react-native-push-notification중 하나를 사용합니다.
현재 GCM은 구글에서 지원을 중단했으며 FCM을 권장합니다. 또한 GCM의 모든 기능을 FCM에서 지원합니다. 
FCM도 GCM처럼 ANDROID, IOS모두 지원할 수 있습니다.
OneSignal도 두 플랫폼 모두 지원합니다.
* [서버-클라이언트: FCM 튜토리얼1](https://codeburst.io/react-native-push-notifications-with-firebase-1f23c4f0af65)
* [서버-클라이언트: FCM 튜토리얼2](https://blog.botreetechnologies.com/how-to-send-push-notification-to-the-android-phones-using-react-native-and-fcm-b28e1746da7b)
* [클라이언트: React-native-FCM](https://github.com/evollu/react-native-fcm)
* [서버: OneSignal](https://onesignal.com/)
* [클라이언트: react-native-onesignal](https://www.npmjs.com/package/react-native-onesignal)
* [클라이언트: react-native-push-notification](https://www.npmjs.com/package/react-native-push-notification)
* [클라이언트: react-native-push-notification 예제](https://product.farewell.io/visible-react-native-push-notifications-that-work-on-both-ios-and-android-5e90badb4a0f)


### Purchasing
> 여러 글에 의하면 안드로이드는 react-native-billing, IOS는 react-native-in-app-utils 모듈을 이용
불행히도 둘을 동시에 지원하는 모듈은 없으며, 따로 구현해야 합니다. 
* [참고한 글 1](https://www.reddit.com/r/reactnative/comments/66z6mq/tutorials_about_in_app_purchases_with_reactnative/)
* [참고한 글 2](https://react-native.canny.io/feature-requests/p/support-for-in-app-purchases)
* [ANDROID: react-native-billing](https://github.com/idehub/react-native-billing)
* [IOS: react-native-in-app-utils](https://github.com/chirag04/react-native-in-app-utils)
* [인앱결제 테스트](https://developer.android.com/google/play/billing/billing_testing.html)




 