虽然underscore是函数式编程的代言词，但是underscore内部也实现面向对象的语法。我们来看看underscore内部是怎样实现的呢？

先看看下面这个函数：

~~~js
// `_` 其实是一个构造函数
// 支持无 new 调用的构造函数（思考 jQuery 的无 new 调用）
// 将传入的参数（实际要操作的数据）赋值给 this._wrapped 属性
// OOP 调用时，_ 相当于一个构造函数
// each 等方法都在该构造函数的原型链上
// _([1, 2, 3]).each(alert)
// _([1, 2, 3]) 相当于无 new 构造了一个新的对象
// 调用了该对象的 each 方法，该方法在该对象构造函数的原型链上
var _ = function(obj) {
  // 以下均针对 OOP 形式的调用
  // 如果是非 OOP 形式的调用，不会进入该函数内部

  // 如果 obj 已经是 `_` 函数的实例，则直接返回 obj
  if (obj instanceof _)
    return obj;

  // 如果不是 `_` 函数的实例
  // 则调用 new 运算符，返回实例化的对象
  if (!(this instanceof _))
    return new _(obj);

  // 将 obj 赋值给 this._wrapped 属性
  this._wrapped = obj;
};
~~~

underscore通过 \_() 函数将一个对象转换为 \_ 的实例，underscore的实例化过程采用了无new调用。对于无new调用构造函数，可以看看jquery的实现。[传送门](http://www.jb51.net/article/89701.htm)

对于\_()函数，当传入的参数是一个普通对象，则会调用new \_()方法实例化，实例化过程中，该函数又被调用，这时会绕过前两个拦截，执行this._wrapped = obj, 此时就将obj的值挂载到该实例的 \_wrapped属性上了，方便后续操作。

~~~js
_.mixin = function(obj) {
  // 遍历 obj 的 key，将方法挂载到 Underscore 上
  // 其实是将方法浅拷贝到 _.prototype 上
  _.each(_.functions(obj), function(name) {
    // 直接把方法挂载到 _[name] 上
    // 调用类似 _.myFunc([1, 2, 3], ..)
    var func = _[name] = obj[name];

    // 浅拷贝
    // 将 name 方法挂载到 _ 对象的原型链上，使之能 OOP 调用
    _.prototype[name] = function() {
      // 第一个参数
      var args = [this._wrapped];

      // arguments 为 name 方法需要的其他参数
      push.apply(args, arguments);
      // 执行 func 方法
      // 支持链式操作
      return result(this, func.apply(_, args));
    };
  });
};
// 调用mixin函数
_.mixin(_);
~~~

~~~js
_.functions = _.methods = function(obj) {
  // 返回的数组
  var names = [];

  // if IE < 9
  // 且对象重写了 `nonEnumerableProps` 数组中的某些方法
  // 那么这些方法名是不会被返回的
  // 可见放弃了 IE < 9 可能对 `toString` 等方法的重写支持
  for (var key in obj) {
    // 如果某个 key 对应的 value 值类型是函数
    // 则将这个 key 值存入数组
    if (_.isFunction(obj[key])) names.push(key);
  }

  // 返回排序后的数组
  return names.sort();
};
~~~

