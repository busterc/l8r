'use strict';

module.exports = function () {
  var _queue = [];

  function _add(fn) {
    _queue.push(fn);
    return this;
  }

  function _run() {
    var args = [].slice.call(arguments);
    var n = 0;
    var max = _queue.length;
    for (n; n < max; n++) {
      _queue[n].apply(_queue[n], args);
    }
    return this;
  }

  function _apply() {
    var context = arguments[0];
    var args = arguments[1];
    var n = 0;
    var max = _queue.length;
    for (n; n < max; n++) {
      _queue[n].apply(context, args);
    }
    return this;
  }

  return {
    add: _add,
    apply: _apply,
    q: _queue,
    queue: _queue,
    run: _run
  };
};
