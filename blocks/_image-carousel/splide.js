import Splide from "@splidejs/splide";

function updateHeight(slider) {
	// let slide = slider.Components.Slides.getAt(slider.index).slide;
	let slide = slider.Components.Slides.getAt(slider.index).slide;
	let sliderTrackParent = slide.closest(".carousel-resize");

	sliderTrackParent.querySelector(".splide__track").style.height =
		slide.offsetHeight + "px";
}

document.addEventListener("DOMContentLoaded", () => {
	const imgCarousels = document.querySelectorAll(
		".blockons-image-carousel-slider"
	);

	if (imgCarousels) {
		imgCarousels.forEach((slider) => {
			const theCarousel = document.getElementById(slider.id);

			const theCarouselSettings = JSON.parse(
				theCarousel.getAttribute("data-settings")
			);
			const slidesNumber = theCarousel.getAttribute("data-slides");

			const sliderElement = theCarousel.querySelector(".splide");

			if (sliderElement) {
				if (parseInt(slidesNumber) === 1) {
					var aSlider = new Splide(sliderElement, theCarouselSettings);
					aSlider.on("mounted", function () {
						setTimeout(() => {
							updateHeight(aSlider);
						}, 80);
					});
					aSlider.on("move", function () {
						updateHeight(aSlider);
					});
					aSlider.on("resize", function () {
						updateHeight(aSlider);
					});
					aSlider.mount();
					// updateHeight(aSlider);
				} else {
					// console.log("multiple slides");
					new Splide(sliderElement, theCarouselSettings).mount();
				}
			}
		});
	}
});
