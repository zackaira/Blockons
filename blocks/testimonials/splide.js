import Splide from "@splidejs/splide";

document.addEventListener("DOMContentLoaded", () => {
	const testimonialsSliders = document.querySelectorAll(
		".blockons-testimonials-slider"
	);

	if (testimonialsSliders) {
		testimonialsSliders.forEach((slider) => {
			const theSlider = document.getElementById(slider.id);
			// const theSliderId = theSlider.getAttribute("id");

			const theSliderSettings = JSON.parse(
				theSlider.getAttribute("data-settings")
			);

			const sliderElement = theSlider.querySelector(".splide");

			new Splide(sliderElement, theSliderSettings).mount();
		});
	}
});
