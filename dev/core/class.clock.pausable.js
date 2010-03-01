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

goog.provide('Breeze.PausableClock');

goog.require('Breeze.Clock');

/**
 * @param {Breeze.TimeSource|null} timeSource
 * @constructor
 * @extends Breeze.Clock
 */
Breeze.PausableClock = function(timeSource) {
  Breeze.Clock.call(this, timeSource);

  /**
   * @type {boolean}
   */
  this.paused = false;
};
goog.inherits(Breeze.PausableClock, Breeze.Clock);

/**
 * @return {number}
 */
Breeze.PausableClock.prototype.getFrameDuration = function() {
  return this.paused_ ? 0 : Breeze.Clock.prototype.getFrameDuration.call(this);
};
