---
layout: post
category: Blockchain
title: "스텔라 루멘(Stellar Lumens) 토큰 만드는 방법"
tagline: 
tags : ["스텔라","루멘","가상화폐","코인","Stellar","lumens","coin","XLM"] 
published: true
---

대부분의 ICO는 이더리움<sub>Ethereum</sub>의 토큰으로 발행하고 있습니다. 이렇게 하는 이유는 이더리움은 생태계가 매우 잘되어 있고, 많은 사람들이 이더리움을 사용하고 있기 때문입니다. 

그러나 단점도 있습니다. 이더리움은 초당 약 15건의 트랜잭션만 처리할 수 있습니다. 이것은 이미 문제가 되고 있으며 일부 기존의 dApp들은 이더리움 플랫폼에서 벗어나고 있습니다.

하지만 우리에게는 스텔라루멘(XLM)<sub>Stellar Lumens</sub>이 있습니다. 스텔라에서 나만의 토큰을 만드는 방법을 알아봅니다. 

이 글에서는 스텔라에서 토큰을 발행하는 방법을 설명합니다.



스텔라루멘을 처음 시작하는 분들은 아래 글을 먼저 읽고 오시기 바랍니다.

- [스텔라루멘(STELLAR LUMENS) 시작하기](https://anpigon.github.io/steller-lumens-get-started/)



## 스텔라 계정 생성하기

신규 토큰을 발행하기 위해서는 두 개의 계정이 필요합니다. 토큰을 발행하는데 사용하는 계정과 토큰을 배포하는데 사용되는 계정입니다. 

- **발행계정(issuing account)**: 토큰 발행 및 파기에만 사용.
- **배포계정(base account)**: 다른 계정과 거래하는 데 사용되는 기본 계정. 발행계정에서 발행한 토큰을 소유합니다. 

두 개의 계정이 필요한 이유는, 만약 발행계정에서 토큰을 무한으로 발행한다면 토큰의 가치가 점점 떨어지게 됩니다. 그것을 방지하기 위해 발행계정을 중단할 수 있는 방법이 없습니다. 따라서 발행계정은 토큰을 생성하고 배포계정에게 발행합니다. 그런 다음 발행계정은 더 이상 토큰을 발행 할 수 없도록 영구적으로 잠궈버립니다. 이것으로 토큰이 더 이상 발행되지 않을 것임을 모두에게 보장합니다.

참고로 테스트넷 계정은 [*https://www.stellar.org/laboratory*](https://www.stellar.org/laboratory/#account-creator?network=test) 에서 생성가능합니다. 



## 두 계정의 트러스트(Trust) 변경하기

이더리움과 다르게 스텔라는 완벽한 스마트 컨트랙트를 제공하지는 않습니다. 이더리움 방식의 스마트 컨트랙트는 최대한의 유연성을 제공하지만 DAO와 같은 주요 해킹 사건과 비교적 최근 패리티(parity) 지갑 오류로  입증되는 것처럼 위험도가 높고 오류가 발생하기 쉽습니다.

스텔라에서의 스마트 컨트랙트라고 하면 일종의 트랜잭션으로 다양한 유형이 있습니다. 이러한 트랜잭션 유형 중에 하나는 "[Change Trust](https://www.stellar.org/developers/guides/concepts/list-of-operations.html#change-trust)"입니다.

토큰을 발행하기 위해서는 배포계정과 발행계정 간에 **Change Trust** 트랜잭션이 선행되어야 합니다. 배포계정이 배포하는 토큰이 발행계정에서 발행한 신뢰할 수 있는 토큰이라고 선언하는 과정입니다.

아래와 같이 트랜잭션을 빌드하여 실행합니다. 

```js
// 배포계정(base account)
var keyPair = StellarSdk.Keypair.fromSecret(secret);

server
	.loadAccount(keyPair.publicKey()) // 1. 배포계정의 Account 정보 로드
  .then(function (account) {
    // 2. 트랜잭션 빌드
		var transaction = new StellarSdk.TransactionBuilder(account)
			.addOperation(StellarSdk.Operation.changeTrust({
				asset: new StellarSdk.Asset('ANPIGON', 'GCCJZXGB5QRWNVUV2IYCEIFPLU2GB2FF7U4Y25MCCWYSVQYYE4O3ZIJT')
			}))
      .build();
  
    // 3. 트랜잭션 서명
    transaction.sign(keyPair);
    
    // 4. 트랜잭션 전송
    return server.submitTransaction(transaction);
  })
  .then(function (transactionResult) {
    console.log(transactionResult);
  })
  .catch(function(err) {
    console.log(err);
  });
```

`changeTrust` 오퍼레이션의 `asset`에는 `new Asset('<asset code>', '<issuer>')`와 같이 자산코드<sub>asset code</sub>와 발행자<sub>Issuer</sub>가 포함됩니다. 자산코드는 관례에 따라 [ISO 4217 code](https://en.wikipedia.org/wiki/ISO_4217)로 표현합니다. 또는 자신만의 자산코드를 만들 수도 있습니다. 이 글에서는 자산코드에 "ANPIGON"을 입력하였습니다. 



## 토큰 발행하기

토큰 생성은 발행계정에서 배포계정으로 payment 트랜잭션을 보내면 됩니다. 

~~~js
// 발행계정(issuing account)
var issuer = StellarSdk.Keypair.fromSecret(secret);

// 토큰발행
server
  .loadAccount(issuer.publicKey()) // 1. 발행계정의 Account 정보 로드 
  .then(function(account) {
    // 2. 트랜잭션 빌드
    var transaction = new StellarSdk.TransactionBuilder(account)
      .addOperation(StellarSdk.Operation.payment({
        destination: keyPair.publicKey(), // 배포계정의 주소
        asset: new StellarSdk.Asset(assetCode, issuer.publicKey()),
        amount: '10000',
      }))
      .addMemo(StellarSdk.Memo.text(assetCode + ' 토큰 발행'))
      .build();
  
    // 3. 트랜잭션 서명
    transaction.sign(issuer);
    
    // 4. 트랜잭션 전송
    return server.submitTransaction(transaction);
  })
  .then(function (transactionResult) {
    console.log(transactionResult);
  })
  .catch(function (err) {
    console.log(err);
  });
~~~

자, 이제 테스트넷에 우리가 만든 토큰을 10,000개를 발행했습니다.



## 토큰 발행 계정 잠그기

이제 우리에게는 10,000개의 토큰이 존재하기 때문에 발행계정을 영원히 잠글 시간입니다. 이것은 스텔라에서 제공하는 멀티시그<sub>multi-sig</sub> 옵션을 사용하여 수행합니다. **Set Options** 트랜잭션을 사용할 것입니다.

 Set Options을 사용하여 발행계정의 가중치<sub>weight</sub>를 "0"으로 설정하고 트랜잭션을 실행하기 위한 임계값<sub>threshold</sub>를 "1"로 설정합니다. 이렇게 하면 이 발행계정에서는 더 이상 어떤 트랜잭션도 실행할 수 없습니다.

아래와 같이 Set Options 트랜잭션를 서명하고 전송하면 완료됩니다!

~~~js
// 발행계정(issuing account)
var issuer = StellarSdk.Keypair.fromSecret(secret);

// 토큰발행
server
  .loadAccount(issuer.publicKey()) // 1. 발행계정의 Account 정보 로드 
  .then(function(account) {
    // 2. 트랜잭션 빌드
    var transaction = new StellarSdk.TransactionBuilder(account)
      .addOperation(StellarSdk.Operation.setOptions({
        masterWeight: 0, // 발행계정 가중치
        lowThreshold: 1,
        medThreshold: 1,
        highThreshold: 1
      }))
  
    // 3. 트랜잭션 서명
    transaction.sign(issuer);
    
    // 4. 트랜잭션 전송
    return server.submitTransaction(transaction);
  })
  .then(function (transactionResult) {
    console.log(transactionResult);
  })
  .catch(function (err) {
    console.log(err);
  });
~~~



테스트넷에 토큰이 있는지 보려면 아래와 같이 배포계정 링크로 조회할 수 있습니다.

[https://horizon-testnet.stellar.org/accounts/GAHST5MT3VALXJGCEVETQVYMCO2CODTW3DXVXIDQ5SISEZJIPBI62ITI](https://horizon-testnet.stellar.org/accounts/GAHST5MT3VALXJGCEVETQVYMCO2CODTW3DXVXIDQ5SISEZJIPBI62ITI)

보시다시피 10,000개의 ANPIGON 토큰이 있습니다.

~~~
"balances": [
    {
      "balance": "10000.0000000",
      "limit": "10000.0000000",
      "asset_type": "credit_alphanum12",
      "asset_code": "ANPIGON",
      "asset_issuer": "GCCJZXGB5QRWNVUV2IYCEIFPLU2GB2FF7U4Y25MCCWYSVQYYE4O3ZIJT"
    },
    {
      "balance": "9999.9999900",
      "asset_type": "native"
    }
  ]
~~~



자! 방금 스텔라 테스트넷에 우리가 만든 토큰을 발행했습니다. 

이상 마칩니다.
