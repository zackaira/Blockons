import "../imagegallery";

document.addEventListener("DOMContentLoaded", () => {
	console.log(blockonsDetails.isPremium);

	

		new VenoBox({
			selector: ".blockons-venobox",
			customClass: "blockons-popup",
			numeration: true,
			infinigall: true,
			share: false,
			titleattr: "data-title",
			titlePosition: "top", // bottom
			titleStyle: "top", // 'block' | 'pill' | 'transparent' | 'bar'
			spinner: "flow",
			maxWidth: "1200px",
		});
});
