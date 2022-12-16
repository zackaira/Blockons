const Masonry = require("masonry-layout");
var imagesLoaded = require("imagesloaded");
import PhotoSwipeLightbox from "photoswipe/lightbox";

document.addEventListener("DOMContentLoaded", () => {
	const msnryEle = document.querySelector(".blockons-gallery.masonry");
	if (msnryEle) {
		const msnry = new Masonry(msnryEle, {
			itemSelector: ".blockons-gallery-item.masonry",
			columnWidth: ".blockons-gallery-item.masonry",
			percentPosition: true,
		});

		imagesLoaded(msnryEle, () => msnry.layout());
	}

	const lightboxGalleries = document.querySelectorAll(".blockons-gallery");
	if (lightboxGalleries) {
		lightboxGalleries.forEach((gallery, i) => {
			const lightbox = new PhotoSwipeLightbox({
				gallery: `#${gallery.id}`,
				children: "a",
				pswpModule: () => import("photoswipe"),
			});
			lightbox.init();
		});
	}
});
