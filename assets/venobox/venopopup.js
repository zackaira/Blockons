document.addEventListener("DOMContentLoaded", () => {
	const isPro = Boolean(blockonsFrontendObj.isPremium);
	const defaultOptions = Boolean(
		blockonsFrontendObj.blockonsOptions?.imagepopups
	);

	console.log("LOADERrrrrD !!!!");
	console.log("defaultOptions: ", defaultOptions);

	const blockonsImages = document.querySelectorAll(".wp-block-image");
	if (blockonsImages) {
		blockonsImages.forEach((image) => {
			const popupSettings = JSON.parse(image.getAttribute("data-popup"));
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
							: "top", // bottom
					titleStyle: "pill", // 'block' | 'pill' | 'transparent' | 'bar'
					spinner: "flow",
					maxWidth: "1200px",
					toolsColor: "#FFF",
				});
			}
		});
	}
});
