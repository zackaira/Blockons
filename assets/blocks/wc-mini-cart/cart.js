/**
 * Little JS hack to display the Cart amount and Mini Cart in the Cart Icon Block
 */
document.addEventListener("DOMContentLoaded", function () {
	const cartIcons = document.querySelectorAll(
		".blockons-wc-mini-cart-block-icon"
	);

	if (cartIcons) {
		cartIcons.forEach((item) => {
			const cartItem = document.querySelector(".blockons-cart-amnt");
			if (cartItem) item.appendChild(cartItem.cloneNode(true));
		});
	}

	const miniCarts = document.querySelectorAll(".blockons-wc-mini-cart-inner");

	if (miniCarts) {
		miniCarts.forEach((item) => {
			const miniCart = document.querySelector(".blockons-mini-crt");
			if (miniCart) item.appendChild(miniCart.cloneNode(true));
		});
	}
});
