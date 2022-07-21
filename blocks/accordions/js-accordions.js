/**
 * Functionality to show/hide the Blockons Accordions
 */
document.addEventListener("DOMContentLoaded", () => {
	console.log("accordions js loaded");

	const accordionBlocks = document.querySelectorAll(
		".wp-block-blockons-accordions"
	);

	if (accordionBlocks) {
		accordionBlocks.forEach((accordionBlock, i) => {
			console.log("Each Accordion");
		}); //accordionBlocks forEach
	}
});
