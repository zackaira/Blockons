/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/_components/BlockonsColorpicker.js":
/*!***************************************************!*\
  !*** ./blocks/_components/BlockonsColorpicker.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);



const BlockonsColorpicker = props => {
  const {
    label,
    value,
    onChange,
    paletteColors
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Dropdown, {
    className: "blockons-colorpicker",
    contentClassName: "blockons-editor-popup blockons-colorpicker-popup",
    position: "bottom left",
    renderToggle: _ref => {
      let {
        isOpen,
        onToggle
      } = _ref;
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        variant: "link",
        onClick: onToggle,
        className: "blockons-colorpicker-btn"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ColorIndicator, {
        colorValue: value
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, label));
    },
    renderContent: () => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ColorPalette, {
      colors: paletteColors,
      value: value,
      onChange: onChange
    })
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BlockonsColorpicker);

/***/ }),

/***/ "./blocks/block-global.js":
/*!********************************!*\
  !*** ./blocks/block-global.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "accordionArrowIcons": () => (/* binding */ accordionArrowIcons),
/* harmony export */   "colorPickerPalette": () => (/* binding */ colorPickerPalette),
/* harmony export */   "elementTags": () => (/* binding */ elementTags),
/* harmony export */   "iconListIcons": () => (/* binding */ iconListIcons),
/* harmony export */   "marketingButtonIcons": () => (/* binding */ marketingButtonIcons),
/* harmony export */   "minimalRichText": () => (/* binding */ minimalRichText),
/* harmony export */   "sliderArrowIcons": () => (/* binding */ sliderArrowIcons),
/* harmony export */   "slugify": () => (/* binding */ slugify)
/* harmony export */ });
/*
 * Convert Text to slug
 */
const slugify = str => str.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
/*
 * Default Colors for Color Palette
 */

const colorPickerPalette = [{
  name: "white",
  color: "#FFF"
}, {
  name: "Grey",
  color: "#9b9b9b"
}, {
  name: "Black",
  color: "#000"
}, {
  name: "Dark",
  color: "#232323"
}, {
  name: "Turqoise",
  color: "#00b291"
}, {
  name: "Emerald",
  color: "#51d88b"
}, {
  name: "Peter River",
  color: "#3497df"
}, {
  name: "Amethyst",
  color: "#9c56b8"
}, {
  name: "Wet Asphalt",
  color: "#34495d"
}, {
  name: "Sunflower",
  color: "#f1c50f"
}, {
  name: "Carrot",
  color: "#e77e22"
}, {
  name: "Alizarin",
  color: "#e84c3d"
}, {
  name: "Clouds",
  color: "#ecf0f1"
}, {
  name: "Concrete",
  color: "#95a5a5"
}, {
  name: "Dusty Pink",
  color: "#d4afb9"
}, {
  name: "Soft Purple",
  color: "#9cadce"
}, {
  name: "Creamy",
  color: "#f2e8ce"
}, {
  name: "Soil",
  color: "#874c48"
}];
/*
 * RichText Tags to select for RichText
 */

const elementTags = [{
  label: "H1",
  value: "h1"
}, {
  label: "H2",
  value: "h2"
}, {
  label: "H3",
  value: "h3"
}, {
  label: "H4",
  value: "h4"
}, {
  label: "H5",
  value: "h5"
}, {
  label: "H6",
  value: "h6"
}, {
  label: "div",
  value: "div"
}];
/*
 * Font Awesome Icons used in Icon List
 */

