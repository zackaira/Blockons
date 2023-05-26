/**
 * Functionality to show/hide the Blockons Accordions
 */
document.addEventListener("DOMContentLoaded", () => {
	const accordionBlocks = document.querySelectorAll(
		".wp-block-blockons-accordions"
	);

	if (accordionBlocks) {
		accordionBlocks.forEach((accordionBlock, index) => {
			const accPanels = accordionBlock.querySelectorAll(
				".wp-block-blockons-accordion"
			);
			const closeAll = accordionBlock.classList.contains("close-all");

			if (accPanels) {
				accPanels.forEach((accPanel, i) => {
					const panelTitle = accPanel.querySelector(".accordion-label");
					const panelHeight =
						accPanel.querySelector(".accordion-content").scrollHeight;

					if (accPanel.classList.contains("active")) {
						accPanel.querySelector(".accordion-content").style.maxHeight =
							panelHeight + "px";
					}

					panelTitle.addEventListener("click", () => {
						if (closeAll) {
							accPanels.forEach((acc, i) => {
								acc.classList.remove("active");
								acc.querySelector(".accordion-content").style.maxHeight = null;
							});
						}

						const accPanelContent =
							accPanel.querySelector(".accordion-content");

						if (accPanel.classList.contains("active")) {
							accPanel.classList.remove("active");
							accPanelContent.style.maxHeight = null;
						} else {
							accPanel.classList.add("active");
							accPanelContent.style.maxHeight =
								accPanelContent.scrollHeight + "px";
						}
					});
				}); // accPanels forEach
			}
		}); // accordionBlocks forEach
	}
});
