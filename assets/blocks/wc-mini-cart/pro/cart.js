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
	const blockonsSideCart = document.querySelector(
		".wp-block-blockons-wc-mini-cart.cart-sidecart"
	);

	if (typeof blockonsSideCart !== undefined && blockonsSideCart !== null) {
		// const sidecartSettings = blockonsSideCart.getAttribute("data-settings");

		ReactDOM.render(
			<SideCart />,
			document.getElementById("blockons-side-cart")
		);
	}

	if (blockonsSideCart) {
		console.log(blockonsSideCart.classList[0]);

		const sideCartParent = document.querySelector(
			".blockons-side-cart-block .blockons-side-cart-content"
		);

		if (sideCartParent) {
			const miniCart = document.querySelector(".blockons-mini-crt");
			if (miniCart) sideCartParent.appendChild(miniCart.cloneNode(true));
		}
	}

	if (blockonsSideCart) {
		const sideCartClick = document.getElementById("blockons-sidecart-click");
		const sideCartIcon = document.getElementById("blockons-sidecart-icon");

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

			const overlayClick = document.querySelector(
				".blockons-side-cart-overlay"
			);

			if (sideCartIcon)
				sideCartIcon.addEventListener("click", (e) => sideCartClick.click());

			if (overlayClick)
				overlayClick.addEventListener("click", (e) => sideCartClick.click());
		}
	}
});
