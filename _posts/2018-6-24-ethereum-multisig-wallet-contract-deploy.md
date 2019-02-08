---
layout: post
categories: Blockchain
title: "이더리움 멀티시그 지갑 컨트랙트 배포하기"
---

이번에는 이더리움 멀티시그 지갑 컨트랙트를 배포하는 것을 알아봅니다. 

해당 내용은 아래 블로그를 참고하여 구현하였습니다.

[참고: Exploring Simpler Ethereum Multisig Contracts - Christian Lundkvist](https://medium.com/@ChrisLundkvist/exploring-simpler-ethereum-multisig-contracts-b71020c19037)



## web3 모듈 설치

현재 web3 버전은 1.0.0-beta.34 까지 나왔지만, 여기서는 web3-0.20.6을 설치하여 사용합니다. 필요한 모듈들을 아래와 같이 설치합니다.

```bash
npm install web3@0.20.6 solc ethereumjs-tx ethereumjs-util bitcore-lib
```

web 모듈은 아래와 같이 사용합니다. 예제에서는 HttpProvider 를 지정해주었으나, 이더리움 노드와 web3가 같은 서버에서 동작한다면 IpcProvider 하는것이 성능면에서 더 효율적입니다.

```javascript
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8551'));
```



## 멀티시그 컨트랙트 작성

멀티시트 컨트랙트 소스는 아래 github에서 가져왔습니다. 컨트랙트 소스 내용에 대한 설명은 생략합니다.

[https://github.com/christianlundkvist/simple-multisig](https://github.com/christianlundkvist/simple-multisig)

```javascript
pragma solidity ^0.4.22;

contract SimpleMultiSig {

  uint public nonce;                 // (only) mutable state
  uint public threshold;             // immutable state
  mapping (address => bool) isOwner; // immutable state
  address[] public ownersArr;        // immutable state

  // Note that owners_ must be strictly increasing, in order to prevent duplicates
  constructor(uint threshold_, address[] owners_) public {
    require(owners_.length <= 10 && threshold_ <= owners_.length && threshold_ >= 0);

    address lastAdd = address(0); 
    for (uint i = 0; i < owners_.length; i++) {
      require(owners_[i] > lastAdd);
      isOwner[owners_[i]] = true;
      lastAdd = owners_[i];
    }
    ownersArr = owners_;
    threshold = threshold_;
  }

  // Note that address recovered from signatures must be strictly increasing, in order to prevent duplicates
  function execute(uint8[] sigV, bytes32[] sigR, bytes32[] sigS, address destination, uint value, bytes data) public {
    require(sigR.length == threshold);
    require(sigR.length == sigS.length && sigR.length == sigV.length);

    // Follows ERC191 signature scheme: https://github.com/ethereum/EIPs/issues/191
    bytes32 txHash = keccak256(byte(0x19), byte(0), this, destination, value, data, nonce);

    address lastAdd = address(0); // cannot have address(0) as an owner
    for (uint i = 0; i < threshold; i++) {
      address recovered = ecrecover(txHash, sigV[i], sigR[i], sigS[i]);
      require(recovered > lastAdd && isOwner[recovered]);
      lastAdd = recovered;
    }

    // If we make it here all signatures are accounted for.
    // The address.call() syntax is no longer recommended, see:
    // https://github.com/ethereum/solidity/issues/2884
    nonce = nonce + 1;
    bool success = false;
    assembly { success := call(gas, destination, value, add(data, 0x20), mload(data), 0, 0) }
    require(success);
  }

  function () payable public {}
}
```



## 컨트랙트 소스 컴파일

solidity 소스를 컴파일 하는 방법은 다양하지만, 여기서는 node 에서 solc 모듈을 사용하여 컴파일하였습니다.

```javascript
var fs = require('fs');
var path = require('path');
var solc = require('solc');

// 1. 컨트랙트 소스 파일 읽기
var contractSource = fs.readFileSync(path.resolve(__dirname, 'SimpleMultiSig.sol'), 'utf8');

// 2. solc를 사용하여 컴파일
var compiledCode = solc.compile(contractSource.toString(), 1).contracts[':SimpleMultiSig'];

// 3. 컴파일 결과물에서 바이트코드와 abi 정보 조회
var bytecode = compiledCode.bytecode;
var abiDefinition = JSON.parse(compiledCode.interface);
```

매번 소스코드를 읽어와서 컴파일하면 시간이 오래걸리므로, 컴파일된 코드를 파일로 저장하여 사용하는 것을 권장합니다.



## 이더리움 블록체인에 컨트랙트 배포

컨트랙트를 배포하기 위한 과정을 차례대로 알아봅니다.



### 1. 개인키 생성

우선 서명하기 위한 개인키가 필요합니다. 개인키 생성은 Bitcore 모듈을 이용하였습니다.

```javascript
var Bitcore = require('bitcore-lib');
var ethUtil = require('ethereumjs-util');

// 개인키 생성
var privateKey = new Bitcore.PrivateKey().toBuffer(); 
// 이미 테스트 중인 개인키가 있다면 아래와 같이 사용가능
// var privateKey = new Buffer("f6fd01....fb41", "hex"); 
```

### 2. 트랜잭션 생성

트랜잭션은 nonce, to, value, gasPrice, gasLimit, data, v, r, s 로 구성됩니다. gasPrice 는 `web3.eth.gasPrice` 를 이용하여 이더리움 블록체인의 평균 gas 가격 조회가 가능합니다. 

또는 아래 이더리움 가스스테이션 서비스를 이용할 수도 있습니다.

https://ethgasstation.info/

```javascript
// 1. 개인키에 해당하는 이더리움 주소
var fromAddress = '0x' + ethUtil.privateToAddress(privkey).toString('hex');  

// 2. 잔액 조회
var balance = web3.eth.getBalance(fromAddress);
console.log('balance: ' + web3.fromWei(balance, 'ether').toString(10) + ' ETH');
// 컨트랙트를 배포하기 위해서는 gas비용이 필요하기 때문에 ether가 있어야한다.

// 3. 컨트랙트 생성자(constructor)에 필요한 데이터
var threshold = 2; // 필요한 서명 갯수
var owners = ["<address1>", "<address2>", "<address3>"]; // 서명자 주소들

// 4. 컨트랙트를 배포하기 위한 데이터 생성
var contract = web3.eth.contract(abiDefinition); //컨트랙트 인스턴스 생성
var txInputData = '0x' + contract.new.getData(threshold, owners, {data: bytecode});

// 5. 트랜잭션 Nonce값 조회
var nonce = web3.eth.getTransactionCount(fromAddress); // 발생한 트랜잭션이 없다면 0이 조회됨

// 6. 트랙잭션 데이터 생성
const rawTx = {
  nonce: web3.toHex(nonce),
  //to: '0x0',
  //value: '0x0',					
  gasPrice: web3.toHex(1), 			// 가스 가격(wei 단위)
  gasLimit: web3.toHex(3000000), // 가스 최대 사용량
  data: txInputData, // 컨트랙트 배포 데이터                   
  chainId: 3, //네트워크 ID(3=Ropsten Tesetnet)
}
var tx = new ethTx(rawTx);

// 7. 트랜잭션 서명하기
tx.sign(privateKey);
```

### 3. 트랜잭션 전송

컨트랙트를 배포를 위한 트랜잭션을 아래와 같이 이더리움 블록체인에 전송합니다.

```javascript
// 1. hex serialize binary 생성
var serializedTx = tx.serialize(); 

// 2. 트랜잭션 전송하기
web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, txId) {
  if (!err) {
    console.log('txId: ', txId); // 트랜잭션ID값
  }
});
```

### 4. 컨트랙트 주소 조회

컨트랙트 주소는 블록이 채굴된 후에 조회가능합니다. 트랜잭션이 블록에 포함되었다면, 아래와 같이 Transaction Receipt에서 조회 가능합니다.

```javascript
// 컨트랙트 주소 조회하기
web3.eth.getTransactionReceipt(txId, function(err, receipt){
  if (err) {
    console.log('Contract Address: ', receipt.contractAddress);
  }
});
```



여기까지 이더리움 멀티시그 컨트랙트 배포에 대해 알아보았습니다.
