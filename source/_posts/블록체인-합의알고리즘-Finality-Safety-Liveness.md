---
title: '[Blockchain] 블록체인 합의알고리즘(Finality,Safety,Liveness)'
tags: [Blockchain, Cryptocurrency]
toc: true
widgets:
  - type: toc
    position: left
  - type: categories
    position: right
cover: /img/blockchain.jpeg
date: 2021-12-19 13:35:03
categories: [Blockchain]
---

</pre>

<!--more-->

<!--more-->

## 🚫 Finality

블록체인에서 finality의 의미는 블록이 한 번 블록체인에 포함(import)되고 나면 되돌릴 수 없음을 의미한다. finality 보장 방법은 합의 알고리즘 설계에서 가장 중요한 문제 중 하나이다.

finality는 크게 `확률적 finality`와 `절대적 finality` 두 종류로 분류한다.

---

### **확률적 finality**

확률적 finality는 블록을 되돌릴 수 없다는 것을 확률적으로만 보장한다. 비트코인 나카모토 합의 알고리즘이 사용하는 방식으로 블록이 추가로 생성될 수록 앞쪽에 있는 블록의 finality가 확률적으로 증가하는 방식이다. 오래된 블록을 되돌리기 위해서는 많은 컴퓨팅 파워가 필요하기 때문에 어느 정도 오래된 블록은 사실상 되돌리는 것이 불가능해진다. 거래소에 비트코인을 입금하면 6개의 블록 컨펌을 기다린 이후 거래가 가능한 이유도 거래소 입장에서 확률적으로 finality를 체크하기 때문이다.

---

### **절대적 finality**

절대적 finality는 한 번 블록이 블록체인에 포함되면 어떤 경우에도 해당 블록을 되돌릴 수 없음을 보장하는 방식이다. 주로 텐더민트와 같은 BFT 계열의 합의 알고리즘이 절대적 finality를 보장하는데, 텐더민트의 경우 블록이 전체 노드 voting power의 2/3 prevote와 2/3의 precommit을 받으면 해당 블록은 즉시 finalize가 된다.

---

### CAP Theorem

확률적 finality와 절대적 finality의 속성을 비교하면 당연히 절대적 finality가 좋다. finality만 봤을 때는 모든 체인이 BFT 계열의 합의 알고리즘을 사용해야 한다고 생각할 수 있다. 하지만 모든 엔지니어링은 트레이드오프가 있고, 절대적 finality 역시 공짜로 얻어지는 것은 아니다.

