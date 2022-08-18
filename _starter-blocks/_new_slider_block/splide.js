import Splide from "@splidejs/splide";

document.addEventListener("DOMContentLoaded", () => {
	const imgCarousels = document.querySelectorAll(
		".blockons-imgcarousel-slider"
	);

	if (imgCarousels) {
		imgCarousels.forEach((slider) => {
			const theSlider = document.getElementById(slider.id);
			// const theSliderId = theSlider.getAttribute("id");

			const theSliderSettings = JSON.parse(
				theSlider.getAttribute("data-settings")
			);

			const sliderElement = theSlider.querySelector(".splide");

			if (sliderElement) {
				new Splide(sliderElement, theSliderSettings).mount();
			}
		});
	}
});
