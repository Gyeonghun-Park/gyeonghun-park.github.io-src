---
title: '[Solidity]솔리디티 보안 셀프디스트럭트(selfdestruct)'
tags: [Blockchain, Solidity, Security]
toc: true
widgets:
  - type: toc
    position: left
  - type: categories
    position: right
cover: /img/sol-sec.jpeg
date: 2022-01-13 14:58:36
categories: [Solidity, Security]
---

</pre>

<!--more-->

<!--more-->

스마트 컨트랙트 개발자라면 스마트 컨트랙트에 ETH를 보내려면 `fallback` 함수가 있어야 한다는 사실을 알고 있을 겁니다. 하지만 이번 해킹에서는 우리는 `selfdestruct` 함수를 호출 하여 스마트 컨트랙트에 ether를 강제로 보내는 방법을 배웁니다.

## **selfdestruct는 무엇을 하나요?**

`selfdestruct` 함수는 블록체인에서 스마트 컨트랙트의 인스턴스를 삭제하고 그 전에 스마트 컨트랙트에 저장된 모든 나머지 ETH를 인수(argument)로 전달된 주소로 모두 전송합니다. 아래에 예시가 있습니다.

```js
selfdestruct("address_to_send_ETH_before_deletion");
```

## **게임**

`EtherGame` 컨트랙트는 각 사용자가 1개의 이더(ether)를 예치할 수 있는 매우 간단한 게임이며, 이더를 예치한 `7번째 사람`이 컨트랙트에 저장된 모든 이더를 얻습니다. 일단 `(잔액 ≤ 목표 금액)`을 만족하면, 더 이상 이더를 보낼 수 없으며 트랜잭션은 revert된다. 아래에서 EtherGame의 소스 코드를 볼 수 있습니다.

![EtherGame contract](/img/솔리디티-보안-셀프디스트럭트-selfdestruct/1.png?style=centerme)

악의적인 공격자는 컨트랙트를 통해 `selfdestruct` 함수를 호출하고 ETH를 EtherGame 컨트랙트에 강제로 보내고 이를 망가트릴수 있습니다.

첫 번째 사용자 `Bob`이 1개의 ether를 보내고 두 번째 사용자 `Alice`가 1개의 이더를 보낸다고 상상해 보십시오. `EtherGame` 컨트랙트의 현재 잔액은 2 이더입니다. 이제 `Eve`는 아래 표시된 Attack 컨트랙트를 통해 `selfdestruct` 함수를 호출하고 EtherGame 컨트랙트에 5 이더를 보냅니다. `EtherGame` 컨트랙트의 잔액은 7 이더로 업데이트되었지만 승자는 설정되지 않았습니다. 그후 EtherGame의 `라인 11`에 정의된 조건으로 인해 이 다음으로 호출되는 deposit함수의 트랜잭션은 모두 revert될 것입니다. 이로서 아무도 EtherGame에 예치된 ETH를 가져갈수 없습니다!

![The malicious contract](/img/솔리디티-보안-셀프디스트럭트-selfdestruct/2.png?style=centerme)

## **해결책**

이를 방지하는 가장 좋은 방법은 `address(this.balance)`를 사용하여 컨트랙트의 현재 잔액을 업데이트하지 않고 로컬 상태 변수(`balance`)를 사용하여 사용자가 자금을 입금할 때에만 업데이트하는 것입니다. 공격자는 여전히 `selfdestruct` 통해 ETH를 보낼수 있지만, 게임을 망가트릴수는 없습니다.

![The Fix via “balance” state variable](/img/솔리디티-보안-셀프디스트럭트-selfdestruct/2.png?style=centerme)

재미있게 읽으셨기를 바랍니다.

챠오!!!
