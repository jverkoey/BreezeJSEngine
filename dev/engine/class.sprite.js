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
 * @param {Object.<string, *>} options
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

  /**
   * @type {number}
   * @public
   */
  this.x = 0;

  /**
   * @type {number}
   * @public
   */
  this.y = 0;

  /**
   * @type {Image}
   * @private
   */
  this.image_ = settings.image;

  /**
   * @type {number}
   * @private
   */
  this.width_ = settings.width;

  /**
   * @type {number}
   * @private
   */
  this.height_ = settings.height;

  /**
   * @type {number}
   * @private
   */
  this.nCols_ = parseInt(settings.image.width / settings.width, 10);

  /**
   * @type {number}
   * @private
   */
  this.nRows_ = parseInt(settings.image.height / settings.height, 10);

  /**
   * @type {Object.<string, {Object}>}
   * @private
   */
  this.animations_ = settings.animations;

  /**
   * @type {number}
   * @private
   */
  this.frame_ = 0;

  /**
   * @type {number}
   * @private
   */
  this.frameTickStart_ = 0;

  /**
   * @type {number}
   * @private
   */
  this.animationFrameIndex_ = 0;

  /**
   * @type {string|null}
   * @private
   */
  this.currentAnimation_ = null;
};

Breeze.Engine.Sprite.prototype.draw = function(context) {
  context.save();
  context.translate(parseInt(-this.width_ / 2, 10), parseInt(-this.height_ / 2, 10));
  var tx = (this.frame_ % this.nCols_) * this.width_;
  var ty = parseInt(this.frame_ / this.nCols_, 10) * this.height_;
  context.drawImage(this.image_, tx, ty, this.width_, this.height_,
                                 this.x, this.y, this.width_, this.height_);
  context.restore();
};

Breeze.Engine.Sprite.prototype.tick = function(deltaSeconds) {
  if (this.currentAnimation_) {
    var animation = this.animations_[this.currentAnimation_];
    var animationFrame = animation.frames[this.animationFrameIndex_];
    var animationTime = animation.times[this.animationFrameIndex_];
    this.frame_ = animationFrame;
    if ((new Date() - this.frame_TickStart) > animationTime) {
      this.animationFrameIndex_++;
      this.frame_TickStart = new Date();

      // Check for the end of the animation.
      if (this.animationFrameIndex_ == animation.frames.length) {
        if (animation.repeats) {
          this.animationFrameIndex_ = 0;
        } else {
          this.currentAnimation_ = null;
        }
      }
    }
  }
};

Breeze.Engine.Sprite.prototype.animate = function(animation) {
  this.currentAnimation_ = animation;
  this.animationFrameIndex_ = 0;
  this.frame_ = this.animations_[this.currentAnimation_].frames[this.animationFrameIndex_];
  this.frame_TickStart = new Date();
};