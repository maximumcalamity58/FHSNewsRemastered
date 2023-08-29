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
})({"js/clockv4.js":[function(require,module,exports) {
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
/**
 * @fileoverview This file updates the current time as a simple countdown.
 * @version August 25, 2023
 * @authors Maxime Hendryx-Parker
 **/

var countdown;
var now = new Date();
var endTime;
var hasAdvanced = false; // Add this flag at the top of the file to track whether we have already advanced the period
var manualNavigation = false; // Flag to indicate manual navigation

var timePeriodMapping = [{
  startTime: "08:00",
  endTime: "08:30",
  periodName: "Passing Period"
}, {
  startTime: "08:30",
  endTime: "09:53",
  periodName: "Period 1"
}, {
  startTime: "09:53",
  endTime: "10:01",
  periodName: "Passing Period"
}, {
  startTime: "10:01",
  endTime: "11:24",
  periodName: "Period 2"
}, {
  startTime: "11:24",
  endTime: "13:24",
  periodName: "Period 3 & Lunch"
}, {
  startTime: "13:24",
  endTime: "13:32",
  periodName: "Passing Period"
}, {
  startTime: "13:32",
  endTime: "15:00",
  periodName: "Period 4"
}];
var lunchTimings = {
  "A": {
    startTime: "11:24",
    endTime: "11:54",
    periodName: "A Lunch"
  },
  "B": {
    startTime: "11:54",
    endTime: "12:24",
    periodName: "B Lunch"
  },
  "C": {
    startTime: "12:24",
    endTime: "12:54",
    periodName: "C Lunch"
  },
  "D": {
    startTime: "12:54",
    endTime: "13:24",
    periodName: "D Lunch"
  }
};

// At the top of the file
var currentPeriodIndex = getCurrentPeriodIndex();
function getCurrentPeriodIndex() {
  for (var i = 0; i < timePeriodMapping.length; i++) {
    var _timePeriodMapping$i$ = timePeriodMapping[i].endTime.split(":").map(Number),
      _timePeriodMapping$i$2 = _slicedToArray(_timePeriodMapping$i$, 2),
      endHours = _timePeriodMapping$i$2[0],
      endMinutes = _timePeriodMapping$i$2[1];
    var potentialEndTime = new Date(now);
    potentialEndTime.setHours(endHours, endMinutes, 0, 0);
    if (now < potentialEndTime) {
      return i;
    }
  }
  return -1; // Return 0 if outside of all periods
}

function to12HourFormat(timeStr) {
  var _timeStr$split$map = timeStr.split(":").map(Number),
    _timeStr$split$map2 = _slicedToArray(_timeStr$split$map, 2),
    hours = _timeStr$split$map2[0],
    minutes = _timeStr$split$map2[1];
  hours = hours % 12 || 12; // Convert 0 hours to 12 for 12 AM
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return "".concat(hours, ":").concat(minutes);
}
window.advanceToNextPeriod = function () {
  manualNavigation = true;
  if (currentPeriodIndex < timePeriodMapping.length - 1) {
    currentPeriodIndex++;
    updatePeriod();
  }
};
window.advanceToPreviousPeriod = function () {
  manualNavigation = true;
  if (currentPeriodIndex > -1) {
    currentPeriodIndex--;
    updatePeriod();
  }
};

/**
 * Initialize the countdown variables and start the tick function.
 */
function initializeCountdown() {
  countdown = document.getElementById("countdown__timer");
  now = new Date();
  if (!isSchoolHours() || getCurrentPeriodIndex() === -1) {
    manualNavigation = true;
  }
  updatePeriod();
  tick();
}
function isSchoolHours() {
  var _Date, _Date2;
  var firstStartTime = (_Date = new Date()).setHours.apply(_Date, _toConsumableArray(timePeriodMapping[0].startTime.split(":")));
  var lastEndTime = (_Date2 = new Date()).setHours.apply(_Date2, _toConsumableArray(timePeriodMapping.slice(-1)[0].endTime.split(":")));
  return new Date() >= firstStartTime && new Date() <= lastEndTime;
}
var selectedLunchType = null; // This will store the type of lunch selected, if any

function updatePeriod() {
  var currentPeriodMapping = timePeriodMapping[currentPeriodIndex];
  var realCurrentPeriodIndex = getCurrentPeriodIndex();
  if (currentPeriodMapping) {
    // If current period is "Period 3 & Lunch"
    if (currentPeriodMapping.periodName === "Period 3 & Lunch" && selectedLunchType) {
      currentPeriodMapping = lunchTimings[selectedLunchType];
      var _currentPeriodMapping = currentPeriodMapping.startTime.split(":").map(Number),
        _currentPeriodMapping2 = _slicedToArray(_currentPeriodMapping, 2),
        lunchStartHours = _currentPeriodMapping2[0],
        lunchStartMinutes = _currentPeriodMapping2[1];
      var lunchStartTime = new Date(now);
      lunchStartTime.setHours(lunchStartHours, lunchStartMinutes, 0, 0);
      if (now < lunchStartTime) {
        // If the selected lunch has not started, set endTime to its startTime
        endTime = lunchStartTime;
      } else {
        // If the selected lunch has started, set endTime to its actual endTime
        var _currentPeriodMapping3 = currentPeriodMapping.endTime.split(":").map(Number),
          _currentPeriodMapping4 = _slicedToArray(_currentPeriodMapping3, 2),
          lunchEndHours = _currentPeriodMapping4[0],
          lunchEndMinutes = _currentPeriodMapping4[1];
        endTime = new Date(now);
        endTime.setHours(lunchEndHours, lunchEndMinutes, 0, 0);
      }
    } else {
      var _currentPeriodMapping5 = currentPeriodMapping.endTime.split(":").map(Number),
        _currentPeriodMapping6 = _slicedToArray(_currentPeriodMapping5, 2),
        endHours = _currentPeriodMapping6[0],
        endMinutes = _currentPeriodMapping6[1];
      var _currentPeriodMapping7 = currentPeriodMapping.startTime.split(":").map(Number),
        _currentPeriodMapping8 = _slicedToArray(_currentPeriodMapping7, 2),
        _startHours = _currentPeriodMapping8[0],
        _startMinutes = _currentPeriodMapping8[1];
      if (realCurrentPeriodIndex !== currentPeriodIndex) {
        // If the period being looked at is not the current period, set endTime to startTime
        endTime = new Date(now);
        endTime.setHours(_startHours, _startMinutes, 0, 0);
      } else {
        // Otherwise, set endTime to the actual end time of the period
        endTime = new Date(now);
        endTime.setHours(endHours, endMinutes, 0, 0);
      }
    }
    document.getElementById("period__header").textContent = currentPeriodMapping.periodName;
    document.getElementById("period__time").textContent = "".concat(to12HourFormat(currentPeriodMapping.startTime), " - ").concat(to12HourFormat(currentPeriodMapping.endTime));
    var _currentPeriodMapping9 = currentPeriodMapping.startTime.split(":").map(Number),
      _currentPeriodMapping10 = _slicedToArray(_currentPeriodMapping9, 2),
      startHours = _currentPeriodMapping10[0],
      startMinutes = _currentPeriodMapping10[1];
    var periodStartTime = new Date(now);
    periodStartTime.setHours(startHours, startMinutes, 0, 0);
    var lunchButtons = document.getElementById("lunch");
    if (currentPeriodMapping.periodName === "Period 3 & Lunch" || currentPeriodMapping === lunchTimings[selectedLunchType]) {
      lunchButtons.classList.remove("hidden");
    } else {
      lunchButtons.classList.add("hidden");
    }
    updateProgressBar(periodStartTime, endTime);
  } else {
    endTime = new Date(now);
    document.getElementById("period__header").textContent = "Not School Hours";
    // document.getElementById("period__time").textContent = "1:00" + " - " + "1:00";
    // document.getElementById("period__time").textContent = to12HourFormat(timePeriodMapping[length-1].endTime) + " - " + to12HourFormat(timePeriodMapping[0].startTime);
  }

  if (manualNavigation) {
    if (now > endTime) {
      endTime.setDate(endTime.getDate() + 1);
    }
    manualNavigation = false; // Reset the flag
  }

  // Update gallery dots
  var gallery = document.getElementById("period__gallery");
  gallery.innerHTML = ""; // Clear existing dots

  for (var i = 0; i < timePeriodMapping.length; i++) {
    var dot = document.createElement("div");
    dot.className = "gallery-dot";

    // Mark the active dot based on the current period
    if (i === currentPeriodIndex) {
      dot.classList.add("active");
    }
    gallery.appendChild(dot);
  }
}
function updateProgressBar(periodStartTime, periodEndTime) {
  var totalDuration = periodEndTime - periodStartTime;
  var elapsedDuration = now - periodStartTime;

  // Calculate the percentage of time elapsed
  var progressPercentage = elapsedDuration / totalDuration * 100;

  // Set the width of the progress bar
  document.getElementById("countdown__progress").style.width = "".concat(progressPercentage, "%");
}
window.chooseLunch = function (lunchType, buttonElement) {
  // Get all lunch buttons
  var allLunchButtons = document.querySelectorAll("#lunch__choose .container");

  // If the button clicked is already selected
  if (buttonElement.classList.contains("selected")) {
    // Deselect the button
    buttonElement.classList.remove("selected");
    // Reset the selected lunch type
    selectedLunchType = null;
  } else {
    // If another button was previously selected, deselect it
    allLunchButtons.forEach(function (btn) {
      return btn.classList.remove("selected");
    });

    // Mark the clicked button as selected
    buttonElement.classList.add("selected");
    // Set the selected lunch type
    selectedLunchType = lunchType;
  }

  // Update the period to reflect the changes
  manualNavigation = true;
  updatePeriod();
};

/**
 * updates the current time and countdown timer
 */
function updateClock() {
  now = new Date();
  var timeRemaining;

  // If it's not school hours
  if (currentPeriodIndex === -1) {
    var _timePeriodMapping$0$ = timePeriodMapping[0].startTime.split(":").map(Number),
      _timePeriodMapping$0$2 = _slicedToArray(_timePeriodMapping$0$, 2),
      firstStartHours = _timePeriodMapping$0$2[0],
      firstStartMinutes = _timePeriodMapping$0$2[1];
    var firstStartTime = new Date(now);
    firstStartTime.setHours(firstStartHours, firstStartMinutes, 0, 0);

    // If the time has passed for today, set for next day
    if (now > firstStartTime) {
      firstStartTime.setDate(firstStartTime.getDate() + 1);
    }
    timeRemaining = (firstStartTime - now) / 1000; // in seconds
  }
  // Otherwise, it's a regular school period or passing period
  else {
    timeRemaining = (endTime - now) / 1000; // in seconds
  }

  // Reset hasAdvanced flag if the time is not yet expired
  if (timeRemaining > 0) {
    hasAdvanced = false;
  }
  if (timeRemaining <= 0 && !hasAdvanced && !manualNavigation) {
    // ... (existing logic to advance the period)
    hasAdvanced = true;
  }

  // If the time has already expired and it's a manual navigation
  if (timeRemaining <= 0 && manualNavigation) {
    endTime.setDate(endTime.getDate() + 1);
    timeRemaining = (endTime - now) / 1000;
    manualNavigation = false; // Reset the flag
  }

  // Calculate hours, minutes, seconds
  var hours = Math.floor(timeRemaining / 3600);
  timeRemaining %= 3600;
  var minutes = Math.floor(timeRemaining / 60);
  var seconds = Math.floor(timeRemaining % 60);

  // Display time
  if (hours > 0) {
    countdown.textContent = "".concat(hours, ":").concat(minutes < 10 ? '0' : '').concat(minutes, ":").concat(seconds < 10 ? '0' : '').concat(seconds);
  } else {
    countdown.textContent = "".concat(minutes < 10 ? '0' : '').concat(minutes, ":").concat(seconds < 10 ? '0' : '').concat(seconds);
  }

  // Update the progress bar
  var currentPeriodMapping = timePeriodMapping[currentPeriodIndex];
  if (currentPeriodMapping) {
    var _currentPeriodMapping11 = currentPeriodMapping.startTime.split(":").map(Number),
      _currentPeriodMapping12 = _slicedToArray(_currentPeriodMapping11, 2),
      startHours = _currentPeriodMapping12[0],
      startMinutes = _currentPeriodMapping12[1];
    var periodStartTime = new Date(now);
    periodStartTime.setHours(startHours, startMinutes, 0, 0);
    updateProgressBar(periodStartTime, endTime);
  }
}

// main loop
function tick() {
  updateClock();
  requestAnimationFrame(tick);
}
window.addEventListener("DOMContentLoaded", initializeCountdown);
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50945" + '/');
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/clockv4.js"], null)
//# sourceMappingURL=/clockv4.e2df217a.js.map