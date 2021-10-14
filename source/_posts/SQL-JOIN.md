---
title: SQL) JOIN이란?
tags: [SQL, JOIN]
toc: true
widgets:
  - type: toc
    position: left
  - type: categories
    position: right
cover: /img/mysql-joins.png
date: 2021-10-14 21:53:38
categories: SQL
---

</pre>
<!--more-->

## 조인의 종류

</pre>

> ### **JOIN**
>
> 2개 이상의 테이블에 있는 정보 중 사용자가 필요한 집합에 맞게 가상의 테이블처럼 만들어서 결과를 보여주는 것이다.

| 종류            | 설명                                                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| INNER JOIN      | 특정 컬럼을 기준으로 정확히 매칭된 집합을 출력한다.                                                                            |
| OUTER JOIN      | 특정 컬럼을 기준으로 매칭된 집합을 출력하지만 한쪽의 집합은 모두 출력하고 다른 한쪽의 집합은 매칭되는 컬럼의 값 만을 출력한다. |
| SELF JOIN       | 동일한 테이블 끼리 의 특정 컬럼을 기준으로 매칭되는 집합을 출력한다.                                                           |
| SEFULL JOIN     | INNER, LEFT OUTER, RIGHT OUTER 조인 집합을 모두 출력한다.                                                                      |
| FULL OUTER JOIN | INNER, LEFT OUTER, RIGHT OUTER 조인 집합을 모두 출력한다.                                                                      |
| CROSS JOIN      | Cartesian Product이라고도 하며 조인되는 두 테이블에서 곱집합을 반환한다.                                                       |
| NATURAL JOIN    | 특정 테이블의 같은 이름을 가진 컬럼 간의 조인집합을 출력한다.                                                                  |

---

</pre>

각 JOIN들의 결과를 보기위해 예제용 테이블과 데이터들을 만들어보자.

```SQL 연습용 테이블
CREATE TABLE BASKET_A
(
  ID INT PRIMARY KEY
  , FRUIT VARCHAR (100) NOT NULL
);
CREATE TABLE BASKET_B
(
  ID INT PRIMARY KEY
  , FRUIT VARCHAR (100) NOT NULL
);
```

```SQL 연습용 데이터
INSERT INTO BASKET_A
(ID, FRUIT)
VALUES
(1, 'Apple'),
(2, 'Orange'),
(3, 'Banana'),
(4, 'Cucumber')
;
COMMIT;
INSERT INTO BASKET_B
(ID, FRUIT)
VALUES
(1, 'Orange'),
(2, 'Apple'),
(3, 'Watermelon'),
(4, 'Pear')
;
COMMIT;
```

```SQL Query1
SELECT * FROM BASKET_A;

--Result
id  fruit
1   Apple
2   Orange
3   Banana
4   Cucumber
```

```SQL Query2
SELECT * FROM BASKET_A;

--Result
id  fruit
1   Orange
2   Apple
3   Watermelon
4   Pear
```

## INNER JOIN

> ### **INNER JOIN**
>
> 특정 컬럼을 기준으로 정확히 매칭된 집합을 출력한다. INNER JOIN은 대표적인 JOIN의 종류이다.

BASKET_A 테이블과 BASKET_B 테이블을 FRUIT 컬럼 기준으로 조인한다.

```SQL INNER JOIN
SELECT
  A.ID ID_A
  , A.FRUIT FRUIT_A
  , B.ID ID_B
  , B.FRUIT FRUIT_B
FROM BASKET_A A
INNER JOIN BASKET_B B
ON A.FRUIT = B.FRUIT;

--Result
id_a  fruit_a   id_b  fruit_b
1     Apple     2     Apple
2     Orange    1     Orange
```

![INNER JOIN Diagram](/img/inner.png?style=centerme)

## OUTER JOIN

> ### **OUTER JOIN**
>
> 특정 컬럼을 기준으로 정확히 매칭된 집합을 출력한다. INNER JOIN은 대표적인 JOIN의 종류이다.

<!--more-->
