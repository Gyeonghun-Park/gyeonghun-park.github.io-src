---
title: '[Solidity]솔리디티 보안 tx.origin을 사용한 피싱'
tags: [Blockchain, Solidity, Security]
toc: true
widgets:
  - type: toc
    position: left
  - type: categories
    position: right
cover: /img/sol-sec.jpeg
date: 2022-01-23 13:23:33
categories: [Solidity, Security]
---

</pre>
<!--more-->

<!--more-->


[원문으로 가기](https://coinsbench.com/phishing-with-tx-origin-hack-solidity-7-e5a4e8913986)

[Credit: Zuhaib Mohammed](https://zuhaibmd.medium.com/)

이 포스트는 **Zuhaib Mohammed**가 작성한 **Phishing with tx.origin | Hack Solidity #8**를 번역한 내용이며, 임의로 첨삭한 부분이 있습니다.

모든 번역 포스트는 원작자의 동의를 받아 번역을 진행하였습니다.

---

## **tx.origin vs msg.sender**

컨트랙트A가 컨트랙트B를 부르고 컨트랙트B가 컨트랙트C를 호출하는 예를 들어보자. `tx.origin`의 값은 `address(컨트랙트A)`이고 `msg.sender`의 값은 `address(컨트랙트B)`이다.

``` js
ContractA -> ContractB -> ContractC{tx.origin = address(컨트랙트A), 
                                   msg.sender = address(컨트랙트B)}
```

이는 `tx.origin`이 트랜잭션이 시작된 주소를 추적하고 `msg.sender`가 이를 호출한 계정 또는 컨트랙트의 주소를 보유하기 때문입니다.

---

## **예제**

아래는 `소유자`가 컨트랙트를 배포한 사람으로 설정된 `Wallet` 컨트랙트를 볼 수 있습니다(예: alice.eth). `소유자`가 아무 계정에 이더를 보낼 수 있는 `transfer` 함수가 있습니다. 공격자가 자신의 계정으로 일부 이더를 전송하기 위해 호출하려는 경우 `11행`의 조건을 전달해야 합니다.

`tx.origin`과 `msg.sender`의 차이점을 어느 정도 이해하셨기를 바랍니다. 이전에 작성한 [글](https://zuhaibmd.medium.com/ethernaut-level-4-telephone-b93392a93836)에 이것에 대해 전에 설명을 하였습니다.

이제 다시 문제로 돌아갑니다. 해커는 `Attack` 컨트랙트에서 `attack` 함수를 정의합니다. 해커가 스스로 공격 기능을 발동시키면 그 transaction 실패할 것입니다. 공격이 성공하려면 해커가 어떻게든 `alice.eth(소유자)`를 유인하여 `attack` 함수를 트리거하도록 해야 합니다. `tx.origin == owner`인 이유는 `alice.eth`가 `attack` 함수를 트리거한 사람이고 해커의 계정으로 자금이 이체되었기 때문입니다.

![Wallet.sol](/img/솔리디티-보안-tx-origin을-사용한-피싱/1.png?style=centerme)

---

##  **해결책**

`tx.origin` 대신 `msg.sender`를 사용하세요. 그게 전부 입니다!

즐겁게 읽으셨기를 바랍니다.

챠오!!!