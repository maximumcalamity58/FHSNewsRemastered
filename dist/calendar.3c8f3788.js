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
})({"js/calendar.js":[function(require,module,exports) {
/**
 * classes to represent a calendar year
 * @version December 20th, 2021
 * @authors Logan Cover
 **/

var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var MONTH_NAMES_ABR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var DAYS_OF_WEEK_ABR = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat'];
var DAYS_OF_WEEK_LETTERS = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];
function Day(year, month, day) {
  //represents a day of the year
  this.year = year;
  this.month = month;
  this.day = day;
  this.date = new Date(year, month - 1, day);
  this.userData = undefined; //holds information about schedule
}

Day.prototype = {
  toString: function toString() {
    return (this.month < 10 ? "0" + this.month : this.month + "") + "/" + (this.day < 10 ? "0" + this.day : this.day + "") + "/" + this.year;
  },
  getMonthName: function getMonthName(abr) {
    if (abr) {
      return MONTH_NAMES_ABR[this.month - 1];
    }
    return MONTH_NAMES[this.month - 1];
  },
  getDayOfWeek: function getDayOfWeek() {
    return this.date.getDay();
  }
};
function Month(year, month) {
  //represents a month of the year
  this.month = month;
  this.year = year;
  this.daysInMonth = new Date(year, month, 0).getDate();
  this.days = [];
  for (var i = 1; i < this.daysInMonth + 1; i++) {
    this.days.push(new Day(year, month, i));
  }
}
function Year(year) {
  // represents a year
  this.year = year;
  this.months = [];
  for (var i = 1; i < 13; i++) {
    this.months.push(new Month(year, i));
  }
}
Year.prototype = {
  getNumberDaysPerMonth: function getNumberDaysPerMonth() {
    return numberDaysInMonths = this.months.map(function (month) {
      return month.daysInMonth;
    });
  }
};
function Calendar() {
  var loopYear = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  // represents a calendar year
  this.now = new Date(); //current user date
  this.currentYear = this.now.getFullYear();
  this.currentMonth = this.now.getMonth() + 1;
  this.years = []; //list of currentYear -1, currentYear, currentYear +1
  this.loopCurrentYear = loopYear; //current year to display
  for (var i = -1; i < 2; i++) {
    this.years.push(new Year(this.currentYear + i));
  }
}
Calendar.prototype = {
  getFullMonth: function getFullMonth() {
    var m = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.currentMonth;
    //returns month of 42 days (7 days by 6 weeks) (past month, current month, next month)
    var arr = [],
      month = m || this.currentMonth,
      numPrev = this.years[1].months[month - 1].days[0].getDayOfWeek();
    for (var i = 0; i < 42; i++) {
      if (i < numPrev) {
        //number of days in previous month that overlapp here
        if (month == 1) {
          //Check if January
          arr.push(this.years[this.loopCurrentYear ? 1 : 0].months[11].days[31 - numPrev + i]);
        } else {
          arr.push(this.years[1].months[month - 2].days[this.years[1].months[month - 2].daysInMonth - numPrev + i]);
        }
      } else if (i < numPrev + this.years[1].months[month - 1].daysInMonth) {
        arr.push(this.years[1].months[month - 1].days[i - numPrev]);
      } else {
        if (month == 12) {
          //check if December
          arr.push(this.years[this.loopCurrentYear ? 1 : 2].months[0].days[i - (numPrev + this.years[1].months[month - 1].daysInMonth)]);
        } else {
          arr.push(this.years[1].months[month].days[i - (numPrev + this.years[1].months[month - 1].daysInMonth)]);
        }
      }
    }
    return arr;
  },
  //only takes -1 and 1
  updateYear: function updateYear(factor) {
    if (factor === 0) {
      return false;
    }
    if (factor > 0) {
      this.currentYear = this.years[2].year;
      this.years.shift();
      this.years.push(new Year(this.currentYear + 1));
    } else {
      this.currentYear = this.years[0].year;
      this.years.pop();
      this.years.unshift(new Year(this.currentYear - 1));
    }
    return true;
  },
  //only takes -1 and 1
  updateMonth: function updateMonth(factor) {
    if (factor === 0) {
      return false;
    }
    factor /= Math.abs(factor);
    this.currentMonth += factor;
    if (this.currentMonth == 13) {
      this.currentMonth = 1;
      if (!this.loopCurrentYear) {
        return this.updateYear(factor);
      }
    } else if (this.currentMonth === 0) {
      this.currentMonth = 12;
      if (!this.loopCurrentYear) {
        return this.updateYear(factor);
      }
    }
    return false;
  },
  /**
   * returns the Year object associated to the year parameter. Null if not in proper range
   * year - numerical year value to find
   */
  getYear: function getYear(year) {
    for (var i = 0; i < 3; i++) {
      if (this.years[i].year == year) {
        return this.years[i];
      }
    }
    return null;
  }
};
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57093" + '/');
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/calendar.js"], null)
//# sourceMappingURL=/calendar.3c8f3788.js.map