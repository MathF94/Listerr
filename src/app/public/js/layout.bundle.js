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

/***/ "./src/app/src/layout/header.js":
/*!**************************************!*\
  !*** ./src/app/src/layout/header.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   header: () => (/* binding */ header)\n/* harmony export */ });\n/* harmony import */ var _nav_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./nav.js */ \"./src/app/src/layout/nav.js\");\n\nfunction header() {\n  var header = document.createElement('header');\n  header.id = \"mainWrapper\";\n  header.className = \"mainWrapper\";\n  var title = document.createElement('h1');\n  title.id = \"mainTitle\";\n  title.className = \"mainTitle\";\n  title.innerText = 'Listerr';\n  title.style.textAlign = 'Center';\n  header.appendChild(title);\n  (0,_nav_js__WEBPACK_IMPORTED_MODULE_0__.navigation)(header);\n  document.body.prepend(header);\n}\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n  header();\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvYXBwL3NyYy9sYXlvdXQvaGVhZGVyLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2xpc3RlcnIvLi9zcmMvYXBwL3NyYy9sYXlvdXQvaGVhZGVyLmpzPzQzOTMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbmF2aWdhdGlvbiB9IGZyb20gJy4vbmF2LmpzJztcclxuXHJcbmZ1bmN0aW9uIGhlYWRlcigpIHtcclxuICAgIGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hlYWRlcicpXHJcbiAgICBoZWFkZXIuaWQgPSBcIm1haW5XcmFwcGVyXCI7XHJcbiAgICBoZWFkZXIuY2xhc3NOYW1lID0gXCJtYWluV3JhcHBlclwiO1xyXG5cclxuICAgIGNvbnN0IHRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKVxyXG4gICAgdGl0bGUuaWQgPSBcIm1haW5UaXRsZVwiO1xyXG4gICAgdGl0bGUuY2xhc3NOYW1lID0gXCJtYWluVGl0bGVcIjtcclxuICAgIHRpdGxlLmlubmVyVGV4dCA9ICdMaXN0ZXJyJztcclxuICAgIHRpdGxlLnN0eWxlLnRleHRBbGlnbiA9ICdDZW50ZXInO1xyXG4gICAgaGVhZGVyLmFwcGVuZENoaWxkKHRpdGxlKVxyXG5cclxuICAgIG5hdmlnYXRpb24oaGVhZGVyKTtcclxuXHJcbiAgICBkb2N1bWVudC5ib2R5LnByZXBlbmQoaGVhZGVyKTtcclxufVxyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xyXG4gICAgaGVhZGVyKCk7XHJcbn0pXHJcblxyXG5leHBvcnQgeyBoZWFkZXIgfSA7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/app/src/layout/header.js\n");

/***/ }),

/***/ "./src/app/src/layout/layout.js":
/*!**************************************!*\
  !*** ./src/app/src/layout/layout.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _header_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./header.js */ \"./src/app/src/layout/header.js\");\n\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvYXBwL3NyYy9sYXlvdXQvbGF5b3V0LmpzIiwibWFwcGluZ3MiOiI7O0FBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9saXN0ZXJyLy4vc3JjL2FwcC9zcmMvbGF5b3V0L2xheW91dC5qcz9hNzc0Il0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5cclxuaW1wb3J0IHsgaGVhZGVyIH0gZnJvbSBcIi4vaGVhZGVyLmpzXCI7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/app/src/layout/layout.js\n");

/***/ }),

