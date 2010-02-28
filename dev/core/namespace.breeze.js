/**
 * Copyright 2010 Jeff Verkoeyen
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

goog.provide('Breeze');

goog.require('goog.math.Matrix');

/**
 * Welcome to Breeze.
 *
 * This library was built with the following dependencies:
 *  - modernizr 1.1
 *
 * Created by: Jeff Verkoeyen (jverkoey@gmail.com || @featherless)
 *             February 20, 2010
 *
 * Last time this library was dabbled with: February 28, 2010
 *
 * This is the root file required to create the Breeze namespace.
 */
var Breeze = {
  arrg : function (iterable) {
    if (!iterable) return [];
    if (iterable.toArray) return iterable.toArray();
    var length = iterable.length || 0, results = new Array(length);
    while (length--) results[length] = iterable[length];
    return results;
  }
};

Breeze.Util = {};

/**
 * Create an array filled with the given object.
 *
 * @param {number} numberOfItems
 * @param {Object=} opt_value     Default: 0
 * @return {Array.<Object>}
 */
Breeze.Util.filledArray = function(numberOfItems, opt_value) {
  opt_value = opt_value || 0;
  var array = [];
  for (var ix = 0; ix < numberOfItems; ++ix) {
    array.push(opt_value);
  }
  return array;
};

/**
 * Prototype-based Object extensions.
 */
Object.extend = function(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
};

Object.extend(Function.prototype, {
  isUndefined: function(object) {
    return typeof object == "undefined";
  },

  /**
   * Set a method invocation's "this" scope.
   *
   * Example: When passing a callback.
   *          callback : myobject.onCallback.bind(myobject)
   *          This will ensure that within the onCallback method, "this" refers to "myobject".
   */
  bind: function() {
    if (arguments.length < 2 && Object.isUndefined(arguments[0])) return this;
    var __method = this, args = Breeze.arrg(arguments), object = args.shift();
    return function() {
      return __method.apply(object, args.concat(Breeze.arrg(arguments)));
    }
  }
});
