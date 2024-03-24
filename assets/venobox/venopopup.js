document.addEventListener("DOMContentLoaded", () => {
	const isPro = Boolean(blockonsFrontendObj.isPremium);
	const defaultOptions = blockonsFrontendObj.blockonsOptions?.imagepopups;

	const blockonsImages = document.querySelectorAll(".wp-block-image");
	if (blockonsImages) {
		blockonsImages.forEach((image) => {
			const popupSettings = JSON.parse(image.getAttribute("data-popup"));
			console.log("Default Options: ", defaultOptions);
			console.log("Popup Settings: ", popupSettings);

			if (popupSettings) {
				new VenoBox({
					selector: ".blockons-venobox",
					customClass: "blockons-img-popup",
					numeration: true,
					infinigall: popupSettings.infinite,
					share: false,
					titleattr:
						popupSettings.captionPosition !== "none"
							? popupSettings.caption
							: "",
					titlePosition:
						popupSettings.captionPosition !== "none"
							? popupSettings.captionPosition
							: "top",
					titleStyle: "pill",
					spinner: "flow",
					maxWidth: "1200px",
					toolsColor: "#FFF",
				});
			}
		});
	}
});
