// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/clockv3.js":[function(require,module,exports) {
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * @fileoverview This file updates the current time in reference to the schedule
 * that the current day is running. This file only applies to the home page of
 * each school, otherwise known as the main, timer page.
 * @version January 3rd, 2023
 * @authors Logan Cover, Skylar Smith, Gabriel Iskandar
 **/

var updateClockFrame = 0; //used for animation frame tracking

var secOffset = -1; //seconds offset (always set to -1)
var minOffset = 0; //minute offset (testing variable)
var hourOffset = 0; //hour offset (testing variable)
var enableOffset = false;
var periodBox = document.getElementById("period__time");
var countdown = document.getElementById("countdown__timer");
var now = newDateAdjusted(); //user's current time
var curTotalSec = 0; //user's current time in seconds
var pageLoadDate = now.toISOString().split('T')[0]; //date the user loaded the page
var schedname = JSON_calendar[now.getFullYear()] === undefined ? "000" : JSON_calendar[now.getFullYear()][now.getMonth()][now.getDate() - 1]; //name of the day's schedule
var schedule = JSON_sched[schedname] === undefined ? JSON_sched["000"] : JSON_sched[schedname]; //schedule the timer follows

var index_obj = {
  //index object to track main schedule and sub schedule positions
  main_index: -1
};

/**
 * corrects the current time based on the offset (testing) variables
 * @returns a new Date object given the offsets
 **/
function newDateAdjusted() {
  return new Date(Date.now() // user's clock
  + 1000 * secOffset + 60000 * minOffset + 3600000 * hourOffset // because it's easier to do this than fix the off-by-one error
  );
}

/**
 * updates the timing system used
 * @returns boolean if the day was not reloaded (not relevant value)
 */
function updateClock() {
  now = newDateAdjusted();
  curTotalSec = now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds();
  if (pageLoadDate != now.toISOString().split('T')[0]) {
    // new day
    window.location.reload(true);
    return false;
  }
  return true;
}

//main loop
function tick() {
  console.log("h");
  if (updateClock()) {
    updateDisplay();
    window.cancelAnimationFrame(updateClockFrame);
    updateClockFrame = window.requestAnimationFrame(tick);
  } else {
    window.cancelAnimationFrame(updateClockFrame);
  }
}

/**
 * initializes the schedule and timing system
 */
function init() {
  updateClock();
  var i = 0;
  var _iterator = _createForOfIteratorHelper(schedule.periods),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var period = _step.value;
      if (!isEmpty(period.intraschedule)) {
        index_obj[i] = 0;
      }
      if (getTimeRemaining(period) < 0) {
        index_obj.main_index = i + 1;
      }
      periodBox.children[2].appendChild(createElement('button', ["class", "gallery-dot"]));
      i++;
    }
    //paint screen
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (index_obj.main_index == -1 || index_obj.main_index == schedule.periods.length) {
    updateTimer(0, true, null);
    updateScheduleDisplay(true);
  } else {
    updateScheduleDisplay(false);
    updateTimer(getTimeRemaining(), false, schedule.periods[index_obj.main_index]);
    periodBox.children[2].children[index_obj.main_index].classList = "gallery-dot active";
    if (!isEmpty(schedule.periods[index_obj.main_index].intraschedule)) {
      displaySubPeriodOptions(schedule.periods[index_obj.main_index]);
    }
  }
  //start loop
  tick();
}

/**
 * updates the countdown and progress bar
 * @param {Integer} timeRemaining time remaining until the endTime
 * @param {boolean} displayBlank if the current schedule is not active
 * @param {Object} period period object (should be current active)
 */
function updateTimer(timeRemaining, displayBlank, period) {
  if (displayBlank || timeRemaining < 0) {
    countdown.children[0].textContent = "--:--";
    countdown.children[1].children[0].style.width = "0%";
  } else {
    //calculate display time
    var progress;
    if (curTotalSec < period.startTime) {
      progress = "0%";
      timeRemaining -= period.endTime - period.startTime;
    } else {
      progress = (1 - timeRemaining / (period.endTime - period.startTime)) * 100 + "%";
    }
    var timeArr = [];
    do {
      timeArr.unshift(timeRemaining % 60);
      timeRemaining = timeRemaining / 60 >> 0; //integer division
    } while (timeRemaining != 0);
    countdown.children[0].textContent = timeArr.map(function (t) {
      return t < 10 ? "0".concat(t) : t;
    }).join(":");
    countdown.children[1].children[0].style.width = progress;
  }
}

/**
 * updates the schedule name and time
 * @param {boolean} displayBlank if the current schedule is not active
 */
function updateScheduleDisplay(displayBlank) {
  if (displayBlank) {
    periodBox.children[0].textContent = "";
    periodBox.children[1].textContent = "Not School Hours";
  } else {
    var period = schedule.periods[index_obj.main_index];
    if (period.intraindex != -1) {
      period = period.intraschedule[period.intraindex][index_obj[index_obj.main_index]];
    }
    periodBox.children[0].textContent = period.name;
    periodBox.children[1].textContent = to12HTime(period.startTimeDigits) + " - " + to12HTime(period.endTimeDigits);
  }
}

/**
 * Displays information on the current active period
 */
