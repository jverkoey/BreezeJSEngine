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

goog.provide('Breeze.StateMachine');

goog.require('Breeze');
goog.require('Breeze.Clock');
goog.require('Breeze.Timer');

/**
 * @param {Array.<Object.<string, number>>} states
 * @constructor
 */
Breeze.StateMachine = function(states) {
  /**
   * @type {number}
   * @private
   */
  this.curr_ = Breeze.StateMachine.ReservedIDs.InvalidID;

  /**
   * @type {number}
   * @private
   */
  this.queued_ = Breeze.StateMachine.ReservedIDs.InvalidID;

  /**
   * @type {boolean}
   * @private
   */
  this.isTransitioning_ = false;

  /**
   * @type {number}
   * @private
   */
  this.transitionTo_ = Breeze.StateMachine.ReservedIDs.InvalidID;

  /**
   * @type {number}
   * @private
   */
  this.transitionToQueue_ = Breeze.StateMachine.ReservedIDs.InvalidID;

  /**
   * @type {number}
   * @private
   */
  this.percent_ = -1;

  /**
   * @type {Object}
   * @private
   */
  this.notifier_ = null;

  /**
   * @type {!Breeze.Timer}
   * @private
   */
  this.timer_ = new Breeze.Timer(Breeze.Clock.getGlobalClock());

  /**
   * @type Array.<Breeze.StateMachine.State>
   * @private
   */
  this.states_ = [];

  for (var key in states) {
    var newState = new Breeze.StateMachine.State();
    goog.object.extend(newState, states[key]);
    this.states_.push(newState);
  }
};

/**
 * @enum {number}
 */
Breeze.StateMachine.ReservedIDs = {
  InvalidID: 0,
  QueuedID : 1,
  ManualID : 2,
  StartID  : 3
};

/**
 * @enum {number}
 */
Breeze.StateMachine.Flags = {
  None            : 0,
  NotifyChildren  : 1,
  AllowUserInput  : 2
};

/**
 * @param {Object} notifier
 */
Breeze.StateMachine.prototype.attachNotifier = function(notifier) {
  this.notifier_ = notifier;
};

/**
 * @param {number} startState
 * @param {number} queuedState
 */
Breeze.StateMachine.prototype.init = function(startState, queuedState) {
  this.curr_              = Breeze.StateMachine.ReservedIDs.InvalidID;
  this.queued_            = Breeze.StateMachine.ReservedIDs.InvalidID;
  this.isTransitioning_   = false;
  this.transitionTo_      = Breeze.StateMachine.ReservedIDs.InvalidID;
  this.transitionToQueue_ = Breeze.StateMachine.ReservedIDs.InvalidID;
  this.timer_.reset();

  this.queueStateChange(startState, queuedState);
};

/**
 * @param {number} newState
 * @param {number} queuedState
 */
Breeze.StateMachine.prototype.transitionTo = function(newState, queuedState) {
  if (this.states_[this.curr_ - Breeze.StateMachine.ReservedIDs.StartID].flags
      & Breeze.StateMachine.Flags.NotifyChildren) {
    // We can't transfer immediately in this case. Let the implementor notify
    //  its children first.
    this.isTransitioning_   = true;
    this.transitionTo_      = newState;
    this.transitionToQueue_ = queuedState;

    this.notifier_.notifyChildrenStateChange(newState);

    // Check for quick exit.
    if (this.notifier_.childrenHaveFinished()) {
      this.queueStateChange(this.transitionTo_, this.transitionToQueue_);
    }
  } else {
    // Otherwise we can transition immediately.
    if (this.queueStateChange(newState, queuedState)) {
      this.clearTransition();
    }
  }
};

/**
 * @return {number}
 */
Breeze.StateMachine.prototype.getState = function() {
  return this.curr_;
};

/**
 * @return {number}
 */
Breeze.StateMachine.prototype.getPercent = function() {
  return this.percent_;
};

/**
 * @return {boolean}
 */
Breeze.StateMachine.prototype.allowsUserInput = function() {
  return !!(this.states_[this.curr_ - Breeze.StateMachine.ReservedIDs.StartID].flags
         & Breeze.StateMachine.Flags.AllowUserInput);
};

/**
 * @return {boolean}
 */
Breeze.StateMachine.prototype.isTransitioning = function() {
  return this.isTransitioning_;
};

/**
 * @param {number} newState
 * @return {boolean}
 */
Breeze.StateMachine.prototype.setState = function(newState) {
  // Let the implementor know that we've changed states before we actually do.
  if (this.notifier_.notifyStateChange(newState)) {
    this.curr_    = newState;
    this.queued_  = Breeze.StateMachine.ReservedIDs.InvalidID;

    this.timer_.reset();

    this.clearTransition();

    return true;
  } else {
    return false;
  }
};

/**
 * @param {number} via
 * @param {number} queuedState
 * @return {boolean}
 */
Breeze.StateMachine.prototype.queueStateChange = function(via, queuedState) {
  if (this.setState(via)) {
    this.queued_ = queuedState;
    return true;
  } else {
    return false;
  }
};

/**
 */
Breeze.StateMachine.prototype.clearTransition = function() {
  this.transition_        = false;
  this.transitionTo_      = Breeze.StateMachine.ReservedIDs.InvalidID;
  this.transitionToQueue_ = Breeze.StateMachine.ReservedIDs.InvalidID;
  this.percent_           = 0;
};

/**
 */
Breeze.StateMachine.prototype.tickBegin = function() {
  var state = this.states_[this.curr_ - Breeze.StateMachine.ReservedIDs.StartID];
  if (state.duration > 0) {
    this.percent_ = goog.math.clamp(this.timer_.getTime() / state.duration, 0, 1);
  } else {
    this.percent_ = 1;
  }
};

/**
 */
Breeze.StateMachine.prototype.tickEnd = function() {
  var state = this.states_[this.curr_ - Breeze.StateMachine.ReservedIDs.StartID];
  if (this.transition_) {
    if (this.pNotifier_.childrenHaveFinished()) {
      if (Breeze.StateMachine.ReservedIDs.InvalidID != this.transitionToQueue_) {
        this.queueStateChange(this.transitionTo_, this.transitionToQueue_);
      } else {
        this.setState(this.transitionTo_);
      }
    }
  } else {// if (!this.transition_)
    // Not transitioning, so let's do the regular state change logic.
    if (this.percent_ >= 1) {
      if (Breeze.StateMachine.ReservedIDs.QueuedID == state.nextState) {
        this.setState(this.queued_);
      } else if(Breeze.StateMachine.ReservedIDs.ManualID != state.nextState) {
        this.setState(state.nextState);
      }
    }
  }

  this.percent_ = -1;
};

/**
 * @constructor
 */
Breeze.StateMachine.State = function() {
  /**
   * @type {number}
   */
  this.nextState = 0;

  /**
   * @type {number}
   */
  this.duration = 0;

  /**
   * @type {number}
   */
  this.flags = 0;
};
