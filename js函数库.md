~~~js
// 数据取整

function toFixed(num, value) {
  if (typeof num !== 'number') {
    return new TypeError('parm is not a number');
  }
  if (isNaN(num)) {
    return new TypeError('parm can\'t be NaN');
  }
  if (num < 0) {
    return new TypeError('parm must be eaual or greater than 0')
  }
  var result = parseInt(num);
  return parseInt(value * Math.pow(10, result) + 0.5) / Math.pow(10, result);
}
~~~