const iconListIcons = {
  check: "check",
  "square-check": "square-check",
  "clipboard-check": "clipboard-check",
  "circle-check": "circle-check",
  "check-double": "check-double",
  xmark: "xmark",
  "square-xmark": "square-xmark",
  plus: "plus",
  "circle-plus": "circle-plus",
  minus: "minus",
  "circle-minus": "circle-minus",
  "arrow-right": "arrow-right",
  "circle-arrow-right": "circle-arrow-right",
  "circle-right": "circle-right",
  "chevron-right": "chevron-right",
  "chevron-circle-right": "chevron-circle-right",
  "caret-right": "caret-right",
  "square-caret-right": "square-caret-right",
  "hand-point-right": "hand-point-right",
  star: "star",
  "star-of-life": "star-of-life",
  play: "play",
  info: "info",
  "circle-info": "circle-info",
  heart: "heart",
  bone: "bone",
  skull: "skull",
  "skull-crossbones": "skull-crossbones",
  "earth-americas": "earth-americas",
  "earth-asia": "earth-asia",
  phone: "phone",
  "phone-flip": "phone-flip",
  envelope: "envelope",
  "square-envelope": "square-envelope",
  "envelope-circle-check": "envelope-circle-check",
  inbox: "inbox",
  at: "at",
  "location-dot": "location-dot",
  "location-pin": "location-pin",
  "location-arrow": "location-arrow",
  "map-location": "map-location",
  "map-pin": "map-pin",
  tag: "tag",
  tags: "tags",
  ellipsis: "ellipsis"
};
/*
 * Font Awesome Icons used for Marketing Button
 */

const marketingButtonIcons = {
  "arrow-right": "arrow-right",
  "caret-right": "caret-right",
  "circle-right": "circle-right",
  "right-left": "right-left",
  check: "check",
  bullhorn: "bullhorn",
  "star-of-life": "star-of-life",
  "circle-radiation": "circle-radiation",
  "comment-sms": "comment-sms",
  comment: "comment",
  "face-grin": "face-grin",
  "hands-clapping": "hands-clapping",
  bug: "bug",
  play: "play",
  info: "info",
  flag: "flag",
  road: "road",
  gears: "gears",
  recycle: "recycle",
  scissors: "scissors",
  gift: "gift",
  "power-off": "power-off",
  rotate: "rotate",
  print: "print",
  podcast: "podcast",
  "circle-info": "circle-info",
  certificate: "certificate",
  heart: "heart",
  bone: "bone",
  skull: "skull",
  "skull-crossbones": "skull-crossbones",
  phone: "phone",
  "phone-flip": "phone-flip",
  envelope: "envelope",
  "square-envelope": "square-envelope",
  "envelope-circle-check": "envelope-circle-check",
  "envelopes-bulk": "envelopes-bulk",
  "envelope-open-text": "envelope-open-text",
  inbox: "inbox",
  at: "at",
  atom: "atom",
  house: "house",
  plane: "plane",
  plug: "plug",
  "location-dot": "location-dot",
  "location-arrow": "location-arrow",
  "map-location": "map-location",
  "map-pin": "map-pin",
  tags: "tags",
  "chart-simple": "chart-simple",
  "people-group": "people-group",
  "rectangle-ad": "rectangle-ad",
  lightbulb: "lightbulb",
  timeline: "timeline",
  award: "award",
  "baby-carriage": "baby-carriage",
  bell: "bell",
  "pizza-slice": "pizza-slice",
  bookmark: "bookmark",
  "ice-cream": "ice-cream",
  pen: "pen",
  "pen-fancy": "pen-fancy"
};
/*
 * Font Awesome Icons used for slider arrows
 */

const sliderArrowIcons = {
  "arrow-right": "arrow-right",
  "arrow-right-long": "arrow-right-long",
  "angle-right": "angle-right",
  "caret-right": "caret-right",
  "angles-right": "angles-right"
};
/*
 * Font Awesome Icons used for accordions
 */

const accordionArrowIcons = {
  "arrow-right": "arrow-right",
  "arrow-right-long": "arrow-right-long",
  "angle-right": "angle-right",
  "caret-right": "caret-right",
  "angles-right": "angles-right",
  plus: "plus",
  eye: "eye",
  "circle-plus": "circle-plus"
};
/*
 * Minimal RichText Settings
 */

const minimalRichText = ["core/bold", "core/italic", "core/highlight", "core/subscript", "core/superscript", "core/strikethrough"];

/***/ }),

