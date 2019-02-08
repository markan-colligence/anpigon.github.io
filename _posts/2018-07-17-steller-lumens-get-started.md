---
layout: post
title: "스텔라 루멘(Stellar lumens) 시작하기"
category: Blockchain
tagline: 
tags : ["스텔라 루멘","스텔라","루멘","가상화폐","코인","Stellar lumens","Stellar","lumen","coin"] 
published: true
---

스텔라<sub>Stellar</sub>는 [리플<sub>Ripple</sub>](https://ripple.com/xrp)에서 하드포크하여 개발되었습니다. 현재 비영리 기업인 스텔라 재단에서 운영하고 있습니다. 거래코드는 XLM이고 총 발행량은 1,000억 개입니다.

리플과 스텔라가 다른 점은 리플은 수수료를 소각하지만, 스텔라는 계속 잔류하여 1% 수준의 인플레이션을 유발합니다. 리플이 기업간의 자금송금을 목적으로 하고 있다면 스텔라루멘은 개인간의 거래를 목적으로 만들어진 화폐입니다. 합의 매커니즘은 [SCP(Stellar Consensus Protocol)](https://www.stellar.org/papers/stellar-consensus-protocol.pdf)를 사용합니다.



## 스텔라 SDK

스텔라<sub>stellar</sub> SDK는 아래와 같이 2종류가 존재합니다.

- js-stellar-base: [https://github.com/stellar/js-stellar-base](https://github.com/stellar/js-stellar-base)
- js-stellar-sdk: [https://github.com/stellar/js-stellar-sdk](https://github.com/stellar/js-stellar-sdk)

### js-stellar-base

*js-stellar-base library*는 lowest-level 라이브러리입니다. 이 라이브러리를 사용하면 stellar-core에서 사용되는 XDR 형태의 데이터를 읽고 쓰고 해싱하고 서명할 수 있습니다. JavaScript로 구현되어 있어 Node.js 또는 웹브라우저에서 사용할 수 있습니다.

### js-stellar-sdk

*js-stellar-sdk*는 [Stellar Horizon 서버](https://github.com/stellar/go/tree/master/services/horizon)와 통신하는 Javascript라이브러리입니다. *js-stellar-sdk*도 내부적으로는 *js-stellar-base* 라이브러리를 사용하고 있습니다.



## 스텔라 SDK 설치 및 사용

이 문서에서는 js-stellar-sdk 라이브러리를 사용합니다. 아래와 같이 설치하여 사용할 수 있습니다.

**설치하기**

```bash
# stellar-sdk Install
npm install --save stellar-sdk
# or
yarn add stellar-sdk
```

**사용하기**

```js
// stellar-sdk Usage
var StellarSdk = require('stellar-sdk'); 
```



## 계정(Account) 생성

스텔라 네트워크에서 거래를 하기 위해서는 계정을 생성하여야 합니다. 계정<sub>account</sub>은 **public key**와 **secret seed** 로 구성됩니다. 아래와 같이 `public Key`와 `secret`를 생성 할 수 있습니다.

```js
var pair = StellarSdk.Keypair.random();  

pair.secret(); // SAV76USXIJOBMEQXPANUOQM6F5LIOTLPDIDVRJBFFE2MDJXG24TAPUU7 
pair.publicKey(); // GCFXHS4GXL6BVUCXBWXGTITROWLVYXQKQLF4YH5O5JT3YZXCYPAFBJZB 
```

생성된 *secret seed* 와 *public key*를 이용해서 거래를 하기 위해서는 스텔라 네트워크에 계정 생성 요청을 해야합니다. 스텔라에서는 무분별한 불필요한 계정 생성을 막기 위해서 계정의 최소 잔액을 1루멘<sub>lumen</sub>을 정의하고 있습니다. 계정을 생성하기 위해서는 루멘을 가지고 있는 계정이 필요합니다. 다만 테스트넷에서는 계정을 생성 할 수 있는 Friendbot API를 제공하고 있습니다.



### Friendbot API로 계정(Account) 생성

테스트넷에서는 friendbot API를 이용하여 아래와 같이 계정 생성 요청을 할 수 있습니다.

```js
var StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

var keypair = StellarSdk.Keypair.random();
console.log('Secret Key:', keypair.secret());
console.log('Public Key:', keypair.publicKey()); //address

server.friendbot(keypair.publicKey())
  .call()
  .then(function(resp) {
    console.log(resp);
  })
  .catch(function(err) {
    console.log(err);
  });
```

*stellar-sdk* 를 사용하지 않는다면 아래와 같은 방법으로도 가능합니다.

```js
var request = require('request');
request.get({
  url: 'https://friendbot.stellar.org',
  qs: { addr: keypair.publicKey() },
  json: true
}, function(error, response, body) {
  if (error || response.statusCode !== 200) {
    console.error('ERROR!', error || body);
  } else {
    console.log('SUCCESS! You have a new account :)\n', body);
  }
});
```

이제 마지막으로 계정의 잔액을 확인해보도록 하겠습니다. 스텔라는 여러 통화 유형의 거래를 허용하기 때문에 계정에는 통화 유형별로 잔액을 가지고 있습니다. 

아래와 같이 계정 정보를 조회할 수 있습니다.

```js
server.loadAccount(pair.publicKey()).then(function(account) {
  console.log('Balances for account: ' + pair.publicKey());
  account.balances.forEach(function(balance) {
    console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
  }); 
});
```



### createAccount 오퍼레이션으로 계성 생성

`createAccount` 오퍼레이션<sub>operation</sub>를 사용하여 계정 생성하는 방법은 아래와 같습니다. 트랜잭션을 서명하는 계정에는 계정 생성에 필요한 1루멘와 수수료를 포함한 잔액을 가지고 있어야합니다.

```js
var secretKey = '루멘을 가지고 있는 계정의 secret key';
var keypair = StellarSdk.Keypair.fromSecret(secretKey);
var newKeypair = StellarSdk.Keypair.random(); // 신규 생성할 계정
server
    .loadAccount(keypair.publicKey())
    .then(function (account) {
      var transaction = new StellarSdk.TransactionBuilder(account)
        .addOperation(StellarSdk.Operation.createAccount({
          destination: newKeypair.publicKey(),
          startingBalance: "1" // 최소 1 XLM 필요
        })).build();
      transaction.sign(keypair); // 트랜잭션 서명
      return server.submitTransaction(transaction); // 트랜잭션 전송
  })
  .then(function (transactionResult) {
    console.log('tx hash:', transactionResult.hash);
  });
```



여러분이 생성한 계정과 트랜잭션 정보는 stellar expert expolorer에서 조회 가능합니다.
- [https://stellar.expert/explorer/testnet](https://stellar.expert/explorer/testnet)



이상 마칩니다.
