import { blockonsStringReplaceForLink } from "../../backend/helpers";
const isPremium = Boolean(blockonsFrontendObj.isPremium);

export function createTooltipComponent(title, text, tooltipSettings) {
	const tooltipComponent = document.createElement("div");
	tooltipComponent.classList.add("blockons-tooltip");

	if (isPremium && tooltipComponent) {
		tooltipComponent?.classList.add(tooltipSettings?.theme || "one");
	} else {
		tooltipComponent?.classList.add("one");
	}

	tooltipComponent.innerHTML = `
		<h6 class="blockons-tooltip-title">${title}</h6>
		<p class="blockons-tooltip-text">${
			isPremium ? blockonsStringReplaceForLink(text) : text
		}</p>
	`;
	return tooltipComponent;
}

export function initializeTooltips(tooltipSettings = {}) {
	const blockonsTooltips = document.querySelectorAll(
		".blockons-inline-tooltip"
	);
	if (blockonsTooltips.length > 0) {
		blockonsTooltips.forEach((tooltip) => {
			const title = tooltip.getAttribute("data-title");
			const text = tooltip.getAttribute("data-text");

			if (title || text) {
				const tooltipComponent = createTooltipComponent(
					title,
					text,
					tooltipSettings
				);
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
