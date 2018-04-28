// Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  // 是否是 {}、[] 或者 "" 或者 null、undefined
  _.isEmpty = function(obj) {
    if (obj == null) return true;

    // 如果是数组、类数组、或者字符串
    // 根据 length 属性判断是否为空
    // 后面的条件是为了过滤 isArrayLike 对于 {length: 10} 这样对象的判断 bug？
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;

    // 如果是对象
    // 根据 keys 数量判断是否为 Empty
    return _.keys(obj).length === 0;
  };


  // Is a given value a DOM element?
  // 判断是否为 DOM 元素
  _.isElement = function(obj) {
    // 确保 obj 不是 null, undefined 等假值
    // 并且 obj.nodeType === 1
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  // 判断是否为数组
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  // 判断是否为对象
  // 这里的对象包括 function 和 object
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  // 其他类型判断
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  // _.isArguments 方法在 IE < 9 下的兼容
  // IE < 9 下对 arguments 调用 Object.prototype.toString.call 方法
  // 结果是 => [object Object]
  // 而并非我们期望的 [object Arguments]。
  // so 用是否含有 callee 属性来做兼容
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  // _.isFunction 在 old v8, IE 11 和 Safari 8 下的兼容
  // 觉得这里有点问题
  // 我用的 chrome 49 (显然不是 old v8)
  // 却也进入了这个 if 判断内部
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  // 判断是否是有限的数字
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  // 判断是否是 NaN
  // NaN 是唯一的一个 `自己不等于自己` 的 number 类型
  // 这样写有 BUG
  // _.isNaN(new Number(0)) => true
  // 详见 https://github.com/hanzichi/underscore-analysis/issues/13
  // 最新版本（edge 版）已经修复该 BUG
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  // 判断是否是布尔值
  // 基础类型（true、 false）
  // 以及 new Boolean() 两个方向判断
  // 有点多余了吧？
  // 个人觉得直接用 toString.call(obj) 来判断就可以了
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  // 判断是否是 null
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  // 判断是否是 undefined
  // undefined 能被改写 （IE < 9）
  // undefined 只是全局对象的一个属性
  // 在局部环境能被重新定义
  // 但是「void 0」始终是 undefined
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  // 判断对象中是否有指定 key
  // own properties, not on a prototype
  _.has = function(obj, key) {
    // obj 不能为 null 或者 undefined
    return obj != null && hasOwnProperty.call(obj, key);
  };