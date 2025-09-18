/**
 * Functionality to show/hide the Blockons WC Mini Cart
 * Also localizes wcCartObj for edit.js
 *
 * PREMIUM
 */
import { createRoot } from '@wordpress/element';
import SideCart from './components/SideCart';
import '../cart';

// Flag to prevent multiple initializations
let blockonsProCartInitialized = false;

function initializeBlockonsProCart() {
	// Prevent multiple initializations
	if (blockonsProCartInitialized) {
		return;
	}
	blockonsProCartInitialized = true;

	const blockonsSideCart = document.getElementById('blockons-side-cart');
	// const cartAmnt = document.querySelector(".blockons-cart-amnt .count");
	// let hahahah = cartAmnt.cloneNode(true);
	//.innerText.replace(/[^0-9]/g, "");

	if (typeof blockonsSideCart !== undefined && blockonsSideCart !== null) {
		const root = createRoot(document.getElementById('blockons-side-cart'));
		root.render(<SideCart />);
	}

	if (blockonsSideCart) {
		const sideCartParent = document.querySelector(
			'.blockons-side-cart-block .blockons-side-cart-content',
		);

		if (sideCartParent) {
			const miniCart = document.querySelector('.blockons-mini-crt');
			if (miniCart) sideCartParent.appendChild(miniCart.cloneNode(true));
		}

		// NOTIFICATION
		const cartNotif = document.querySelector('.blockons-notification');
		if (cartNotif) {
			const cartAmnt = document.querySelector('.blockons-crtamnt');
			if (cartAmnt) cartNotif.appendChild(cartAmnt.cloneNode(true));
		}
	}
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initializeBlockonsProCart);

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeBlockonsProCart);
} else {
	initializeBlockonsProCart();
}