/***/ "./src/app/src/layout/nav.js":
/*!***********************************!*\
  !*** ./src/app/src/layout/nav.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   navigation: () => (/* binding */ navigation)\n/* harmony export */ });\nfunction navigation(template) {\n  var token = localStorage.getItem(\"token\");\n  var user = localStorage.getItem(\"user\");\n  var nav = document.createElement(\"nav\");\n  nav.id = \"mainNav\";\n  nav.className = \"mainNav\";\n  var ul = document.createElement(\"ul\");\n  if (user) {\n    var dataUser = JSON.parse(user);\n    if (dataUser.is_admin) {\n      var links = [{\n        text: \"Liste d'utilisateurs\",\n        href: \"#/profils.html\",\n        id: \"nav_usersProfil\"\n      }];\n      addLinks(links);\n    }\n    ;\n  }\n  ;\n  if (token === undefined || token === null || user === null || user === undefined) {\n    var _links = [{\n      text: \"Inscription\",\n      href: \"#/registration.html\",\n      id: \"nav_register\"\n    }, {\n      text: \"Connexion\",\n      href: \"#/login.html\",\n      id: \"nav_login\"\n    }];\n    addLinks(_links);\n  }\n  ;\n  if (user !== undefined && user !== null) {\n    var _links2 = [{\n      text: \"Votre profil\",\n      href: \"#/profil.html\",\n      id: \"nav_profil\"\n    }, {\n      text: \"Listes\",\n      href: \"#/list.html\",\n      id: \"nav_list\"\n    }, {\n      text: \"Déconnexion\",\n      id: \"nav_logout\"\n    }];\n    addLinks(_links2);\n  }\n  ;\n  function addLinks(links) {\n    links.forEach(function (linkData) {\n      var a = document.createElement(\"a\");\n      var li = document.createElement(\"li\");\n      if (linkData.href !== undefined) {\n        a.setAttribute(\"href\", linkData.href);\n        a.id = linkData.id;\n        a.innerText = linkData.text;\n      } else {\n        var _a = document.createElement(\"div\");\n        _a.id = linkData.id;\n        _a.innerText = linkData.text;\n        li.appendChild(_a);\n      }\n      ;\n      li.appendChild(a);\n      ul.appendChild(li);\n    });\n    nav.appendChild(ul);\n    template.appendChild(nav);\n  }\n}\n;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvYXBwL3NyYy9sYXlvdXQvbmF2LmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQUE7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUVBO0FBQ0E7QUFBQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9saXN0ZXJyLy4vc3JjL2FwcC9zcmMvbGF5b3V0L25hdi5qcz8xODNkIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIG5hdmlnYXRpb24odGVtcGxhdGUpIHtcclxuICAgIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcclxuICAgIGNvbnN0IHVzZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInVzZXJcIik7XHJcbiAgICBjb25zdCBuYXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibmF2XCIpO1xyXG4gICAgbmF2LmlkID0gXCJtYWluTmF2XCI7XHJcbiAgICBuYXYuY2xhc3NOYW1lID0gXCJtYWluTmF2XCI7XHJcbiAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcclxuXHJcbiAgICBpZih1c2VyKXtcclxuICAgICAgICBjb25zdCBkYXRhVXNlciA9IEpTT04ucGFyc2UodXNlcik7XHJcbiAgICAgICAgaWYgKGRhdGFVc2VyLmlzX2FkbWluKXtcclxuICAgICAgICAgICAgY29uc3QgbGlua3MgPSBbXHJcbiAgICAgICAgICAgICAgICB7dGV4dDogXCJMaXN0ZSBkJ3V0aWxpc2F0ZXVyc1wiLCBocmVmOiBcIiMvcHJvZmlscy5odG1sXCIsIGlkOiBcIm5hdl91c2Vyc1Byb2ZpbFwifSxcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgYWRkTGlua3MobGlua3MpO1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIGlmICh0b2tlbiA9PT0gdW5kZWZpbmVkIHx8IHRva2VuID09PSBudWxsIHx8IHVzZXIgPT09IG51bGwgfHwgdXNlciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgY29uc3QgbGlua3MgPSBbXHJcbiAgICAgICAgICAgIHt0ZXh0OiBcIkluc2NyaXB0aW9uXCIsIGhyZWY6IFwiIy9yZWdpc3RyYXRpb24uaHRtbFwiLCBpZDogXCJuYXZfcmVnaXN0ZXJcIn0sXHJcbiAgICAgICAgICAgIHt0ZXh0OiBcIkNvbm5leGlvblwiLCBocmVmOiBcIiMvbG9naW4uaHRtbFwiLCBpZDogXCJuYXZfbG9naW5cIn0sXHJcbiAgICAgICAgXTtcclxuICAgICAgICBhZGRMaW5rcyhsaW5rcyk7XHJcbiAgICB9O1xyXG5cclxuICAgIGlmICh1c2VyICE9PSB1bmRlZmluZWQgJiYgdXNlciAhPT0gbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IGxpbmtzID0gW1xyXG4gICAgICAgICAgICB7dGV4dDogXCJWb3RyZSBwcm9maWxcIiwgaHJlZjogXCIjL3Byb2ZpbC5odG1sXCIsIGlkOiBcIm5hdl9wcm9maWxcIn0sXHJcbiAgICAgICAgICAgIHt0ZXh0OiBcIkxpc3Rlc1wiLCBocmVmOiBcIiMvbGlzdC5odG1sXCIsIGlkOiBcIm5hdl9saXN0XCJ9LFxyXG4gICAgICAgICAgICB7dGV4dDogXCJEw6ljb25uZXhpb25cIiwgaWQ6IFwibmF2X2xvZ291dFwifSxcclxuICAgICAgICBdO1xyXG4gICAgICAgIGFkZExpbmtzKGxpbmtzKTtcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gYWRkTGlua3MobGlua3MpIHtcclxuXHJcbiAgICAgICAgbGlua3MuZm9yRWFjaChsaW5rRGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcclxuICAgICAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XHJcblxyXG4gICAgICAgICAgICBpZihsaW5rRGF0YS5ocmVmICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGEuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCBsaW5rRGF0YS5ocmVmKTtcclxuICAgICAgICAgICAgICAgIGEuaWQgPSBsaW5rRGF0YS5pZDtcclxuICAgICAgICAgICAgICAgIGEuaW5uZXJUZXh0ID0gbGlua0RhdGEudGV4dDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICAgICAgYS5pZCA9IGxpbmtEYXRhLmlkO1xyXG4gICAgICAgICAgICAgICAgYS5pbm5lclRleHQgPSBsaW5rRGF0YS50ZXh0O1xyXG4gICAgICAgICAgICAgICAgbGkuYXBwZW5kQ2hpbGQoYSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgICAgICB1bC5hcHBlbmRDaGlsZChsaSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbmF2LmFwcGVuZENoaWxkKHVsKTtcclxuICAgICAgICB0ZW1wbGF0ZS5hcHBlbmRDaGlsZChuYXYpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IHsgbmF2aWdhdGlvbiB9OyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/app/src/layout/nav.js\n");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app/src/layout/layout.js");
/******/ 	
/******/ })()
;