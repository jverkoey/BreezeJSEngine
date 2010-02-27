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

goog.require('goog.math.Matrix');

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
 * Interpolate with an ease in.
 * @param {number} t
 * @return {number}
 */
Breeze.Math.easeIn = function(t) {
  return x * x;
};

/**
 * Interpolate with an ease out.
 * @param {number} t
 * @return {number}
 */
Breeze.Math.easeOut = function(t) {
  return 1 - (t - 1) * (t - 1);
};

/**
 * Interpolate with an ease in and out.
 * @param {number} t
 * @return {number}
 */
Breeze.Math.easeInAndOut = function(t) {
  if (t < 0.5) {
    return t * t * 2;   // Identical to (t * 2) * (t * 2) / 2
  } else {
    return 1 - (t - 1) * (t - 1) * 2;
  }
};

/**
 * Create a 4x4 rotation matrix on the given axis.
 * @param {!number} degreesCCW
 * @param {!string} axis
 * @return {goog.math.Matrix}
 */
goog.math.Matrix.createRotation = function(degreesCCW, axis) {
  var ret = goog.math.Matrix.createIdentityMatrix(4);

  var radiansCCW = -goog.math.toRadians(degreesCCW);

  switch( axis )
  {
    case 'X':
    case 'x':
      ret.setValueAt(1, 1, Math.cos(radiansCCW));
      ret.setValueAt(1, 2, Math.sin(radiansCCW));
      ret.setValueAt(2, 1, -Math.sin(radiansCCW));
      ret.setValueAt(2, 2, Math.cos(radiansCCW));
      break;

    case 'Y':
    case 'y':
      ret.setValueAt(0, 0, Math.cos(radiansCCW));
      ret.setValueAt(0, 2, -Math.sin(radiansCCW));
      ret.setValueAt(2, 0, Math.sin(radiansCCW));
      ret.setValueAt(2, 2, Math.cos(radiansCCW));
      break;

    case 'Z':
    case 'z':
      ret.setValueAt(0, 0, Math.cos(radiansCCW));
      ret.setValueAt(0, 1, Math.sin(radiansCCW));
      ret.setValueAt(1, 0, -Math.sin(radiansCCW));
      ret.setValueAt(1, 1, Math.cos(radiansCCW));
      break;
  }

  return ret;
};

/**
 * Clamp a coordinate within this box.
 *
 * @param {!goog.math.Vec2} coord The coordinates to clamp within this box.
 * @return {!goog.math.Vec2} The clamped coordinates.
 */
goog.math.Box.prototype.clamped = function(coord) {
  return new goog.math.Vec2(goog.math.clamp(coord.x, this.left, this.right),
                           goog.math.clamp(coord.y, this.top, this.bottom));
};

/**
 * Multiply this vector by a scalar.
 *
 * @param {!number} b The scalar to multiply by.
 * @return {!goog.math.Vec2} This vector with {@code b} multiplied.
 */
goog.math.Vec2.prototype.times = function(b) {
  return new goog.math.Vec2(this.x * b, this.y * b);
};

/**
 * Subract a vector from this and return the result.
 *
 * @param {!goog.math.Vec2} b The vector to subtract.
 * @return {!goog.math.Vec2} This vector with {@code b} subtracted.
 */
goog.math.Vec2.prototype.minus = function(b) {
  return new goog.math.Vec2(this.x - b.x, this.y - b.y);
};

/**
 * Returns the cross-product of two vectors.
 *
 * @param {!goog.math.Vec2} a The first vector.
 * @param {!goog.math.Vec2} b The second vector.
 * @return {number} The cross-product of the two vectors.
 */
goog.math.Vec2.cross = function(a, b) {
  return a.x * b.y - a.y * b.x;
};
