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
	const blockonsSideCart = document.getElementById("blockons-side-cart");

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
		const sideCartOpen = document.querySelectorAll(".blockons-opencart");

		if (sideCartOpen) {
			sideCartOpen.forEach((item) => {
				item.addEventListener("click", (e) => {
					e.preventDefault();
					const body = document.body;

					if (body.classList.contains("blockons-show-sidecart")) {
						body.classList.remove("blockons-show-sidecart");
					} else {
						body.classList.add("blockons-show-sidecart");
					}
				});
			});

			const overlayClick = document.querySelector(
				".blockons-side-cart-overlay"
			);
		}
	}
});
