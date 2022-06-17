/**
 * Global functions & Settings used in multiple blocks
 */
/*
 * Convert Text to slug
 */
export const slugify = (str) =>
	str
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");

/*
 * Default Colors for Color Palette
 */
export const colorPickerPalette = [
	{ name: "white", color: "#FFF" },
	{ name: "light", color: "#f7f7f7" },
	{ name: "dark", color: "#4B4B4B" },
	{ name: "black", color: "#000" },
];

/*
 * Font Awesome Icons used in Icon List
 */
export const iconListIcons = {
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
	ellipsis: "ellipsis",
};

/*
 * Minimal RichText Settings
 */
export const minimalRichText = [
	"core/bold",
	"core/italic",
	"core/highlight",
	"core/subscript",
	"core/superscript",
	"core/strikethrough",
];
