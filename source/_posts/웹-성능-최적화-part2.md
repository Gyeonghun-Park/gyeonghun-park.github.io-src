---
title: "[웹] 성능 최적화 - part 2"
tags: [Web, Optimization]
toc: true
widgets:
  - type: toc
    position: left
  - type: categories
    position: right
cover: /img/web_opt.png
date: 2022-03-11 15:44:37
categories: [Web, Optimization]
---

</pre>
<!--more-->

<!--more-->

## **이미지 지연로딩**

Interscetion Observer API를 사용하여 타켓 요소가 Viewport에 표시될 때 이미지를 로딩하여 불필요한 로딩을 줄일수 있다.

```js
useEffect(() => {
  const options = {};
  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.src = entry.target.dataset.src;
        observer.unobserve(entry.target);
      }
    });
  };
  const observer = new IntersectionObserver(callback, options);

  observer.observe(imgRef.current);
}, []);

return <img data-src={props.image} ref={imgRef} />;
```

LazyImage 컴포넌트

```js
import React, { useEffect, useRef } from "react";

const LazyImage = ({ observer, src, alt }) => {
  const imageEl = useRef(null);

  useEffect(() => {
    const { current } = imageEl;

    if (observer !== null) {
      observer.observe(current);
    }

    return () => {
      observer.unobserve(current);
    };
  }, [observer]);

  return <img ref={imageEl} data-src={src} alt={alt} />;
};
export default LazyImage;
```

---

## **이미지 사이즈 최적화**

