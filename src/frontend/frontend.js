import React from "react";
import ReactDOM from "react-dom";
import BackToTop from "./site-addons/BackToTop";
import ScrollIndicator from "./site-addons/ScrollIndicator";
import "./frontend.css";

document.addEventListener("DOMContentLoaded", function () {
	// Website Page Loader
	const blockonsPageLoader = document.getElementById("blockons-pageloader");
	if (typeof blockonsPageLoader !== undefined && blockonsPageLoader !== null) {
		ReactDOM.render(
			<BackToTop
				bttOptions={blockonsObj.blockonsOptions?.pageloader}
				isPro={blockonsObj.isPremium}
			/>,
			document.getElementById("blockons-pageloader")
		);
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
				bttOptions={blockonsObj.blockonsOptions?.scrollindicator}
				isPro={blockonsObj.isPremium}
			/>,
			document.getElementById("blockons-scroll-indicator")
		);
	}
});
