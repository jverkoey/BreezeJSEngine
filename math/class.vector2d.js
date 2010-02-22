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

Breeze.Math.Vector2D = function(x, y) {
  this.x = x || 0;
  this.y = y || 0;
};

Breeze.Math.Vector2D.prototype = {

  plus : function(vector) {
    return new Breeze.Math.Vector2D(this.x + vector.x, this.y + vector.y);
  },

  minus : function(vector) {
    return new Breeze.Math.Vector2D(this.x - vector.x, this.y - vector.y);
  },

  times : function(magnitude) {
    return new Breeze.Math.Vector2D(this.x * magnitude, this.y * magnitude);
  },

  dividedBy : function(magnitude) {
    return new Breeze.Math.Vector2D(this.x / magnitude, this.y / magnitude);
  },

  lengthSquared : function() {
    return this.dot(this);
  },

  length : function() {
    return Math.sqrt(this.lengthSquared());
  },

  normal : function() {
    var length = this.length();
    return new Breeze.Math.Vector2D(this.x / length, this.y / length);
  },

  dot : function(vector) {
    return this.x * vector.x + this.y * vector.y;
  },

  cross : function(vector) {
    return this.x * vector.x - this.y * vector.y;
  },

  perp : function(vector) {
    return new Breeze.Math.Vector2D(-this.y, this.x);
  },

  interpTo : function(vector, t) {
    return this.multiply(1 - t) + vector.multiply(t);
  }

};
