---
title: '[Solidity]솔리디티 보안 재진입성(Reentrancy)'
tags: [Blockchain, Solidity, Security]
toc: true
widgets:
  - type: toc
    position: left
  - type: categories
    position: right
cover: /img/sol-sec.jpeg
date: 2022-01-11 14:00:20
categories: [Solidity, Security]
---

</pre>

<!--more-->

<!--more-->

[원문으로 가기](https://coinsbench.com/reentrancy-hack-solidity-1-aad0154a3a6b)

[Credit: Zuhaib Mohammed](https://zuhaibmd.medium.com/)

이 포스트는 **Zuhaib Mohammed**가 작성한 **Reentrancy | Hack Solidity #1**를 번역한 내용이며, 임의로 첨삭한 부분이 있습니다.

모든 번역 포스트는 원작자의 동의를 받아 번역을 진행하였습니다.

---

이 글을 쓰게된 계기는 스마트 컨트랙트의 일반적인 취약점들을 알아보려고 노력한 것입니다. 이 여정을 도와준 [Smart Contract Programmer](https://www.youtube.com/channel/UCJWh7F3AFyQ_x01VKzr9eyA)에게 감사드립니다. 그의 채널도 확인해 주세요.

그럼 시작 합니다!

---

Ethereum Classic의 탄생으로 이어지는 유명한 `DAO 공격(DAO attack)`에 대해 들어보셨을 것입니다. 공격자가 악용한 취약점을 "`재진입(Reentrancy)`"이라고 합니다.

## **재진입 공격이란?**

컨트랙트 A가 컨트랙트 B를 호출하는 두 개의 `컨트랙트 A와 B`가 있다고 가정합니다. 이 공격에서 발생하는 일은 첫 번째 호출이 아직 실행 중일 때 컨트랙트 B가 컨트랙트 A를 호출하고 일종의 루프가 발생한다는 것입니다.

우리는 아래 주어진 예시를 통해 공격을 더 잘 이해하려고 노력할 것입니다. 우리는 `EtherStore`라는 스마트 컨트랙트을 가지고 있으며 스마트 컨트랙트의 현재 잔액을 입금(deposit), 출금(withdraw) 및 확인(getBalance)할 수 있습니다.

![EtherStore.sol](/img/솔리디티-보안-재진입성-Reentrancy/1.png?style=centerme)

`withdraw` 함수는 사용자가 가지고 있는 금액보다 더 많은 금액을 인출하지 못하도록 하는 체크 기능이 있지만 버그는 `라인 16`에 있습니다. 스마트 컨트랙트 주소로 이더를 보낼 때마다 `fallback` 함수라고 하는 것을 정의합니다. 대부분의 경우 이 기능은 빈 함수에 불과하지만 공격자가 충분히 실제 익스플로잇(exploit) 코드를 배치할수 있는 위치입니다.

## **공격**

공격자는 `EtherStore` 컨트랙트에서 `라인 14`에 대한 체크를 통과하기 위해 `EtherStore` 컨트랙트에 1 이더를 예치하는 익스플로잇(exploit) 함수를 호출합니다. 코드가 `라인 16`에 도달하면 공격자가 자금을 소진할 때까지 EtherStore에서 인출 함수를 호출하는 공격자 컨트랙트의 `fallback` 함수가 실행됩니다.

![Reentrancy.sol](/img/솔리디티-보안-재진입성-Reentrancy/2.png?style=centerme)

## **해결책**

이 공격이 가능한 이유는 `EtherStore` 컨트랙트에서 인출된 금액을 빼는 `EtherStore` 컨트랙트의 `라인 20`에 코드가 도달하지 않기 때문입니다. 이 문제를 해결하기 위해 두 가지 솔루션이 있습니다. 첫 번째는 사용자에게서 잔액을 빼기 위한 로직의 재배치입니다.

![modified withdraw() function](/img/솔리디티-보안-재진입성-Reentrancy/3.png?style=centerme)

두 번째 해결책은 실행 중에 컨트랙트을 잠그고 실행이 끝나면 잠금을 해제하는 noReentrancy guard modifer를 사용하는 것입니다.

![noReentrancy guard modifer](/img/솔리디티-보안-재진입성-Reentrancy/4.png?style=centerme)

간단하게 실제 사례를 사용하여 문제를 설명하려고 노력 했습니다. 즐겁게 읽으셨기를 바랍니다.

챠오!!!