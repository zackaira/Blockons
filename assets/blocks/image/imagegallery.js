const Masonry = require('masonry-layout');
var imagesLoaded = require('imagesloaded');
import showGalleryPopup from '../../popups/GalleryPopup';

document.addEventListener('DOMContentLoaded', () => {
	const msnryEle = document.querySelector('.blockons-gallery.masonry');
	if (msnryEle) {
		const msnry = new Masonry(msnryEle, {
			itemSelector: '.blockons-gallery-item.masonry',
			columnWidth: '.blockons-gallery-item.masonry',
			percentPosition: true,
		});

		imagesLoaded(msnryEle, () => msnry.layout());
	}

	const isPro = Boolean(blockonsFrontendObj.isPremium);
	// const defaultOptions = blockonsFrontendObj.blockonsOptions?.imagepopups;

	const blockonsGalleryImages = document.querySelectorAll(
		'body.blockons-pro .blockons-gallery-img',
	);
	const imagesArray = Array.from(blockonsGalleryImages)
		.map((image) => {
			const img = image.querySelector('img');
			if (!image) return null;

			return {
				imageUrl: img?.src || '',
				imageCaption: image.dataset?.imgcaption || '',
			};
		})
		.filter(Boolean);

	if (isPro && blockonsGalleryImages.length > 0) {
		blockonsGalleryImages.forEach((image, index) => {
			const img = image.querySelector('img');
			if (!img) return;

			// Create a button to trigger the popup
			const popupButton = document.createElement('div');
			popupButton.classList.add('blockons-popup');
			image.appendChild(popupButton);

			// Add click event listener to open the popup
			image.addEventListener('click', () => {
				showGalleryPopup({ images: imagesArray, startIndex: index });
			});
		});
	}
});
