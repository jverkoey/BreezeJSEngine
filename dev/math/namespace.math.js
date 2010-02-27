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

goog.provide('Breeze.Math');

goog.require('Breeze');

Breeze.Math = {};

/**
 * Chop the remainder off of a number, casting to an integer.
 * @param {number} x
 * @return {number} (int)x
 */
Breeze.Math.chopRemainder = function(x) {
  return parseInt(x, 10);
};


/**
 * Calculate the floating point modulus of x by y.
 * Note: This function isn't incredibly accurate.
 *
 * @param {number} x
 * @param {number} y
 * @return {number} x % y (floating point)
 */
Breeze.Math.modf = function(x, y) {
  var quotient = x / y;
  var remainder = (quotient - Breeze.Math.chopRemainder(quotient)) * y;
  if (remainder < 0) {
    remainder += y;
  }
  return remainder;
};
