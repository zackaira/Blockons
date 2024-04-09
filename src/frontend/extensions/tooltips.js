import { blockonsStringReplaceForLink } from "../../backend/helpers";
const isPremium = Boolean(blockonsFrontendObj.isPremium);

export function createTooltipComponent(
	style,
	theme,
	title,
	text,
	color,
	fcolor,
	pColor,
	pfColor,
	tooltipDefaults
) {
	// console.log(
	// 	style,
	// 	theme,
	// 	title,
	// 	text,
	// 	color,
	// 	fcolor,
	// 	pColor,
	// 	pfColor,
	// 	tooltipDefaults
	// );
	const tooltipComponent = document.createElement("div");
	tooltipComponent.classList.add("blockons-tooltip");
	if (theme === "custom") {
		tooltipComponent.style.backgroundColor = pColor;
		tooltipComponent.style.color = pfColor;
	}

	if (isPremium && tooltipComponent) {
		tooltipComponent?.classList.add(theme);
	} else {
		tooltipComponent?.classList.add("one");
	}

	tooltipComponent.innerHTML = `
		<div class="blockons-tooltip-popup">
			<h6 class="blockons-tooltip-title">${title}</h6>
			<p class="blockons-tooltip-text">${
				isPremium ? blockonsStringReplaceForLink(text) : text
			}</p>

			<span class="blockons-tooltip-angle" ${
				theme === "custom" ? "style='border-top-color: " + pColor + "'" : ""
			}></span>
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
			const icon = tooltip.getAttribute("data-icon") || "";
			const color = tooltip.getAttribute("data-color") || "";
			const fcolor = tooltip.getAttribute("data-fcolor") || "";
			const pColor = tooltip.getAttribute("data-pcolor") || "#d6c0ff";
			const pfColor = tooltip.getAttribute("data-pfcolor") || "000";

			if (title || text) {
				const tooltipComponent = createTooltipComponent(
					style,
					theme,
					title,
					text,
					color,
					fcolor,
					pColor,
					pfColor,
					tooltipDefaults
				);
				tooltip.append(tooltipComponent);
				tooltip.classList.add(style);
				if (fcolor) tooltip.style.color = fcolor;

				if (style !== "highlight" && color)
					tooltip.style.borderBottomColor = color;

				if (icon) {
					tooltip.classList.add("icon");
					const tooltipIcon = document.createElement("span");
					tooltipIcon.classList.add(
						"tooltip-icon",
						icon.split(" ")[0],
						icon.split(" ")[1]
					);
					if (color) tooltipIcon.style.color = color;
					tooltip.appendChild(tooltipIcon);
				}

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
