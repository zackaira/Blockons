const Masonry = require("masonry-layout");
var imagesLoaded = require("imagesloaded");

document.addEventListener("DOMContentLoaded", () => {
	const isPro = blockonsDetails.isPremium;

	const msnryEle = document.querySelector(".blockons-gallery.masonry");
	if (msnryEle) {
		const msnry = new Masonry(msnryEle, {
			itemSelector: ".blockons-gallery-item.masonry",
			columnWidth: ".blockons-gallery-item.masonry",
			percentPosition: true,
		});

		imagesLoaded(msnryEle, () => msnry.layout());
	}

	const venoboxItems = document.querySelectorAll(".blockons-venobox-item");

	if (venoboxItems) {
		venoboxItems.forEach((venobox, i) => {
			if (isPro) {
				venobox.classList.add("blockons-venobox");
			} else {
				venobox.classList.add("hide");
			}
		});
	}
});
