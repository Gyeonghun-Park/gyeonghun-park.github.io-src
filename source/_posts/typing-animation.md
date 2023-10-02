---
title: Framer Motion으로 텍스트 애니메이션 만들기
date: 2023-09-24 19:11:09
tags: [CSS, Framer Motion]
---

</pre>

안녕하세요 감자입니다. 오늘은 Framer Motion을 이용해서 타이핑 애니메이션을 추가하는 방법을 알아보겠습니다.

<div style="position: relative; height: 500px">
  <div
    id="loading-message"
    style="
      display: grid;
      place-content: center;
      position: absolute;
      font-size: 24px;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: 8px;
      margin-bottom: 16px;
    "
  >
    Loading...
  </div>
  <iframe
    id="my-iframe"
    style="
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: 8px;
      margin-bottom: 16px;
      z-index: 100;
    "
    srcdoc='
    <head>
  <script
    type="module"
    crossorigin
    src="/html/typing-animation/assets/index-1b6972df.js"
  ></script>
  <link
    rel="stylesheet"
    href="/html/typing-animation/assets/index-d0d57366.css"
  />
</head>
<div id="root"></div>
'
></iframe>
</div>

<script>
  var iframe = document.getElementById("my-iframe");
  var loadingMessage = document.getElementById("loading-message");

  iframe.addEventListener("load", function () {
    loadingMessage.style.display = "none"; // Hide the loading message
  });
</script>

## Framer Motion이 필요한 이유

CSS는 다양한 기능을 제공해주지만, 현재는 타이핑 애니메이션을 구현하기 위한 기능을 완벽하게 제공해주지 않습니다. 각각의 글자에 애니메이션을 적용하려면 일반적으로 `nth-child()`와 같은 selector를 사용하여 딜레이 시간을 적용시켜 주어야 합니다. 하지만 텍스트의 정확한 글자 수를 모르는 경우 이와 같은 방법은 상당히 번거로울 수 있습니다.

애니메이션 반복으로 타이핑 효과를 재현하려는 경우 CSS는 더 큰 문제점이 있습니다. 한 애니메이션의 끝과 다음 애니메이션의 시작 사이에 특정 지연 시간을 설정할 수 없고 애니메이션이 시작되기 전에만 지연 시간을 설정할 수 있기 때문입니다.

이런점에서 Framer Motion은 기존 CSS가 해결해 주지 못하는 문제점들을 해결 해줄수 있습니다.

## 목표

저는 다음과 같은 기능을 갖춘 `AnimatedText` 컴포넌트를 만들겠다는 목표를 가지고 있습니다:

- 타이핑 에니메이션
- Tailwind CSS와 호환되는 클래스 이름
- 어떠한 텍스트도 처리할 수 있는 기능
- 한 문장 뿐만 아니라 여러 문장과의 호환성
- 사용자 친화적인 애니메이션 컨트롤
- 스크롤 트리거 애니메이션
- 사실적인 타이핑 효과를 위한 애니메이션 반복 (선택 사항)
- 컴포넌트 사용은 아래와 같이 간단해야 합니다:

```tsx
<AnimatedText
  text={[
    "This is written on",
    "a typing machine. Tick tick",
    "tick tack tack...",
    "이것은 타자기로",
    "작성되었습니다. 타닥",
    "타닥 타다닥...",
  ]}
  className="text-4xl"
  repeatDelay={10000}
  animation={{
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  }}
/>
```

## AnimatedText 컴포넌트 만들기

이제 차근차근 `AnimatedText` 컴포넌트를 만들어 보겠습니다. 가장 먼저 할 일은 단어를 받아 개별 문자로 분해하는 것입니다. 이를 위해 문자열에 `split("")` 메서드를 사용하여 문자 배열을 제공합니다.

```tsx
type AnimatedTextProps = {
  text: string;
  el?: keyof JSX.IntrinsicElements;
  className?: string;
};

export const AnimatedText = ({
  text,
  el: Wrapper = "p",
  className,
}: AnimatedTextProps) => {
  return (
    <Wrapper className={className}>
      <span className="sr-only">{text}</span>

      <span aria-hidden>
        {text.split("").map((char, charIndex) => (
          <motion.span key={`${char}-${charIndex}`} className="inline-block">
            {char}
          </motion.span>
        ))}
      </span>
    </Wrapper>
  );
};
```

