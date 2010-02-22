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

$V2D = function(x, y) {
  return new Breeze.Math.Vector2D(x, y);
}

$V3D = function(x, y, z) {
  return new Breeze.Math.Vector3D(x, y, z);
}

$MAT4X4ROTZ = function(rot) {
  return Breeze.Math.Matrix4x4.createRotation(rot, 'z');
}

$RECT = function(left, top, right, bottom) {
  return new Breeze.Math.Rectangle(left, top, right, bottom);
}
