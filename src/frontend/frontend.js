import React from "react";
import ReactDOM from "react-dom";
import PageLoader from "./site-addons/pageloader/PageLoader";
import BackToTop from "./site-addons/backtotop/BackToTop";
import ScrollIndicator from "./site-addons/scrollindicator/ScrollIndicator";
import "./frontend.css";

document.addEventListener("DOMContentLoaded", () => {
	const isPremium = Boolean(blockObj.isPremium);
	const blockonsOptions = blockObj.blockonsOptions;

	/*
	 * Site Addons
	 */
	// Website Page Loader
	const blockonsPageLoader = document.getElementById("blockons-pageloader");
	if (typeof blockonsPageLoader !== undefined && blockonsPageLoader !== null) {
		ReactDOM.render(
			<PageLoader
				pageLoaderOptions={blockonsOptions?.pageloader}
				isPro={isPremium}
			/>,
			blockonsPageLoader
		);

		setTimeout(() => {
			document.body.classList.remove("blockons-page-loading");

			setTimeout(() => {
				document.getElementById("blockons-pageloader").remove();
			}, 400);
		}, 200);
	}

	// Back To Top Button
	const blockonsBttb = document.getElementById("blockons-bttb");
	if (typeof blockonsBttb !== undefined && blockonsBttb !== null) {
		ReactDOM.render(
			<BackToTop bttOptions={blockonsOptions?.bttb} isPro={isPremium} />,
			blockonsBttb
		);
	}

	// Page Scroll Indicator
	const blockonsScrollInd = document.getElementById(
		"blockons-scroll-indicator"
	);
	if (typeof blockonsScrollInd !== undefined && blockonsScrollInd !== null) {
		ReactDOM.render(
			<ScrollIndicator
				scrollInOptions={blockonsOptions?.scrollindicator}
				isPro={isPremium}
			/>,
			blockonsScrollInd
		);
	}

	/*
	 * Block Entensions
	 */
	// Blockons Tooltips
	if (isPremium && blockonsOptions?.tooltips?.enabled) {
		import("./extensions/tooltips.js").then((Tooltips) => {
			Tooltips.initializeTooltips();
		});
	}
});
