---
title: JS로 보는 디자인 패턴
date: 2023-08-01 00:11:09
tags: [디자인 패턴, JS]
---

## 디자인 패턴 종류

### 생성 패턴

- Constructor
- Factory
- Abstract Factory
- Prototype
- Singleton
- Builder

### 구조 패턴

- Adapter
- Composite
- Module
- Decorator
- Facade
- Proxy
- FlyWeight
- Bridge

### 행동 패턴

- Chain of Responsibility
- Responsibility
- Command
- Observer
- Iterator
- Template
- Strategy
- Visitor
- State
- Memento
- Mediator

## 생성 패턴

생성 패턴은 객체를 생성하는 다양한 방법을 제공합니다.

1. 생성자 패턴

생성자 패턴은 기존에 클래스를 제공하지 않았던 자바스크립트가 ES6에서 class 키워드 제공을 통해 향상된 패턴

```ts
// 옛날 스타일
function OldPerson(name, age) {
  this.name = name;
  this.age = age;
  this.getDetails = function () {
    console.log(`[OLD] ${this.name} is ${this.age} years old!`);
  };
}

// 인스턴스 생성
const oldPerson = new OldPerson("John", 20);
oldPerson.say(); // [OLD] Output - “John is 20 years old!”
```

```ts
class NewPerson {
  constructor(name, age) {
    this.name = name;
    this.age = age;
    this.say() = function () {
      console.log(`[NEW] ${this.name} is ${this.age} years old!`);
    };
  }
}

// 인스턴스 생성
const newPerson = new NewPerson("John", 20);
newPerson.say(); // [NEW] Output - “John is 20 years old!”
```
