import React from "react";
import ReactDOM from "react-dom";
import BackToTop from "./site-addons/BackToTop";
import "./frontend.css";

document.addEventListener("DOMContentLoaded", function () {
	const blockonsBttb = document.getElementById("blockons-bttb");

	if (typeof blockonsBttb !== undefined && blockonsBttb !== null) {
		ReactDOM.render(
			<BackToTop bttOptions={siteObj.blockonsOptions?.bttb} />,
			document.getElementById("blockons-bttb")
		);
	}
});
