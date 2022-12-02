import Splide from "@splidejs/splide";
import { Video } from "@splidejs/splide-extension-video";

document.addEventListener("DOMContentLoaded", () => {
	const videoSliders = document.querySelectorAll(".blockons-video-slider");

	if (videoSliders) {
		videoSliders.forEach((slider) => {
			const theSlider = document.getElementById(slider.id);
			// const theSliderId = theSlider.getAttribute("id");

			const theSliderSettings = JSON.parse(
				theSlider.getAttribute("data-settings")
			);

			const sliderElement = theSlider.querySelector(".splide");

			if (sliderElement) {
				new Splide(sliderElement, theSliderSettings).mount({ Video });
			}
		});
	}
});
