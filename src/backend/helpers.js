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

export function blockonsStringReplaceForLink(inputString) {
	return inputString.replace(
		/\((.*?)\[\*?(https?:\/\/[^\]]+)\]\)/g,
		(match, linkText, url) => {
			// Check if the original text contains the star indicating a new tab target
			const hasStar = match.includes("[*");
			// Construct the anchor tag with or without the target="_blank" attribute
			return `<a href="${url}"${
				hasStar ? ' target="_blank"' : ""
			}>${linkText}</a>`;
		}
	);
}

/*
 * Setting for the Blocks settings displayed in the admin dashboard
 */
export const blockListSettings = {
	accordions: {
		desc: __(
			"Display content in smaller areas with collapsible lists",
			"blockons"
		),
		pluginSpecific: false,
		isNew: false,
	},
	count_down_timer: {
		desc: __(
			"Add a count down block for specials, sales, events, etc",
			"blockons"
		),
		pluginSpecific: false,
		isNew: false,
	},
	content_selector: {
		desc: __(
			"Let your viewers select which content they want to read.",
			"blockons"
		),
		pluginSpecific: false,
		isNew: __("NEW", "blockons"),
	},
	content_toggler: {
		desc: __(
			"Show / Hide sections of long content with a toggle button",
			"blockons"
		),
		pluginSpecific: false,
		isNew: false,
	},
	icon_list: {
		desc: __("Visually, more attractive list items with icons", "blockons"),
		pluginSpecific: false,
		isNew: false,
	},
	image_comparison: {
		desc: __("Use a neat action slider to compare 2 images", "blockons"),
		pluginSpecific: false,
		isNew: false,
	},
	image_gallery: {
		desc: __("A more advanced gallery with 3 beautiful layouts", "blockons"),
		pluginSpecific: false,
		isNew: false,
	},
	image_carousel: {
		desc: __("Display multiple images in a neat carousel", "blockons"),
		pluginSpecific: false,
		isNew: false,
	},
	line_heading: {
		desc: __("More advanced and customizable line headings", "blockons"),
		pluginSpecific: false,
		isNew: false,
	},
	marketing_button: {
		desc: __(
			"An attractive, more trendy customizable call-to-action",
			"blockons"
		),
		pluginSpecific: false,
		isNew: false,
	},
	progress_bars: {
		desc: __("Show progress with beautiful, animated bars", "blockons"),
		pluginSpecific: false,
		isNew: false,
	},
	slider: {
		desc: __("A slider to display custom content or WC products", "blockons"),
		pluginSpecific: false,
		isNew: false,
	},
	search: {
		desc: __("A search bar/icon with drop down or popup search", "blockons"),
		pluginSpecific: false,
		isNew: false,
	},
	tabs: {
		desc: __("Display your site information in tabbed content", "blockons"),
		pluginSpecific: false,
		isNew: __("NEW", "blockons"),
	},
	// table_of_contents: {
	// 	desc: __("Display a neat table of contents", "blockons"),
	// 	pluginSpecific: false,
	// 	isNew: __("NEW", "blockons"),
	// },
	testimonials: {
		desc: __("Display client testimonials in a slider or carousel", "blockons"),
		pluginSpecific: false,
		isNew: false,
	},
	video_slider: {
		desc: __("Display multiple videos in a neat video slider", "blockons"),
		pluginSpecific: false,
		isNew: false,
	},
	wc_account_icon: {
		desc: __("A simple icon linking to a users WC Account", "blockons"),
		pluginSpecific: "WooCommerce",
		isNew: false,
	},
	wc_featured_product: {
		desc: __("Display a WC featured product with multple layouts", "blockons"),
		pluginSpecific: "WooCommerce",
		isNew: false,
	},
	wc_mini_cart: {
		desc: __("A simple WC cart icon with a full cart drop down", "blockons"),
		pluginSpecific: "WooCommerce",
		isNew: false,
	},
};

export const blockonsGroupSettings = () => {
	const groupBtns = document.querySelectorAll(".blockons-group-btn");

	if (groupBtns) {
		groupBtns.forEach((btn) => {
			btn.addEventListener("click", () => {
				const btnParent = btn.parentElement;

				groupBtns.forEach((btnItem) => {
					btnItem.parentElement.removeAttribute("id", "openGroup");
					btnItem.parentElement.classList.remove("blockons-show");
				});

				// Add / Remove .blockons-show class
				if (btnParent.classList.contains("blockons-show")) {
					btnParent.removeAttribute("id", "openGroup");
					btnParent.classList.remove("blockons-show");
				} else {
					btnParent.setAttribute("id", "openGroup");
					btnParent.classList.add("blockons-show");
				}
			});
		});
	}

	// Close on click outside
	window.addEventListener("click", function (e) {
		const openGroup = document.getElementById("openGroup");

		if (openGroup) {
			if (!e.target == openGroup || !openGroup.contains(e.target)) {
				openGroup.removeAttribute("id");
				openGroup.classList.remove("blockons-show");
			}
		}
	});
};
