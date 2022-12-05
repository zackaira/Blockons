import YouTubePlayer from "youtube-player";
import Player from "@vimeo/player";

export function blockonsSlideVideoAction() {
	const video_slides = document.querySelectorAll(
		".swiper-slide-inner.blockons-videos"
	);

	if (video_slides) {
		video_slides.forEach((slide, i) => {
			const slideParent = slide.parentElement;
			const video = slide.querySelector("iframe");
			const nextPrev = document.querySelectorAll(
				".swiper-button-prev, .swiper-button-next"
			);

			if (video) {
				const videoType = video.classList[1];
				const playBtn = slide.querySelector(".play-button");

				switch (videoType) {
					case "youtube":
						const player = YouTubePlayer(video);

						player.on("ready", (event) => {
							if (playBtn) {
								playBtn.addEventListener("click", () => {
									if (slideParent.classList.contains("swiper-slide-active")) {
										slideParent.classList.add("blockons-play");
									}
									player.playVideo();
								});
							}
						});
						if (nextPrev) {
							nextPrev.forEach((el) => {
								el.addEventListener("click", () => player.pauseVideo());
								slideParent.classList.remove("blockons-play");
							});
						}

						break;
					case "vimeo":
						const vimeo = new Player(video);

						if (playBtn) {
							playBtn.addEventListener("click", () => {
								if (slideParent.classList.contains("swiper-slide-active")) {
									slideParent.classList.add("blockons-play");
								}
								vimeo.play();
							});
						}
						if (nextPrev) {
							nextPrev.forEach((el) => {
								el.addEventListener("click", () => vimeo.pause());
								slideParent.classList.remove("blockons-play");
							});
						}

						break;
					default:
						// console.log("play an uploaded video", videoType);
						break;
				}
			}
		});
	}

	// console.log(nodelist);

	// for (i = 0; i < nodelist; i++) {
	// 	el = video_frame[i];
	// 	let player = new Vimeo.Player(x[i]);

	// 	play_btn[i].addEventListener("click", function () {
	// 		player.play();
	// 	});

	// 	player.on("play", function () {
	// 		console.log("played the video!");
	// 	});
	// }
}
