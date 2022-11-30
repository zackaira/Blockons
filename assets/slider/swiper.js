document.addEventListener("DOMContentLoaded", () => {
	const blockonSliders = document.querySelectorAll(".blockons-slider");

	if (blockonSliders) {
		blockonSliders.forEach((slider) => {
			const sliderSettings = JSON.parse(slider.getAttribute("data-settings"));
			const sliderElement = slider.firstElementChild.className;

			console.log(sliderSettings);

			if (sliderElement) {
				const blockonSwiper = new Swiper(`.${sliderElement}`, sliderSettings);
			}
		});
	}
});
