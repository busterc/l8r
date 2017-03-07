(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.L8r = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}]},{},[1])(1)
});