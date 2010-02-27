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

goog.provide('Breeze.Engine.Texture');

goog.require('Breeze.Engine');

/**
 * Creating a Texture object will create an Image object, load the data, and then call the optional
 * callback method once the image is loaded.
 *
 * @param {string}                          path     The image URL.
 * @param {function(Breeze.Engine.Texture)} didLoad  Called when the image has been loaded.
 * @constructor
 */
Breeze.Engine.Texture = function(path, didLoad) {
  /**
   * @type {boolean}
   */
  this.loaded_ = false;

  /**
   * @type {function(Breeze.Engine.Texture)}
   */
  this.didLoad_ = didLoad;

  var img = new Image();
  img.onload = this.didLoadTexture.bind(this);
  this._img = img;

  // Start loading the image.
  img.src = path;
};

Breeze.Engine.Texture.prototype = {

  /**
   * @return {boolean}
   */
  isLoaded        : function() {
    return this.loaded_;
  },

  /**
   * @return {Image}
   */
  getImage        : function() {
    return this._img;
  },

  /**
   * @param {Image} image
   */
  didLoadTexture : function(image) {
    this.loaded_ = true;

    if (this.didLoad_) {
      this.didLoad_(this);
    }
  }

};
