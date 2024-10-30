/**
 * Functionality to show/hide the Blockons WC Mini Cart
 * Little JS hack to display the Cart amount and Mini Cart in the Cart Icon Block
 * Also localizes wcCartObj for edit.js
 *
 * FREE
 */
document.addEventListener('DOMContentLoaded', function () {
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
});
