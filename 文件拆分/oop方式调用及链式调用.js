// Add a "chain" function. Start chaining a wrapped Underscore object.
  // 使支持链式调用
  /**
  // 非 OOP 调用 chain
  _.chain([1, 2, 3])
    .map(function(a) { return a * 2; })
    .reverse().value(); // [6, 4, 2]

  // OOP 调用 chain
  _([1, 2, 3])
    .chain()
    .map(function(a){ return a * 2; })
    .first()
    .value(); // 2
  **/
  _.chain = function(obj) {
    // 无论是否 OOP 调用，都会转为 OOP 形式
    // 并且给新的构造对象添加了一个 _chain 属性
    var instance = _(obj);

    // 标记是否使用链式操作
    instance._chain = true;

    // 返回 OOP 对象
    // 可以看到该 instance 对象除了多了个 _chain 属性
    // 其他的和直接 _(obj) 的结果一样
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // OOP
  // 如果 `_` 被当做方法（构造函数）调用, 则返回一个被包装过的对象
  // 该对象能使用 underscore 的所有方法
  // 并且支持链式调用

  // Helper function to continue chaining intermediate results.
  // 一个帮助方法（Helper function）
  var result = function(instance, obj) {
    // 如果需要链式操作，则对 obj 运行 _.chain 方法，使得可以继续后续的链式操作
    // 如果不需要，直接返回 obj
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  // 可向 underscore 函数库扩展自己的方法
  // obj 参数必须是一个对象（JavaScript 中一切皆对象）
  // 且自己的方法定义在 obj 的属性上
  // 如 obj.myFunc = function() {...}
  // 形如 {myFunc: function(){}}
  // 之后便可使用如下: _.myFunc(..) 或者 OOP _(..).myFunc(..)
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

  // Add all of the Underscore functions to the wrapper object.
  // 将前面定义的 underscore 方法添加给包装过的对象
  // 即添加到 _.prototype 中
  // 使 underscore 支持面向对象形式的调用
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  // 将 Array 原型链上有的方法都添加到 underscore 中
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);

      if ((name === 'shift' || name === 'splice') && obj.length === 0)
        delete obj[0];

      // 支持链式操作
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  // 添加 concat、join、slice 等数组原生方法给 Underscore
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });