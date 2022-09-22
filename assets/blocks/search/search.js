/**
 * Functionality to show/hide the Blockons Search
 */
document.addEventListener("DOMContentLoaded", function () {
	// Drop Down Search
	const blockFocus = document.querySelectorAll(
		".blockons-search-block.dropdown .blockons-search-input"
	);

	if (!blockFocus) return;

	blockFocus.forEach((item) => {
		item.addEventListener("focus", () => {
			const searchBlockParent = item.closest(".blockons-search-block");
			searchBlockParent.classList.add("search-on");
		});
		item.addEventListener("blur", () => {
			const searchBlockParent = item.closest(".blockons-search-block");
			searchBlockParent.classList.remove("search-on");
		});
	});

	// Popup Search
	const blockSearches = document.querySelectorAll(
		".blockons-search-block.popup"
	);

	if (!blockSearches) return;

	blockSearches.forEach((searchItem) => {
		searchItem.addEventListener("click", () => {
			const searchBlock = searchItem.parentElement;

			if (searchBlock.classList.contains("blockons-show")) {
				searchBlock.classList.remove("blockons-show");
			} else {
				searchBlock.classList.add("blockons-show");
			}
		});
	});

	const searchOverlays = document.querySelectorAll(
		".blockons-search-popup-overlay"
	);
	if (searchOverlays) {
		searchOverlays.forEach((overlayItem) => {
			overlayItem.addEventListener("click", () => {
				overlayItem.parentElement.classList.remove("blockons-show");
			});
		});
	}

	const searchCloses = document.querySelectorAll(
		".blockons-search-popup .blockons-close"
	);
	if (searchCloses) {
		searchCloses.forEach((overlayItem) => {
			overlayItem.addEventListener("click", () => {
				overlayItem
					.closest(".wp-block-blockons-search")
					.classList.remove("blockons-show");
			});
		});
	}
});
