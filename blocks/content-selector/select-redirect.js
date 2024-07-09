document.addEventListener("DOMContentLoaded", () => {
	const dsContents = document.querySelectorAll(".ds-contents");

	if (dsContents.length > 0) {
		for (let i = 0; i < dsContents.length; i++) {
			const dynamicSelect = document.getElementById(dsContents[i].id);
			const dsSelect = dynamicSelect.querySelector(".blockons-ds-select");

			if (dsSelect.value) {
				const selectedOption = dsSelect.value;
				const selectedContent = document.querySelector(
					`.blockons-ds-content.content-ds-${selectedOption}`
				);

				if (selectedContent) {
					selectedContent.classList.add("active");
				}
			}

			dsSelect.addEventListener("change", function () {
				const selectedOption = dsSelect.value;
				const selectedContent = document.querySelector(
					`.blockons-ds-content.content-ds-${selectedOption}`
				);

				dsContents[i]
					.querySelectorAll(".blockons-ds-content")
					.forEach((content) => {
						content.classList.remove("active");
					});

				if (selectedContent) {
					selectedContent.classList.add("active");
				}
			});
		}
	}
});