/***/ "./blocks/wc-account-icon/edit.js":
/*!****************************************!*\
  !*** ./blocks/wc-account-icon/edit.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_BlockonsColorpicker__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../_components/BlockonsColorpicker */ "./blocks/_components/BlockonsColorpicker.js");
/* harmony import */ var _block_global__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../block-global */ "./blocks/block-global.js");


/**
 * WordPress dependencies
 */







const Edit = props => {
  const {
    isSelected,
    attributes: {
      alignment,
      hasDropdown,
      showDashboard,
      showOrders,
      showDownloads,
      showAddresses,
      showAccountDetails,
      textDashboard,
      textOrders,
      textDownloads,
      textAddresses,
      textAccountDetails,
      icon,
      iconSize,
      iconPadding,
      customIcon,
      iconBgColor,
      iconColor,
      dropBgColor,
      dropColor
    },
    setAttributes
  } = props;
  const [showDropDown, setShowDropDown] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
    className: alignment
  });

  const onChangeAlignment = newAlignment => {
    setAttributes({
      alignment: newAlignment === undefined ? "none" : "align-" + newAlignment
    });
  };

  const onChangeCustomIcon = value => {
    setAttributes({
      customIcon: value
    });
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, isSelected && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("WC Account Icon Settings", "blockons"),
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Add Drop Down Menu", "blockons"),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Add a drop down menu on hover to display account page links.", "blockons"),
    checked: hasDropdown,
    onChange: newValue => {
      setAttributes({
        hasDropdown: newValue
      });
    }
  }), hasDropdown && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl // This setting is just for displaying the drop down, value is not saved.
  , {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Always Show Drop Down", "blockons"),
    checked: showDropDown,
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("This will always display the drop down ONLY in the editor", "blockons"),
    onChange: () => {
      setShowDropDown(state => !state);
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.CheckboxControl, {
    label: "Dashboard",
    checked: showDashboard,
    onChange: newValue => {
      setAttributes({
        showDashboard: newValue
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.CheckboxControl, {
    label: "Orders",
    checked: showOrders,
    onChange: newValue => {
      setAttributes({
        showOrders: newValue
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.CheckboxControl, {
    label: "Downloads",
    checked: showDownloads,
    onChange: newValue => {
      setAttributes({
        showDownloads: newValue
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.CheckboxControl, {
    label: "Addresses",
    checked: showAddresses,
    onChange: newValue => {
      setAttributes({
        showAddresses: newValue
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.CheckboxControl, {
    label: "Account Details",
    checked: showAccountDetails,
    onChange: newValue => {
      setAttributes({
        showAccountDetails: newValue
      });
    }
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("WC Account Icon Design", "blockons"),
    initialOpen: false
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Select an Icon", "blockons"),
    value: icon,
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("User Outline", "blockons"),
      value: "fa-regular fa-user"
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("User", "blockons"),
      value: "fa-solid fa-user"
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Circle User", "blockons"),
      value: "fa-solid fa-circle-user"
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Person", "blockons"),
      value: "fa-solid fa-person"
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Custom Icon", "blockons"),
      value: "custom"
    }],
    onChange: newIcon => setAttributes({
      icon: newIcon === undefined ? "fa-regular fa-user" : newIcon
    }),
    __nextHasNoMarginBottom: true
  }), icon === "custom" && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Icon Name", "blockons"),
    value: customIcon,
    onChange: onChangeCustomIcon,
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Add your own custom icon by adding the Font Awesome icon full name", "blockons")
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "helplink fixmargin"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: "#",
    target: "_blank"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Read More")))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Icon Size", "blockons"),
    value: iconSize,
    onChange: value => setAttributes({
      iconSize: value === undefined ? 20 : value
    }),
    min: 14,
    max: 80
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Icon Padding", "blockons"),
    value: iconPadding,
    onChange: value => setAttributes({
      iconPadding: value === undefined ? 20 : value
    }),
    min: 0,
    max: 80
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_BlockonsColorpicker__WEBPACK_IMPORTED_MODULE_4__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Icon Background Color", "blockons"),
    value: iconBgColor,
    onChange: colorValue => {
      setAttributes({
        iconBgColor: colorValue === undefined ? "#FFF" : colorValue
      });
    },
    paletteColors: _block_global__WEBPACK_IMPORTED_MODULE_5__.colorPickerPalette
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_BlockonsColorpicker__WEBPACK_IMPORTED_MODULE_4__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Icon Color", "blockons"),
    value: iconColor,
    onChange: colorValue => {
      setAttributes({
        iconColor: colorValue === undefined ? "#000" : colorValue
      });
    },
    paletteColors: _block_global__WEBPACK_IMPORTED_MODULE_5__.colorPickerPalette
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_BlockonsColorpicker__WEBPACK_IMPORTED_MODULE_4__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Drop Down Background Color", "blockons"),
    value: dropBgColor,
    onChange: colorValue => {
      setAttributes({
        dropBgColor: colorValue === undefined ? "#FFF" : colorValue
      });
    },
    paletteColors: _block_global__WEBPACK_IMPORTED_MODULE_5__.colorPickerPalette
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_BlockonsColorpicker__WEBPACK_IMPORTED_MODULE_4__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Drop Down Font Color", "blockons"),
    value: dropColor,
    onChange: colorValue => {
      setAttributes({
        dropColor: colorValue === undefined ? "#747474" : colorValue
      });
    },
    paletteColors: _block_global__WEBPACK_IMPORTED_MODULE_5__.colorPickerPalette
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.BlockControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.AlignmentToolbar, {
    value: alignment,
    onChange: onChangeAlignment
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `blockons-wc-account-icon-block ${isSelected && showDropDown ? "show" : ""}`,
    style: {
      backgroundColor: iconBgColor,
      fontSize: iconSize,
      padding: iconPadding
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: customIcon && icon == "custom" ? customIcon : icon,
    style: {
      color: iconColor
    }
  }), hasDropdown && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "blockons-wc-account-icon-dropdown",
    style: {
      backgroundColor: dropBgColor,
      color: dropColor
    }
  }, showDashboard && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "blockons-wc-account-icon-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Dashboard", "blockons"),
    value: textDashboard,
    onChange: newValue => setAttributes({
      textDashboard: newValue === undefined ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Dashboard", "blockons") : newValue
    })
  })), showOrders && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "blockons-wc-account-icon-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Orders", "blockons"),
    value: textOrders,
    onChange: newValue => setAttributes({
      textOrders: newValue === undefined ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Orders", "blockons") : newValue
    })
  })), showDownloads && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "blockons-wc-account-icon-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Downloads", "blockons"),
    value: textDownloads,
    onChange: newValue => setAttributes({
      textDownloads: newValue === undefined ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Downloads", "blockons") : newValue
    })
  })), showAddresses && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "blockons-wc-account-icon-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Addresses", "blockons"),
    value: textAddresses,
    onChange: newValue => setAttributes({
      textAddresses: newValue === undefined ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Addresses", "blockons") : newValue
    })
  })), showAccountDetails && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "blockons-wc-account-icon-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
    tagName: "div",
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Account Details", "blockons"),
    value: textAccountDetails,
    onChange: newValue => setAttributes({
      textAccountDetails: newValue === undefined ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Account Details", "blockons") : newValue
    })
  })))));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Edit);

