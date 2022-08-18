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

/***/ "./blocks/_components/FontAwesomeIcon.js":
/*!***********************************************!*\
  !*** ./blocks/_components/FontAwesomeIcon.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);


const FontAwesomeIcon = props => {
  const {
    icon,
    iconSize,
    onClick,
    style
  } = props;
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", {
    className: `blockons-fontawesome fa-solid fa-${icon}`,
    style: { ...style,
      fontSize: iconSize ? iconSize : "inherit"
    },
    onClick: onClick ? onClick : null
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FontAwesomeIcon);

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

/***/ "./blocks/icon-list/edit.js":
/*!**********************************!*\
  !*** ./blocks/icon-list/edit.js ***!
  \**********************************/
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
/* harmony import */ var _components_FontAwesomeIcon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../_components/FontAwesomeIcon */ "./blocks/_components/FontAwesomeIcon.js");
/* harmony import */ var _block_global__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../block-global */ "./blocks/block-global.js");


/**
 * WordPress dependencies
 */







const Edit = props => {
  const {
    isSelected,
    attributes: {
      alignment,
      listItems,
      listItemsLayout,
      listItemSpacing,
      listItemIconSpacing,
      listItemIconSize,
      listItemIconColor,
      listItemFontSize,
      listItemFontColor
    },
    setAttributes
  } = props;
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)({
    className: `${alignment} items-${listItemsLayout}`
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
  }; // Item Control Functions


  const handleItemIconChange = (itemIcon, itemId) => {
    const newListItems = [...listItems];
    const editedListItems = newListItems.map(obj => {
      if (obj.itemId === itemId) return { ...obj,
        itemIcon: itemIcon
      };
      return obj;
    });
    setAttributes({
      listItems: editedListItems
    });
  };

  const handleItemIconSizeChange = (itemIconSize, itemId) => {
    const newListItems = [...listItems];
    const editedListItems = newListItems.map(obj => {
      if (obj.itemId === itemId) return { ...obj,
        itemIconSize: itemIconSize
      };
      return obj;
    });
    setAttributes({
      listItems: editedListItems
    });
  };

  const handleItemIconColorChange = (itemIconColor, itemId) => {
    const newListItems = [...listItems];
    const editedListItems = newListItems.map(obj => {
      if (obj.itemId === itemId) return { ...obj,
        itemIconColor: itemIconColor
      };
      return obj;
    });
    setAttributes({
      listItems: editedListItems
    });
  };

  const handleItemTextSizeChange = (itemTextSize, itemId) => {
    const newListItems = [...listItems];
    const editedListItems = newListItems.map(obj => {
      if (obj.itemId === itemId) return { ...obj,
        itemTextSize: itemTextSize
      };
      return obj;
    });
    setAttributes({
      listItems: editedListItems
    });
  };

  const handleItemTextColorChange = (itemTextColor, itemId) => {
    const newListItems = [...listItems];
    const editedListItems = newListItems.map(obj => {
      if (obj.itemId === itemId) return { ...obj,
        itemTextColor: itemTextColor
      };
      return obj;
    });
    setAttributes({
      listItems: editedListItems
    });
  };

  const handleItemTextChange = (itemText, itemId) => {
    const newListItems = [...listItems]; // Edit the item text and ID (this prevent the edit from editing all instances if the block is duplicated)

    const editedListItems = newListItems.map(obj => {
      if (obj.itemId === itemId) return { ...obj,
        itemId: itemId === "" ? Math.floor(Math.random() * 700) : (0,_block_global__WEBPACK_IMPORTED_MODULE_6__.slugify)(itemText),
        itemText: itemText
      };
      return obj;
    });
    setAttributes({
      listItems: editedListItems
    });
  };

  const handleAddItem = () => {
    const newListItems = [...listItems];
    newListItems.push({
      itemId: newListItems.length + 1,
      itemText: "",
      itemTextSize: null,
      itemTextColor: null,
      itemIcon: "check",
      itemIconSize: null,
      itemIconColor: null
    });
    setAttributes({
      listItems: newListItems
    });
  };

  const handleRemoveItem = index => {
    const newListItems = [...listItems];
    newListItems.splice(index, 1);
    setAttributes({
      listItems: newListItems
    });
  };

  const handleDuplicateItem = (index, text, textSize, textColor, icon, iconSize, iconColor) => {
    const newListItems = [...listItems];
    newListItems.splice(index + 1, 0, {
      itemId: Math.floor(Math.random() * 700) + 1,
      itemText: text,
      itemTextSize: textSize,
      itemTextColor: textColor,
      itemIcon: icon,
      itemIconSize: iconSize,
      itemIconColor: iconColor
    });
    setAttributes({
      listItems: newListItems
    });
  }; // Icon List Items


  let listItemDisplay;

  if (listItems.length) {
    listItemDisplay = listItems.map((listItem, index) => {
      return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
        className: "blockons-list-item",
        style: { ...(listItemsLayout === "horizontal" ? {
            marginRight: listItemSpacing
          } : {
            marginBottom: listItemSpacing
          }),
          fontSize: listItem.itemTextSize ? listItem.itemTextSize : listItemFontSize,
          color: listItem.itemTextColor ? listItem.itemTextColor : listItemFontColor
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "blockons-list-item-icon",
        style: {
          marginRight: listItemIconSpacing,
          color: listItem.itemIconColor ? listItem.itemIconColor : listItemIconColor
        }
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Dropdown, {
        className: "blockons-icon-selecter",
        contentClassName: "blockons-editor-popup",
        position: "bottom right",
        renderToggle: _ref => {
          let {
            isOpen,
            onToggle
          } = _ref;
          return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_FontAwesomeIcon__WEBPACK_IMPORTED_MODULE_5__["default"], {
            icon: listItem.itemIcon,
            iconSize: listItem.itemIconSize ? listItem.itemIconSize : listItemIconSize,
            onClick: onToggle
          });
        },
        renderContent: () => Object.keys(_block_global__WEBPACK_IMPORTED_MODULE_6__.iconListIcons).map(icon => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_FontAwesomeIcon__WEBPACK_IMPORTED_MODULE_5__["default"], {
          icon: icon,
          iconSize: 20,
          onClick: () => handleItemIconChange(icon, listItem.itemId)
        }))
      })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.RichText, {
        tagName: "div",
        placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("#ListItem", "blockons"),
        value: listItem.itemText,
        multiline: false,
        className: "blockons-list-item-text",
        onChange: itemText => handleItemTextChange(itemText, listItem.itemId)
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
        className: "blockons-item-btns"
      }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Dropdown, {
        className: "blockons-item-level-settings",
        contentClassName: "blockons-editor-popup",
        position: "bottom right",
        renderToggle: _ref2 => {
          let {
            isOpen,
            onToggle
          } = _ref2;
          return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
            icon: "art",
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("List Item Colors", "blockons"),
            onClick: onToggle,
            "aria-expanded": isOpen
          });
        },
        renderContent: () => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Text Size & Color", "blockons")), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
          value: listItem.itemTextSize ? listItem.itemTextSize : listItemFontSize,
          onChange: textSize => handleItemTextSizeChange(textSize, listItem.itemId),
          min: 10,
          max: 64
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_BlockonsColorpicker__WEBPACK_IMPORTED_MODULE_4__["default"], {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Text Color", "blockons"),
          value: listItem.itemTextColor ? listItem.itemTextColor : listItemFontColor,
          onChange: itemSize => handleItemTextColorChange(itemSize, listItem.itemId),
          paletteColors: _block_global__WEBPACK_IMPORTED_MODULE_6__.colorPickerPalette
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Icon Size & Color", "blockons")), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
          value: listItem.itemIconSize ? listItem.itemIconSize : listItemIconSize,
          onChange: itemSize => handleItemIconSizeChange(itemSize, listItem.itemId),
          min: 10,
          max: 98
        }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_BlockonsColorpicker__WEBPACK_IMPORTED_MODULE_4__["default"], {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Icon Color", "blockons"),
          value: listItem.itemIconColor ? listItem.itemIconColor : listItemIconColor,
          onChange: itemSize => handleItemIconColorChange(itemSize, listItem.itemId),
          paletteColors: _block_global__WEBPACK_IMPORTED_MODULE_6__.colorPickerPalette
        }))
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
        className: "blockons-duplicate-item",
        icon: "admin-page",
        label: "Duplicate Item",
        onClick: () => handleDuplicateItem(index, listItem.itemText, listItem.itemTextSize, listItem.itemTextColor, listItem.itemIcon, listItem.itemIconSize, listItem.itemIconColor)
      }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
        className: "blockons-remove-item",
        icon: "no-alt",
        label: "Delete Item",
        onClick: () => handleRemoveItem(index)
      })));
    });
  }

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, isSelected && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Icon List Settings", "blockons"),
    initialOpen: true
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("List Layout", "blockons"),
    value: listItemsLayout,
    options: [{
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Vertical", "blockons"),
      value: "vertical"
    }, {
      label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Horizontal", "blockons"),
      value: "horizontal"
    }],
    onChange: value => setAttributes({
      listItemsLayout: value === undefined ? "vertical" : value
    }),
    __nextHasNoMarginBottom: true
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Item Spacing", "blockons"),
    value: listItemSpacing,
    onChange: value => setAttributes({
      listItemSpacing: value
    }),
    min: 0,
    max: 100
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Icon & Text Spacing", "blockons"),
    value: listItemIconSpacing,
    onChange: value => setAttributes({
      listItemIconSpacing: value
    }),
    min: 0,
    max: 80
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Icon List Design", "blockons"),
    initialOpen: false
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Font Size", "blockons"),
    value: listItemFontSize,
    onChange: value => setAttributes({
      listItemFontSize: value
    }),
    min: 10,
    max: 64
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_BlockonsColorpicker__WEBPACK_IMPORTED_MODULE_4__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Font Color", "blockons"),
    value: listItemFontColor,
    onChange: newColor => {
      setAttributes({
        listItemFontColor: newColor
      });
    },
    paletteColors: _block_global__WEBPACK_IMPORTED_MODULE_6__.colorPickerPalette
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.RangeControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Icon Size", "blockons"),
    value: listItemIconSize,
    onChange: newFontSize => {
      setAttributes({
        listItemIconSize: newFontSize
      });
    },
    min: 10,
    max: 98
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_BlockonsColorpicker__WEBPACK_IMPORTED_MODULE_4__["default"], {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Icon Color", "blockons"),
    value: listItemIconColor,
    onChange: newColor => {
      setAttributes({
        listItemIconColor: newColor
      });
    },
    paletteColors: _block_global__WEBPACK_IMPORTED_MODULE_6__.colorPickerPalette
  }))), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.BlockControls, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.AlignmentToolbar, {
    value: alignment,
    onChange: onChangeAlignment
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `blockons-list-align`
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "blockons-list-wrap"
  }, listItemDisplay), isSelected && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `blockons-add-new ${listItemDisplay === undefined ? "no-items" : "has-items"}`
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    variant: "secondary",
    onClick: handleAddItem
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Add List Item", "blockons")))));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Edit);

