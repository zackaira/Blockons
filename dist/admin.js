/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/backend/admin/admin.css":
/*!*************************************!*\
  !*** ./src/backend/admin/admin.css ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************************!*\
  !*** ./src/backend/admin/admin.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _admin_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./admin.css */ "./src/backend/admin/admin.css");

/*
 * Blockons Admin JS
 */

document.addEventListener("DOMContentLoaded", function () {
  var blockonsRm_FsMenuLinks = document.querySelectorAll(".fs-submenu-item.blockons");

  if (blockonsRm_FsMenuLinks) {
    blockonsRm_FsMenuLinks.forEach(function (item) {
      item.closest("li").remove();
    });
  } //   const rateClick = document.querySelector(".wasc-rating-click");
  //   const rateShow = document.querySelector(".wasc-notice-rate");
  //   if (rateClick) {
  //     rateClick.addEventListener("click", () => {
  //       rateClick.style.display = "none";
  //       rateShow.style.display = "block";
  //     });
  //   }

});
})();

/******/ })()
;