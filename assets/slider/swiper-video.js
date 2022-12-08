import "../../blocks/video-slider/video-actions";
import { blockonsSlideVideoAction } from "../../blocks/video-slider/video-actions";

document.addEventListener("DOMContentLoaded", () => {
	const blockonSliders = document.querySelectorAll(
		".blockons-slider.video-slider"
	);

	if (blockonSliders) {
		blockonSliders.forEach((slider) => {
			const sliderSettings = JSON.parse(slider.getAttribute("data-settings"));
			const sliderElement = slider.firstElementChild.classList[0];
			// console.log(sliderElement, sliderSettings);

			const sliderOn = {
				on: {
					init: () => blockonsSlideVideoAction(),
					slideChange: () => blockonsSlideVideoAction(),
				},
			};

			if (sliderElement) {
				// const blockonSwiper = new Swiper(`.${sliderElement}`, {
				// 	...sliderSettings,
				// 	...sliderOn,
				// });
				new Swiper(`.${sliderElement}`, {
					...sliderSettings,
					...sliderOn,
				});
			}
		});
	}
});
