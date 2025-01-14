/**
 * Functionality to show/hide the Blockons Search
 *
 * FREE
 */
document.addEventListener('DOMContentLoaded', function () {
	// Default Search
	const blockDefaultFocus = document.querySelectorAll(
		'.blockons-search-block.default .blockons-search-input',
	);

	if (!blockDefaultFocus) return;

	// Drop Down Search
	const blockDropdownFocus = document.querySelectorAll(
		'.blockons-search-block.dropdown .blockons-search-input',
	);

	if (!blockDropdownFocus) return;

	blockDropdownFocus.forEach((item) => {
		item.addEventListener('focus', () => {
			const searchBlockParent = item.closest('.blockons-search-block');
			searchBlockParent.classList.add('search-on');
		});
		item.addEventListener('blur', () => {
			const searchBlockParent = item.closest('.blockons-search-block');
			searchBlockParent.classList.remove('search-on');
		});
	});

	// Popup Search
	const popupSearch = document.querySelectorAll(
		'.blockons-search-block.popup',
	);

	if (popupSearch) {
		popupSearch.forEach((search) => {
			const searchBlock = search.closest('.wp-block-blockons-search');

			search.addEventListener('click', (e) => {
				e.stopPropagation();

				if (searchBlock) {
					searchBlock.classList.toggle('blockons-search-popup-open');
				}
			});

			if (searchBlock) {
				const searchClosers = searchBlock.querySelectorAll(
					'.blockons-search-popup-overlay, .blockons-search-popup .blockons-close',
				);

				searchClosers.forEach((closer) => {
					closer.addEventListener('click', (e) => {
						e.stopPropagation();
						searchBlock.classList.remove(
							'blockons-search-popup-open',
						);
					});
				});
			}
		});
	}
});
