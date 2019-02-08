---
layout: post
categories: Blockchain
title: "이더리움 멀티시그 지갑 컨트랙트에서 송금하기"
---

이번에는 이더리움 멀티시그 지갑 컨트랙트를 이용하여 송금하는 것을 알아봅니다.

이더리움 멀티시그 지갑 컴트랙트 배포 방법은 이전글을 참고바랍니다.

- [이더리움 멀티시그 지갑 컨트랙트 배포하기](https://markan82.github.io/ethereum-multisig-wallet-contract-deploy/)



## 컨트랙트에 이더 송금하기

멀티시그 지갑 컨트랙트에서 이더를 송금하기 위해서는 우선 컨트랙트에 잔액이 있어야 합니다.
그래서 컨트랙트 주소로 0.1 ether를 송금하여 컨트랙트가 잔액을 가지도록 합니다.

```js
// 이전에 배포한 컨트랙트 주소
var contractAddress = '0x57FC45cc929f84eC95cd6C6903bBcA8d1164d0B3'; 

// 가스비를 지출할 계정 주소
var fromAddress = '0xf6d0B5f612dEecB00345D...'; 

// 1. nonce 값 조회
var nonce = web3.eth.getTransactionCount(fromAddress); 

// 2. 트랙잭션 데이터 생성 
var tx = new ethTx({ 
  nonce: web3.toHex(nonce), 
  to: contractAddress, 
  value: web3.toHex(web3.toWei(0.1, 'ether').toNumber()),					 
  gasPrice: web3.toHex(1), // 가스 가격(wei 단위) 
  gasLimit: web3.toHex(3000000), // 가스 최대 사용량 
  chainId: 3, //네트워크 ID(3=Ropsten Tesetnet) 
});

// 3. 트랜잭션 서명
tx.sign(privateKey);

// 4. 트랜잭션 전송하기
web3.eth.sendRawTransaction('0x' + tx.serialize().toString('hex'), function(err, txId) {
  if (!err) {
 		console.log('txId: ', txId); // 트랜잭션ID값
  }
});
```



## 트랜잭션과 잔액 확인하기

컨트랙트 주소로 송금하는 트랜잭션이 성공하였으면, 컨트랙트에 잔액이 추가되었는지 확인합니다.

트래잭션과 잔액은 아래 사이트에서 확인가능합니다.

[https://ropsten.etherscan.io/](https://ropsten.etherscan.io/address/0x57FC45cc929f84eC95cd6C6903bBcA8d1164d0B3)



아래 화면은 아직 채굴전이라서 트랜잭션이 아직 pending 상태이고, 컨트랙트 잔액이 0 Ether 입니다.

![](/images/multisig_contract_2_1.png)

채굴이 되어 트랜잭션이 블록에 포함되면, 트랜잭션 상태가 바뀌고 컨트랙트가 0.1 Ether를 가지고 있는 것을 확인할 수 있습니다.

![](/images/multisig_contract_2_2.png)



## 컨트랙트 멀티시그 함수 호출하기

이제 컨트랙트에 들어있는 0.1 ether를 멀티시그를 이용하여 송금해보겠습니다. 아래 코드에 보이는  `abiDefinition`에는 컨트랙트 소스를 컴파일해서 나온 abi 데이터를 사용합니다.

```js
var abiDefinition = { /* 컨트랙트 abi 데이터 */ };
var contract = web3.eth.contract(abiDefinition).at(contractAddress);

// 1. 컨트랙트 실행하기 위한 데이터 생성 
var destination = '<ehter를 수신받는 address>';
var value = web3.toWei(new BigNumber(0.01), 'ether');
var data = '0x';
var sigs = createSigs(signers, contract.address, nonce, destination, value, '0x')
var txInputData = contract.execute.getData(sigs.sigV, sigs.sigR, sigs.sigS, destination, web3.toHex(value), ata);

// 2. 트랙잭션 데이터 생성 
var tx = new ethTx({ 
  nonce: web3.toHex(nonce), 
  to: contract.address, 
  gasPrice: web3.toHex(1), 
  gasLimit: web3.toHex(3000000),
  data: txInputData, 
  chainId: 3, //네트워크 ID(3=Ropsten Tesetnet) 
}); 

// 3. 트랜잭션 서명하기 
tx.sign(privateKey); 

// 4. 트랜잭션 전송하기 
web3.eth.sendRawTransaction('0x' + tx.serialize().toString('hex'), function(err, txId) { 
  if (!err) { 		
    console.log('txId: ', txId); // 트랜잭션ID값 
  } 
});
```

`createSigs` 함수 구현방법은 [simplemultisig.js](https://github.com/christianlundkvist/simple-multisig/blob/master/test/simplemultisig.js) 소스를 참고해주세요.

트랜잭션 요청이 끝나면 이더 스캔에서 확인가능합니다.

채굴이 완료되어 컨트랙트에  있던 0.1 Ether 가 `destination`으로 전송되었는지 확인합니다.



이상 마칩니다.



