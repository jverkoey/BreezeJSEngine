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
 * @param vals array row by row, 16 items
 */
Breeze.Math.Matrix4x4 = function(vals) {
  if ('undefined' == typeof vals) {
    this.vals = [1, 0, 0, 0,
                 0, 1, 0, 0,
                 0, 0, 1, 0,
                 0, 0, 0, 1];
  } else {
    this.vals = vals;
  }
};

Breeze.Math.Matrix4x4.createRotation = function(angleCCW, axis) {
  var ret = new Breeze.Math.Matrix4x4();

  angleCCW = -angleCCW;

  switch( axis )
  {
    case 'X':
    case 'x':

      ret.vals[0] = 1.0;
      ret.vals[1] = 0.0;
      ret.vals[2] = 0.0;
      ret.vals[3] = 0.0;

      ret.vals[4] = 0.0;
      ret.vals[5] = Math.cos(angleCCW);
      ret.vals[6] = Math.sin(angleCCW);
      ret.vals[7] = 0.0;

      ret.vals[8] = 0.0;
      ret.vals[9] = -Math.sin(angleCCW);
      ret.vals[10] = Math.cos(angleCCW);
      ret.vals[11] = 0.0;

      ret.vals[12] = 0.0;
      ret.vals[13] = 0.0;
      ret.vals[14] = 0.0;
      ret.vals[15] = 1.0;

      break;

    case 'Y':
    case 'y':
      ret.vals[0] = Math.cos(angleCCW);
      ret.vals[1] = 0.0;
      ret.vals[2] = -Math.sin(angleCCW);
      ret.vals[3] = 0.0;

      ret.vals[4] = 0.0;
      ret.vals[5] = 1.0;
      ret.vals[6] = 0.0;
      ret.vals[7] = 0.0;

      ret.vals[8] = Math.sin(angleCCW);
      ret.vals[9] = 0.0;
      ret.vals[10] = Math.cos(angleCCW);
      ret.vals[11] = 0.0;

      ret.vals[12] = 0.0;
      ret.vals[13] = 0.0;
      ret.vals[14] = 0.0;
      ret.vals[15] = 1.0;

      break;

    case 'Z':
    case 'z':
      ret.vals[0] = Math.cos(angleCCW);
      ret.vals[1] = Math.sin(angleCCW);
      ret.vals[2] = 0.0;
      ret.vals[3] = 0.0;

      ret.vals[4] = -Math.sin(angleCCW);
      ret.vals[5] = Math.cos(angleCCW);
      ret.vals[6] = 0.0;
      ret.vals[7] = 0.0;

      ret.vals[8] = 0.0;
      ret.vals[9] = 0.0;
      ret.vals[10] = 1.0;
      ret.vals[11] = 0.0;

      ret.vals[12] = 0.0;
      ret.vals[13] = 0.0;
      ret.vals[14] = 0.0;
      ret.vals[15] = 1.0;

      break;
  }

  return ret;
}

Breeze.Math.Matrix4x4.prototype = {

  getValue : function(row, col) {
    return this.vals[row * 4 + col];
  },

  setValue : function(row, col, value) {
    this.vals[row * 4 + col] = value;
  },

  times : function(matrix) {
    var ret = new Breeze.Math.Matrix4x4();

    for (var j = 0; j < 4; ++j) {
      for (var i = 0; i < 4; ++i) {
        ret.vals[j * 4 + i] =
          this.vals[j * 4 + 0] * matrix.vals[0 * 4 + i] + this.vals[j * 4 + 1] * matrix.vals[1 * 4 + i] +
          this.vals[j * 4 + 2] * matrix.vals[2 * 4 + i] + this.vals[j * 4 + 3] * matrix.vals[3 * 4 + i];
      }
    }

    return ret;
  },

  timesVector3D : function(vector) {
    var ret = new Breeze.Math.Vector3D();

    ret.x = vector.x * this.vals[0 * 4 + 0] + vector.y * this.vals[0 * 4 + 1] + vector.z * this.vals[0 * 4 + 2];
    ret.y = vector.x * this.vals[1 * 4 + 0] + vector.y * this.vals[1 * 4 + 1] + vector.z * this.vals[1 * 4 + 2];
    ret.z = vector.x * this.vals[2 * 4 + 0] + vector.y * this.vals[2 * 4 + 1] + vector.z * this.vals[2 * 4 + 2];

    return ret;
  }

};
