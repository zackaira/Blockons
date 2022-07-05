import Splide from "@splidejs/splide";

document.addEventListener("DOMContentLoaded", () => {
	const imgCarousels = document.querySelectorAll(
		".blockons-imgcarousel-slider"
	);

	if (imgCarousels) {
		imgCarousels.forEach((slider) => {
			const theCarousel = document.getElementById(slider.id);
			// const theCarouselId = theCarousel.getAttribute("id");

			const theCarouselSettings = JSON.parse(
				theCarousel.getAttribute("data-settings")
			);

			const sliderElement = theCarousel.querySelector(".splide");

			if (sliderElement) {
				new Splide(sliderElement, theCarouselSettings).mount();
			}
		});
	}
});
