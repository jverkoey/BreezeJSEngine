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
 * The director object is responsible for all scenes in the game. This responsibility includes
 * transitioning between scenes and running them once they've completed loading.
 *
 * @param {Object.<string, *>} options
 * @constructor
 */
Breeze.Engine.Director = function(options) {
  var defaults = {
    scenes : null,
    canvas : null
  };

  var settings = {};
  goog.object.extend(settings, defaults, options);

  /**
   * @type {Object.<string, Breeze.Engine.Scene>}
   * @private
   */
  this.scenes_ = settings.scenes;

  /**
   * @type {Element}
   * @private
   */
  this.canvas_ = settings.canvas;

  /**
   * @type {string|null}
   * @private
   */
  this.activeSceneID_ = null;

  /**
   * @type {goog.math.Vec2}
   * @private
   */
  this.mousePos_ = new goog.math.Vec2();

  goog.events.listen(this.canvas_, goog.events.EventType.MOUSEMOVE, this.mouseMove.bind(this));
  goog.events.listen(this.canvas_, goog.events.EventType.CLICK, this.click.bind(this));

  for (var key in this.scenes_) {
    var scene = this.scenes_[key];
    scene.registerOnLoad(this.onLoadScene.bind(this, key));
  }

  Breeze.Engine.Director.sharedDirector = this;
};

/**
 * @type {Breeze.Engine.Director|null}
 */
Breeze.Engine.Director.sharedDirector = null;

/**
 * Set the current scene. This method will call stopScene and runScene 
 * @param {string} sceneID The scene ID.
 */
Breeze.Engine.Director.prototype.present = function(sceneID) {
  if (this.activeSceneID_) {
    this.scenes_[this.activeSceneID_].stopScene();
  }
  this.activeSceneID_ = sceneID;
  if (this.scenes_[this.activeSceneID_].isLoaded()) {
    this.scenes_[this.activeSceneID_].runScene();
  } // else we wait.
};

/**
 * @return {goog.math.Vec2} The current position of the mouse in window coordinates.
 */
Breeze.Engine.Director.prototype.getMousePos = function() {
  return this.mousePos_;
};

/**
 * Event callback for mouse moves.
 */
Breeze.Engine.Director.prototype.mouseMove = function(event) {
  this.mousePos_ = new goog.math.Vec2(
    event.offsetX - this.canvas_.offsetLeft,
    event.offsetY - this.canvas_.offsetTop
  );
};

/**
 * Event callback for mouse clicks.
 */
Breeze.Engine.Director.prototype.click = function(event) {
  if (this.activeSceneID_) {
    this.scenes_[this.activeSceneID_].click(
      new goog.math.Vec2(
        event.offsetX - this.canvas_.offsetLeft,
        event.offsetY - this.canvas_.offsetTop));
  }
};

/**
 * Event callback for the completion of a scene load.
 */
Breeze.Engine.Director.prototype.onLoadScene = function(sceneID) {
  if (sceneID == this.activeSceneID_) {
    this.scenes_[this.activeSceneID_].runScene();
  }
};
