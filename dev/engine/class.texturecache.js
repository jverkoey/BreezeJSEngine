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
 * The texture cache holds all textures and fires notifications when groups of
 * textures are finished loading.
 *
 * @param texture_info  Dictionary  ids => file URL paths.
 * Example: {
 *   'palmtree' : '/gfx/palmtree.png',
 *   'beach'    : '/gfx/beach.png'
 * }
 */
Breeze.Engine.TextureCache = function(texture_info) {
  this._cache = {};
  this._requirers = [];

  this._numLoaded = 0;
  this._numTextures = 0;

  for (var key in texture_info) {
    this._numTextures++;
    var path = texture_info[key];
    this._cache[key] = new Breeze.Engine.Texture(path, {
      didLoad: this.didLoad.bind(this, key)
    });
  }
};

Breeze.Engine.TextureCache.prototype = {

  /**
   * Callback: called once the texture has been loaded.
   * @param key       String                The texture key.
   * @param texture   Breeze.Engine.Texture The texture object.
   */
  didLoad : function(key, texture) {
    var new_requirers = [];
    for (var i in this._requirers) {
      var requirer = this._requirers[i];
      delete requirer.keys[key];
      var isFinished = true;
      for (var keys in requirer.keys) {
        isFinished = false;
        break;
      }
      if (isFinished) {
        requirer.callback();
      } else {
        new_requirers.push(requirer);
      }
    }
    this._requirers = new_requirers;
    this._numLoaded++;
  },

  /**
   * Retrieve a loaded texture object, or null otherwise.
   */
  getTexture : function(key) {
    if (this._cache[key].isLoaded()) {
      return this._cache[key];
    }

    return null;
  },

  /**
   * Require a set of textures to be loaded. This is the recommended way to require a batch of
   * images for a particular scene.
   *
   * Example:
   * this._textureCache.requireTextures([
   *   'palmtree',
   *   'beach'
   * ], this.didLoadTextures.bind(this));
   *
   */
  requireTextures : function(keys, callback) {
    var any_missing = false;

    var required_keys = {};
    for (var i in keys) {
      var key = keys[i];
      if (!this.getTexture(key)) {
        required_keys[key] = true;
        any_missing = true;
      }
    }

    if (any_missing) {
      this._requirers.push({
        'keys' : required_keys,
        'callback' : callback
      });

    } else {
      // Everything's already loaded, ship it.
      callback();
    }
  },

};
