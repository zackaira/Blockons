import { blockonsStringReplaceForLink } from "../../backend/helpers";

export function createTooltipComponent(title, text) {
	const tooltipComponent = document.createElement("div");
	tooltipComponent.classList.add("blockons-tooltip");
	tooltipComponent.innerHTML = `
		<h6 class="blockons-tooltip-title">${title}</h6>
		<p class="blockons-tooltip-text">${blockonsStringReplaceForLink(text)}</p>
	`;
	return tooltipComponent;
}

export function initializeTooltips(blockonsOptions = {}) {
	const blockonsTooltips = document.querySelectorAll(
		".blockons-inline-tooltip"
	);
	if (blockonsTooltips.length > 0) {
		blockonsTooltips.forEach((tooltip) => {
			const title = tooltip.getAttribute("data-title");
			const text = tooltip.getAttribute("data-text");
			console.log("blockonsOptions", blockonsOptions);
			tooltip.classList.add(blockonsOptions?.theme || "one");

			if (title || text) {
				const tooltipComponent = createTooltipComponent(title, text);
				tooltip.append(tooltipComponent);

				tooltip.addEventListener("mouseover", () => {
					tooltip.classList.add("active");
				});
				tooltip.addEventListener("mouseout", () => {
					tooltip.classList.remove("active");
				});
			}
		});
	}
}
