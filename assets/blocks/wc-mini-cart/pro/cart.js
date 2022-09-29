/**
 * Functionality to show/hide the Blockons WC Mini Cart
 * Also localizes wcCartObj for edit.js
 *
 * PREMIUM
 */
import React from "react";
import ReactDOM from "react-dom";
import SideCart from "./components/SideCart";
import "../cart";

document.addEventListener("DOMContentLoaded", () => {
	const cartLinkElement = document.querySelector(
		".wp-block-blockons-wc-mini-cart.cart-sidecart"
	);

	if (cartLinkElement) {
		const sideCartClick = document.getElementById("blockons-sidecart-click");

		if (sideCartClick) {
			sideCartClick.addEventListener("click", (e) => {
				e.preventDefault();
				const body = document.body;

				if (body.classList.contains("blockons-show-sidecart")) {
					body.classList.remove("blockons-show-sidecart");
				} else {
					body.classList.add("blockons-show-sidecart");
				}
			});
		}

		if (typeof cartLinkElement !== undefined && cartLinkElement !== null) {
			// const sidecartSettings = cartLinkElement.getAttribute("data-settings");

			ReactDOM.render(
				<SideCart />,
				document.getElementById("blockons-side-cart")
			);
		}
	}
});
