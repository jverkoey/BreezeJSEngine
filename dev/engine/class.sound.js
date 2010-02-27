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

/*
  var audioHolder = window.jQuery('<div>');
  // We have to add the element to the page for jPlayer to work correctly.
  window.jQuery('body').append(audioHolder);

  // oggSupport: false, mp3Support: true is the only way to get sound working in Chrome.
  // oggSupport: true, mp3Support: * is the only way to get sound working in Firefox.

  audioHolder.jPlayer({
    oggSupport: Modernizr.audio.ogg && !Modernizr.audio.mp3,
    mp3Support: true,
    ready= function () {
      audioHolder
      .jPlayer("onProgressChange", this.onProgressChange.bind(this))
      .jPlayer("setFile", path+'.mp3', path+'.ogg');
    }.bind(this)
  });

  if (settings.repeats) {
    audioHolder.jPlayer("onSoundComplete", function() {
      this.element.jPlayer("play"); // Auto-Repeat
    });
  }*/

  //this._audio = audioHolder;
};

Breeze.Engine.Sound.prototype.play = function() {
  //this._audio.jPlayer("play");
};

Breeze.Engine.Sound.prototype.stop = function() {
  //this._audio.jPlayer("stop");
};

Breeze.Engine.Sound.prototype.setVolume = function(perc) {
  //this._audio.jPlayer("volume", perc * 100);
};

Breeze.Engine.Sound.prototype.getPlayedTime = function() {
  //return this._playedTime;
};

Breeze.Engine.Sound.prototype.onProgressChange = function(loadPercent, playedPercentRelative, playedPercentAbsolute, playedTime, totalTime) {
  //this._playedTime = playedTime;
  //this._totalTime = totalTime;
};