여기서부터 몇 가지 중요한 단계 부터 시작하겠습니다.

14번째 줄 span에서 `sr-only` 텍스트를 렌더링합니다. 즉, 이 span 내의 콘텐츠는 보이지 않지만 스크린 리더(screen reader)에서만 액세스할 수 있습니다.

16번째 줄에서는 스크린 리더에는 숨겨져 있지만 사용자에게는 표시되는 콘텐츠를 볼수있습니다. 이것이 타이핑 애니메이션을 위해 개별 문자로 분할되는 텍스트입니다.

텍스트를 두 번 렌더링하는 것은 다음과 같은 목적이 있습니다. 간혹 문자가 별도의 span으로 나뉘어져 있는 경우 스크린 리더가 이를 완전한 단어가 아닌 약어로 해석할 수 있습니다. 이 문제를 해결하기 위해 `sr-only` span 내에서 전체 단어를 렌더링하도록 선택했습니다. 이렇게 하면 사용자에게 소리내어 읽혀지는 내용이 완전한 단어 또는 문장이 됩니다.

## 애니메이션 추가하기

이제 토대가 완성되었으니 여기에 애니메이션을 더할 차례입니다. 첫 번째 단계는 각 글자에 fade-in 애니메이션을 추가하는 것입니다.

```tsx
export const AnimatedText = ({
  text,
  el: Wrapper = "p",
  className,
}: AnimatedTextProps) => {
  return (
    <Wrapper className={className}>
      <span className="sr-only">{text}</span>

      <span aria-hidden>
        {word.split("").map((char, charIndex) => (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={`${char}-${charIndex}`}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </span>
    </Wrapper>
  );
};
```

아직 까지는 기본적인 fade-in 애니메이션 입니다. 한 단계 더 나아가서 시간차를 만들어 봅시다!

이를 위해 Framer Motion의 animation variant를 사용할겁니다. 이 방식은 `initial` 및 `animate` 스타일을 직접 적용하는 대신 애니메이션 상태에 고유한 이름을 사용하는 것입니다. 코드를 다음과 같이 수정해야 합니다:

```tsx
const defaultAnimation = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

export const AnimatedText = ({
  text,
  el: Wrapper = "p",
  className,
}: AnimatedTextProps) => {
  return (
    <Wrapper className={className}>
      <span className="sr-only">{text}</span>

      <motion.span aria-hidden>
        {word.split("").map((char, charIndex) => (
          <motion.span
            variants={defaultAnimation}
            key={`${char}-${charIndex}`}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    </Wrapper>
  );
};
```

새로운 `defaultAnimation` 객체가 추가 되었습니다. 이 객체 안에는 다양한 애니메이션 상태가 정의되어 있습니다. 객체의 속성의 이름은 사용자 마음대로 정의할 수 있으며 각 상태 내에서 적용하려는 스타일을 지정합니다.

다음으로 부모 엘리멘트를 표준 `span` 대신 `motion.span`으로 변경했습니다. 개별 문자가 아닌 부모 컨테이너에 애니메이션을 적용하기 때문에 변경이 필요합니다. 그런 다음 `initial`과 `animate` 속성을 제거하고 대신 `variants`를 사용합니다.

이 단계에서는 이전과 크게 다르지 않습니다. 하지만 transition을 추가 함으로서 애니메이션간 딜레이가 발생하도록 할 수 있습니다.

```tsx
const defaultAnimation = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

export const AnimatedText = ({
  text,
  el: Wrapper = "p",
  className,
}: AnimatedTextProps) => {
  return (
    <Wrapper className={className}>
      <span className="sr-only">{text}</span>

      <motion.span
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {},
        }}
        initial="hidden"
        animate="visible"
        aria-hidden
      >
        {word.split("").map((char, charIndex) => (
          <motion.span
            variants={defaultAnimation}
            key={`${char}-${charIndex}`}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    </Wrapper>
  );
};
```

위의 코드에서 어떤 일이 일어나고 있을까요? 가장 먼저 부모 요소에 variant를 추가하였습니다. 하지만 부모 요소의 스타일은 variant에 따라 변경되지 않으므로 그에 대한 스타일을 정의하지 않습니다. 대신 `visible`상태 안에 `transition` 속성을 추가 했습니다. 이것은 varian를 적용할 때 자식에 딜레이를 두도록 지시합니다.

