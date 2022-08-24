// import React from "react";
// import ReactDOM from "react-dom";
// import UpdateNotice from "./UpdateNotice";
import "./admin.css";
/*
 * Blockons Admin JS
 */
document.addEventListener("DOMContentLoaded", function () {
	const blockonsRemFsLinks = document.querySelectorAll(
		".fs-submenu-item.blockons"
	);
	if (blockonsRemFsLinks) {
		blockonsRemFsLinks.forEach((item) => {
			item.closest("li").remove();
		});
	}

	// const blockonsUpdate = document.getElementById("blockons-update");

	// if (typeof blockonsUpdate !== undefined && blockonsUpdate !== null) {
	// 	ReactDOM.render(
	// 		<UpdateNotice />,
	// 		document.getElementById("blockons-update")
	// 	);
	// }
});
