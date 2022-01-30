---
title: '[Solidity]솔리디티 보안 Unsafe Delegatecall | Part 1'
tags: [Blockchain, Solidity, Security]
toc: true
widgets:
  - type: toc
    position: left
  - type: categories
    position: right
cover: /img/sol-sec.jpeg
date: 2022-01-18 12:08:48
categories: [Solidity, Security]
---

</pre>

<!--more-->

<!--more-->

[원문으로 가기](https://coinsbench.com/unsafe-delegatecall-part-1-hack-solidity-5-81d5f295edb6)

[Credit: Zuhaib Mohammed](https://zuhaibmd.medium.com/)

이 포스트는 **Zuhaib Mohammed**가 작성한 **Unsafe Delegatecall (Part #1) | Hack Solidity #5**를 번역한 내용이며, 임의로 첨삭한 부분이 있습니다.

모든 번역 포스트는 원작자의 동의를 받아 번역을 진행하였습니다.

---

## **delegatecall 이란?**

컨트랙트A가 `delegatecall`을 사용하여 컨트랙트B를 호출하면 기본적으로 컨트랙트B에 해당 컨텍스트(storage, msg.sender, msg.value, msg.data 등) 내에서 컨트랙트A의 코드를 실행하도록 지시합니다. 스토리지 레이아웃은 컨트랙트A와 컨트랙트B에 대해 동일해야 합니다. 즉, 동일한 상태 변수가 동일한 순서로 선언되어야 함을 의미합니다.

![understanding delegatecall](/img/솔리디티-보안-Unsafe-Delegatecall-part1/1.png?style=centerme)

---

## **예제를 통한 이해**

`생성자` 호출 중에 소유자가 설정되는 `HackMe 컨트랙트`가 있습니다. `Lib 컨트랙트`를 통해 `delegatecall`을 만드는 `fallback 함수`가 정의되어 있습니다. 우리는 소유자를 설정하는 Lib 컨트랙트에서 `pwn` 함수가 정의되어 있는 것을 볼 수 있습니다.

---

## **공격**

`HackMe` 컨트랙트의 소유자를 업데이트하기 위해, 악성 컨트랙트(`Attack`)로 부터 `abi.encodeWithSignature(“pwn()”)`를 통해 `pwn` 함수의 함수 시그니처(signature)를 전달합니다.

먼저, `HackMe` 컨트랙트에서 `pwn` 함수에 대한 조회가 발생합니다. Attack 컨트랙트에는 `pwn` 함수가 없기 때문에 pwn 함수의 시그니처로 Lib 컨트랙트를 호출하는 HackMe의 `fallback` 함수가 트리거됩니다. `Lib` 컨트랙트에 pwn `함수` 정의가 있고 소유자가 msg.sender로 설정되어 있음을 알 수 있습니다. context-preservation에 의해 msg.sender가 이제 `HackMe` 컨트랙트의 소유자가 됩니다.



이 포스트의 2부에서 이를 방지하는 방법에대해 논의하겠습니다.



즐겁게 읽으셨기를 바랍니다.

챠오!!!
