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
  this._soundCache = settings.soundCache;
  this._ctx = settings.context;

  this._firstLayer = 0;
  this._lastLayer = 0;

  this._lastTick = new Date();

  this._isLoaded = false;

  this._onLoadCallbacks = [];

  this._timeout = null;
};

Object.extend(Breeze.Engine.Scene, {
  GOAL_FPS        : 30, // The desired frames per second.
  MAX_TIME_DELTA  : 50 // The maximum time delta for a given tick.
});

Breeze.Engine.Scene.prototype = {

  runScene : function() {
    this._lastTick = new Date();
    this._timeout = window.setInterval(
      Breeze.Engine.Scene.prototype.animate.bind(this),
      parseInt(1000 / Breeze.Engine.Scene.GOAL_FPS, 10));
  },

  stopScene : function() {
    clearTimeout(this._timeout);
    this._timeout = null;
  },

  drawScene : function() {
    this._ctx.clearRect(0,0,this._ctx.canvas.width,this._ctx.canvas.height);

    for (var i = this._firstLayer; i <= this._lastLayer; ++i) {
      var oldAlpha = this._ctx.globalAlpha;

      this.drawLayer(i);

      this._ctx.globalAlpha = oldAlpha;
    }
  },

  animate : function() {
    var currentTick = new Date();
    var deltaMS = Math.min(Breeze.Engine.Scene.MAX_TIME_DELTA, currentTick.getTime() - this._lastTick);

    this.tick(deltaMS / 1000);

    this._lastTick = currentTick;

    Breeze.Engine.Scene.prototype.drawScene.call(this);
  },

  registerOnLoad : function(callback) {
    if (this._isLoaded) {
      callback();
    } else {
      this._onLoadCallbacks.push(callback);
    }
  },

  didLoad : function() {
    this._isLoaded = true;
    for (var i in this._onLoadCallbacks) {
      var callback = this._onLoadCallbacks[i];
      callback();
    }
    this._onLoadCallbacks = null;
  }

};
