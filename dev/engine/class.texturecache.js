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

goog.provide('Breeze.Engine.TextureCache');

goog.require('Breeze.Engine');
goog.require('Breeze.Engine.Texture');

/**
 * The texture cache holds all textures and fires notifications when groups of
 * textures are finished loading.
 *
 * @param texture_info  Dictionary  ids => file URL paths.
 * Example: {
 *   'palmtree' : '/gfx/palmtree.png',
 *   'beach'    : '/gfx/beach.png'
 * }
 * @constructor
 */
Breeze.Engine.TextureCache = function(texture_info) {

  /**
   * @type {Object.<string, Breeze.Engine.Texture>}
   * @private
   */
  this.cache_ = {};

  /**
   * @type Array.<Breeze.Engine.TextureCache.Requirer>
   * @private
   */
  this.requirers_ = [];

  /**
   * @type {number}
   * @private
   */
  this.numLoaded_ = 0;

  /**
   * @type {number}
   * @private
   */
  this.numTextures_ = 0;

  for (var key in texture_info) {
    this.numTextures_++;

    /**
     * @type {string}
     */
    var path = texture_info[key];
    this.cache_[key] = new Breeze.Engine.Texture(path, this.didLoad.bind(this, key));
  }
};

/**
 * Callback: called once the texture has been loaded.
 * @param key       String                The texture key.
 * @param texture   Breeze.Engine.Texture The texture object.
 */
Breeze.Engine.TextureCache.prototype.didLoad = function(key, texture) {
  /**
   * @type Array.<Breeze.Engine.TextureCache.Requirer>
   */
  var newrequirers = [];
  for (var i in this.requirers_) {
    /**
     * @type {Breeze.Engine.TextureCache.Requirer}
     */
    var requirer = this.requirers_[i];
    delete requirer.keys[key];
    var isFinished = true;
    for (var keys in requirer.keys) {
      isFinished = false;
      break;
    }
    if (isFinished) {
      requirer.callback.call();
    } else {
      newrequirers.push(requirer);
    }
  }
  this.requirers_ = newrequirers;
  this.numLoaded_++;
};

/**
 * Retrieve a loaded texture object, or null otherwise.
 * @param {string} key
 * @return {Breeze.Engine.Texture|null}
 */
Breeze.Engine.TextureCache.prototype.getTexture = function(key) {
  if (this.cache_[key].isLoaded()) {
    return this.cache_[key];
  }

  return null;
};

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
 * @param {Array.<string>}  keys
 * @param {function()}      callback
 */
Breeze.Engine.TextureCache.prototype.requireTextures = function(keys, callback) {
  var any_missing = false;

  /**
   * @type {Object.<string, boolean>}
   */
  var required_keys = {};
  for (var i in keys) {
    var key = keys[i];
    if (!this.getTexture(key)) {
      required_keys[key] = true;
      any_missing = true;
    }
  }

  if (any_missing) {
    this.requirers_.push(new Breeze.Engine.TextureCache.Requirer(required_keys, callback));

  } else {
    // Everything's already loaded, ship it.
    callback();
  }
};

/**
 * @param {Object.<string, boolean>}  keys
 * @param {function()}                callback
 * @constructor
 */
Breeze.Engine.TextureCache.Requirer = function(keys, callback) {
  /**
   * @type {Object.<string, boolean>}
   */
  this.keys = keys;

  /**
   * @type {function()}
   */
  this.callback = callback;
};
