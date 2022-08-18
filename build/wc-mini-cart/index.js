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

/***/ "./blocks/wc-mini-cart/edit.js":
/*!*************************************!*\
  !*** ./blocks/wc-mini-cart/edit.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _components_BlockonsColorpicker__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../_components/BlockonsColorpicker */ "./blocks/_components/BlockonsColorpicker.js");
/* harmony import */ var _block_global__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../block-global */ "./blocks/block-global.js");



/**
 * WordPress dependencies
 */







const Edit = props => {
  const {
    isSelected,
    attributes: {
      cartLink,
      cartLinkNewTab,
      alignment,
      hasDropdown,
      dropPosition,
      noItems,
      noAmount,
      icon,
      iconSize,
      layoutSwitch,
      iconPadding,
      customIcon,
      iconBgColor,
      textColor,
      iconColor,
      dropBgColor,
      dropColor
    },
    setAttributes
  } = props;
  const [showMiniCart, setShowMiniCart] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps)({
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

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", blockProps, isSelected && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("WC Mini Cart Settings", "blockons"),
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
    label: "Cart Page Url",
    value: cartLink,
    onChange: newValue => {
      setAttributes({
        cartLink: newValue === undefined ? cartIconObj.wcCartUrl : newValue
      });
    },
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("If not set, this defaults to the WooCommerce cart page", "blockons")
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Open in a new tab", "blockons"),
    checked: cartLinkNewTab,
    onChange: newValue => {
      setAttributes({
        cartLinkNewTab: newValue
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Add Mini Cart", "blockons"),
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Add a drop down mini cart to display cart items", "blockons"),
    checked: hasDropdown,
    onChange: newValue => {
      setAttributes({
        hasDropdown: newValue
      });
    }
  }), hasDropdown && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl // This setting is just for displaying the drop down, value is not saved.
  , {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Always Show Drop Down", "blockons"),
    checked: showMiniCart,
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("This will always display the drop down ONLY in the editor", "blockons"),
    onChange: () => {
      setShowMiniCart(state => !state);
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Remove Cart Amount", "blockons"),
    checked: noAmount,
    onChange: newValue => {
      setAttributes({
        noAmount: newValue
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Remove Items Count", "blockons"),
    checked: noItems,
    onChange: newValue => {
      setAttributes({
        noItems: newValue
      });
    }
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("WC Mini Cart Design", "blockons"),
    initialOpen: false
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Switch Layout", "blockons"),
    checked: layoutSwitch,
    onChange: newValue => {
      setAttributes({
        layoutSwitch: newValue
      });
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Select an Icon", "blockons"),
    value: icon,
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Shopping Cart", "blockons"),
      value: "cart-shopping"
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Cart Arrow Down", "blockons"),
      value: "cart-arrow-down"
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Shopping Basket", "blockons"),
      value: "basket-shopping"
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Shopping Bag", "blockons"),
      value: "bag-shopping"
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Shopping Suitcase", "blockons"),
      value: "suitcase"
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Bucket", "blockons"),
      value: "bucket"
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Custom Icon", "blockons"),
      value: "custom"
    }],
    onChange: newIcon => setAttributes({
      icon: newIcon === undefined ? "cart-shopping" : newIcon
    }),
    __nextHasNoMarginBottom: true
  }), icon === "custom" && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
    label: "Custom Icon Name",
    value: customIcon,
    onChange: onChangeCustomIcon,
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Add your own custom icon by adding the Font Awesome icon name", "blockons")
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "helplink fixmargin"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("a", {
    href: "#",
    target: "_blank"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Read More")))), hasDropdown && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Drop Down Cart Position", "blockons"),
    value: dropPosition,
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Bottom Right", "blockons"),
      value: "bottom-right"
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Bottom Left", "blockons"),
      value: "bottom-left"
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Top Right", "blockons"),
      value: "top-right"
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Top Left", "blockons"),
      value: "top-left"
    }],
    onChange: newPosition => setAttributes({
      dropPosition: newPosition === undefined ? "bottom-right" : newPosition
    }),
    __nextHasNoMarginBottom: true
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Icon Size", "blockons"),
    value: iconSize,
    onChange: value => setAttributes({
      iconSize: value === undefined ? 17 : value
    }),
    min: 14,
    max: 50
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Icon Padding", "blockons"),
    value: iconPadding,
    onChange: value => setAttributes({
      iconPadding: value === undefined ? 5 : value
    }),
    min: 0,
    max: 50
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_components_BlockonsColorpicker__WEBPACK_IMPORTED_MODULE_5__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Background Color", "blockons"),
    value: iconBgColor,
    onChange: colorValue => {
      setAttributes({
        iconBgColor: colorValue === undefined ? "#FFF" : colorValue
      });
    },
    paletteColors: _block_global__WEBPACK_IMPORTED_MODULE_6__.colorPickerPalette
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_components_BlockonsColorpicker__WEBPACK_IMPORTED_MODULE_5__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Text Color", "blockons"),
    value: textColor,
    onChange: colorValue => {
      setAttributes({
        textColor: colorValue === undefined ? "#444" : colorValue
      });
    },
    paletteColors: _block_global__WEBPACK_IMPORTED_MODULE_6__.colorPickerPalette
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_components_BlockonsColorpicker__WEBPACK_IMPORTED_MODULE_5__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Icon Color", "blockons"),
    value: iconColor,
    onChange: colorValue => {
      setAttributes({
        iconColor: colorValue === undefined ? "#000" : colorValue
      });
    },
    paletteColors: _block_global__WEBPACK_IMPORTED_MODULE_6__.colorPickerPalette
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_components_BlockonsColorpicker__WEBPACK_IMPORTED_MODULE_5__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Drop Down Background Color", "blockons"),
    value: dropBgColor,
    onChange: colorValue => {
      setAttributes({
        dropBgColor: colorValue === undefined ? "#FFF" : colorValue
      });
    },
    paletteColors: _block_global__WEBPACK_IMPORTED_MODULE_6__.colorPickerPalette
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_components_BlockonsColorpicker__WEBPACK_IMPORTED_MODULE_5__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("Drop Down Font Color", "blockons"),
    value: dropColor,
    onChange: colorValue => {
      setAttributes({
        dropColor: colorValue === undefined ? "#747474" : colorValue
      });
    },
    paletteColors: _block_global__WEBPACK_IMPORTED_MODULE_6__.colorPickerPalette
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.BlockControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.AlignmentToolbar, {
    value: alignment,
    onChange: onChangeAlignment
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: `blockons-wc-mini-cart-block ${isSelected && showMiniCart ? "show" : ""} ${noItems ? "noitems" : ""} ${noAmount ? "noamount" : ""} ${layoutSwitch ? "switch" : ""} ${dropPosition}`,
    style: {
      backgroundColor: iconBgColor
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("a", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, cartLinkNewTab ? {
    target: "_blank"
  } : "", {
    className: "blockons-wc-mini-cart-block-icon",
    style: {
      fontSize: iconSize,
      padding: iconPadding,
      color: textColor
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
    className: `icon fa-solid fa-${customIcon && icon == "custom" ? customIcon : icon}`,
    style: {
      color: iconColor
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "blockons-cart-amnt"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
    className: "amount"
  }, "$34,00"), " ", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
    className: "count"
  }, "(2 items)"))), hasDropdown && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "blockons-wc-mini-cart-dropdown",
    style: {
      backgroundColor: dropBgColor,
      color: dropColor
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "blockons-wc-mini-cart-inner"
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)("This will display all the items that have been added to cart", "blockons")))));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Edit);

