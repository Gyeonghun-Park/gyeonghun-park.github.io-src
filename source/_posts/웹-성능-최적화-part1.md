---
title: "[웹] 성능 최적화 - part 1"
tags: [Web, Optimization]
toc: true
widgets:
  - type: toc
    position: left
  - type: categories
    position: right
cover: /img/web_opt.png
date: 2022-03-05 18:24:17
categories: [Web, Optimization]
---

</pre>
<!--more-->

<!--more-->

## **웹 성능 최적화의 주요 포인트**

`로딩 성능`

- 화면에 필요한 리소스들을 서버로부터 가지고 오는 구간

`렌더링 성능`

- 리소스를 화면에 표시하는 구간

---

### **로딩 성능**

`이미지 최적화`

- 이미지를 상황에 맞게 사이즈 축소 (썸네일)
- 이미지 CDN을 사용하여 상황에 맞는 크기별로 이미지 로딩
  - ex) https://imgix.com/

`bottleneck 코드 최적화`

- 크롬 개발자 도구의 성능탭을 사용하여 병목이 되는 구간의 컴포넌트 코드 최적화
- 함수 성능 개선

`bundle 파일 최적화`

- 현재 화면에 필요한 코드들만 로딩하도록 Code Splitting 및 Lazy Loading ([코드 분할](https://ko.reactjs.org/docs/code-splitting.html))
  - 중복되는 코드 없이 적절한 타이밍에 로드
- bundle 분석은 [bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 사용

`텍스트 압축`

- 리소스(HTML, Javascript, CSS)들을 서버에서 압축하여 리소스 다운로드 성능을 개선
- 서버 또는 CDN에서 제공하는 기능을 사용하여 압축 ([CloudFront](https://docs.aws.amazon.com/ko_kr/AmazonCloudFront/latest/DeveloperGuide/ServingCompressedFiles.html), [NGINX](https://docs.nginx.com/nginx/admin-guide/web-server/compression/))

---

### **렌더링 성능**

`브라우저 렌더링`

- 브라우저에서 초당 60 프레임(60FPS)이상 화면을 그리지 못하면 화면이 버벅이는 쟁크 현상이 발생한다. ([자바스크립트 최적화](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/javascript-startup-optimization?hl=ko))
- 브라우저 렌더링 과정

![Rendering Process](/img/웹-성능-최적화-part1/1.png?style=centerme)

1. HTML, CSS를 각각 트리구조의 DOM, CSSOM의 데이터 모델로 변환
2. DOM, CSSOM을 화면 렌더링을 위한 Render Tree 모델로 조합
3. Layout - 각 요소들의 화면에 표시될 위치와 크기를 계산 (Reflow)
4. Paint - 각 요소에 필요한 색상 정보를 표현 (Repaint)
5. Composition - 여러개로 만들어진 Layer를 합성

> [자바스크립트 최적화](https://m.blog.naver.com/PostView.naver?blogId=pjt3591oo&logNo=222495673377&targetKeyword=&targetRecommendationCode=1)
>
> [브라우저는 어떻게 동작하는가](https://d2.naver.com/helloworld/59361)
>
> [브라우저 렌더링 원리 그리고 가상돔](https://m.blog.naver.com/PostView.naver?blogId=pjt3591oo&logNo=222495673377&targetKeyword=&targetRecommendationCode=1)

- 크기나 위치를 변경하는 Layout(Reflow)이 발생하면 Paint 작업을 다시 수행한다.
- GPU가 관여할 수 있는 속성(transform, opacity)을 변경하면 Layout, Paint 동작이 생략된다.

> CSS Trigger 사이트를 참고하여 렌더링 비용을 고려하여 작업하는것이 좋다. (https://csstriggers.com/)

`컴포넌트 Lazy Loading`

> (https://benestudio.co/how-to-lazy-load-your-react-components/)

React.lazy

```js
// without lazy
import OtherComponent from "./OtherComponent";

// with lazy
const OtherComponent = React.lazy(() => import("./OtherComponent"));
```

</pre>

Suspense

```js
//using suspense
import React, { Suspense } from "react";
const OtherComponent = React.lazy(() => import("./OtherComponent"));

const MyComponent = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading ... </div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
};
```

</pre>

Lazy Loading Routes

```js
const Home = lazy(() => import("./Home"));

const App = () => {
  return (
    // ...
    <Route exact component={Home} path="/" />
  );
};
```

</pre>

예제

```js
import React, { Suspense, lazy } from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const SelectCity = lazy(() => import("./pages/SelectCity"));
const CityPage = lazy(() => import("./pages/City"));

const App = () => {
  return (
    <Router>
      <Suspense fallback={<h1>Loading...</h1>}>
        <Switch>
          <Route exact component={Home} path="/" />
          <Route component={SelectCity} path="/select-city" />
          <Route component={CityPage} path="/:city" />
        </Switch>
      </Suspense>
    </Router>
  );
};

export default App;
```

</pre>

컴포넌트 Preloading

- 특정 시점에 컴포넌트를 로딩하도록 하는 방법 (마우스 오버시, 부모 컴포넌트 로딩 완료 후)

```js
function lazyWithPreload(importFunction) {
  const Component = React.lazy(importFunction);
  Component.preload = importFunction;
  return Component;
}

const LazyImageModal = lazyWithPreLoad(() => import("./components/ImageModal"));

const App = () => {
  // ...
  useEffect(() => {
    LazyImageModal.preload();
  }, []);
};
```

</pre>

이미지 Preloading

- 이미지를 특정시점에 로딩하여 캐싱되도록 하고 캐싱된 이미지가 사용되도록 하는 방법

```js
const App = () => {
  useEffect(() => {
    const img = new Image();
    img.scr = "이미지 주소";
  }, []);
};
```

</pre>

Promise를 사용한 이미지 Preloading

```js
const cacheImages = async (scrArray) => {
  const promises = await srcArray.map((src) => {
    return new Promise(function (resolve, reject) {
      const img = new Image();
      img.src = src;
      img.onload = resolve();
      img.onerror = reject();
    });
  });

  await Promise.all(promises);
};

const App = () => {
  useEffect(() => {
    const imgs = ["image1.png", "image2.png", "image3.png"];
    cacheImages(imgs);
  }, []);
};
```
