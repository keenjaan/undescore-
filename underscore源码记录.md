js中有7种数据类型，可以分为两类：原始类型、对象类型：

基础类型(原始值)：

~~~JS
Undefined、 Null、 String、 Number、 Boolean、 Symbol (es6新出的，本文不讨论这种类型)
~~~

复杂类型(对象值)：

~~~
object
~~~

js中一个难点就是js隐形转换，因为js在一些操作符下其类型会做一些变化，所以js灵活，同时造成易出错，并且难以理解。下面就关于隐形转换讲一讲。

涉及隐形转化最多的两个运算符 + 和 ==。

+运算符即可数字相加，也可以字符串相加。所以转换时很麻烦。== 不同于===，故也存在隐式转换。- * / 这些运算符只会针对number类型，故转换的结果只能是转换成number类型。

既然要隐式转换，那到底怎么转换呢，应该有一套转换规则，才能追踪最终转换成什么了。

隐式转换中主要涉及到三种转换：

1、将值转为原始值，ToPrimitive()。

2、将值转为数字，ToNumber()。

3、将值转为字符串，ToString()。



**通过ToPrimitive将值转换为原始值**

js引擎内部的抽象操作ToPrimitive有着这样的签名：

ToPrimitive(input, PreferredType?)

input是要转换的值，PreferredType是可选参数，可以是Number或String类型。他只是一个转换标志，转化后的结果并不一定是这个参数所值的类型，但是转换结果一定是一个原始值（或者报错）。

如果PreferredType被标记为Number，则会进行下面的操作流程来转换输入的值。

~~~ js
1、如果输入的值已经是一个原始值，则直接返回它
2、否则，如果输入的值是一个对象，则调用该对象的valueOf()方法，如果valueOf()方法的返回值是一个原始值，则返回这个原始值。
3、否则，调用这个对象的toString()方法，如果toString()方法返回的是一个原始值，则返回这个原始值。
4、否则，抛出TypeError异常。
~~~

如果PreferredType被标记为String，则会进行下面的操作流程来转换输入的值。

```js
1、如果输入的值已经是一个原始值，则直接返回它
2、否则，调用这个对象的toString()方法，如果toString()方法返回的是一个原始值，则返回这个原始值。
3、否则，如果输入的值是一个对象，则调用该对象的valueOf()方法，如果valueOf()方法的返回值是一个原始值，则返回这个原始值。
4、否则，抛出TypeError异常。
```

既然PreferredType是可选参数，那么如果没有这个参数时，怎么转换呢？PreferredType的值会按照这样的规则来自动设置：

~~~js
1、该对象为Date类型，则PreferredType被设置为String
2、否则，PreferredType被设置为Number
~~~

上面主要提及到了valueOf方法和toString方法，那这两个方法在对象里是否一定存在呢？答案是肯定的。在控制台输出Object.prototype，你会发现其中就有valueOf和toString方法，而Object.prototype是所有对象原型链顶层原型，所有对象都会继承该原型的方法，故任何对象都会有valueOf和toString方法。

先看看对象的valueOf函数，其转换结果是什么？对于js的常见内置对象：`Date, Array, Math, Number, Boolean, String, Array, RegExp, Function`。

1、除了Number、Boolean、String这三种构造函数生成的基础值的对象形式，通过valueOf转换后会变成相应的原始值。如：

~~~js
var num = new Number('123');
num.valueOf(); // 123

var str = new String('12df');
str.valueOf(); // '12df'

var bool = new Boolean('fd');
bool.valueOf(); // true
~~~

2、Date这种特殊的对象，其原型Date.prototype上内置的valueOf函数将日期转换为日期的毫秒的形式的数值。

~~~js
var a = new Date();
a.valueOf(); // 1515143895500
~~~

3、除此之外返回的都为this，即对象本身：(没有一一验证，只是本人认为的，有问题欢迎告知)

~~~js
var a = new Array();
a.valueOf() === a; // true

var b = new Object({});
b.valueOf() === b; // true
~~~

再来看看toString函数，其转换结果是什么？对于js的常见内置对象：`Date, Array, Math, Number, Boolean, String, Array, RegExp, Function`。

1、除了Number、Boolean、String、Array、Date、RegExp、Function这几种构造函数生成的对象，通过toString转换后会变成相应的字符串的形式，因为这些构造函数上封装了自己的toString方法。如：

```js
Number.prototype.hasOwnProperty('toString'); // true
Boolean.prototype.hasOwnProperty('toString'); // true
String.prototype.hasOwnProperty('toString'); // true
Array.prototype.hasOwnProperty('toString'); // true
Date.prototype.hasOwnProperty('toString'); // true
RegExp.prototype.hasOwnProperty('toString'); // true
Function.prototype.hasOwnProperty('toString'); // true

var num = new Number('123sd');
num.toString(); // 'NaN'

var str = new String('12df');
str.toString(); // '12df'

var bool = new Boolean('fd');
bool.toString(); // 'true'

var arr = new Array(1,2);
arr.toString(); // '1,2'

var d = new Date();
d.toString(); // "Fri Jan 05 2018 17:46:12 GMT+0800 (中国标准时间)"

var func = function () {}
func.toString(); // "function () {}"
```

除此之外，对象返回的都是该对象的类型，(没有一一验证，只是本人认为的，有问题欢迎告知)，都是继承的Object.prototype.toString方法。

~~~js
var obj = new Object({});
obj.toString(); // "[object Object]"

Math.toString(); // "[object Math]"
~~~

从上面valueOf和toString两个函数对对象的转换可以看出为什么对于ToPrimitive(input, PreferredType?)，PreferredType没有设定的时候，除了Date类型，PreferredType被设置为String，其它的会设置成Number。



**通过ToNumber将值转换为数字**

根据参数类型进行下面转换：

| 参数        | 结果                                       |
| --------- | ---------------------------------------- |
| undefined | NaN                                      |
| null      | +0                                       |
| 布尔值       | true转换1，false转换为+0                       |
| 数字        | 无须转换                                     |
| 字符串       | 有字符串解析为数字，例如：‘324’转换为324                 |
| 对象(obj)   | 先进行 ToPrimitive(obj, Number)转换得到原始值，在进行ToNumber转换为数字 |

**通过ToString将值转换为字符串**

根据参数类型进行下面转换：

| 参数        | 结果                                       |
| --------- | ---------------------------------------- |
| undefined | 'undefined'                              |
| null      | 'null'                                   |
| 布尔值       | 转换为'true' 或 'false'                      |
| 数字        | 数字转换字符串，比如：1.765转为'1.765'                |
| 字符串       | 无须转换                                     |
| 对象(obj)   | 先进行 ToPrimitive(obj, String)转换得到原始值，在进行ToString转换为字符串 |





typeof、Object.prototype.toString.call

https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/typeof

[js中的内置对象](http://www.cnblogs.com/liuluteresa/p/6413988.html)