/***/ }),

/***/ "./blocks/wc-mini-cart/index.js":
/*!**************************************!*\
  !*** ./blocks/wc-mini-cart/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block.json */ "./blocks/wc-mini-cart/block.json");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./blocks/wc-mini-cart/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./blocks/wc-mini-cart/save.js");
/* harmony import */ var _editor_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.css */ "./blocks/wc-mini-cart/editor.css");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.css */ "./blocks/wc-mini-cart/style.css");
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

/***/ "./blocks/wc-mini-cart/save.js":
/*!*************************************!*\
  !*** ./blocks/wc-mini-cart/save.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);



/**
 * WordPress dependencies
 */


const Save = _ref => {
  let {
    attributes
  } = _ref;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps.save({
    className: attributes.alignment
  }); // const ajaxObj = cartIconObj ? cartIconObj : {}

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: `blockons-wc-mini-cart-block ${attributes.noItems ? "noitems" : ""} ${attributes.noAmount ? "noamount" : ""} ${attributes.layoutSwitch ? "switch" : ""}`,
    style: {
      backgroundColor: attributes.iconBgColor
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("a", (0,_babel_runtime_helpers_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, attributes.cartLink ? {
    href: attributes.cartLink
  } : {
    href: cartIconObj.wcCartUrl
  }, attributes.cartLinkNewTab ? {
    target: "_blank"
  } : "", {
    className: "blockons-wc-mini-cart-block-icon",
    style: {
      fontSize: attributes.iconSize,
      padding: attributes.iconPadding,
      color: attributes.textColor
    }
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("span", {
    className: `icon fa-solid fa-${attributes.customIcon && attributes.icon == "custom" ? attributes.customIcon : attributes.icon}`,
    style: {
      color: attributes.iconColor
    }
  })), attributes.hasDropdown && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "blockons-wc-mini-cart-dropdown",
    style: {
      backgroundColor: attributes.dropBgColor,
      color: attributes.dropColor
    }
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.createElement)("div", {
    className: "blockons-wc-mini-cart-inner"
  }))));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Save);

