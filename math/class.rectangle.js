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
 * The HTML5 canvas operates with (0, 0) being in the top left corner, so bear that in mind.
 */
Breeze.Math.Rectangle = function(left, top, right, bottom) {
  this.left   = left || 0;
  this.top    = top || 0;
  this.right  = right || 0;
  this.bottom = bottom || 0;
};

Breeze.Math.Rectangle.prototype = {

  /**
   * @param point  {Breeze.Math.Vector2D}  The point to bound.
   * @return A new Vector2D bounded within this rectangle.
   */
  boundedPoint : function(point) {
    return new Breeze.Math.Vector2D(
      Breeze.Math.bound(point.x, this.left, this.right),
      Breeze.Math.bound(point.y, this.top, this.bottom));
  },

  /**
   * @param point  {Breeze.Math.Vector2D}  The point to bound.
   * @return A new Vector2D bounded within this rectangle.
   */
  containsPoint : function(point) {
    return point.x >= this.left && point.x < this.right &&
           point.y >= this.top && point.y < this.bottom;
  }

};
