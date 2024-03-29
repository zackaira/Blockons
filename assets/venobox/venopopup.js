/* Venobox Popup - Also in /assets/blocks/image-gallery/imagegallery.js */
import "./venopopup.css";

document.addEventListener("DOMContentLoaded", () => {
	const defaultOptions = blockonsFrontendObj.blockonsOptions?.imagepopups;

	const blockonsImages = document.querySelectorAll(
		".wp-block-image, body.blockons-pro .blockons-gallery-img"
	);
	if (blockonsImages) {
		blockonsImages.forEach((image) => {
			const popupSettings = JSON.parse(image.getAttribute("data-popup"));
			if (!popupSettings || !popupSettings?.enabled || !defaultOptions.enabled)
				return;

			const img = image.querySelector("img");
			if (!img) return;

			const styles = calculatePosition(
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
				selector: ".blockons-venobox",
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

	function calculatePosition(width, height, position) {
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
