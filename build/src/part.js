var $__toObject = function(value) {
  if (value == null) throw TypeError();
  return Object(value);
}, $__spread = function() {
  var rv = [], k = 0;
  for (var i = 0; i < arguments.length; i++) {
    var value = $__toObject(arguments[i]);
    for (var j = 0; j < value.length; j++) {
      rv[k++] = value[j];
    }
  }
  return rv;
};
(function(GLOBAL, $) {
  $.papply = function(fn, receiver) {
    return function part__() {
      for (var args1 = [], $__0 = 0; $__0 < arguments.length; $__0++) args1[$__0] = arguments[$__0];
      return function part_() {
        for (var args2 = [], $__1 = 0; $__1 < arguments.length; $__1++) args2[$__1] = arguments[$__1];
        return fn.apply(receiver, $__spread(args1, args2));
      };
    };
  };
  $._create = function(fn) {
    return function _part(receiver) {
      for (var args1 = [], $__1 = 1; $__1 < arguments.length; $__1++) args1[$__1 - 1] = arguments[$__1];
      return function part_() {
        for (var args2 = [], $__0 = 0; $__0 < arguments.length; $__0++) args2[$__0] = arguments[$__0];
        return fn.apply(receiver, $__spread(args1, args2));
      };
    };
  };
  $.create_ = function(fn) {
    return function part_() {
      for (var args1 = [], $__0 = 0; $__0 < arguments.length; $__0++) args1[$__0] = arguments[$__0];
      return function _part(receiver) {
        for (var args2 = [], $__1 = 1; $__1 < arguments.length; $__1++) args2[$__1 - 1] = arguments[$__1];
        return fn.apply(receiver, $__spread(args1, args2));
      };
    };
  };
  $.augment = function(name, fn) {
    this["_" + name] = $._create(fn);
    this[name + "_"] = $.create_(fn);
  };
  $.borrow = function(source, name) {
    $.augment.call(this, name, source[name]);
  };
  $.augment("augment", $.augment);
  $.augment("borrow", $.borrow);
  if (typeof module === "undefined") {
    GLOBAL._part_ = $;
  } else {
    module.exports = $;
  }
}(this, {}));
