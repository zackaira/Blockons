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
	// const cartAmnt = document.querySelector(".blockons-cart-amnt .count");
	// let hahahah = cartAmnt.cloneNode(true);
	//.innerText.replace(/[^0-9]/g, "");

	if (typeof blockonsSideCart !== undefined && blockonsSideCart !== null) {
		ReactDOM.render(
			<SideCart />,
			document.getElementById("blockons-side-cart")
		);
	}

	if (blockonsSideCart) {
		const sideCartParent = document.querySelector(
			".blockons-side-cart-block .blockons-side-cart-content"
		);

		if (sideCartParent) {
			const miniCart = document.querySelector(".blockons-mini-crt");
			if (miniCart) sideCartParent.appendChild(miniCart.cloneNode(true));
		}

		// NOTIFICATION
		const cartNotif = document.querySelector(".blockons-notification");
		if (cartNotif) {
			const cartAmnt = document.querySelector(".blockons-crtamnt");
			if (cartAmnt) cartNotif.appendChild(cartAmnt.cloneNode(true));
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
		}
	}
});
