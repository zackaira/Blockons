import { blockonsStringReplaceForLink } from "../../backend/helpers";
const isPremium = Boolean(blockonsFrontendObj.isPremium);

export function createTooltipComponent(
	theme,
	title,
	text,
	image,
	pcolor,
	pfcolor
) {
	const tooltipComponent = document.createElement("div");
	tooltipComponent.classList.add("blockons-tooltip");
	if (isPremium && theme === "custom") {
		tooltipComponent.style.backgroundColor = pcolor;
		tooltipComponent.style.color = pfcolor;
	}

	if (isPremium && tooltipComponent) {
		tooltipComponent?.classList.add(theme);
	} else {
		tooltipComponent?.classList.add("one");
	}

	tooltipComponent.innerHTML = `
		<div class="blockons-tooltip-popup">
			${isPremium && image ? `<img src="${image}" alt="${title}" />` : ""}

			<h6 class="blockons-tooltip-title">${title}</h6>
			<p class="blockons-tooltip-text">${
				isPremium ? blockonsStringReplaceForLink(text) : text
			}</p>

			<span class="blockons-tooltip-angle" ${
				isPremium && theme === "custom"
					? "style='border-top-color: " + pcolor + "'"
					: ""
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
			const style = tooltip.getAttribute("data-style") || tooltipDefaults.style;
			const theme = tooltip.getAttribute("data-theme") || tooltipDefaults.theme;
			const title = tooltip.getAttribute("data-title");
			const text = tooltip.getAttribute("data-text");
			const icon = tooltip.getAttribute("data-icon") || "";
			const image = tooltip.getAttribute("data-image") || "";
			const color = tooltip.getAttribute("data-color") || tooltipDefaults.color;
			const fcolor =
				tooltip.getAttribute("data-fcolor") || tooltipDefaults.fcolor;
			const pcolor =
				tooltip.getAttribute("data-pcolor") || tooltipDefaults.pcolor;
			const pfcolor =
				tooltip.getAttribute("data-pfcolor") || tooltipDefaults.pfcolor;

			if (title || text) {
				const tooltipComponent = createTooltipComponent(
					theme,
					title,
					text,
					image,
					pcolor,
					pfcolor
				);
				tooltip.append(tooltipComponent);
				tooltip.classList.add(style);
				if (isPremium && fcolor) tooltip.style.color = fcolor;

				if (isPremium && style !== "highlight" && color)
					tooltip.style.borderBottomColor = color;

				if (isPremium && icon) {
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
