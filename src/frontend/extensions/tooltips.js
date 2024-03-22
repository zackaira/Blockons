import { blockonsStringReplaceForLink } from "../../backend/helpers";
const isPremium = Boolean(blockonsFrontendObj.isPremium);

export function createTooltipComponent(
	style,
	theme,
	title,
	text,
	icon,
	tooltipDefaults
) {
	// console.log(style, theme, title, text, icon, tooltipDefaults);
	const tooltipComponent = document.createElement("div");
	tooltipComponent.classList.add("blockons-tooltip");

	if (isPremium && tooltipComponent) {
		tooltipComponent?.classList.add(style, theme);
	} else {
		tooltipComponent?.classList.add("underlined", "one");
	}

	tooltipComponent.innerHTML = `
		<div class="blockons-tooltip-popup">
			<h6 class="blockons-tooltip-title">${title}</h6>
			<p class="blockons-tooltip-text">${
				isPremium ? blockonsStringReplaceForLink(text) : text
			}</p>

			${icon ? `<div class="tooltip-icon ${icon}"></div>` : ""}
		</div>`;

	return tooltipComponent;
}

export function initializeTooltips(tooltipDefaults = {}) {
	const blockonsTooltips = document.querySelectorAll(
		".blockons-inline-tooltip"
	);
	if (blockonsTooltips.length > 0) {
		blockonsTooltips.forEach((tooltip) => {
			const style = tooltip.getAttribute("data-style") || "underlined";
			const theme = tooltip.getAttribute("data-theme") || "one";
			const title = tooltip.getAttribute("data-title");
			const text = tooltip.getAttribute("data-text");
			const icon = tooltip.getAttribute("data-icon");
			const color = tooltip.getAttribute("data-color");
			const fcolor = tooltip.getAttribute("data-fcolor");

			if (title || text) {
				const tooltipComponent = createTooltipComponent(
					style,
					theme,
					title,
					text,
					tooltipDefaults
				);
				tooltip.append(tooltipComponent);

				if (icon) tooltip.classList.add("icon");
				if (style !== "highlight" && color)
					tooltip.style.borderBottomColor = color;

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
