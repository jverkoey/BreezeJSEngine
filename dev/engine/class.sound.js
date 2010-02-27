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

goog.provide('Breeze.Engine.Sound');

goog.require('Breeze.Engine');

/**
 * Creating a Sound object will create a jPlayer object, load the data, and then call the optional
 * callback method once the sound is loaded.
 *
 * @param {string}              path        The URL of the sound.
 * @param {Object.<string, *>}  options
 * @constructor
 */
Breeze.Engine.Sound = function(path, options) {
  var defaults = {
    'repeats' : false
  };

  var settings = {};
  goog.object.extend(settings, defaults, options);

  /**
   * @type {boolean}
   * @private
   */
  this.loaded_ = false;

  if (Modernizr.audio) {
    this.audio_ = document.createElement('audio');

    if (settings.repeats) {
      this.audio_.addEventListener("ended", function() {
        this.audio_.play();
      }.bind(this), true);
    }

    if (this.audio_.canPlayType('audio/mp3')) {
      this.audio_.setAttribute('src', path+'.mp3');
    } else if (this.audio_.canPlayType('audio/ogg')) {
      this.audio_.setAttribute('src', path+'.ogg');
    } else {
      // No supported file formats.
    }
  }
};

Breeze.Engine.Sound.prototype.play = function() {
  if (Modernizr.audio) {
    this.audio_.play();
  }
};

Breeze.Engine.Sound.prototype.stop = function() {
  this.audio_.pause();
};

Breeze.Engine.Sound.prototype.setVolume = function(perc) {
  this._audio.volume = perc;
};

Breeze.Engine.Sound.prototype.getPlayedTime = function() {
};

Breeze.Engine.Sound.prototype.onProgressChange = function(loadPercent, playedPercentRelative, playedPercentAbsolute, playedTime, totalTime) {
};
