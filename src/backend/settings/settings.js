/*
 * Site Chat Admin / Settings Page JS
 */
import React from "react";
import ReactDOM from "react-dom";
import SettingsPage from "./SettingsPage";
import "./settings.css";

document.addEventListener("DOMContentLoaded", function () {
	const element = document.getElementById("blockons-root");

	if (typeof element !== undefined && element !== null) {
		ReactDOM.render(<SettingsPage />, document.getElementById("blockons-root"));
	}
});
