---
title: "[자바스크립트] V8 엔진 및 JavaScript 최적화 팁"
tags: [Web, Optimization]
toc: true
widgets:
  - type: toc
    position: left
  - type: categories
    position: right
cover: /img/v8.png
date: 2022-03-19 10:27:55
categories:
---

</pre>
<!--more-->

<!--more-->

[원문으로 가기](https://www.digitalocean.com/community/tutorials/js-v8-engine)

[Credit: Paul Ryan](https://www.digitalocean.com/community)

이 포스트는 **Paul Ryan**가 작성한 **The V8 Engine and JavaScript Optimization Tips**를 번역한 내용이며, 임의로 첨삭한 부분이 있습니다.

모든 번역 포스트는 원작자의 동의를 받아 번역을 진행하였습니다.

---

[V8](https://v8.dev/)은 JavaScript를 컴파일하기 위한 Google의 엔진입니다. Firefox에는 SpiderMonkey라는 자체 엔진이 있으며 V8과 매우 유사하지만 차이점이 있습니다. 이 포스트에서는 V8 엔진에 대해 논의할 것입니다.

V8 엔진에 대한 몇 가지 사실:

- C++로 작성되고 Chrome 및 Node.js (및 [Microsoft Edge의 최신 릴리스](https://www.theverge.com/2018/12/6/18128648/microsoft-edge-chrome-chromium-browser-changes)) 에서 사용됨
- ECMA-262에 지정된 대로 ECMAScript를 구현합니다.

---

## **JavaScript 살펴보기**

그렇다면 V8 엔진에 의해 구문 분석되도록 JavaScript(JavaScript 코드에 대해 minified, uglified 및 기타 다른 작업을 수행한 후)를 보내면 어떤일이 벌어질 까요?
모든 단계를 보여주는 다음 다이어그램을 만들었습니다. 각 단계에 대해 자세히 살펴 보겠습니다.

![](/img/자바스크립트-V8-엔진-및-JavaScript-최적화/1.png?style=centerme)
이 포스트에서는 JavaScript 코드가 구문 분석되는 방법과 가능한 한 많은 JavaScript를 Optimizing Compiler로 가져오는 방법에 대해 설명합니다. 최적화 컴파일러(Turbofan)는 자바스크립트 코드를 가져다가 고성능 머신 코드로 변환하므로 더 많은 코드를 제공할수록 응용 프로그램의 속도가 빨라집니다. 참고로, 크롬의 인터프리터를 Ignition이라고 합니다.

## **JavaScript 파싱**

JavaScript 코드의 첫 번째 처리는 이를 구문 분석하는 것입니다. 파싱(parsing)이 정확히 무엇인지 논의해 봅시다.
구문 분석에는 다음과 같은 두 단계가 있습니다.

1. Eager(전체 구문 분석) - 각 라인을 즉시 구문 분석합니다.
2. Lazy(사전 구문 분석) - 최소한의 작업만 수행하고 필요한 구문 분석을 수행하고 나머지는 나중으로 미룹니다.

어떤게 더 좋을까요? 그것은 상황에 따라 다릅니다.

몇 가지 코드를 살펴보겠습니다.

```js
// eager parse declarations right away
const a = 1;
const b = 2;

// lazily parse this as we don't need it right away
function add(a, b) {
  return a + b;
}

// oh looks like we do need add so lets go back and parse it
add(a, b);
```
