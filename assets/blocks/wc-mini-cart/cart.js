/**
 * Functionality to show/hide the Blockons WC Mini Cart
 * Little JS hack to display the Cart amount and Mini Cart in the Cart Icon Block
 * Also localizes wcCartObj for edit.js
 *
 * FREE
 */

// Flag to prevent multiple initializations
let blockonsCartInitialized = false;

function initializeBlockonsCart(forceReinit = false) {
	// Prevent multiple initializations unless forced
	if (blockonsCartInitialized && !forceReinit) {
		return;
	}

	// If forcing re-initialization, reset the flag first to allow cleanup
	if (forceReinit) {
		blockonsCartInitialized = false;
	}

	blockonsCartInitialized = true;

	// Configuration object for selectors
	const selectors = {
		cartIcon: '.blockons-wc-mini-cart-block-icon',
		cartAmount: '.blockons-cart-amnt',
		dropdownCart: '.wp-block-blockons-wc-mini-cart.cart-dropdown',
		miniCart: '.blockons-mini-crt',
	};

	/**
	 * Safely clones and appends an element
	 */
	function cloneAndAppend(sourceSelector, targetParent) {
		const sourceElement = document.querySelector(sourceSelector);
		if (!sourceElement || !targetParent) return false;

		try {
			const clone = sourceElement.cloneNode(true);
			targetParent.appendChild(clone);
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Initializes cart icons with amount indicators
	 */
	function initializeCartIcons() {
		const cartIcons = document.querySelectorAll(selectors.cartIcon);
		if (!cartIcons.length) return;

		cartIcons.forEach((icon, index) => {
			// Remove existing cart amount clones to prevent duplicates
			const existingAmount = icon.querySelector('.blockons-cart-amnt');
			if (existingAmount) {
				existingAmount.remove();
			}

			cloneAndAppend(selectors.cartAmount, icon);
		});
	}

	/**
	 * Initializes dropdown carts
	 */
	function initializeDropdownCarts() {
		const dropdownCarts = document.querySelectorAll(selectors.dropdownCart);
		if (!dropdownCarts.length) return;

		dropdownCarts.forEach((cart, index) => {
			const innerContainer = cart.querySelector(
				'.blockons-wc-mini-cart-inner',
			);
			if (innerContainer) {
				// Remove existing mini cart clones to prevent duplicates
				const existingMiniCart =
					innerContainer.querySelector('.blockons-mini-crt');
				if (existingMiniCart) {
					existingMiniCart.remove();
				}

				cloneAndAppend(selectors.miniCart, innerContainer);
			}
		});
	}

	// Initialize all cart components
	try {
		initializeCartIcons();
		initializeDropdownCarts();
	} catch (error) {
		console.error('Failed to initialize cart components:', error);
	}
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initializeBlockonsCart);

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeBlockonsCart);
} else {
	initializeBlockonsCart();
}

// Expose function globally for other scripts to use
window.initializeBlockonsCart = initializeBlockonsCart;
