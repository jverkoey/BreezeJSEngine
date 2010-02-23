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

goog.provide('Breeze.Engine.Director');

goog.require('Breeze.Engine');
goog.require('Breeze.Engine.Scene');

goog.require('goog.math.Vec2');
goog.require('goog.object');

/**
 * @param {Object.<string, *>} options
 * @constructor
 */
Breeze.Engine.Director = function(options) {
  var defaults = {
    scenes : null
  };

  var settings = {};
  goog.object.extend(settings, defaults, options);
  
  this.scenes_ = settings.scenes;

  for (var key in this.scenes_) {
    var scene = this.scenes_[key];
    scene.registerOnLoad(this.onLoadScene.bind(this, key));
  }

  this.activeScene_ = null;
  this.mousePos = {x: 0, y: 0},

  Breeze.Engine.Director.sharedDirector = this;
};

Object.extend(Breeze.Engine.Director, {
  sharedDirector : null
});

Breeze.Engine.Director.prototype = {

  present : function(sceneID) {
    if (!this.activeScene_) {
      this.activeScene_ = sceneID;
    } else {
      this.scenes_[this.activeScene_].stopScene();
      this.activeScene_ = sceneID;
      this.scenes_[this.activeScene_].runScene();
    }
  },

  getMousePos : function() {
    return new goog.math.Vec2(this.mousePos.x, this.mousePos.y);
  },

  mouseMove : function(event) {
    this.mousePos = {x: event.offsetX, y:event.offsetY};
  },

  click : function(event) {
    if (this.activeScene_) {
      this.scenes_[this.activeScene_].click(new goog.math.Vec2(event.offsetX, event.offsetY));
    }
  },

  onLoadScene : function(sceneID) {
    if (sceneID == this.activeScene_) {
      this.scenes_[this.activeScene_].runScene();
    }
  }

};

goog.exportSymbol('Breeze.Engine.Director', Breeze.Engine.Director);
