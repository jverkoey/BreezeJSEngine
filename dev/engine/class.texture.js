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
 * Creating a Texture object will create an Image object, load the data, and then call the optional
 * callback method once the image is loaded.
 *
 * @param path    string     The image URL.
 * @param options dictionary
 *                   - didLoad(texture) method called when the image has been loaded
 */
Breeze.Engine.Texture = function(path, options) {
  var defaults = {
    'didLoad' : null
  };

  var settings = $.extend({}, defaults, options);

  this._loaded = false;
  this._didLoad = settings.didLoad;

  var img = new Image();
  img.onload = this.didLoadTexture.bind(this);
  this._img = img;

  // Start loading the image.
  img.src = path;
};

Breeze.Engine.Texture.prototype = {

  isLoaded        : function() {
    return this._loaded;
  },

  getImage        : function() {
    return this._img;
  },

  didLoadTexture : function(image) {
    this._loaded = true;

    if (this._didLoad) {
      this._didLoad(this);
    }
  }

};
