/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app/src/services/routes.js":
/*!****************************************!*\
  !*** ./src/app/src/services/routes.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _view_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view.js */ \"./src/app/src/services/view.js\");\n/* harmony import */ var _routeur_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./routeur.js */ \"./src/app/src/services/routeur.js\");\n\n\n\n// fonction template (name, templateFunction) => {}\n(0,_routeur_js__WEBPACK_IMPORTED_MODULE_1__.template)(\"index\", function () {\n  _view_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].load(\"./index\"); //  View.load(nom de fichier sans extension)\n});\n// fonction route (path, template) => {}\n(0,_routeur_js__WEBPACK_IMPORTED_MODULE_1__.route)(\"/\", \"index\");\n\n// route registration\n(0,_routeur_js__WEBPACK_IMPORTED_MODULE_1__.template)(\"registration\", function () {\n  _view_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].load(\"./registration\"); //\n});\n\n(0,_routeur_js__WEBPACK_IMPORTED_MODULE_1__.route)(\"/registration.html\", \"registration\");\n\n// route login\n(0,_routeur_js__WEBPACK_IMPORTED_MODULE_1__.template)(\"login\", function () {\n  _view_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].load(\"./login\"); //\n});\n\n(0,_routeur_js__WEBPACK_IMPORTED_MODULE_1__.route)(\"/login.html\", \"login\");\n\n// route profil\n(0,_routeur_js__WEBPACK_IMPORTED_MODULE_1__.template)(\"profil\", function () {\n  _view_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].load(\"./profil\"); //\n});\n\n(0,_routeur_js__WEBPACK_IMPORTED_MODULE_1__.route)(\"/profil.html\", \"profil\");\n\n// (admin) route listes d\"utilisateurs\n(0,_routeur_js__WEBPACK_IMPORTED_MODULE_1__.template)(\"users\", function () {\n  _view_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].load(\"./profils\"); //\n});\n\n(0,_routeur_js__WEBPACK_IMPORTED_MODULE_1__.route)(\"/users.html\", \"users\");\n\n// route update user\n(0,_routeur_js__WEBPACK_IMPORTED_MODULE_1__.template)(\"update\", function () {\n  _view_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"].load(\"./update\"); //\n});\n\n(0,_routeur_js__WEBPACK_IMPORTED_MODULE_1__.route)(\"/update.html\", \"update\");\nwindow.addEventListener(\"load\", _routeur_js__WEBPACK_IMPORTED_MODULE_1__.router);\nwindow.addEventListener(\"hashchange\", _routeur_js__WEBPACK_IMPORTED_MODULE_1__.router);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvYXBwL3NyYy9zZXJ2aWNlcy9yb3V0ZXMuanMiLCJtYXBwaW5ncyI6Ijs7O0FBQUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBQ0E7QUFFQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbGlzdGVyci8uL3NyYy9hcHAvc3JjL3NlcnZpY2VzL3JvdXRlcy5qcz9jYTQ5Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3ICBmcm9tIFwiLi92aWV3LmpzXCI7XHJcbmltcG9ydCB7cm91dGUsIHRlbXBsYXRlLCByb3V0ZXJ9IGZyb20gXCIuL3JvdXRldXIuanNcIlxyXG5cclxuLy8gZm9uY3Rpb24gdGVtcGxhdGUgKG5hbWUsIHRlbXBsYXRlRnVuY3Rpb24pID0+IHt9XHJcbnRlbXBsYXRlKFwiaW5kZXhcIiwgZnVuY3Rpb24oKXtcclxuICAgIFZpZXcubG9hZChcIi4vaW5kZXhcIik7IC8vICBWaWV3LmxvYWQobm9tIGRlIGZpY2hpZXIgc2FucyBleHRlbnNpb24pXHJcbn0pO1xyXG4vLyBmb25jdGlvbiByb3V0ZSAocGF0aCwgdGVtcGxhdGUpID0+IHt9XHJcbnJvdXRlKFwiL1wiLCBcImluZGV4XCIpO1xyXG5cclxuLy8gcm91dGUgcmVnaXN0cmF0aW9uXHJcbnRlbXBsYXRlKFwicmVnaXN0cmF0aW9uXCIsIGZ1bmN0aW9uKCl7XHJcbiAgICBWaWV3LmxvYWQoXCIuL3JlZ2lzdHJhdGlvblwiKTsgLy9cclxufSk7XHJcbnJvdXRlKFwiL3JlZ2lzdHJhdGlvbi5odG1sXCIsIFwicmVnaXN0cmF0aW9uXCIpO1xyXG5cclxuLy8gcm91dGUgbG9naW5cclxudGVtcGxhdGUoXCJsb2dpblwiLCBmdW5jdGlvbigpe1xyXG4gICAgVmlldy5sb2FkKFwiLi9sb2dpblwiKTsgLy9cclxufSk7XHJcbnJvdXRlKFwiL2xvZ2luLmh0bWxcIiwgXCJsb2dpblwiKTtcclxuXHJcbi8vIHJvdXRlIHByb2ZpbFxyXG50ZW1wbGF0ZShcInByb2ZpbFwiLCBmdW5jdGlvbigpe1xyXG4gICAgVmlldy5sb2FkKFwiLi9wcm9maWxcIik7IC8vXHJcbn0pO1xyXG5yb3V0ZShcIi9wcm9maWwuaHRtbFwiLCBcInByb2ZpbFwiKTtcclxuXHJcbi8vIChhZG1pbikgcm91dGUgbGlzdGVzIGRcInV0aWxpc2F0ZXVyc1xyXG50ZW1wbGF0ZShcInVzZXJzXCIsIGZ1bmN0aW9uKCl7XHJcbiAgICBWaWV3LmxvYWQoXCIuL3Byb2ZpbHNcIik7IC8vXHJcbn0pO1xyXG5yb3V0ZShcIi91c2Vycy5odG1sXCIsIFwidXNlcnNcIik7XHJcblxyXG4vLyByb3V0ZSB1cGRhdGUgdXNlclxyXG50ZW1wbGF0ZShcInVwZGF0ZVwiLCBmdW5jdGlvbigpe1xyXG4gICAgVmlldy5sb2FkKFwiLi91cGRhdGVcIik7IC8vXHJcbn0pO1xyXG5yb3V0ZShcIi91cGRhdGUuaHRtbFwiLCBcInVwZGF0ZVwiKTtcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCByb3V0ZXIpO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImhhc2hjaGFuZ2VcIiwgcm91dGVyKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/app/src/services/routes.js\n");

