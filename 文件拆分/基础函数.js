// Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  // underscore 内部方法
  // 根据 this 指向（context 参数）
  // 以及 argCount 参数
  // 二次操作返回一些回调、迭代方法
  var optimizeCb = function(func, context, argCount) {
    // 如果没有指定 this 指向，则返回原函数
    if (context === void 0)
      return func;

    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };

      // 如果有指定 this，但没有传入 argCount 参数
      // 则执行以下 case
      // _.each、_.map
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };

      // _.reduce、_.reduceRight
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }

    // 其实不用上面的 switch-case 语句
    // 直接执行下面的 return 函数就行了
    // 不这样做的原因是 call 比 apply 快很多
    // .apply 在运行前要对作为参数的数组进行一系列检验和深拷贝，.call 则没有这些步骤
    // 具体可以参考：
    // https://segmentfault.com/q/1010000007894513
    // http://www.ecma-international.org/ecma-262/5.1/#sec-15.3.4.3
    // http://www.ecma-international.org/ecma-262/5.1/#sec-15.3.4.4
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };

  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  // 有三个方法用到了这个内部函数
  // _.extend & _.extendOwn & _.defaults
  // _.extend = createAssigner(_.allKeys);
  // _.extendOwn = _.assign = createAssigner(_.keys);
  // _.defaults = createAssigner(_.allKeys, true);
  var createAssigner = function(keysFunc, undefinedOnly) {
    // 返回函数
    // 经典闭包（undefinedOnly 参数在返回的函数中被引用）
    // 返回的函数参数个数 >= 1
    // 将第二个开始的对象参数的键值对 "继承" 给第一个参数
    return function(obj) {
      var length = arguments.length;
      // 只传入了一个参数（或者 0 个？）
      // 或者传入的第一个参数是 null
      if (length < 2 || obj == null) return obj;

      // 枚举第一个参数除外的对象参数
      // 即 arguments[1], arguments[2] ...
      for (var index = 1; index < length; index++) {
        // source 即为对象参数
        var source = arguments[index],
            // 提取对象参数的 keys 值
            // keysFunc 参数表示 _.keys
            // 或者 _.allKeys
            keys = keysFunc(source),
            l = keys.length;

        // 遍历该对象的键值对
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          // _.extend 和 _.extendOwn 方法
          // 没有传入 undefinedOnly 参数，即 !undefinedOnly 为 true
          // 即肯定会执行 obj[key] = source[key]
          // 后面对象的键值对直接覆盖 obj
          // ==========================================
          // _.defaults 方法，undefinedOnly 参数为 true
          // 即 !undefinedOnly 为 false
          // 那么当且仅当 obj[key] 为 undefined 时才覆盖
          // 即如果有相同的 key 值，取最早出现的 value 值
          // *defaults 中有相同 key 的也是一样取首次出现的
          if (!undefinedOnly || obj[key] === void 0)
            obj[key] = source[key];
        }
      }

      // 返回已经继承后面对象参数属性的第一个参数对象
      return obj;
    };
  };