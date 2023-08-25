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
})({"js/DOM.js":[function(require,module,exports) {
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
//returns HTML element specified. Can overload arguments to give the element attributes. Syntax is "[attr, value]"
function createElement(type) {
  var elm = document.createElement(type);
  var func;
  for (var i = 1; i < arguments.length; i++) {
    switch (arguments[i][0]) {
      case "text":
        elm.innerHTML = arguments[i][1];
        break;
      case "children":
        if (arguments[i][1] instanceof Array) {
          var _iterator = _createForOfIteratorHelper(arguments[i][1]),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var e = _step.value;
              if (e != null) elm.appendChild(e);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        } else {
          if (arguments[i][1] != null) elm.appendChild(arguments[i][1]);
        }
        break;
      case "onkeydown":
        func = arguments[i][1];
        elm.addEventListener("keypress", func.bind(event, this, elm));
        break;
      case "onkeyup":
        func = arguments[i][1];
        elm.addEventListener("keyup", func.bind(event, this, elm));
        break;
      case "checked":
        elm.checked = arguments[i][1];
      default:
        elm.setAttribute(arguments[i][0], arguments[i][1]);
    }
  }
  return elm;
}

//returns all HTML elements within the parent. findAll specifies if all elements of the same name should be found. Overload arguments with element(s) descriptor
function findElements(parent, findAll, desc) {
  if (parent == undefined || desc == undefined) {
    return;
  }
  var elms = [];
  for (var i = 2; i < arguments.length; i++) {
    if (findAll) {
      var q = parent.querySelectorAll(arguments[i]);
      var _iterator2 = _createForOfIteratorHelper(q),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var thing = _step2.value;
          elms.push(thing);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    } else {
      elms.push(parent.querySelector(arguments[i]));
    }
  }
  return findAll ? elms : elms[0];
}
function replaceElementsWith(parent, newNodes) {
  for (var i = 0; i < newNodes.length; i++) {
    if (i < parent.children.length) {
      parent.replaceChild(newNodes[i], parent.children[i]);
    } else {
      parent.appendChild(newNodes[i]);
    }
  }
}
function replaceAllChildren(parent, newNodes) {
  clearChildren(parent);
  replaceElementsWith(parent, newNodes);
}
function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
function clearChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  return parent;
}
function createDropDown(nodeList) {
  var maxShow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  var table = createElement('table', ['style', 'border-collapse: collapse;']),
    thead = createElement('thead'),
    tbody = createElement('tbody', ['style', ' visibility:collapse']),
    wrapper = createElement('div', ['class', ' dropdown_wrapper'], ['style', ' width: fit-content;display: inline-block;line-height: 0;position: relative;box-sizing: content-box;']),
    overflowContainer = createElement('div', ['class', ' overflow_container'], ['style', 'position: absolute;width: max-content;cursor: pointer;overflow:auto;']);
  tr = createElement('tr'), closeDropdown = true;
  var comp;
  var r = function r(n) {
    return function () {
      thead.replaceChild(n.cloneNode(true), thead.children[0]);
      window.dropdownRef = getDropDownCurrentNode();
      dropdownUpdated();
      closeDropdown = true;
    };
  };
  var _iterator3 = _createForOfIteratorHelper(nodeList),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var node = _step3.value;
      node.classList += ' drop_itm';
      node.addEventListener('click', r(node));
      tr.appendChild(node);
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  thead.onclick = function () {
    overflowContainer.style.height = "";
    overflowContainer.style.overflow = "auto";
    tbody.style = "";
    closeDropdown = false;
  };
  tbody.appendChild(tr);
  thead.appendChild(tr.cloneNode().appendChild(nodeList[0].cloneNode(true)));
  table.appendChild(thead);
  table.appendChild(tbody);
  overflowContainer.appendChild(table);
  wrapper.appendChild(overflowContainer);
  window.addEventListener('load', function size() {
    comp = window.getComputedStyle(thead);
    wrapper.style.width = comp.width;
    wrapper.style.height = comp.height;
    overflowContainer.style.maxHeight = parseInt(comp.height.split("px")[0]) * maxShow * 1.2 + "px";
    overflowContainer.style.height = parseInt(comp.height.split("px")[0]) + "px";
    //global variables to check if a new option has been selected
    window.dropdownRef = getDropDownCurrentNode();
    window.dropdownLength = nodeList.length;
    dropdownLoaded();
    this.removeEventListener('load', size);
  });
  window.addEventListener('resize', function size() {
    comp = window.getComputedStyle(thead);
    if (comp.width != "auto") {
      wrapper.style.width = comp.width;
      wrapper.style.height = comp.height;
      overflowContainer.style.maxHeight = parseInt(comp.height.split("px")[0]) * maxShow * 1.2 + "px";
      if (closeDropdown) {
        overflowContainer.style.height = parseInt(comp.height.split("px")[0]) + "px";
      }
    }
  });
  window.addEventListener('click', function () {
    if (closeDropdown) {
      overflowContainer.style.overflow = "hidden";
      overflowContainer.style.height = parseInt(comp.height.split("px")[0]) + "px";
      overflowContainer.scrollTop = 0;
      tbody.style = "visibility:hidden";
    }
    closeDropdown = true;
  });
  var addRule = function (style) {
    var sheet = document.head.appendChild(style).sheet;
    return function (selector, css) {
      var propText = typeof css === "string" ? css : Object.keys(css).map(function (p) {
        return p + ":" + (p === "content" ? "'" + css[p] + "'" : css[p]);
      }).join(";");
      sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
    };
  }(document.createElement("style"));
  addRule(".overflow_container::-webkit-scrollbar", {
    display: "none"
  });
  return wrapper;
}
function getDropDownCurrentNode() {
  var drop = findElements(document.body, false, ".dropdown_wrapper");
  if (drop) {
    return drop.children[0].children[0].children[0].children;
  } else {
    return;
  }
}
function replaceDropdownContent(drop, nodeList) {
  var thead = findElements(drop, false, "thead"),
    tr = findElements(drop, false, "tr");
  clearChildren(tr);
  clearChildren(thead);
  var r = function r(n) {
    return function () {
      thead.replaceChild(n.cloneNode(true), thead.children[0]);
      window.dropdownRef = getDropDownCurrentNode();
      dropdownUpdated();
      closeDropdown = true;
    };
  };
  var _iterator4 = _createForOfIteratorHelper(nodeList),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var node = _step4.value;
      node.classList += ' drop_itm';
      node.addEventListener('click', r(node));
      tr.appendChild(node);
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  thead.appendChild(tr.cloneNode().appendChild(nodeList[0].cloneNode(true)));
  window.dropdownRef = getDropDownCurrentNode();
  dropdownUpdated();
  return drop;
}
function dropdownUpdated() {
  return;
}
function dropdownLoaded() {
  return;
}
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58293" + '/');
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
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/DOM.js"], null)
//# sourceMappingURL=/DOM.b5e18724.js.map