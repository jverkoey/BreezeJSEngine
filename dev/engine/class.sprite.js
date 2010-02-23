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

goog.provide('Breeze.Engine.Sprite');

goog.require('Breeze.Engine');
goog.require('Breeze.Engine.Texture');

/**
 * @constructor
 */
Breeze.Engine.Sprite = function(options) {
  var defaults = {
    image: null,
    animations: {},
    width: 0,
    height: 0
  };

  var settings = {};
  goog.object.extend(settings, defaults, options);

  this.x = 0;
  this.y = 0;
  this._image = settings.image;
  this._width = settings.width;
  this._height = settings.height;
  this._nCols = parseInt(settings.image.width / settings.width, 10);
  this._nRows = parseInt(settings.image.height / settings.height, 10);
  this._animations = settings.animations;

  this._frame = 0;

  this._frameTickStart = 0;
  this._animationIndex = 0;
  this._currentAnimation = null;
};

Breeze.Engine.Sprite.prototype = {

  draw : function(context) {
    context.save();
    context.translate(parseInt(-this._width / 2, 10), parseInt(-this._height / 2, 10));
    var tx = (this._frame % this._nCols) * this._width;
    var ty = parseInt(this._frame / this._nCols, 10) * this._height;
    context.drawImage(this._image, tx, ty, this._width, this._height,
                                   this.x, this.y, this._width, this._height);
    context.restore();
  },

  tick : function(deltaSeconds) {
    if (this._currentAnimation) {
      var animation = this._animations[this._currentAnimation];
      var animationFrame = animation.frames[this._animationIndex];
      var animationTime = animation.times[this._animationIndex];
      this._frame = animationFrame;
      if ((new Date() - this._frameTickStart) > animationTime) {
        this._animationIndex++;
        this._frameTickStart = new Date();

        // Check for the end of the animation.
        if (this._animationIndex == animation.frames.length) {
          if (animation.repeats) {
            this._animationIndex = 0;
          } else {
            this._currentAnimation = null;
          }
        }
      }
    }
  },

  animate : function(animation) {
    this._currentAnimation = animation;
    this._animationIndex = 0;
    this._frame = this._animations[this._currentAnimation].frames[this._animationIndex];
    this._frameTickStart = new Date();
  }

};
