/**
 * Functionality to show/hide the Blockons Accordions
 */
document.addEventListener("DOMContentLoaded", () => {
	console.log("Here");
	const accordionBlocks = document.querySelectorAll(
		".wp-block-blockons-accordions"
	);

	if (accordionBlocks) {
		accordionBlocks.forEach((accordionBlock, index) => {
			const accPanels = accordionBlock.querySelectorAll(
				".wp-block-blockons-accordion"
			);

			if (accPanels) {
				accPanels.forEach((accPanel, i) => {
					accPanel.addEventListener("click", () => {
						accPanel.classList.toggle("active");

						const accPanelContent = accPanel.querySelector(
							".accordion-content"
						);
						if (accPanelContent.style.maxHeight) {
							accPanelContent.style.maxHeight = null;
						} else {
							accPanelContent.style.maxHeight =
								accPanelContent.scrollHeight + "px";
						}
					});
				});
			}
		}); //accordionBlocks forEach
	}
});
