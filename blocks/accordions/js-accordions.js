/**
 * Functionality to show/hide the Blockons Accordions
 */
document.addEventListener("DOMContentLoaded", () => {
	const accordions = document.getElementsByClassName("accordion-label");

	if (accordions.length > 0) {
		for (let i = 0; i < accordions.length; i++) {
			accordions[i].addEventListener("click", function () {
				this.parentElement.classList.toggle("active");
				const panel = this.nextElementSibling;
				const accordionBlock = this.closest(".wp-block-blockons-accordions");
				const closeAll = accordionBlock.classList.contains("close-all");

				if (closeAll) {
					const allPanels = accordionBlock.querySelectorAll(
						".wp-block-blockons-accordion"
					);

					allPanels.forEach((acc, i) => {
						if (acc !== this.parentElement) {
							acc.querySelector(".accordion-content").style.maxHeight =
								acc.querySelector(".accordion-content").scrollHeight + "px";
							setTimeout(() => {
								// This is a hack to make the transition smoother
								acc.classList.remove("active");
								acc.querySelector(".accordion-content").style.maxHeight = null;
							}, 0);
						}
					});
				}

				if (panel.style.maxHeight) {
					// Closed
					panel.style.maxHeight = panel.scrollHeight + "px";
					setTimeout(() => {
						panel.style.maxHeight = null;
					}, 50);
				} else {
					// Opened
					panel.style.maxHeight = panel.scrollHeight + "px";
					setTimeout(() => {
						panel.style.maxHeight = "unset";
					}, 200);
				}
			});
		}
	}
});
