/**
 * Functionality to show/hide the Blockons Search
 *
 * PREMIUM
 */
import React from "react";
import ReactDOM from "react-dom";
import SearchWrap from "./components/SearchWrap";
import "../search";

document.addEventListener("DOMContentLoaded", () => {
	const searchElements = document.querySelectorAll(
		".blockons-search-results-wrap"
	);

	if (searchElements) {
		searchElements.forEach((searchBlock) => {
			const searchId = searchBlock.closest(".wp-block-blockons-search").id;
			const searchSettings = JSON.parse(
				searchBlock.getAttribute("data-settings")
			);

			if (!searchSettings.searchPro) return;

			if (typeof searchElements !== undefined && searchElements !== null) {
				ReactDOM.render(
					<SearchWrap searchId={searchId} searchSettings={searchSettings} />,
					searchBlock
				);
			}
		});
	}
});