/***/ }),

/***/ "./blocks/icon-list/index.js":
/*!***********************************!*\
  !*** ./blocks/icon-list/index.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./block.json */ "./blocks/icon-list/block.json");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./blocks/icon-list/edit.js");
/* harmony import */ var _save__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./save */ "./blocks/icon-list/save.js");
/* harmony import */ var _editor_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.css */ "./blocks/icon-list/editor.css");
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./style.css */ "./blocks/icon-list/style.css");
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

/***/ "./blocks/icon-list/save.js":
/*!**********************************!*\
  !*** ./blocks/icon-list/save.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_FontAwesomeIcon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_components/FontAwesomeIcon */ "./blocks/_components/FontAwesomeIcon.js");


/**
 * WordPress dependencies
 */



const Save = _ref => {
  let {
    attributes
  } = _ref;
  const blockProps = _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.useBlockProps.save({
    className: `${attributes.alignment} items-${attributes.listItemsLayout}`
  });
  const listItemElements = attributes.listItems.map((listItem, index) => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("li", {
      className: "blockons-list-item",
      style: { ...(attributes.listItemsLayout === "horizontal" ? {
          marginRight: attributes.listItemSpacing
        } : {
          marginBottom: attributes.listItemSpacing
        }),
        fontSize: listItem.itemTextSize ? listItem.itemTextSize : attributes.listItemFontSize,
        color: listItem.itemTextColor ? listItem.itemTextColor : attributes.listItemFontColor
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "blockons-list-item-icon",
      style: {
        marginRight: attributes.listItemIconSpacing,
        fontSize: listItem.itemIconSize ? listItem.itemIconSize : attributes.listItemIconSize,
        color: listItem.itemIconColor ? listItem.itemIconColor : attributes.listItemIconColor
      }
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_components_FontAwesomeIcon__WEBPACK_IMPORTED_MODULE_2__["default"], {
      icon: listItem.itemIcon
    })), listItem.itemText && (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_1__.RichText.Content, {
      tagName: "div",
      value: listItem.itemText,
      className: "blockons-list-item-text"
    }));
  });
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", blockProps, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: `blockons-list-align`
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("ul", {
    className: "blockons-list-wrap"
  }, listItemElements)));
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Save);