- [WebP](https://kr.bandisoft.com/honeycam/webp/what-is-webp/) 포맷 이미지를 사용하여 이미지 로딩 속도 개선
- WebP(Web Picture)는 GIF, JPG, PNG 이미지 포맷을 대치하기 위해 개발되었다.
- WebP를 사용하면 JPG는 기존 대비 25~34%, PNG는 비손실의 경우 평균 26%(손실 방식의 경우 60~70%) 정도 기존 파일 대비 작아진다고 한다.
- WebP는 HTML5 표준의 img 태그에서 사용할 수 있으며 대부분의 모던 브라우저에서 지원된다.
- 이미지 변환 사이트를 통해 이미지를 변환하고 사용한다.(https://squoosh.app/)

picture 태그를 사용하여 WebP 미지원 브라우저에 이미지 대체 ([Use WebP images](https://web.dev/i18n/en/serve-images-webp/))

```html
<picture>
  <source type="image/webp" srcset="pic.webp" />
  <img src="pic.jpg" alt="test" />
</picture>
```

---

## **동영상 사이즈 최적화**

- WebM 포맷 동영상을 사용하여 동영상 로딩 속도 개선
- WebM은 웹의 트래픽 감소를 주 목적으로 구글에서 개발해 오픈소스로 개발/운영되는 형식이다.
- 압축률이 높고 파일의 크기가 작아 웹기반의 사이트나 애플리케이션에서 전송속도 개선에도 효과적이다.
- WebM은 HTML5 표준의 video 태그에서 사용할 수 있으며 대부분의 모던 브라우저에서 지원된다.
- 동영상 변환 사이트를 통해 동영상을 변환하고 사용한다. (https://www.media.io/)

video 태그를 사용하여 WebM 미지원 브라우저에 동영상 대체 ([Video Tag](https://developer.mozilla.org/ko/docs/Web/HTML/Element/Video))

```html
<video controls width="250">
  <source src="/media/cc0-videos/flower.webm" type="video/webm" />
  <source src="/media/cc0-videos/flower.mp4" type="video/mp4" />
  Sorry, your browser doesn't support embedded videos.
</video>
```

---

## **폰트 최적화**

- 폰트 적용 시점 컨트롤 하기
- 폰트 사이즈 줄이기

> [웹 폰트 사용과 최적화의 최근 동향](https://d2.naver.com/helloworld/4969726) > [웹폰트 최적화 하기](https://velog.io/@vnthf/%EC%9B%B9%ED%8F%B0%ED%8A%B8-%EC%B5%9C%EC%A0%81%ED%99%94-%ED%95%98%EA%B8%B0#%EC%9B%B9%ED%8F%B0%ED%8A%B8%EB%9E%80)

### `폰트 적용 시점 컨트롤 하기`

- 브라우저는 웹페이지 렌더링시 웹폰트가 다운로드되지 않으면 텍스트 렌더링을 차단한다.
  - `FOIT(Flash Of Inivisible Text)`: 최초 텍스트가 보이지 않는 상태에서 폰트가 다운로드되면 텍스트가 표시되는 방식
  - `FOUT(Flash Of Unstyled Text)`: 폴백 폰트가 표시되고 폰트가 다운로드되면 텍스트가 표시되는 방식
- CSS `font-display` 속성으로 브라우저 렌더링 방식을 변경할 수 있다.

```css
font-display: auto; // 브라우저에 의해 결정
font-display: swap; // 폴백 폰트가 표시되고 로딩 완료되면 적용
font-display: block; // 폰트가 표시되지 않고 로딩 완료되면 적용 (최대 3초)
font-display: fallback; // ~100ms 까지 폰트 표시 안됨, ~3초 까지 폴백 폰트 표시 후 로딩 완료되면 적용
font-display: optional; // ~100ms 까지 폰트 표시 안됨, 폴백 표시 후 로딩 완료시 네트워크 상태에 따라 폴백/웹폰트 적용
```

Font Observer 라이브러리 사용으로 폰트 로딩 표시 시점에 CSS 효과를 적용하여 UX 개선

- [Font Face Observer](https://github.com/bramstein/fontfaceobserver)
- [Font Face Observer React Hook](https://github.com/iamskok/use-font-face-observer)

### `폰트 사이즈 줄이기`

웹폰트 포맷 사용

- WOFF, WOFF2 포맷을 사용하여 폰트 사이즈 축소 (https://transfonter.org/)
- 파일 크기: EOT > TTF/OTF > WOFF > WOFF2

```css
@font-face {
  font-family: "Nanum Gothic";
  font-style: normal;
  font-weight: 400;
  src: url(/static_fonts/NanumGothic-Regular.eot),
    url(/static_fonts/NanumGothic-Regular.woff2) format("woff2"), url(/static_fonts/NanumGothic-Regular.woff)
      format("woff"),
    url(/static_fonts/NanumGothic-Regular.ttf) format("truetype");
}
```

Local 폰트 사용

- 사용자의 로컬환경에 설치된 폰트는 local() 이라는 구문을 사용하여 Local 폰트를 사용

```css
@font-face {
  font-family: MyHelvetica;
  src: local("Helvetica Neue Bold"), local("HelveticaNeue-Bold"),
    url(MgOpenModernaBold.ttf);
  font-weight: bold;
}
```

Subset 사용

- 서브셋 폰트(subset font)는 폰트 파일에서 불필요한 글자를 제거하고 사용할 글자만 사용하는 폰트 적용

Unicode Range 적용

- 유니코드를 사용하여 폰트에서 사용할 특정 문자 범위를 설정하여 필요한 글자만 폰트 적용

data-uri로 변환 (Data-URI로 웹 폰트 사용하기)

- BASE64 encoding으로 폰트를 data-uri로 변환하여 CSS 로드시에 폰트를 로딩하여 속도를 개선

### `Preload를 폰트 로딩 개선`

preload 속성을 사용하여 CSS 파일보다 우선하여 폰트 로딩

```html
<link
  rel="preload"
  href="./nanumGothic.woff2"
  as="font"
  type="font/woff2"
  crossorigin="anonymous"
/>
```

> [preload-webpack-plugin](https://github.com/googlechromelabs/preload-webpack-plugin) <br/> [Preload, Prefetch And Priorities in Chrome](https://medium.com/@koh.yesl/preload-prefetch-and-priorities-in-chrome-15d77326f646)

---

## **캐시 최적화**

서버에서 Response Header의 `Cache-Control` 속성을 컨트롤하여 캐싱을 최적화한다.

> [HTTP caching](https://developer.mozilla.org/ko/docs/Web/HTTP/Caching) <br/> [Cache-Control](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Cache-Control) <br/> [웹 서비스 캐시 똑똑하게 다루기](https://toss.tech/article/smart-web-service-cache) <br/> [chromium disk cache](https://www.chromium.org/developers/design-documents/network-stack/disk-cache/)

### `Cache-control`

- no-cache: 캐시를 사용하기 전에 서버에거 검사 후, 사용 결정
- no-store: 캐시 사용 안함
- public: 모든 환경에서 캐시 사용 가능
- private: 브라우저 환경에서만 캐시 사용, 외부 캐시 서버에서는 사용 불가 (중간 서버에서 사용 안함)
- max-age: 캐시의 유효기간 (60 = 60초), 유효기간 만료후에는 서버에 검사 요청 후에 사용 결정

### `어떻게 리소스 변경을 식별하는가?`

`etag` 속성을 사용하여 리소스 변경을 식별한다.

> ETag HTTP 응답 헤더는 특정 버전의 리소스를 식별하는 식별자입니다. 웹 서버가 내용을 확인하고 변하지 않았으면, 웹 서버로 full 요청을 보내지 않기 때문에, 캐쉬가 더 효율적이게 되고, 대역폭도 아낄 수 있습니다. ([ETag HTTP](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/ETag))

### `리소스 사용 구조`

브라우저는 최초에 HTML 파일을 로딩하고 HTML 구문을 해석하여 JS,CSS 파일과 IMG 파일을 로딩한다.

> [모던 웹 브라우저 들여다보기](https://developers.google.com/web/updates/2018/09/inside-browser-part1)

### `일반적인 사용 방식`

- HTML을 서버에서 검사하고, 다른 리소스는 모든 서버에서 캐싱되도록 하고 유효기간은 최대로 설정한다.
- HTML을 제외한 리소스는 배포시에 새로운 hash값으로 변경된다면 항상 최신으로 유지가 가능하다.

```
HTML: no-cache
CSS, JS, IMG: public, max-age=31536000
```

### `CDN에 캐싱을 유지하고 배포시에 CDN Invalidation을 발생하여 갱신하는 방식`

- s-maxage값으로 중간 서버에 캐싱을 유지하고 max-age=0(=no-cache)로 최신 파일을 확인한다.
- CDN에는 캐싱된 파일이 최대 유효기간으로 설정되어 있기때문에 배포후에 CDN Invalidation으로 최신 파일로 갱신해야 한다.

```
HTML: max-age=0, s-maxage=31536000
CSS, JS, IMG: public, max-age=31536000
```

### `Request Header는 언제 사용되는가?`

HTTP 요청에서 사용되지만 메시지의 컨텐츠와 관련이 없는 패치될 리소스나 클라이언트 자체에 대한 자세한 정보를 포함하는 헤더이다. 해당 요청을 통해 서버에서 클라이언트 요청 사항과 요청 정보를 파악할 수 있다.

- Host : 요청하려는 서버 호스트 이름과 포트번호
- User-agent : 클라이언트 프로그램 정보 ex) Mozilla/4.0, Windows NT5.1
- Referer : 현재 페이지로 연결되는 링크가 있던 이전 웹 페이지의 주소
- Accept : 클라이언트가 처리 가능한 MIME Type 종류 나열
- Accept-charset : 클라이언트가 지원가능한 문자열 인코딩 방식
- Accept-language : 클라이언트가 지원가능한 언어 나열
- Accept-encoding : 클라이언트가 해석가능한 압축 방식 지정
- If-Modified-Since : 여기에 쓰여진 시간 이후로 변경된 리소스 취득. 캐시가 만료되었을 때에만 데이터를 전송하는데 사용
- Authorization : 인증 토큰을 서버로 보낼 때 쓰이는 헤더
- Origin : 서버로 Post 요청을 보낼 때 요청이 어느 주소에서 시작되었는지 나타내는 값. 경로 정보는 포함하지 않고 서버 이름만 포함
- 이 값으로 요청을 보낸 주소와 받는 주소가 다르면 CORS 에러가 난다.
- Cookie : 쿠기 값 key-value로 표현된다. Set-Cookie 헤더와 함께 서버로부터 이전에 전송됐던 저장된 HTTP 쿠키를 포함

### `불필요한 CSS 제거`

- 빌드시점에 사용하지 않는 CSS를 제거하여 CSS 파일 사이즈 최소화한다.
- PurgeCSS를 사용하여 사용하지 않는 CSS를 제거 (https://purgecss.com/)