/***/ }),

/***/ "./blocks/wc-mini-cart/editor.css":
/*!****************************************!*\
  !*** ./blocks/wc-mini-cart/editor.css ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/wc-mini-cart/style.css":
/*!***************************************!*\
  !*** ./blocks/wc-mini-cart/style.css ***!
  \***************************************/
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

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./blocks/wc-mini-cart/block.json":
/*!****************************************!*\
  !*** ./blocks/wc-mini-cart/block.json ***!
  \****************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"https://json.schemastore.org/block.json","apiVersion":2,"name":"blockons/wc-mini-cart","title":"WooCommerce Mini Cart","textdomain":"blockons","icon":"cart","category":"blockons-category","keywords":["cart","icon","mini cart","woocommerce","header"],"attributes":{"cartLink":{"type":"string"},"cartLinkNewTab":{"type":"boolean","default":false},"alignment":{"type":"string","default":"none"},"hasDropdown":{"type":"boolean","default":false},"dropPosition":{"type":"string","default":"bottom-right"},"noItems":{"type":"boolean","default":false},"noAmount":{"type":"boolean","default":false},"icon":{"type":"string","default":"cart-shopping"},"iconSize":{"type":"number","default":17},"layoutSwitch":{"type":"boolean","default":false},"iconPadding":{"type":"number","default":8},"customIcon":{"type":"string","default":"face-smile"},"iconBgColor":{"type":"string","default":"#FFF"},"textColor":{"type":"string","default":"#444"},"iconColor":{"type":"string","default":"#000"},"dropBgColor":{"type":"string","default":"#FFF"},"dropColor":{"type":"string","default":"#747474"}},"editorScript":"file:./index.js","editorStyle":"file:./index.css","script":"blockons-wc-mini-cart","style":["file:./style-index.css","blockons-fontawesome"]}');

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
/******/ 			"wc-mini-cart/index": 0,
/******/ 			"wc-mini-cart/style-index": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["wc-mini-cart/style-index"], () => (__webpack_require__("./blocks/wc-mini-cart/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map