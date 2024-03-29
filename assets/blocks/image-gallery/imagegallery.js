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

	const isPro = Boolean(blockonsFrontendObj.isPremium);
	const defaultOptions = blockonsFrontendObj.blockonsOptions?.imagepopups;

	/* Venobox Popup - Also in /assets/venobox/venopopup.js */
	const blockonsGalleryImages = document.querySelectorAll(
		"body.blockons-pro .blockons-gallery-img"
	);
	if (blockonsGalleryImages) {
		blockonsGalleryImages.forEach((image) => {
			const popupSettings = JSON.parse(image.getAttribute("data-popup"));
			const img = image.querySelector("img");
			if (!img || !isPro) return;

			const styles = calculateIconPosition(
				img.width,
				img.height,
				popupSettings.iconpos
			);
			const popupButton = document.createElement("div");
			popupButton.classList.add("blockons-venobox-trigger");
			popupButton.style.left = styles.left + "px";
			popupButton.style.top = styles.top + "px";
			image.appendChild(popupButton);

			new VenoBox({
				selector: ".blockons-galvenobox",
				customClass: defaultOptions.popuptheme,
				numeration: true,
				infinigall: true,
				share: false,
				...(defaultOptions.captionpos !== "none"
					? { titleattr: "data-title" }
					: {}),
				titlePosition: defaultOptions.captionpos,
				titleStyle: "pill",
				spinner: "flow",
				maxWidth: "1200px",
				toolsColor: "#FFF",
				...(defaultOptions.popuptheme === "light"
					? { overlayColor: "rgb(255 255 255 / 75%)" }
					: {}),
			});
		});
	}

	function calculateIconPosition(width, height, position) {
		switch (position) {
			case "topleft":
				return { left: 15, top: 15 };
			case "topright":
				return { left: `${width - 47}`, top: 15 };
			case "bottomleft":
				return { left: 15, top: `${height - 47}` };
			case "bottomright":
				return { left: `${width - 47}`, top: `${height - 47}` };
			default:
				return { left: width / 2, top: height / 2 };
		}
	}
});
