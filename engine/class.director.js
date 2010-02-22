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

Breeze.Engine.Director = function(options) {
  var defaults = {
    scenes : null
  };

  var settings = $.extend({}, defaults, options);
  
  this._scenes = settings.scenes;

  for (var key in this._scenes) {
    var scene = this._scenes[key];
    scene.registerOnLoad(this.onLoadScene.bind(this, key));
  }

  this._activeScene = null;
  this.mousePos = {x: 0, y: 0},

  Breeze.Engine.Director.sharedDirector = this;
};

Object.extend(Breeze.Engine.Director, {
  sharedDirector : null,
});

Breeze.Engine.Director.prototype = {

  present : function(sceneID) {
    if (!this._activeScene) {
      this._activeScene = sceneID;
    } else {
      this._scenes[this._activeScene].stopScene();
      this._activeScene = sceneID;
      this._scenes[this._activeScene].runScene();
    }
  },

  getMousePos : function() {
    return new Breeze.Math.Vector2D(this.mousePos.x, this.mousePos.y);
  },

  mouseMove : function(event) {
    this.mousePos = {x: event.layerX, y:event.layerY};
  },

  click : function(event) {
    if (this._activeScene) {
      this._scenes[this._activeScene].click(new Breeze.Math.Vector2D(event.layerX, event.layerY));
    }
  },

  onLoadScene : function(sceneID) {
    if (sceneID == this._activeScene) {
      this._scenes[this._activeScene].runScene();
    }
  }

};
