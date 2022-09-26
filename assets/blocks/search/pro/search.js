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
	const searchElement = document.getElementById("blockons-search-results-wrap");

	if (typeof searchElement !== undefined && searchElement !== null) {
		ReactDOM.render(
			<SearchResults />,
			document.getElementById("blockons-search-results-wrap")
		);
	}
});
