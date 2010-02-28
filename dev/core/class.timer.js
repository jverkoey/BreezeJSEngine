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

goog.provide('Breeze.Timer');

goog.require('Breeze');

/**
 * @constructor
 */
Breeze.Timer = function() {
  /**
   * @type {number}
   * @private
   */
  this.currentTime_ = 0;

  /**
   * @type {number}
   * @private
   */
  this.frameDuration_ = 0;

  /**
   * @type {boolean}
   * @private
   */
  this.isPaused_ = false;

  /**
   * @type {number}
   * @private
   */
  this.scale_ = 1;
};

Breeze.Timer.prototype.reset = function() {
  this.frameDuration_ = 0;
  this.currentTime_   = 0;
};

/**
 * @param {number} deltaTime
 */
Breeze.Timer.prototype.tick = function(deltaTime) {
  if (!this.isPaused_) {
    this.frameDuration_ = deltaTime * this.scale_;
    this.currentTime_ += this.frameDuration_;
  }
};

/**
 * @return {number}
 */
Breeze.Timer.prototype.getTime = function() {
  return this.currentTime_;
};

/**
 * @return {number}
 */
Breeze.Timer.prototype.getFrameDuration = function() {
  return this.frameDuration_;
};

/**
 * @return {boolean}
 */
Breeze.Timer.prototype.isPaused = function() {
  return this.isPaused_;
};

/**
 * @return {number}
 */
Breeze.Timer.prototype.getScale = function() {
  return this.scale_;
};

/**
 * @param {boolean} paused
 */
Breeze.Timer.prototype.setPaused = function(paused) {
  this.isPaused_ = paused;
};

/**
 * @param {number} scale
 */
Breeze.Timer.prototype.setScale = function(scale) {
  this.scale_ = scale;
};