/***/ }),

/***/ "./blocks/icon-list/editor.css":
/*!*************************************!*\
  !*** ./blocks/icon-list/editor.css ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./blocks/icon-list/style.css":
/*!************************************!*\
  !*** ./blocks/icon-list/style.css ***!
  \************************************/
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

/***/ "./blocks/icon-list/block.json":
/*!*************************************!*\
  !*** ./blocks/icon-list/block.json ***!
  \*************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"$schema":"https://json.schemastore.org/block.json","apiVersion":2,"name":"blockons/icon-list","title":"Icon List","textdomain":"blockons","icon":"editor-ul","category":"blockons-category","keywords":["list","icons","items","links"],"attributes":{"alignment":{"type":"string","default":"none"},"listItems":{"type":"array","default":[{"itemId":0,"itemText":"","itemTextSize":null,"itemTextColor":null,"itemIcon":"check","itemIconSize":null,"itemIconColor":null},{"itemId":1,"itemText":"","itemTextSize":null,"itemTextColor":null,"itemIcon":"check","itemIconSize":null,"itemIconColor":null}]},"listItemsLayout":{"type":"string","default":"vertical"},"listItemSpacing":{"type":"number","default":8},"listItemIconSpacing":{"type":"number","default":5},"listItemIconSize":{"type":"number","default":18},"listItemIconColor":{"type":"string","default":"#4f4f4f"},"listItemFontSize":{"type":"number","default":16},"listItemFontColor":{"type":"string","default":"#4f4f4f"}},"example":{"attributes":{"pbDesign":"one","listItems":[{"itemId":"id1","itemText":"List Item 1","itemTextSize":null,"itemTextColor":null,"itemIcon":"check","itemIconSize":null,"itemIconColor":null},{"itemId":"id2","itemText":"List Item 2","itemTextSize":null,"itemTextColor":null,"itemIcon":"check","itemIconSize":null,"itemIconColor":null},{"itemId":"id3","itemText":"List Item 3","itemTextSize":null,"itemTextColor":null,"itemIcon":"check","itemIconSize":null,"itemIconColor":null}]}},"editorScript":"file:./index.js","editorStyle":"file:./index.css","style":["file:./style-index.css","blockons-fontawesome"]}');

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
/******/ 			"icon-list/index": 0,
/******/ 			"icon-list/style-index": 0
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
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["icon-list/style-index"], () => (__webpack_require__("./blocks/icon-list/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map