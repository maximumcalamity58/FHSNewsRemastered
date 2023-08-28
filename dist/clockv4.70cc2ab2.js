parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"zZUo":[function(require,module,exports) {
function e(e,n){return i(e)||a(e,n)||r(e,n)||t()}function t(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function r(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var r=0,n=new Array(t);r<t;r++)n[r]=e[r];return n}function a(e,t){var r=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=r){var n,a,i,o,d=[],c=!0,s=!1;try{if(i=(r=r.call(e)).next,0===t){if(Object(r)!==r)return;c=!1}else for(;!(c=(n=i.call(r)).done)&&(d.push(n.value),d.length!==t);c=!0);}catch(m){s=!0,a=m}finally{try{if(!c&&null!=r.return&&(o=r.return(),Object(o)!==o))return}finally{if(s)throw a}}return d}}function i(e){if(Array.isArray(e))return e}var o,d,c=new Date,s=0,m=!0,u=[{startTime:"08:00",endTime:"08:30",periodName:"Passing Period"},{startTime:"08:30",endTime:"09:53",periodName:"Period 1"},{startTime:"09:53",endTime:"10:01",periodName:"Passing Period"},{startTime:"10:01",endTime:"11:24",periodName:"Period 2"},{startTime:"11:24",endTime:"13:24",periodName:"Period 3 & Lunch"},{startTime:"13:24",endTime:"13:32",periodName:"Passing Period"},{startTime:"13:32",endTime:"15:00",periodName:"Period 4"}],l={A:{startTime:"11:24",endTime:"11:54",periodName:"A Lunch"},B:{startTime:"11:54",endTime:"12:24",periodName:"B Lunch"},C:{startTime:"12:24",endTime:"12:54",periodName:"C Lunch"},D:{startTime:"12:54",endTime:"13:24",periodName:"D Lunch"}};function f(){for(var t=0;t<u.length;t++){var r=e(u[t].startTime.split(":").map(Number),2),n=r[0],a=r[1],i=e(u[t].endTime.split(":").map(Number),2),o=i[0],d=i[1],s=new Date(c);s.setHours(n,a,0,0);var m=new Date(c);if(m.setHours(o,d,0,0),c<s)return{i:t,hasStarted:!1};if(c<m)return{i:t,hasStarted:!0}}return{i:0,hasStarted:!1}}function p(t){var r=e(t.split(":").map(Number),2),n=r[0],a=r[1];return a=a<10?"0"+a:a,"".concat(n=n%12||12,":").concat(a)}function v(){o=document.getElementById("countdown__timer"),c=new Date;var e=f();s=e.i,m=e.hasStarted,T(),N()}window.advanceToNextPeriod=function(){s<u.length-1&&(s++,T(!1))},window.advanceToPreviousPeriod=function(){s>0&&(s--,T(!1))};var h=null;function T(){if(!(arguments.length>0&&void 0!==arguments[0])||arguments[0]){var t=f();s=t.i,m=t.hasStarted}var r=u[s];if(r){"Period 3 & Lunch"===r.periodName&&h&&(r=l[h]);var n=e(r.endTime.split(":").map(Number),2),a=n[0],i=n[1];(d=new Date(c)).setHours(a,i,0,0),document.getElementById("period__header").textContent=r.periodName,document.getElementById("period__time").textContent="".concat(p(r.startTime)," - ").concat(p(r.endTime));var o=e(r.startTime.split(":").map(Number),2),v=o[0],T=o[1],w=new Date(c);w.setHours(v,T,0,0);var N=document.getElementById("lunch");"Period 3 & Lunch"===r.periodName||r===l[h]?N.classList.remove("hidden"):N.classList.add("hidden"),y(w,d)}else d=new Date(c),document.getElementById("period__header").textContent="Not School Hours",document.getElementById("period__time").textContent="";if(m){var g=e(r.endTime.split(":").map(Number),2),b=g[0],L=g[1];(d=new Date(c)).setHours(b,L,0,0)}else{var _=e(r.startTime.split(":").map(Number),2),P=_[0],D=_[1];(d=new Date(c)).setHours(P,D,0,0)}var S=document.getElementById("period__gallery");S.innerHTML="";for(var E=0;E<u.length;E++){var I=document.createElement("div");I.className="gallery-dot",E===s&&I.classList.add("active"),S.appendChild(I)}}function y(e,t){var r=(c-e)/(t-e)*100;document.getElementById("countdown__progress").style.width="".concat(r,"%")}function w(){var t;if(c=new Date,(t=(d-c)/1e3)<=0)T(!0);else{if(t<=0){var r=f();return s=r.i,m=r.hasStarted,void T()}var n=Math.floor(t/3600);t%=3600;var a=Math.floor(t/60),i=Math.floor(t%60);o.textContent=n>0?"".concat(n,":").concat(a<10?"0":"").concat(a,":").concat(i<10?"0":"").concat(i):"".concat(a<10?"0":"").concat(a,":").concat(i<10?"0":"").concat(i);var l=u[s];if(l){var p=e(l.startTime.split(":").map(Number),2),v=p[0],h=p[1],w=new Date(c);w.setHours(v,h,0,0),y(w,d)}}}function N(){w(),requestAnimationFrame(N)}window.chooseLunch=function(e,t){var r=document.querySelectorAll("#lunch__choose .container");t.classList.contains("selected")?(t.classList.remove("selected"),h=null):(r.forEach(function(e){return e.classList.remove("selected")}),t.classList.add("selected"),h=e),T()},window.addEventListener("DOMContentLoaded",v);
},{}]},{},["zZUo"], null)
//# sourceMappingURL=/clockv4.70cc2ab2.js.map