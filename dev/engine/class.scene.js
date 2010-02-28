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
 * A scene object that is responsible for ensuring textures and sounds are loaded, as well as
 * setting up the animation timer and rendering layers.
 *
 * @param {Object.<string, *>} options
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
   * @type {Breeze.Engine.TextureCache}
   * @private
   */
  this.textureCache_ = settings.textureCache;

  /**
   * @type {Breeze.Engine.SoundCache}
   * @private
   */
  this.soundCache_ = settings.soundCache;

  this.ctx_ = settings.context;

  /**
   * @type {number}
   * @private
   */
  this.firstLayer_ = 0;

  /**
   * @type {number}
   * @private
   */
  this.lastLayer_ = 0;

  /**
   * @type {Date}
   * @private
   */
  this.lastTick_ = new Date();

  /**
   * @type {boolean}
   * @private
   */
  this.isLoaded_ = false;

  /**
   * @type Array.<function()>
   * @private
   */
  this.onLoadCallbacks_ = [];

  /**
   * @type {number|null}
   * @private
   */
  this.timeout_ = null;
};

Breeze.Engine.Scene.GOAL_FPS = 40; // The desired frames per second.
Breeze.Engine.Scene.MAX_TIME_DELTA = 50; // The maximum time delta for a given tick.

/**
 * Kick off the animation timer for the scene.
 */
Breeze.Engine.Scene.prototype.runScene = function() {
  this.lastTick_ = new Date();
  this.timeout_ = window.setInterval(
    Breeze.Engine.Scene.prototype.animate.bind(this),
    parseInt(1000 / Breeze.Engine.Scene.GOAL_FPS, 10));
};

/**
 * Kill the animation timer for the scene.
 */
Breeze.Engine.Scene.prototype.stopScene = function() {
  clearTimeout(this.timeout_);
  this.timeout_ = null;
};

Breeze.Engine.Scene.prototype.img = function(key) {
  return this.textureCache_.getTexture(key).getImage();
};

Breeze.Engine.Scene.prototype.sound = function(key) {
  return this.soundCache_.getSound(key);
};

/**
 * Draw a layered scene.
 */
Breeze.Engine.Scene.prototype.drawScene = function() {
  this.ctx_.clearRect(0,0,this.ctx_.canvas.width,this.ctx_.canvas.height);

  for (var i = this.firstLayer_; i <= this.lastLayer_; ++i) {
    var oldAlpha = this.ctx_.globalAlpha;
    var oldFillStyle = this.ctx_.fillStyle;

    this.drawLayer(i);

    this.ctx_.globalAlpha = oldAlpha;
    this.ctx_.fillStyle = oldFillStyle;
  }
};

/**
 * Callback for the animation event.
 */
Breeze.Engine.Scene.prototype.animate = function() {
  var currentTick = new Date();
  var deltaMS = Math.min(Breeze.Engine.Scene.MAX_TIME_DELTA, currentTick.getTime() - this.lastTick_);

  this.tick(deltaMS / 1000);

  this.lastTick_ = currentTick;

  Breeze.Engine.Scene.prototype.drawScene.call(this);
};

/**
 * Register a callback that will be executed upon successfully loading this scene.
 * If the scene is already loaded, executes the callback immediately.
 *
 * @param {function()} callback
 */
Breeze.Engine.Scene.prototype.registerOnLoad = function(callback) {
  if (this.isLoaded_) {
    callback();
  } else {
    this.onLoadCallbacks_.push(callback);
  }
};

/**
 * Callback for successfully loading the scene.
 */
Breeze.Engine.Scene.prototype.didLoad = function() {
  this.isLoaded_ = true;
  for (var i in this.onLoadCallbacks_) {
    var callback = this.onLoadCallbacks_[i];
    callback();
  }
  this.onLoadCallbacks_ = null;
};

/**
 * @return {boolean} Whether or not the scene has successfully completed loading.
 */
Breeze.Engine.Scene.prototype.isLoaded = function() {
  return this.isLoaded_;
};
