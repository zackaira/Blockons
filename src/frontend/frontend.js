import React from "react";
import ReactDOM from "react-dom";
import PageLoader from "./site-addons/pageloader/PageLoader";
import BackToTop from "./site-addons/backtotop/BackToTop";
import ScrollIndicator from "./site-addons/scrollindicator/ScrollIndicator";
import "./frontend.css";

document.addEventListener("DOMContentLoaded", () => {
	// Website Page Loader
	const blockonsPageLoader = document.getElementById("blockons-pageloader");
	if (typeof blockonsPageLoader !== undefined && blockonsPageLoader !== null) {
		ReactDOM.render(
			<PageLoader
				pageLoaderOptions={blockonsObj.blockonsOptions?.pageloader}
				isPro={blockonsObj.isPremium}
			/>,
			document.getElementById("blockons-pageloader")
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
			<BackToTop
				bttOptions={blockonsObj.blockonsOptions?.bttb}
				isPro={blockonsObj.isPremium}
			/>,
			document.getElementById("blockons-bttb")
		);
	}

	// Page Scroll Indicator
	const blockonsScrollInd = document.getElementById(
		"blockons-scroll-indicator"
	);
	if (typeof blockonsScrollInd !== undefined && blockonsScrollInd !== null) {
		ReactDOM.render(
			<ScrollIndicator
				scrollInOptions={blockonsObj.blockonsOptions?.scrollindicator}
				isPro={blockonsObj.isPremium}
			/>,
			document.getElementById("blockons-scroll-indicator")
		);
	}
});
