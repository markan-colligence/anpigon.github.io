---
layout: post 
categories: Blockchain
title: "이더리움 클라이언트 geth 맥에 설치하기"
tagline: 
tags : ["이더리움","geth"] 
published: true
---

이더리움 클라이언트 중 하나인 geth를 맥에 설치하여 사용하는 방법을 알아보겠습니다.

## brew 설치

brew는 Mac용 패키지 관리자입니다.

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```


## Go 설치

Go 공식 웹 사이트에 가서 Mac OSX 용 패키지를 다운로드 받아 설치합니다. 본 글에서는 1.10.2 을 사용합니다.
* go다운로드 페이지: http://golang.org/dl

`go1.10.2.darwin-amd64.pkg (124MB)` 를 다운로드 받습니다.


## Geth 설치

여기서는 현재 최신버전인 Titanium(v1.8.7)를 사용합니다.
Geth 설치방법은 2가지가 있습니다.

#### (1) geth 바이너리 다운로드하는 방법

* 다운로드 페이지: https://geth.ethereum.org/downloads/

`geth-darwin-amd64-1.8.7-66432f38.tar.gz`를 다운받아서 압축을 해제한다. 그리고 `/usr/local/bin/` 디렉토리에 geth 를 복사한 후 버전을 확인한다.

``` bash
$ sudo cp ~/Downloads/geth-darwin-amd64-1.8.7-66432f38/geth /usr/local/bin/

$ geth version
Geth
Version: 1.8.7-stable
Git Commit: 66432f3821badf24d526f2d9205f36c0543219de
Architecture: amd64
Protocol Versions: [63 62]
Network Id: 1
Go Version: go1.10.1
Operating System: darwin
GOPATH=
GOROOT=/Users/travis/.gimme/versions/go1.10.1.darwin.amd64
```

#### (2) git에서 소스코드를 다운받아 컴파일하는 방법


```bash
$ git clone -b release/1.8 https://github.com/ethereum/go-ethereum
```

다운로드가 완료되면 폴더로 이동한다음 컴파일을 실행한다. 참고로 Geth는 Go 언어로 개발되었기때문에 Go 컴파일러가 반드시 필요하다.

```bash
$ cd go-ethereum/
$ make geth
```



## Geth 실행하기

```bash
$ geth --networkid 4649 --nodiscover --maxpeers 0 --datadir ~/data_testnet --rpc --rpcaddr "0.0.0.0" --rpcport 8545 --rpccorsdomain "*" --rpcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" --verbosity 6 console 2>> ~/data_testnet/geth.log
```
geth의 Command line options에 대한 설명은 다음을 참고한다.
* https://github.com/ethereum/go-ethereum/wiki/Command-Line-Options

매번 구동시 마다 편의를 위해서 `alias`를 설정합니다.

```bash
$ echo "alias gethstart='geth --networkid 4649 --nodiscover --maxpeers 0 --datadir ~/data_testnet --rpc --rpcaddr "0.0.0.0" --rpcport 8545 --rpccorsdomain "*" --rpcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" --verbosity 6 console 2>> ~/data_testnet/geth.log'" >> ~/.bashrc
```

그리고 로그인시 마다 적용하기 위해서는 .profile 에 해당 내용을 Shell에 반영합니다.

```bash
$ source ~/.bashrc
```


이상 마칩니다.

___


참고: https://steemit.com/ethreum/@wisefree/1
