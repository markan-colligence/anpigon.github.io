---
layout: post 
categories: Blockchain
title: "이더리움 ERC20 토큰(또는 코인) 만들기"
tagline: 
tags : ["이더리움","geth","erc20","토큰"] 
published: true
---

이더리움의 스마트 컨트랙트를 사용하여 토큰(코인)을 만드는 방법을 알아보겠습니다. 이더리움 네트워크에 토큰 컨트랙트를 배포하면 해당 컨트랙트를 코인처럼 사용할 수 있습니다. 



## ERC20 토큰 컨트랙트 구현

ERC20 토큰 컨트랙트는 [[EIP-20]](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) 규격문서 참고하여 구현합니다.  이미 구현된 오픈소스들이 있으므로 github에서 가져오겠습니다.  

아래는 ERC20 토큰 컨트랙트를 구현하는 [EIP20.sol](https://github.com/ConsenSys/Tokens/blob/master/contracts/eip20/EIP20.sol) 내용입니다. 소스코드 전체가 아니므로 giuhub에서 컨트랙트 전체 소스코드를 확인바랍니다.

```js
pragma solidity ^0.4.21;

import "./EIP20Interface.sol";

contract EIP20 is EIP20Interface {

    uint256 constant private MAX_UINT256 = 2**256 - 1;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;

    string public name;                   //fancy name: eg Simon Bucks
    uint8 public decimals;                //How many decimals to show.
    string public symbol;                 //An identifier: eg SBX

    function EIP20(
        uint256 _initialAmount,
        string _tokenName,
        uint8 _decimalUnits,
        string _tokenSymbol
    ) public {
        balances[msg.sender] = _initialAmount; // Give the creator all initial tokens
        totalSupply = _initialAmount; // Update total supply
        name = _tokenName; // Set the name for display purposes
        decimals = _decimalUnits; // Amount of decimals for display purposes
        symbol = _tokenSymbol; // Set the symbol for display purposes
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        uint256 allowance = allowed[_from][msg.sender];
        require(balances[_from] >= _value && allowance >= _value);
        balances[_to] += _value;
        balances[_from] -= _value;
        if (allowance < MAX_UINT256) {
            allowed[_from][msg.sender] -= _value;
        }
        emit Transfer(_from, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
}
```



## 컨트랙트 컴파일 및 배포

컨트랙트를 배포하기 위해 Ropsten 테스트넷을 사용합니다. 

### 테스트넷 연결

web3를 이용하여 테스트넷에 접속하기 위해서 [www.infura.io](https://www.infura.io/) 에 회원가입하여 `API_KEY`를 발급받습니다.테스트넷 접속 URL는 `https://ropsten.infura.io/[API_KEY]`의 형태가 됩니다. 아래와 같이 테스트넷에 연결합니다.

```js
var Web3 = require('web3');

// 이더리움 테스트넷 연결
var TEST_NET_URL = 'https://ropsten.infura.io/[infura_api_key_here]';
var web3 = new Web3(new Web3.providers.HttpProvider(TEST_NET_URL));
```

### 컨트랙트 컴파일

이제 소스코드 `EIP20.sol` 파일을 컴파일합니다. 그리고 이더리움 노드에 등록할 토큰 컨트랙트를 생성하도록 하겠습니다.

```js
var path = require('path');
var solc = require('solc');

// 컴파일 하기
var contractSource = fs.readFileSync(path.resolve(__dirname, 'ERC20Token.sol'), 'utf8');
var compiledCode = solc.compile(contractSource.toString(), 1).contracts[':EIP20'];
var bytecode = compiledCode.bytecode;
var abiDefinition = JSON.parse(compiledCode.interface);
var contract = web3.eth.contract(abiDefinition);

// 토큰 정보 입력
var name = '안피곤 코인'; // 코인 이름
var symbol = 'ANP';			// 코인 기호
var amount = 10000;			// 초기 코인량
var decimals = 18;			// 자연 단위수(10^18)
var txInputData = '0x' + contract.new.getData(amount, name, decimals, symbol, {data: bytecode});
```
### 개인키 생성

트랜잭션을 서명할 개인키는 니모닉 워드를 사용하여 생성하겠습니다. 

```js
var Bitcore = require('bitcore-lib');
var Mnemonic = require('bitcore-mnemonic');

// 니모닉 워드(보통 12단어로 구성)
var mnemonicWords = 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
var xPriKey = Mnemonic(mnemonicWords).toHDPrivateKey('', 'testnet'); // 확장 개인키 생성
var privkey = xPriKey.deriveChild("m/44'/60'/0'/0/0").privateKey; // 서명할 개인키
var fromAddress = '0x' + ethUtil.privateToAddress(privkey.toBuffer()).toString('hex'); 
console.log('fromAddress:', fromAddress); // 이더리움 주소
```

### 트랙잭션 서명

이제 트랜잭션을 구성하고 개인키로 트랜잭션을 서명 합니다.

```js
var EthTx = require('ethereumjs-tx');
var ethUtil = require('ethereumjs-util');

// 서명자의 주소
var fromAddress = '0x' + ethUtil.privateToAddress(privkey).toString('hex'); 

// 트랜잭션 생성
var nonce = web3.eth.getTransactionCount(fromAddress); // 트랜잭션 Nonce값 조회
var gasPrice = web3.eth.gasPrice; // 네트워크 가스 가격 조회
const rawTx = {
  nonce: web3.toHex(nonce),
  gasPrice: web3.toHex(gasPrice),  // 가스 1개당 가격(wei 단위)
  gasLimit: web3.toHex(3000000),   // 가스 최대 사용량
  data: txInputData,               // 컨트랙트 excute 함수 호출 데이터                   
  chainId: 3, //네트워크 ID
}

// 트랜잭션 서명
const tx = new EthTx(rawTx); // 트랜잭션 객체 생성
tx.sign(privkey); // tx 서명
```
### 트랜잭션 전송 및 컨트랙트 배포

이제 이더리움 네트워크에 트랜잭션을 전송합니다. 
참고로 컨트랙트를 배포하기 위해서는 수수료를 지불할 수 있을 정도의 Ether가 있어야합니다. 테스트넷의 Ether를 받는 방법은 [Faucet](http://faucet.ropsten.be:3001/)를 이용하는 것입니다.

```js
var serializedTx = tx.serialize(); // hex serialize binary 생성
web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('txHash:', hash); // tx hash 생성
});
```

트랜잭션을 전송하고 나서 출력된 `txHash`값을 이용하여 테스트넷 이더스캔([https://ropsten.etherscan.io/](https://ropsten.etherscan.io/))에서 컨트랙트 주소를 확인합니다. 채굴이 완료되면 방금 등록한 토큰의 address가 보일 것 입니다.

### 토큰 확인

컨트랙트 주소가 생성되면 아래와 같이 토큰을 확인 할 수 있다.

```js
var contractAddress = '[컨트랙트 주소]';
var contractInstance = web3.eth.contract(abiDefinition).at(contractAddress);
console.log('symbol:', contractInstance.symbol.call());
console.log('decimals:', contractInstance.decimals.call().toNumber());
console.log('name:', contractInstance.name.call());
console.log('balance:', contractInstance.balanceOf.call(fromAddress).toNumber());
```
Result:

```bash
symbol: ANP
drcimals: 18
name: 안피곤 코인
balance: 10000
```

이상 마칩니다.

다음에는 우리가 만든 토큰을 거래 할 수 있는 지갑을 구현해볼 예정입니다.