/***/ }),

/***/ "./blocks/wc-account-icon/index.js":
/*!*****************************************!*\
  !*** ./blocks/wc-account-icon/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block.json */ "./blocks/wc-account-icon/block.json");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./blocks/wc-account-icon/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./blocks/wc-account-icon/save.js");
/* harmony import */ var _editor_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.css */ "./blocks/wc-account-icon/editor.css");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.css */ "./blocks/wc-account-icon/style.css");
/**
 * WordPress dependencies
 */

/**
 * Internal dependencies
 */






const {
  name
} = _block_json__WEBPACK_IMPORTED_MODULE_1__;
/**
 * Register the Block
 */

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(name, {
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: _save__WEBPACK_IMPORTED_MODULE_3__["default"]
});

/***/ }),

/***/ "./blocks/wc-account-icon/save.js":
/*!****************************************!*\
  !*** ./blocks/wc-account-icon/save.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);


/**
 * WordPress dependencies
 */


const Save = _ref => {
  let {
    attributes
  } = _ref;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
    className: attributes.alignment
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `blockons-wc-account-icon-block`,
    style: {
      backgroundColor: attributes.iconBgColor,
      fontSize: attributes.iconSize,
      padding: attributes.iconPadding
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: attributes.customIcon && attributes.icon == "custom" ? attributes.customIcon : attributes.icon,
    style: {
      color: attributes.iconColor
    }
  }), attributes.hasDropdown && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "blockons-wc-account-icon-dropdown",
    style: {
      backgroundColor: attributes.dropBgColor,
      color: attributes.dropColor
    }
  }, attributes.showDashboard && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "blockons-wc-account-icon-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: ""
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
    value: attributes.textDashboard
  }))), attributes.showOrders && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "blockons-wc-account-icon-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: ""
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
    value: attributes.textOrders
  }))), attributes.showDownloads && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "blockons-wc-account-icon-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: ""
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
    value: attributes.textDownloads
  }))), attributes.showAddresses && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "blockons-wc-account-icon-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: ""
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
    value: attributes.textAddresses
  }))), attributes.showAccountDetails && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "blockons-wc-account-icon-item"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: ""
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
    value: attributes.textAccountDetails
  }))))));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Save);

