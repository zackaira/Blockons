/**
 * Functionality to show/hide the Blockons Tabs
 */
document.addEventListener("DOMContentLoaded", () => {
	const tabBlocks = document.querySelectorAll(".wp-block-blockons-tabs");

	if (tabBlocks) {
		tabBlocks.forEach((block) => {
			block.classList.remove("load-content"); // Loading class
			const tabs = block.querySelectorAll(".blockons-tab");
			const contents = block.querySelectorAll(".blockons-content");

			// Hide all content blocks
			contents.forEach((content) => {
				content.style.display = "none";
			});

			// Show the content of the first tab by default
			if (contents.length > 0) {
				contents[0].style.display = "block";
				tabs[0].classList.add("active");
			}

			for (let i = 0; i < tabs.length; i++) {
				tabs[i].addEventListener("click", () => {
					const contentClass = tabs[i].id.replace("tab-", "content-");

					for (let d = 0; d < contents.length; d++) {
						contents[d].style.display = "none";
					}

					for (let j = 0; j < tabs.length; j++) {
						tabs[j].classList.remove("active");

						if (contents[j].classList.contains(contentClass)) {
							contents[j].style.display = "block";
						}
					}

					tabs[i].classList.add("active");
				});
			}
		});
	}
}); // DOMContentLoaded