이 문제를 이해하기 위해서는 [Eric Brewer’s CAP 정리](https://www.cs.ubc.ca/~bestchai/teaching/cs416_2017w2/lectures/lecture-mar26.pdf)를 살펴볼 필요가 있다. CAP 정리에 따르면 모든 분산 컴퓨팅 시스템은 `Consistency, Availability, Partition Tolerance` 중 2가지만 달성 가능하다. 참여 노드가 전세계에 분산된 블록체인의 경우 네트워크 파티션을 피할 수 없으므로, 모든 체인은 Consistency와 Availability 둘 중 하나를 선택해야 한다는 뜻이기도 하다.

확률적 finality를 선택한 체인은 네트워크 파티션 상황에서 Availability를 보장한다. 비트코인의 경우 네트워크 파티션이 발생하면 각 파티션에 포크가 생기게 되고, 네트워크 파티션이 사라지면 longest-chain 규칙에 따라 다시 하나의 체인으로 합쳐지게 된다. 포크가 난 상황에서도 계속 합의를 진행할 수 있지만, finality는 보장하지 못한다.

반대로 절대적 finality를 선택한 체인은 네트워크 파티션 상황에서도 Consistency를 보장한다. 텐더민트의 경우 네트워크가 반으로 파티션되면 어느 한 쪽도 2/3의 투표를 받지 못하기 때문에 블록에 대한 합의를 진행하지 못한다. 이후 네트워크 파티션이 사라지면 다시 합의를 진행하게 된다. 파티션 상황에서 Availability를 보장하지 못하는 대신 절대적 finality를 보장할 수 있다.

하나의 체인이 모든 종류의 Dapp을 지원하기 어려운 이유도 여기에 있다. 어떤 Dapp은 Consistency가 중요하고 어떤 Dapp은 Availability가 중요할 수 있다. Dapp 개발자는 Finality 보장에 숨어 있는 트레이드오프를 이해하고 Dapp의 성격에 맞는 적절한 체인을 선택하는 것이 좋다.

---

<!--more-->

<!--more-->

## 🦺 Safety와 Liveness

어떤 합의 알고리즘이 네트워크에서 통용되기 위해선 Safety와 Liveness라는 특성을 가지고 있어야 한다.

Safety의 의미는 '노드 간 합의가 발생했다면, 어느 노드가 접근하든 그 값은 동일해야 한다'이다. 블록체인의 finality와 동일한 개념으로 이해해도 된다.

Liveness는 '합의 대상(Transaction 또는 블록체인에서 블록)에 문제가 없다면, 네트워크 내에서 반드시 합의가 이루어진다'라는 의미이다.

---

### FLP impossibility

하지만, 비동기 네트워크 내에서는 Safety와 Liveness를 모두 완벽히 만족하는 합의 알고리즘을 설계하는 것이 불가능하다는 것이 증명되었다. 이 증명을 "FLP Impossibility"(논문 작성자: Fischer, Lynch, Paterson라고 한다.

정확히 말하면, 비동기 네트워크에서는 합의 문제를 완벽히 해결할 수 있는 분산 알고리즘이 없다는 것을 증명했다. 1985년 4월 발표된 논문 [Impossibility of Distributed Consensus with One Faulty Process](https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf)에서 언급된 내용이다. 비동기 네트워크에서는 어떤 한 노드에서 문제가 발생했을 경우 그 노드에서 합의가 됐는데 단순히 응답에 오랜 시간이 걸리는 건지, 아니면 합의 과정에서 충돌이 발생해서 응답하지 않는 건지 알 수 없기 때문이다.

블록체인이 구동되는 네트워크는 비동기 네트워크이다. 따라서 비동기 네트워크에서 완벽한 합의 알고리즘은 존재하지 않는다. 다시 말해, Safety와 Liveness를 동시에 완벽히 만족하는 합의 알고리즘을 설계할 수가 없다. 즉 블록체인에서 어떤 합의 알고리즘을 채택한다는 것은, Safety와 Liveness 중 하나를 어느 정도 포기해야 한다는 것을 말한다.

Replication System은 싱글 호스트 시스템에게 고가용성(High Availability) 제공할 수 있지만, Replica 간의 네트워크 오류나 Replica자체 고장 등의 문제로 여전히 정상 동작되지 않을 수 있는데, 합의 알고리즘은 이러한 문제들을 다룰 수 있어야 하고, 일반적으로 다음 두 개의 시스템 속성을 만족시켜야 한다.

• `Safety`: 시스템에 나쁜 일이 발생하지 않는다는 의미이며, 모든 정상적인 Replica는 같은 상태에 동의하여야 하고, 그 상태는 유효해야 한다. (노드간에 합의가 발생했다면, 어느 노드에 접근하던 그값은 동일해야 함.)

• `Liveness`: 시스템은 항상 살아 있어야 한다는 의미이며, 결국에는 어떤 상태에 동의하여야 하고, 모든 Replica는 동의된 상태에 도달해야 한다. (합의대상 (Transaction, Block)에 문제가 없다면 네트워크 내에 반드시 합의가 이뤄져야 함)

Replica의 비정상적인 상황을 크게 두 가지로 구분할 수 있는데, Fail-stop은 단순히 노드가 고장이 나서 멈추는 형태의 오동작인 반면(Non-Byzantine), Byzantine-Fault는 리플리카가 악의적인 행동을 포함하여 임의의 동작을 할 수 있는 것을 의미한다. ​

Fail-stop 형태의 대표 합의 프로토콜에는 Paxos와 Raft가 있고, Byzantine-Fault 의 대표 합의 프로토콜은 PBFT가 있다.