/***/ }),

/***/ "./blocks/wc-account-icon/editor.css":
/*!*******************************************!*\
  !*** ./blocks/wc-account-icon/editor.css ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/wc-account-icon/style.css":
/*!******************************************!*\
  !*** ./blocks/wc-account-icon/style.css ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./blocks/wc-account-icon/block.json":
/*!*******************************************!*\
  !*** ./blocks/wc-account-icon/block.json ***!
  \*******************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"https://json.schemastore.org/block.json","apiVersion":2,"name":"blockons/wc-account-icon","title":"WooCommerce Account Icon","textdomain":"blockons","icon":"admin-users","category":"blockons-category","keywords":["account","icon","profile","woocommerce","header"],"attributes":{"alignment":{"type":"string","default":"none"},"hasDropdown":{"type":"boolean","default":false},"showDashboard":{"type":"boolean","default":true},"showOrders":{"type":"boolean","default":true},"showDownloads":{"type":"boolean","default":true},"showAddresses":{"type":"boolean","default":true},"showAccountDetails":{"type":"boolean","default":true},"textDashboard":{"type":"string","default":"Dashboard"},"textOrders":{"type":"string","default":"Orders"},"textDownloads":{"type":"string","default":"Downloads"},"textAddresses":{"type":"string","default":"Addresses"},"textAccountDetails":{"type":"string","default":"Account Details"},"icon":{"type":"string","default":"fa-regular fa-user"},"iconSize":{"type":"number","default":20},"iconPadding":{"type":"number","default":15},"customIcon":{"type":"string","default":"fa-regular fa-face-smile"},"iconBgColor":{"type":"string","default":"#FFF"},"iconColor":{"type":"string","default":"#000"},"dropBgColor":{"type":"string","default":"#FFF"},"dropColor":{"type":"string","default":"#747474"}},"editorScript":"file:./index.js","editorStyle":"file:./index.css","style":["file:./style-index.css","blockons-fontawesome"]}');

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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var chunkIds = deferred[i][0];
/******/ 				var fn = deferred[i][1];
/******/ 				var priority = deferred[i][2];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"wc-account-icon/index": 0,
/******/ 			"wc-account-icon/style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var chunkIds = data[0];
/******/ 			var moreModules = data[1];
/******/ 			var runtime = data[2];
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkblockons"] = self["webpackChunkblockons"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["wc-account-icon/style-index"], () => (__webpack_require__("./blocks/wc-account-icon/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map