import { __ } from "@wordpress/i18n";

/*
 * Convert Text to slug
 */
export const blockonsConvertToSlug = (text) => {
	return text
		.toLowerCase()
		.replace(/[^\w ]+/g, "")
		.replace(/ +/g, "_");
};

/*
 * Setting for the Blocks settings displayed in the admin dashboard
 */
export const blockonsBlockBlurbs = {
	accordions: {
		desc: __(
			"Display content in smaller areas with collapsible lists",
			"blockons"
		),
		pluginSpecific: false,
	},
	icon_list: {
		desc: __("Visually, more attractive list items with icons", "blockons"),
		pluginSpecific: false,
	},
	image_carousel: {
		desc: __("Display multiple images in a neat carousel", "blockons"),
		pluginSpecific: false,
	},
	line_heading: {
		desc: __("More advanced and customizable line headings", "blockons"),
		pluginSpecific: false,
	},
	marketing_button: {
		desc: __(
			"An attractive, more trendy customizable call-to-action",
			"blockons"
		),
		pluginSpecific: false,
	},
	progress_bars: {
		desc: __("Show progress with beautiful, animated bars", "blockons"),
		pluginSpecific: false,
	},
	search: {
		desc: __("A search bar/icon with drop down or popup search", "blockons"),
		pluginSpecific: false,
	},
	testimonials: {
		desc: __("Display client testimonials in a slider or carousel", "blockons"),
		pluginSpecific: false,
	},
	video_slider: {
		desc: __("Display multiple videos in a neat video slider", "blockons"),
		pluginSpecific: false,
	},
	wc_account_icon: {
		desc: __("A simple icon linking to a users WC Account", "blockons"),
		pluginSpecific: "WooCommerce",
	},
	wc_featured_product: {
		desc: __("Display a WC featured product with multple layouts", "blockons"),
		pluginSpecific: "WooCommerce",
	},
	wc_mini_cart: {
		desc: __("A simple WC cart icon with a full cart drop down", "blockons"),
		pluginSpecific: "WooCommerce",
	},
	layout_container: {
		desc: __("A more advaced layout block for your pages", "blockons"),
		pluginSpecific: false,
	},
};