/***/ }),

/***/ "./src/app/src/services/routeur.js":
/*!*****************************************!*\
  !*** ./src/app/src/services/routeur.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   route: () => (/* binding */ route),\n/* harmony export */   router: () => (/* binding */ router),\n/* harmony export */   template: () => (/* binding */ template)\n/* harmony export */ });\nvar routes = {}; // objet pour stocker les URLs\nvar templates = {}; // objet pour stocker les templates (les fonctions qui appellent les templates)\n\n// Fonction qui permet de faire le stockage des URLs dans routes\nvar route = function route(path, template) {\n  // console.log('fonction route()', {routes, path, template})\n  if (typeof template === 'function') {\n    return routes[path] = template;\n  } else if (typeof template === 'string') {\n    // routes[path] = templates[page html];\n    return routes[path] = templates[template];\n  } else {\n    return;\n  }\n  ;\n};\n\n// Fonction qui permet de faire le stockage des fonctions appelant les templates\nvar template = function template(name, templateFunction) {\n  templates[name] = templateFunction;\n  // console.log('fonction template', {name, templateFunction, template: templates[name]})\n  return templates;\n};\n\n// Fonction qui retrouve la route et la retourne en fonction du path de la fonction route sinon retourne une erreur\nvar resolveRoute = function resolveRoute(path) {\n  // console.log('fonction resolveRoute()', {path, selectedRoute:routes[path], routes});\n  try {\n    // retourne le template Cf. ligne 8 ave routes[path] = template\n    return routes[path];\n  } catch (e) {\n    throw new Error(\"Route \".concat(path, \" not found\")); // possible de retourner vers E404\n  }\n  ;\n};\nvar router = function router(evt) {\n  var path = window.location.hash.slice(1) || '/';\n  var route = resolveRoute(path);\n  // console.log(\"fonction router()\", {evt, route, path});\n  route();\n};\nconsole.log(\"route\");\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvYXBwL3NyYy9zZXJ2aWNlcy9yb3V0ZXVyLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL2xpc3RlcnIvLi9zcmMvYXBwL3NyYy9zZXJ2aWNlcy9yb3V0ZXVyLmpzP2UzYjkiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IHJvdXRlcyA9IHt9OyAvLyBvYmpldCBwb3VyIHN0b2NrZXIgbGVzIFVSTHNcclxubGV0IHRlbXBsYXRlcyA9IHt9OyAvLyBvYmpldCBwb3VyIHN0b2NrZXIgbGVzIHRlbXBsYXRlcyAobGVzIGZvbmN0aW9ucyBxdWkgYXBwZWxsZW50IGxlcyB0ZW1wbGF0ZXMpXHJcblxyXG4vLyBGb25jdGlvbiBxdWkgcGVybWV0IGRlIGZhaXJlIGxlIHN0b2NrYWdlIGRlcyBVUkxzIGRhbnMgcm91dGVzXHJcbmNvbnN0IHJvdXRlID0gKHBhdGgsIHRlbXBsYXRlKSA9PiB7XHJcbiAgICAvLyBjb25zb2xlLmxvZygnZm9uY3Rpb24gcm91dGUoKScsIHtyb3V0ZXMsIHBhdGgsIHRlbXBsYXRlfSlcclxuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICByZXR1cm4gcm91dGVzW3BhdGhdID0gdGVtcGxhdGU7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmICh0eXBlb2YgdGVtcGxhdGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgLy8gcm91dGVzW3BhdGhdID0gdGVtcGxhdGVzW3BhZ2UgaHRtbF07XHJcbiAgICAgICAgcmV0dXJuIHJvdXRlc1twYXRoXSA9IHRlbXBsYXRlc1t0ZW1wbGF0ZV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH07XHJcbn07XHJcblxyXG4vLyBGb25jdGlvbiBxdWkgcGVybWV0IGRlIGZhaXJlIGxlIHN0b2NrYWdlIGRlcyBmb25jdGlvbnMgYXBwZWxhbnQgbGVzIHRlbXBsYXRlc1xyXG5jb25zdCB0ZW1wbGF0ZSA9IChuYW1lLCB0ZW1wbGF0ZUZ1bmN0aW9uKSA9PiB7XHJcbiAgICB0ZW1wbGF0ZXNbbmFtZV0gPSB0ZW1wbGF0ZUZ1bmN0aW9uO1xyXG4gICAgLy8gY29uc29sZS5sb2coJ2ZvbmN0aW9uIHRlbXBsYXRlJywge25hbWUsIHRlbXBsYXRlRnVuY3Rpb24sIHRlbXBsYXRlOiB0ZW1wbGF0ZXNbbmFtZV19KVxyXG4gICAgcmV0dXJuIHRlbXBsYXRlcztcclxufTtcclxuXHJcbi8vIEZvbmN0aW9uIHF1aSByZXRyb3V2ZSBsYSByb3V0ZSBldCBsYSByZXRvdXJuZSBlbiBmb25jdGlvbiBkdSBwYXRoIGRlIGxhIGZvbmN0aW9uIHJvdXRlIHNpbm9uIHJldG91cm5lIHVuZSBlcnJldXJcclxuY29uc3QgcmVzb2x2ZVJvdXRlID0gKHBhdGgpID0+IHtcclxuICAgIC8vIGNvbnNvbGUubG9nKCdmb25jdGlvbiByZXNvbHZlUm91dGUoKScsIHtwYXRoLCBzZWxlY3RlZFJvdXRlOnJvdXRlc1twYXRoXSwgcm91dGVzfSk7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIC8vIHJldG91cm5lIGxlIHRlbXBsYXRlIENmLiBsaWduZSA4IGF2ZSByb3V0ZXNbcGF0aF0gPSB0ZW1wbGF0ZVxyXG4gICAgICAgIHJldHVybiByb3V0ZXNbcGF0aF07XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBSb3V0ZSAke3BhdGh9IG5vdCBmb3VuZGApOyAvLyBwb3NzaWJsZSBkZSByZXRvdXJuZXIgdmVycyBFNDA0XHJcbiAgICB9O1xyXG59O1xyXG5cclxuY29uc3Qgcm91dGVyID0gKGV2dCkgPT4ge1xyXG4gICAgbGV0IHBhdGggPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zbGljZSgxKSB8fCAnLyc7XHJcbiAgICBsZXQgcm91dGUgPSByZXNvbHZlUm91dGUocGF0aCk7XHJcbiAgICAvLyBjb25zb2xlLmxvZyhcImZvbmN0aW9uIHJvdXRlcigpXCIsIHtldnQsIHJvdXRlLCBwYXRofSk7XHJcbiAgICByb3V0ZSgpO1xyXG59O1xyXG5cclxuY29uc29sZS5sb2coXCJyb3V0ZVwiKTtcclxuZXhwb3J0IHtyb3V0ZSwgdGVtcGxhdGUsIHJvdXRlcn07XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/app/src/services/routeur.js\n");

