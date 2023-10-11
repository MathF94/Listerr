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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   navigation: () => (/* binding */ navigation)\n/* harmony export */ });\nfunction navigation(template) {\n  var token = localStorage.getItem(\"token\");\n  var user = localStorage.getItem(\"user\");\n  var nav = document.createElement(\"nav\");\n  nav.id = \"mainNav\";\n  nav.className = \"mainNav\";\n  var ul = document.createElement(\"ul\");\n  if (token === undefined || token === null || user === null || user === undefined) {\n    var links = [{\n      text: \"Accueil\",\n      href: \"#/home.html\",\n      id: \"nav_home\"\n    }, {\n      text: \"Inscription\",\n      href: \"#/registration.html\",\n      id: \"nav_register\"\n    }, {\n      text: \"Connexion\",\n      href: \"#/login.html\",\n      id: \"nav_login\"\n    }];\n    addLinks(links);\n  }\n  ;\n  if (user !== undefined && user !== null) {\n    var _links = [{\n      text: \"Accueil\",\n      href: \"#/home.html\",\n      id: \"nav_home\"\n    }, {\n      text: \"Déconnexion\",\n      id: \"nav_logout\"\n    }, {\n      text: \"Votre profil\",\n      href: \"#/profil.html\",\n      id: \"nav_profil\"\n    }, {\n      text: \"Listes de souhaits\",\n      href: \"#/wish.html\",\n      id: \"nav_wishlist\"\n    }, {\n      text: \"Listes de tâches\",\n      href: \"#/todo.html\",\n      id: \"nav_todolist\"\n    }];\n    addLinks(_links);\n  }\n  ;\n  if (user) {\n    var dataUser = JSON.parse(user);\n    if (dataUser.is_admin) {\n      var _links2 = [{\n        text: \"Liste d'utilisateurs\",\n        href: \"#/profils.html\",\n        id: \"nav_usersProfil\"\n      }];\n      addLinks(_links2);\n    }\n    ;\n  }\n  ;\n  function addLinks(links) {\n    links.forEach(function (linkData) {\n      var a = document.createElement(\"a\");\n      var li = document.createElement(\"li\");\n      if (linkData.href !== undefined) {\n        a.setAttribute(\"href\", linkData.href);\n        a.id = linkData.id;\n        a.innerText = linkData.text;\n      } else {\n        var _a = document.createElement(\"div\");\n        _a.id = linkData.id;\n        _a.innerText = linkData.text;\n        li.appendChild(_a);\n      }\n      ;\n      li.appendChild(a);\n      ul.appendChild(li);\n    });\n    nav.appendChild(ul);\n    template.appendChild(nav);\n  }\n}\n;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvYXBwL3NyYy9sYXlvdXQvbmF2LmpzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFFQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9saXN0ZXJyLy4vc3JjL2FwcC9zcmMvbGF5b3V0L25hdi5qcz8xODNkIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIG5hdmlnYXRpb24odGVtcGxhdGUpIHtcclxuICAgIGNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJ0b2tlblwiKTtcclxuICAgIGNvbnN0IHVzZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInVzZXJcIik7XHJcbiAgICBjb25zdCBuYXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibmF2XCIpO1xyXG4gICAgbmF2LmlkID0gXCJtYWluTmF2XCI7XHJcbiAgICBuYXYuY2xhc3NOYW1lID0gXCJtYWluTmF2XCI7XHJcbiAgICBjb25zdCB1bCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcclxuXHJcblxyXG4gICAgaWYgKHRva2VuID09PSB1bmRlZmluZWQgfHwgdG9rZW4gPT09IG51bGwgfHwgdXNlciA9PT0gbnVsbCB8fCB1c2VyID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBjb25zdCBsaW5rcyA9IFtcclxuICAgICAgICAgICAge3RleHQ6IFwiQWNjdWVpbFwiLCBocmVmOiBcIiMvaG9tZS5odG1sXCIsIGlkOiBcIm5hdl9ob21lXCJ9LFxyXG4gICAgICAgICAgICB7dGV4dDogXCJJbnNjcmlwdGlvblwiLCBocmVmOiBcIiMvcmVnaXN0cmF0aW9uLmh0bWxcIiwgaWQ6IFwibmF2X3JlZ2lzdGVyXCJ9LFxyXG4gICAgICAgICAgICB7dGV4dDogXCJDb25uZXhpb25cIiwgaHJlZjogXCIjL2xvZ2luLmh0bWxcIiwgaWQ6IFwibmF2X2xvZ2luXCJ9LFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgYWRkTGlua3MobGlua3MpO1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAodXNlciAhPT0gdW5kZWZpbmVkICYmIHVzZXIgIT09IG51bGwpIHtcclxuICAgICAgICBjb25zdCBsaW5rcyA9IFtcclxuICAgICAgICAgICAge3RleHQ6IFwiQWNjdWVpbFwiLCBocmVmOiBcIiMvaG9tZS5odG1sXCIsIGlkOiBcIm5hdl9ob21lXCJ9LFxyXG4gICAgICAgICAgICB7dGV4dDogXCJEw6ljb25uZXhpb25cIiwgaWQ6IFwibmF2X2xvZ291dFwifSxcclxuICAgICAgICAgICAge3RleHQ6IFwiVm90cmUgcHJvZmlsXCIsIGhyZWY6IFwiIy9wcm9maWwuaHRtbFwiLCBpZDogXCJuYXZfcHJvZmlsXCJ9LFxyXG4gICAgICAgICAgICB7dGV4dDogXCJMaXN0ZXMgZGUgc291aGFpdHNcIiwgaHJlZjogXCIjL3dpc2guaHRtbFwiLCBpZDogXCJuYXZfd2lzaGxpc3RcIn0sXHJcbiAgICAgICAgICAgIHt0ZXh0OiBcIkxpc3RlcyBkZSB0w6JjaGVzXCIsIGhyZWY6IFwiIy90b2RvLmh0bWxcIiwgaWQ6IFwibmF2X3RvZG9saXN0XCJ9LFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgYWRkTGlua3MobGlua3MpO1xyXG4gICAgfTtcclxuXHJcbiAgICBpZih1c2VyKXtcclxuICAgICAgICBjb25zdCBkYXRhVXNlciA9IEpTT04ucGFyc2UodXNlcik7XHJcbiAgICAgICAgaWYgKGRhdGFVc2VyLmlzX2FkbWluKXtcclxuICAgICAgICAgICAgY29uc3QgbGlua3MgPSBbXHJcbiAgICAgICAgICAgICAgICB7dGV4dDogXCJMaXN0ZSBkJ3V0aWxpc2F0ZXVyc1wiLCBocmVmOiBcIiMvcHJvZmlscy5odG1sXCIsIGlkOiBcIm5hdl91c2Vyc1Byb2ZpbFwifSxcclxuICAgICAgICAgICAgXTtcclxuICAgICAgICAgICAgYWRkTGlua3MobGlua3MpO1xyXG4gICAgICAgIH07XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGFkZExpbmtzKGxpbmtzKSB7XHJcblxyXG4gICAgICAgIGxpbmtzLmZvckVhY2gobGlua0RhdGEgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xyXG5cclxuICAgICAgICAgICAgaWYobGlua0RhdGEuaHJlZiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBhLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgbGlua0RhdGEuaHJlZik7XHJcbiAgICAgICAgICAgICAgICBhLmlkID0gbGlua0RhdGEuaWQ7XHJcbiAgICAgICAgICAgICAgICBhLmlubmVyVGV4dCA9IGxpbmtEYXRhLnRleHQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgICAgIGEuaWQgPSBsaW5rRGF0YS5pZDtcclxuICAgICAgICAgICAgICAgIGEuaW5uZXJUZXh0ID0gbGlua0RhdGEudGV4dDtcclxuICAgICAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGEpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBsaS5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICAgICAgdWwuYXBwZW5kQ2hpbGQobGkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIG5hdi5hcHBlbmRDaGlsZCh1bCk7XHJcbiAgICAgICAgdGVtcGxhdGUuYXBwZW5kQ2hpbGQobmF2KTtcclxuICAgIH1cclxufTtcclxuXHJcbmV4cG9ydCB7IG5hdmlnYXRpb24gfTsiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/app/src/layout/nav.js\n");

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