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

goog.provide('Breeze.Engine.Scene');

goog.require('Breeze.Engine');
goog.require('Breeze.Engine.Sound');
goog.require('Breeze.Engine.SoundCache');
goog.require('Breeze.Engine.TextureCache');

/**
 * @constructor
 */
Breeze.Engine.Scene = function(options) {
  var defaults = {
    textureCache: null,
    soundCache: null,
    context: null
  };

  var settings = {};
  goog.object.extend(settings, defaults, options);

  /**
   * Texture cache
   * @type {Breeze.Engine.TextureCache}
   */
  this.textureCache_ = settings.textureCache;
  this.soundCache_ = settings.soundCache;
  this.ctx_ = settings.context;

  this.firstLayer_ = 0;
  this.lastLayer_ = 0;

  this.lastTick_ = new Date();

  this.isLoaded_ = false;

  this.onLoadCallbacks_ = [];

  this.timeout_ = null;
};

Object.extend(Breeze.Engine.Scene, {
  GOAL_FPS        : 30, // The desired frames per second.
  MAX_TIME_DELTA  : 50 // The maximum time delta for a given tick.
});

Breeze.Engine.Scene.prototype = {

  runScene : function() {
    this.lastTick_ = new Date();
    this.timeout_ = window.setInterval(
      Breeze.Engine.Scene.prototype.animate.bind(this),
      parseInt(1000 / Breeze.Engine.Scene.GOAL_FPS, 10));
  },

  stopScene : function() {
    clearTimeout(this.timeout_);
    this.timeout_ = null;
  },

  drawScene : function() {
    this.ctx_.clearRect(0,0,this.ctx_.canvas.width,this.ctx_.canvas.height);

    for (var i = this.firstLayer_; i <= this.lastLayer_; ++i) {
      var oldAlpha = this.ctx_.globalAlpha;

      this.drawLayer(i);

      this.ctx_.globalAlpha = oldAlpha;
    }
  },

  animate : function() {
    var currentTick = new Date();
    var deltaMS = Math.min(Breeze.Engine.Scene.MAX_TIME_DELTA, currentTick.getTime() - this.lastTick_);

    this.tick(deltaMS / 1000);

    this.lastTick_ = currentTick;

    Breeze.Engine.Scene.prototype.drawScene.call(this);
  },

  registerOnLoad : function(callback) {
    if (this.isLoaded_) {
      callback();
    } else {
      this.onLoadCallbacks_.push(callback);
    }
  },

  didLoad : function() {
    this.isLoaded_ = true;
    for (var i in this.onLoadCallbacks_) {
      var callback = this.onLoadCallbacks_[i];
      callback();
    }
    this.onLoadCallbacks_ = null;
  },

  isLoaded : function() {
    return this.isLoaded_;
  }

};