/***/ }),

/***/ "./src/app/src/services/view.js":
/*!**************************************!*\
  !*** ./src/app/src/services/view.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nfunction _typeof(o) { \"@babel/helpers - typeof\"; return _typeof = \"function\" == typeof Symbol && \"symbol\" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && \"function\" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? \"symbol\" : typeof o; }, _typeof(o); }\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\nfunction _toPropertyKey(arg) { var key = _toPrimitive(arg, \"string\"); return _typeof(key) === \"symbol\" ? key : String(key); }\nfunction _toPrimitive(input, hint) { if (_typeof(input) !== \"object\" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || \"default\"); if (_typeof(res) !== \"object\") return res; throw new TypeError(\"@@toPrimitive must return a primitive value.\"); } return (hint === \"string\" ? String : Number)(input); }\nfunction _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }\nfunction _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError(\"Cannot initialize the same private elements twice on an object\"); } }\nfunction _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, \"get\"); return _classApplyDescriptorGet(receiver, descriptor); }\nfunction _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }\nfunction _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, \"set\"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }\nfunction _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError(\"attempted to \" + action + \" private field on non-instance\"); } return privateMap.get(receiver); }\nfunction _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError(\"attempted to set read only private field\"); } descriptor.value = value; } }\nvar _wrapperTarget = /*#__PURE__*/new WeakMap();\nvar View = /*#__PURE__*/function () {\n  function View() {\n    _classCallCheck(this, View);\n    _classPrivateFieldInitSpec(this, _wrapperTarget, {\n      writable: true,\n      value: void 0\n    });\n    _classPrivateFieldSet(this, _wrapperTarget, 'content');\n  }\n  _createClass(View, [{\n    key: \"setWrapperTarget\",\n    value: function setWrapperTarget(value) {\n      _classPrivateFieldSet(this, _wrapperTarget, value);\n    }\n  }, {\n    key: \"load\",\n    value: function load(viewPath) {\n      // console.log('fonction load()', {viewPath})\n\n      var wrapper = document.getElementById(_classPrivateFieldGet(this, _wrapperTarget));\n      fetch(\"\".concat(viewPath, \".html\"), {\n        headers: {\n          'Content-Type': 'application/text'\n        }\n      }).then(function (response) {\n        return response.text();\n      }).then(function (html) {\n        // console.log({html})\n        wrapper.innerHTML = html;\n        // console.log(wrapper)\n      })[\"catch\"](function (e) {\n        return console.error(e);\n      });\n    }\n  }]);\n  return View;\n}();\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new View());//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvYXBwL3NyYy9zZXJ2aWNlcy92aWV3LmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBR0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUdBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFHQTs7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFHQSIsInNvdXJjZXMiOlsid2VicGFjazovL2xpc3RlcnIvLi9zcmMvYXBwL3NyYy9zZXJ2aWNlcy92aWV3LmpzP2VlZTgiXSwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgVmlldyB7XHJcbiAgICAjd3JhcHBlclRhcmdldDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLiN3cmFwcGVyVGFyZ2V0ID0gJ2NvbnRlbnQnO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFdyYXBwZXJUYXJnZXQgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy4jd3JhcHBlclRhcmdldCA9IHZhbHVlXHJcbiAgICB9XHJcblxyXG4gICAgbG9hZCAodmlld1BhdGgpIHtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnZm9uY3Rpb24gbG9hZCgpJywge3ZpZXdQYXRofSlcclxuXHJcbiAgICAgICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuI3dyYXBwZXJUYXJnZXQpO1xyXG5cclxuICAgICAgICBmZXRjaChgJHt2aWV3UGF0aH0uaHRtbGAse1xyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3RleHQnLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS50ZXh0KCkpXHJcbiAgICAgICAgLnRoZW4oaHRtbCA9PiB7XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHtodG1sfSlcclxuICAgICAgICAgICAgd3JhcHBlci5pbm5lckhUTUwgPSBodG1sXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHdyYXBwZXIpXHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goZSA9PiBjb25zb2xlLmVycm9yKGUpKTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IFZpZXcoKTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/app/src/services/view.js\n");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app/src/services/routes.js");
/******/ 	
/******/ })()
;