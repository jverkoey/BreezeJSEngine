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

goog.provide('Breeze.Clock');

goog.require('Breeze');
goog.require('Breeze.TimeSource');

/**
 * @param {Breeze.TimeSource|null} timeSource
 * @constructor
 */
Breeze.Clock = function(timeSource) {
  /**
   * @type {Breeze.TimeSource|null}
   * @private
   */
  this.timeSource_ = null;

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
   * @type {number}
   * @private
   */
  this.frameNumber_ = 0;

  /**
   * @type {number}
   * @private
   */
  this.sourceStartValue_ = 0;

  /**
   * @type {number}
   * @private
   */
  this.sourceLastValue_ = 0;

  /**
   * @type {number}
   * @private
   */
  this.filteringFrameWindow_ = 0;

  /**
   * @type {number}
   * @private
   */
  this.frameDefaultTime_ = 0;

  /**
   * @type {Array.<number>}
   * @private
   */
  this.frameDurationHistory_ = [];

  /**
   * @type {Array.<Object>}
   * @private
   */
  this.observers_ = [];

  this.setTimeSource(timeSource);
  this.setFiltering(10);
  this.frameDuration_ = this.getPredictedFrameDuration();
};

/**
 * @type {number}
 * @const
 */
Breeze.Clock.FRAMEMAX = 0.200;

/**
 * @return {!Breeze.Clock}
 */
Breeze.Clock.getGlobalClock = function() {
  Breeze.Clock.globalClock = Breeze.Clock.globalClock || new Breeze.Clock(new Breeze.TimeSource());
  return Breeze.Clock.globalClock;
};

/**
 * @param {Breeze.TimeSource} timeSource
 */
Breeze.Clock.prototype.setTimeSource = function(timeSource) {
  this.timeSource_ = timeSource;

  if (this.pTimeSource_ != null) {
    this.sourceStartValue_ = this.timeSource_.getTime();
    this.sourceLastValue_ = this.sourceStartValue_;
  }
};

/**
 *
 */
Breeze.Clock.prototype.frameStep = function() {
  var exactLastFrameDuration = this.getExactLastFrameDuration();
  this.addToFrameHistory(exactLastFrameDuration);

  this.frameDuration_ = this.getPredictedFrameDuration();
  this.currentTime_ += this.frameDuration_;

  ++this.frameNumber_;

  for (var key in this.observers_) {
    this.observers_[key].frameDidStep();
  }
};

/**
 * @return {number}
 */
Breeze.Clock.prototype.getExactTime = function() {
  return this.timeSource_.getTime();
};

/**
 * @return {number}
 */
Breeze.Clock.prototype.getExactLastFrameDuration = function() {
  var sourceTime;
  if (null == this.timeSource_) {
    sourceTime = 0;
  } else {
    sourceTime = this.timeSource_.getTime();
  }

  var frameDuration = sourceTime - this.sourceLastValue_;

  // If we pause the game to debug, we do not want our time-based algorithms to explode
  if (frameDuration > Breeze.Clock.FRAMEMAX) {
    frameDuration = this.frameDurationHistory_[this.frameDurationHistory_.length - 1];
  }
  this.sourceLastValue_ = sourceTime;

  return frameDuration;
};

/**
 * @param {number} exactFrameDuration
 */
Breeze.Clock.prototype.addToFrameHistory = function(exactFrameDuration) {
  this.frameDurationHistory_.push(exactFrameDuration);
  if (this.frameDurationHistory_.length > this.frameFilteringWindow_) {
    goog.array.removeAt(this.frameDurationHistory_, 0);
  }
};

/**
 * @return {number}
 */
Breeze.Clock.prototype.getPredictedFrameDuration = function() {
  var totalFrameTime = 0;

  for (var key in this.frameDurationHistory_) {
    totalFrameTime += this.frameDurationHistory_[key];
  }
  return totalFrameTime / this.frameDurationHistory_.length;
};

/**
 * @param {Object} observer
 */
Breeze.Clock.prototype.addObserver = function(observer) {
  this.observers_.push(observer);
};

/**
 * @param {Object} observer
 */
Breeze.Clock.prototype.removeObserver = function(observer) {
  goog.array.remove(this.observers_, observer);
};

/**
 * @return {number}
 */
Breeze.Clock.prototype.getFrameRate = function() {
  return 1 / this.frameDuration_;
};

/**
 * @param {number}  frameWindow       The max number of frames to keep around.
 * @param {number=} opt_frameDefault  The default frame time.
 */
Breeze.Clock.prototype.setFiltering = function(frameWindow, opt_frameDefault) {
  opt_frameDefault = opt_frameDefault || 0.030;

  this.frameFilteringWindow_ = Math.max(frameWindow, 1);
  this.frameDefaultTime_ = opt_frameDefault;

  this.frameDurationHistory_ = [];
  this.frameDurationHistory_.push(this.frameDefaultTime_);
};
