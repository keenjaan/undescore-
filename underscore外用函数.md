[underscore中文文档](http://www.css88.com/doc/underscore/)

undescore中外部调用的基本函数，内部没有其他函数调用它。

**_.noConflict**

~~~js
_.noConflict = function() {
  root._ = previousUnderscore;
  return this;
};
~~~

解决 \_ 符号冲突时，用自己变量来替代underscore的 \_ 符号，如果不调用这个函数，引用这个库前的 \_ 变量或被覆盖掉。（所有的前提是underscore库在 \_ 变量后引用）

**_.constant**

~~~js
_.constant = function(value) {
  return function() {
    return value;
  };
};
~~~

用于包裹一个常量，返回一个函数，该函数总是返回该常量。

**_.noop**

~~~js
_.noop = function(){};
~~~

空函数，节省代码。

**_.propertyOf**

~~~js
_.propertyOf = function(obj) {
  return obj == null ? function(){} : function(key) {
    return obj[key];
  };
};
~~~

用于包裹一个对象，并返回一个函数,这个函数将返回一个提供的属性的值。

**_.now**

~~~js
 _.now = Date.now || function() {
   return new Date().getTime();
 };
~~~

返回当前时间的时间戳（ms）， 与 +new Date功能相似。

**_.uniqueId**

~~~js
var idCounter = 0;
_.uniqueId = function(prefix) {
  var id = ++idCounter + '';
  return prefix ? prefix + id : id;
};
~~~

生成唯一id，如果传入值，则在值尾部拼接1，2....如果不传则为1，2...