/**
 * Functionality to show/hide the Blockons Search
 *
 * PREMIUM
 */
import React from "react";
import ReactDOM from "react-dom";
import SearchResults from "./components/SearchResults";
import "../search";

document.addEventListener("DOMContentLoaded", () => {
	const searchElements = document.querySelectorAll(
		".blockons-search-results-wrap"
	);

	if (searchElements) {
		searchElements.forEach((searchBlock) => {
			const searchSettings = JSON.parse(
				searchBlock.getAttribute("data-settings")
			);

			if (!searchSettings.searchPro) return;

			// console.log("SearchBlock:", searchBlock);

			if (typeof searchElements !== undefined && searchElements !== null) {
				ReactDOM.render(
					<SearchResults
						searchId={searchBlock.getAttribute("id")}
						searchSettings={searchSettings}
					/>,
					searchBlock
				);
			}
		});
	}
});
