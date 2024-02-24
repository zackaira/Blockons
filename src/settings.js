/*
 * Site Chat Admin / Settings Page JS
 */
import React from "react";
import ReactDOM from "react-dom";
import SettingsPage from "./backend/settings/SettingsPage";
import "./backend/settings.css";

document.addEventListener("DOMContentLoaded", function () {
	const element = document.getElementById("blockons-root");

	if (typeof element !== undefined && element !== null) {
		ReactDOM.render(<SettingsPage />, document.getElementById("blockons-root"));
	}

	/*
	 * JS for Settings Tabs
	 */
	const tabItems = document.querySelectorAll(".blockons-tab");
	const contentItems = document.querySelectorAll(".blockons-content");

	tabItems.forEach((item) => {
		item.addEventListener("click", () => {
			// Add / Remove Tab active class
			tabItems.forEach((tabItem) => {
				tabItem.classList.remove("active");
			});
			item.classList.add("active");

			// Add / Remove Content hide class
			const contentName =
				"blockons-content-" + item.id.substring(item.id.indexOf("-") + 1);
			const contentShow = document.getElementById(contentName);

			contentItems.forEach((contItem) => {
				contItem.classList.remove("active");
			});
			if (contentShow) {
				contentShow.classList.add("active");
			}
		});
	});
});
