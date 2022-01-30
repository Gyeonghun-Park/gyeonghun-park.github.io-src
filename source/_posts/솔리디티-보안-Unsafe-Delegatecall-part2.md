---
title: '[Solidity]솔리디티 보안 Unsafe Delegatecall | Part 2'
tags: [Blockchain, Solidity, Security]
toc: true
widgets:
  - type: toc
    position: left
  - type: categories
    position: right
cover: /img/sol-sec.jpeg
date: 2022-01-19 14:17:33
categories: [Solidity, Security]
---

</pre>

<!--more-->

<!--more-->

[원문으로 가기](https://coinsbench.com/unsafe-delegatecall-part-2-hack-solidity-5-94dd32a628c7)

[Credit: Zuhaib Mohammed](https://zuhaibmd.medium.com/)

이 포스트는 **Zuhaib Mohammed**가 작성한 **Unsafe Delegatecall (Part #2) | Hack Solidity #5**를 번역한 내용이며, 임의로 첨삭한 부분이 있습니다.

모든 번역 포스트는 원작자의 동의를 받아 번역을 진행하였습니다.

---

상태 변수가 잘못된 순서로 선언되거나 컨트랙에서 잘못된 데이터 타입으로 선언되면 어떻게 되는지 살펴보겠습니다.

Unsafe Delegation Call의 [Part #1](https://gyeonghun-park.github.io/2022/01/18/%EC%86%94%EB%A6%AC%EB%94%94%ED%8B%B0-%EB%B3%B4%EC%95%88-Unsafe-Delegatecall-part1/)을 읽지 않았다면 먼저 확인해주십시오.

---

## **공격**

`Lib`와 `HackMe`의 두 가지 컨트랙트가 있습니다. 우리의 목표는 HackMe 컨트랙트의 `소유자`를 악의적인 공격자로 업데이트하는 것입니다.

`HackMe` 컨트랙트에서 `doSomething`을 통해 `Lib` 컨트랙트에 `delegatecall`이 수행되는 것을 볼 수 있습니다. 여기서 someNumber는 업데이트됩니다. 그러나 우리는 이미 `delegatecall`의 경우 상태 변수가 같은 순서로 선언되어야 한다는 것을 알고 있습니다. 따라서 HackMe 컨트랙트의 `someNumber` 대신 `lib` 변수가 업데이트됩니다.

![HackMe contract](/img/솔리디티-보안-Unsafe-Delegatecall-part2/1.png?style=centerme)

address 데이터타입은 `20바이트`를, `uint`는 `32바이트`를 가질수 있습니다. 따라서 공격자는 doSomething을 호출하기 전에 암시적 변환(implicit conversion)을 사용하고 `lib` 값을 공격자의 컨트랙트 주소로 업데이트합니다.

이제 공격자가 `doSomething` 함수를 두 번째로 호출하면, 그 호출을 공격자가 `HackMe` 주소의 소유자를 업데이트할 수 있는 공격자 컨트랙트 `doSomething` 함수에 위임(delegate)합니다.

> 참고: 공격자의 컨트랙트 상태 변수는 HackMe 컨트랙트와 동일한 순서를 따릅니다. 또한 공격자 컨트랙트의 `doSomething` 시그니처(*signature*)는 `HackMe의 doSomething` 시그니처와 일치해야 합니다(즉, 동일한 함수 이름 및 인수(argument)).

![Attacker’s contract](/img/솔리디티-보안-Unsafe-Delegatecall-part2/2.png?style=centerme)

---

## **예방법**

`delegatecall`을 사용하는 동안 공격자에게 공격 표면(attack surface)을 제공할 수 있는 다른 상태 변수에 대한 불필요한 업데이트를 방지하기 위해 상태 변수가 동일한 순서로 선언되었는지 확인하십시오.



즐겁게 읽으셨기를 바랍니다.

챠오!!!
