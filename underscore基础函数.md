1、optimizeCb

~~~js
var optimizeCb = function(func, context, argCount) {
  if (context === void 0) return func;
  switch (argCount == null ? 3 : argCount) {
    case 1: return function(value) {
      return func.call(context, value);
    };
    case 2: return function(value, other) {
      return func.call(context, value, other);
    };
    case 3: return function(value, index, collection) {
      return func.call(context, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(context, accumulator, value, index, collection);
    };
  }
  return function() {
    return func.apply(context, arguments);
  };
};
~~~

给func函数替换this的指向，同时根据argCount的值决定传入的参数个数。默认不传或为null时，接受3个参数。

其实函数可以将switch分支去掉，简写为

~~~js
var optimizeCb = function(func, context, argCount) {
  if (context === void 0) return func;
  return function() {
    return func.apply(context, arguments);
  };
};
~~~

只是call函数执行速度比apply快很多，apply 在运行前要对作为参数的数组进行一系列检验和深拷贝，call 则没有这些步骤。



**_.identity**

~~~js
_.identity = function(value) {
  return value;
};
~~~

直接返回传入的参数，看起来没有用，其实源码中有多处这个迭代函数，简写是为了节省代码。

**_.random**

```js
_.random = function(min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }
  return min + Math.floor(Math.random() * (max - min + 1));
};
```

返回一个[min, max]范围内任意整数

**escapeMap**

```js
var escapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  // 以上四个为最常用的字符实体
  // 也是仅有的可以在所有环境下使用的实体字符（其他应该用「实体数字」，如下）
  // 浏览器也许并不支持所有实体名称（对实体数字的支持却很好）
  "'": '&#x27;',
  '`': '&#x60;'
};
```

用于html转译