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
	{ name: "Grey", color: "#9b9b9b" },
	{ name: "Black", color: "#000" },
	{ name: "Dark", color: "#232323" },
	{ name: "Turqoise", color: "#00b291" },
	{ name: "Emerald", color: "#51d88b" },
	{ name: "Peter River", color: "#3497df" },
	{ name: "Amethyst", color: "#9c56b8" },
	{ name: "Wet Asphalt", color: "#34495d" },
	{ name: "Sunflower", color: "#f1c50f" },
	{ name: "Carrot", color: "#e77e22" },
	{ name: "Alizarin", color: "#e84c3d" },
	{ name: "Clouds", color: "#ecf0f1" },
	{ name: "Concrete", color: "#95a5a5" },
	{ name: "Dusty Pink", color: "#d4afb9" },
	{ name: "Soft Purple", color: "#9cadce" },
	{ name: "Creamy", color: "#f2e8ce" },
	{ name: "Soil", color: "#874c48" },
];

/*
 * RichText Tags to select for RichText
 */
export const elementTags = [
	{ label: "H1", value: "h1" },
	{ label: "H2", value: "h2" },
	{ label: "H3", value: "h3" },
	{ label: "H4", value: "h4" },
	{ label: "H5", value: "h5" },
	{ label: "H6", value: "h6" },
	{ label: "div", value: "div" },
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
 * Font Awesome Icons used for Marketing Button
 */
export const marketingButtonIcons = {
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
	"pen-fancy": "pen-fancy",
};

/*
 * Font Awesome Icons used for slider arrows
 */
export const sliderArrowIcons = {
	"arrow-right": "arrow-right",
	"arrow-right-long": "arrow-right-long",
	"angle-right": "angle-right",
	"caret-right": "caret-right",
	"angles-right": "angles-right",
};

/*
 * Font Awesome Icons used for accordions
 */
export const accordionArrowIcons = {
	"arrow-right": "arrow-right",
	"arrow-right-long": "arrow-right-long",
	"angle-right": "angle-right",
	"caret-right": "caret-right",
	"angles-right": "angles-right",
	plus: "plus",
	minus: "minus",
	eye: "eye", // eye-slash
	"circle-plus": "circle-plus",
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
