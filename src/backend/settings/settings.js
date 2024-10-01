import { render } from "@wordpress/element";
import SettingsPage from "./SettingsPage";
import "./settings.css";

document.addEventListener("DOMContentLoaded", function () {
	const element = document.getElementById("blockons-root");

	if (element) {
		render(<SettingsPage />, element);
	}
});
