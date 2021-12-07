---
title: '[Leetcode] 125. Valid Palindrome'
tags: [Leetcode, 'Coding Interview']
toc: true
widgets:
  - type: toc
    position: left
  - type: categories
    position: right
cover: /img/leetcode.png
date: 2021-12-06 21:32:08
categories: ['Coding Interview', 'String Manipulation']
---

</pre>

<!--more-->

## 문제

![Valid Palindrome Problem](/img/lc_125/lc-125-p.png?style=centerme)

> 주어진 문자열이 팰린드롬인지 확인하라. 대소문자를 구분하지 않으며, 영문자와 숫자만을 대상으로 한다.

## 예제

![Valid Palindrome Example](/img/lc_125/lc-125-e.png?style=centerme)

## 제약

![Valid Palindrome Constraints](/img/lc_125/lc-125-c.png?style=centerme)

## 풀이

Regular expression (정규 표현식)을 사용해 불피요한 문자를 제거하고, Slicing [::-1]을 이용하여
문자열을 뒤집었다.

```Python
def isPalindrome(self, s: str) -> bool:
  s = s.lower()
  # 정규식으로 불필요한 문자 필터링
  s = re.sub('[^a-z0-9]', '', s)

  return s == s[::-1]
```

<!--more-->