다음으로 부모에 대한 `initial`과 `animate` 속성을 다시 도입합니다. 이제 스타일을 지정하는 대신 variant 속성 이름을 값으로 할당합니다.

Framer Motion의 작동 방식 덕분에 부모에 대해 설정한 variant가 있고 자식에게는 없는 경우 자동으로 자식에게 상속 됩니다. 그 결과, 더 이상 자식에게 variant을 명시적으로 전달할 필요가 없으며, 글자가 하나씩 애니메이션되기 시작합니다!

## 문제점 해결하기

이제 다음 단계로 넘어가서 텍스트가 사용자의 시야에 표시될 때만 이 애니메이션이 시작되도록 하도록 하겠습니다. 이를 위해 Framer Motion에서 제공하는 `useInView` 훅의 기능을 활용하겠습니다.

```tsx
const defaultAnimation = {}; // see previous snippet

export const AnimatedText = ({
  text,
  el: Wrapper = "p",
  className,
}: AnimatedTextProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once: true });

  return (
    <Wrapper className={className}>
      <span className="sr-only">{text}</span>

      <motion.span
        ref={ref}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {},
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        aria-hidden
      >
        {word.split("").map((char, charIndex) => (
          <motion.span
            variants={defaultAnimation}
            key={`${char}-${charIndex}`}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    </Wrapper>
  );
};
```

부모 요소에 `ref`를 추가하고 이를 `useInView` 훅에 전달합니다. 이 훅은 텍스트가 현재 사용자의 뷰 내에 있는지 여부를 나타내는 boolean 값을 반환합니다. 이 값을 활용하여 텍스트에 애니메이션을 적용할지 여부를 결정하고, 애니메이션 속성에서 적절한 variant를 설정하여 이를 구현합니다. 꽤 깔끔하지 않나요?

## 단 한번만 애니메이션 적용하기

기본값으로 `useInView` 훅의 once값을 true를 할당했습니다. 그러나 텍스트가 사용자 뷰에 들어올 때마다 애니메이션이 활성화되도록 하려면 false로 설정하면 됩니다.

## 애니메이션 반복 활성화

마지막으로 애니메이션 반복기능을 추가 해보겠습니다. 간략히 설명하자면, 애니메이션을 직접 제어 하는 것입니다. 이렇게 하면 지정된 시간 제한 내에 애니메이션을 반복적으로 트리거할 수 있습니다. 결과물은 [여기](https://codesandbox.io/p/sandbox/github/Gyeonghun-Park/typing-animation/tree/master)서 확인 할수 있습니다. 최종 버전의 코드는 아래와 같습니다:

```tsx
import { motion, useInView, useAnimation, Variant } from "framer-motion";
import { useEffect, useRef } from "react";

type AnimatedTextProps = {
  text: string | string[];
  el?: keyof JSX.IntrinsicElements;
  className?: string;
  once?: boolean;
  repeatDelay?: number;
  animation?: {
    hidden: Variant;
    visible: Variant;
  };
};

const defaultAnimations = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.1,
    },
  },
};

export const AnimatedText = ({
  text,
  el: Wrapper = "p",
  className,
  once,
  repeatDelay,
  animation = defaultAnimations,
}: AnimatedTextProps) => {
  const controls = useAnimation();
  const textArray = Array.isArray(text) ? text : [text];
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.5, once });

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const show = () => {
      controls.start("visible");
      if (repeatDelay) {
        timeout = setTimeout(async () => {
          await controls.start("hidden");
          controls.start("visible");
        }, repeatDelay);
      }
    };

    if (isInView) {
      show();
    } else {
      controls.start("hidden");
    }

    return () => clearTimeout(timeout);
  }, [isInView]);

  return (
    <Wrapper className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
          hidden: {},
        }}
        aria-hidden
      >
        {textArray.map((line, lineIndex) => (
          <span className="block" key={`${line}-${lineIndex}`}>
            {line.split(" ").map((word, wordIndex) => (
              <span className="inline-block" key={`${word}-${wordIndex}`}>
                {word.split("").map((char, charIndex) => (
                  <motion.span
                    key={`${char}-${charIndex}`}
                    className="inline-block"
                    variants={animation}
                  >
                    {char}
                  </motion.span>
                ))}
                <span className="inline-block">&nbsp;</span>
              </span>
            ))}
          </span>
        ))}
      </motion.span>
    </Wrapper>
  );
};
```