function updateDisplay() {
  var period = schedule.periods[index_obj.main_index];
  if (period == undefined) {
    return;
  }
  var timeRemaining = getTimeRemaining();
  if (timeRemaining == 0) {
    //update to next period
    periodBox.children[2].children[index_obj.main_index].classList = "gallery-dot";
    if (period.intraindex != -1 && index_obj[index_obj.main_index] != period.intraschedule[period.intraindex].length - 1) {
      //If within a sub period and we don't advance to the next main period
      index_obj[index_obj.main_index] += 1;
    } else {
      //advancing the next main period
      index_obj.main_index += 1;
    }
    if (index_obj.main_index < schedule.periods.length) {
      periodBox.children[2].children[index_obj.main_index].classList = "gallery-dot active";
    }
    updateScheduleDisplay(index_obj.main_index == schedule.periods.length || index_obj.main_index == -1);
    displaySubPeriodOptions(schedule.periods[index_obj.main_index]);
  }
  if (period.intraindex != -1) {
    period = period.intraschedule[period.intraindex][index_obj[index_obj.main_index]];
  }
  updateTimer(timeRemaining, index_obj.main_index == schedule.periods.length || index_obj.main_index == -1, period);
}

/**
 * Displays options to use a sub period schedule
 * @param {Object} period period object
 */
function displaySubPeriodOptions(period) {
  if (period == undefined) {
    replaceAllChildren(subBox, []);
    return;
  }
  var buttons = [];
  var i = 0;
  var _loop = function _loop(sub) {
    buttons.push(createElement("button", ["class", "container hover"], ["text", sub]));
    if (sub == period.intraindex) {
      buttons[i].classList = "container hover active";
    }
    buttons[i].onclick = function () {
      if (period.intraindex == sub) {
        period.intraindex = -1;
        this.classList = "container hover";
        updateScheduleDisplay(false);
        return;
      }
      period.intraindex = sub;
      var _iterator2 = _createForOfIteratorHelper(subBox.children),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var child = _step2.value;
          if (child != this) child.classList = "container hover";
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      index_obj[index_obj.main_index] = 0;
      var j = 0;
      while (j < period.intraschedule[sub].length - 1 && period.intraschedule[sub][j].endTime - curTotalSec < 0) {
        index_obj[index_obj.main_index] = j + 1;
        j++;
      }
      this.classList = "container hover active";
      updateScheduleDisplay(false);
    };
    i++;
  };
  for (var sub in period.intraschedule) {
    _loop(sub);
  }
  replaceAllChildren(subBox, buttons);
}

/**
 * Calculates the amount of seconds left between the current time and the end of the period
 * @param {Object} period period object
 * @returns Integer distance between the times
 */
function getTimeRemaining() {
  var period = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  if (period != null) {
    //if provided an argument
    return period.endTime - curTotalSec;
  } else {
    //use current period
    var _period = schedule.periods[index_obj.main_index];
    if (_period === undefined) {
      return -1;
    }
    if (schedule.periods[index_obj.main_index].intraindex != -1) {
      return _period.intraschedule[_period.intraindex][index_obj[index_obj.main_index]].endTime - curTotalSec;
    } else {
      return _period.endTime - curTotalSec;
    }
  }
}

/**
 * Advances the periods in the direction provided
 * @param {Integer} direction -1 or 1
 */
function arrowAdvancePeriod(direction) {
  var skip = false;
  console.log("a");
  if (direction > 0) {
    if (index_obj.main_index >= schedule.periods.length - 1) {
      return;
    }
    if (index_obj.main_index == -1) {
      index_obj.main_index = 0;
      skip = true;
    }
  } else if (direction < 0) {
    if (index_obj.main_index <= 0) {
      return;
    }
    if (index_obj.main_index == schedule.periods.length) {
      index_obj.main_index = schedule.periods.length - 1;
      skip = true;
    }
  }
  var period = schedule.periods[index_obj.main_index];
  periodBox.children[2].children[index_obj.main_index].classList = "gallery-dot";
  if (!skip) {
    if (period.intraindex !== -1 && index_obj[index_obj.main_index] + direction < period.intraschedule[period.intraindex].length && index_obj[index_obj.main_index] + direction >= 0) {
      //If within a sub period and we don't advance to the next main period
      index_obj[index_obj.main_index] += direction;
      period = period.intraschedule[period.intraindex][index_obj[index_obj.main_index]];
    } else {
      //advancing the next main period
      index_obj.main_index += direction;
    }
  }
  periodBox.children[2].children[index_obj.main_index].classList = "gallery-dot active";
  updateScheduleDisplay(index_obj.main_index == schedule.periods.length || index_obj.main_index == -1);
  updateTimer(getTimeRemaining(), index_obj.main_index == schedule.periods.length || index_obj.main_index == -1, period);
  displaySubPeriodOptions(schedule.periods[index_obj.main_index]);
}

/**
 * Check if a given object has no properties
 * @param {Object} object
 * @returns boolean true if the object has no properties
 */
function isEmpty(object) {
  for (var i in object) {
    return false;
  }
  return true;
}

/**
 * Converts 24 hour to 12 hour time
 * @param {String} time time in HH:MM form
 * @returns String time in HH:MM form
 */
function to12HTime(time) {
  time = time.split(":");
  var digit = parseInt(time[0]);
  time[0] = digit > 12 ? padDigit(digit % 12) : padDigit(digit);
  return time.join(":");
}
function padDigit(number) {
  if (number < 10) {
    return "0".concat(number);
  } else {
    return number;
  }
}
window.addEventListener("DOMContentLoaded", init);
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59021" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/clockv3.js"], null)
//# sourceMappingURL=/clockv3.6c42fcf4.js.map