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

/**
 * Welcome to Breeze.
 *
 * This library was built as a sibling to jQuery 1.4.2, but doesn't strictly depend on it.
 *
 * Created by: Jeff Verkoeyen (jverkoey@gmail.com || @featherless)
 *
 * Last time this library was dabbled with: February 20, 2010
 *
 * This is the root file required to get working with Breeze.
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

/**
 * Prototype-based Object extensions. By rolling this ourself, we can avoid a dependency upon
 * jQuery or Prototype.
 */
Object.extend = function(destination, source) {
  for (var property in source) {
    destination[property] = source[property];
  }
  return destination;
};

Object.inherit = function(subClass, superClass) {
  function inheritance() {}
  inheritance.prototype = superClass.prototype;

  subClass.prototype = new inheritance();
  subClass.prototype.constructor = subClass;
  subClass.baseConstructor = superClass;
  subClass.superClass = superClass.prototype;
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
