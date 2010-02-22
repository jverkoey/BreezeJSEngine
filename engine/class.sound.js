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

/**
 * Creating a Sound object will create a jPlayer object, load the data, and then call the optional
 * callback method once the sound is loaded.
 *
 * @param path    string     The sound URL.
 */
Breeze.Engine.Sound = function(path, options) {
  var defaults = {
    'repeats' : false
  };

  var settings = $.extend({}, defaults, options);

  this._loaded = false;

  var audioHolder = $('<div>');
  $('body').append(audioHolder);

  var audio = new Audio();
  var oggSupport = audio.canPlayType("audio/ogg").match(/maybe|probably/i);
  var mp3Support = audio.canPlayType("audio/mp3").match(/maybe|probably/i);

  // oggSupport: false, mp3Support: true is the only way to get sound working in Chrome.
  // oggSupport: true, mp3Support: * is the only way to get sound working in Firefox.

  audioHolder.jPlayer({
    oggSupport: oggSupport && !mp3Support,
    mp3Support: true,
    ready: function () {
      audioHolder
      .jPlayer("onProgressChange", this.onProgressChange.bind(this))
      .jPlayer("setFile", path+'.mp3', path+'.ogg');
    }.bind(this)
  });

  if (settings.repeats) {
    audioHolder.jPlayer("onSoundComplete", function() {
      this.element.jPlayer("play"); // Auto-Repeat
    });
  }

  this._audio = audioHolder;
};

Breeze.Engine.Sound.prototype = {

  play : function() {
    this._audio.jPlayer("play");
  },

  stop : function() {
    this._audio.jPlayer("stop");
  },

  setVolume : function(perc) {
    this._audio.jPlayer("volume", perc * 100);
  },

  getPlayedTime : function() {
    return this._playedTime;
  },

  onProgressChange : function(loadPercent, playedPercentRelative, playedPercentAbsolute, playedTime, totalTime) {
    this._playedTime = playedTime;
    this._totalTime = totalTime;
  }

};
