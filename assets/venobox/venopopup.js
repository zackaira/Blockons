document.addEventListener("DOMContentLoaded", () => {
	const isPro = Boolean(blockonsFrontendObj.isPremium);
	const defaultOptions = blockonsFrontendObj.blockonsOptions?.imagepopups;

	const blockonsImages = document.querySelectorAll(".wp-block-image");
	if (blockonsImages) {
		blockonsImages.forEach((image) => {
			const popupSettings = JSON.parse(image.getAttribute("data-popup"));
			if (!popupSettings) return;

			const img = image.querySelector("img");
			const styles = calculatePosition(
				img.width,
				img.height,
				popupSettings.iconpos
			);
			const popupButton = document.createElement("div");
			popupButton.classList.add("blockons-venobox-trigger");
			console.log("styles", styles);
			popupButton.style.left = styles.left + "px";
			popupButton.style.top = styles.top + "px";
			image.appendChild(popupButton);

			// console.log("Default Options: ", defaultOptions);
			console.log("Popup Settings: ", popupSettings);

			new VenoBox({
				selector: ".blockons-venobox",
				customClass: "blockons-img-popup",
				numeration: true,
				infinigall: popupSettings.infinite,
				share: false,
				titleattr:
					popupSettings.captionPosition !== "none" ? popupSettings.caption : "",
				titlePosition:
					popupSettings.captionPosition !== "none"
						? popupSettings.captionPosition
						: "top",
				titleStyle: "pill",
				spinner: "flow",
				maxWidth: "1200px",
				toolsColor: "#FFF",
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
