import YouTubePlayer from "youtube-player";
import Player from "@vimeo/player";

export function blockonsSlideVideoAction() {
	const video_slides = document.querySelectorAll(
		".swiper-slide-inner.blockons-videos"
	);

	if (video_slides) {
		video_slides.forEach((slide, i) => {
			const slideParent = slide.parentElement;
			const video = slide.querySelector(".blockons-video");
			const nextPrev = document.querySelectorAll(
				".swiper-button-prev, .swiper-button-next"
			);

			if (video) {
				const videoType = video.classList[1];
				const playBtn = slide.querySelector(".play-button");

				switch (videoType) {
					case "youtube":
						const videoId = video.id.slice(4);
						const player = YouTubePlayer(video.id, {
							videoId: videoId,
						});

						if (playBtn) {
							playBtn.addEventListener("click", () => {
								if (slideParent.classList.contains("swiper-slide-active")) {
									slideParent.classList.add("blockons-play");
								}
								player.playVideo();
							});
						}

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

								vimeo
									.ready()
									.then(() => vimeo.play())
									.catch((err) => console.log(err));
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
						if (playBtn) {
							playBtn.addEventListener("click", () => {
								if (slideParent.classList.contains("swiper-slide-active")) {
									slideParent.classList.add("blockons-play");
								}
								video.play();
							});
						}
						if (nextPrev) {
							nextPrev.forEach((el) => {
								el.addEventListener("click", () => video.pause());
								slideParent.classList.remove("blockons-play");
							});
						}

						break;
				}
			}
		});
	}
}
