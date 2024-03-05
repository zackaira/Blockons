const Masonry = require("masonry-layout");
var imagesLoaded = require("imagesloaded");

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
});
