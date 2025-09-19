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
let reactRoot = null;

function initializeBlockonsProCart(forceReinit = false) {
	// Prevent multiple initializations unless forced
	if (blockonsProCartInitialized && !forceReinit) {
		return;
	}

	// If forcing re-initialization, reset the flag first to allow cleanup
	if (forceReinit) {
		blockonsProCartInitialized = false;
		reactRoot = null;
	}

	blockonsProCartInitialized = true;

	const blockonsSideCart = document.getElementById('blockons-side-cart');
	// const cartAmnt = document.querySelector(".blockons-cart-amnt .count");
	// let hahahah = cartAmnt.cloneNode(true);
	//.innerText.replace(/[^0-9]/g, "");

	// Only create React root once, reuse it for updates
	if (typeof blockonsSideCart !== undefined && blockonsSideCart !== null) {
		if (!reactRoot) {
			reactRoot = createRoot(
				document.getElementById('blockons-side-cart'),
			);
			reactRoot.render(<SideCart />);
		}
	}

	// Use a small timeout to ensure React component has rendered
	setTimeout(() => {
		if (blockonsSideCart) {
			const sideCartParent = document.querySelector(
				'.blockons-side-cart-block .blockons-side-cart-content',
			);

			if (sideCartParent) {
				// Remove existing mini cart clones to prevent duplicates
				const existingMiniCart =
					sideCartParent.querySelector('.blockons-mini-crt');
				if (existingMiniCart) {
					existingMiniCart.remove();
				}

				const miniCart = document.querySelector('.blockons-mini-crt');
				if (miniCart)
					sideCartParent.appendChild(miniCart.cloneNode(true));
			}

			// NOTIFICATION
			const cartNotif = document.querySelector('.blockons-notification');
			if (cartNotif) {
				// Remove existing cart amount clones to prevent duplicates
				const existingCartAmnt =
					cartNotif.querySelector('.blockons-crtamnt');
				if (existingCartAmnt) {
					existingCartAmnt.remove();
				}

				const cartAmnt = document.querySelector('.blockons-crtamnt');
				if (cartAmnt) cartNotif.appendChild(cartAmnt.cloneNode(true));
			}
		}
	}, 10);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initializeBlockonsProCart);

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeBlockonsProCart);
} else {
	initializeBlockonsProCart();
}

// Expose function globally for other scripts to use
window.initializeBlockonsProCart = initializeBlockonsProCart;
