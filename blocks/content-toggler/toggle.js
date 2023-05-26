/**
 * Functionality for the Content Toggler block
 */
document.addEventListener("DOMContentLoaded", () => {
	const toggleContents = document.querySelectorAll(
		".blockons-content-toggle-container"
	);

	if (toggleContents) {
		toggleContents.forEach((toggleContent) => {
			const toggleBtn = toggleContent.querySelector(".blockons-toggle-button");

			if (toggleBtn) {
				toggleBtn.addEventListener("click", () => {
					if (toggleContent.classList.contains("isclosed")) {
						toggleContent.classList.remove("isclosed");
						toggleContent.classList.add("isopen");
					} else {
						toggleContent.classList.remove("isopen");
						toggleContent.classList.add("isclosed");
					}
				});
			}
		});
	}
});
