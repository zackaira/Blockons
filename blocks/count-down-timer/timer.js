/**
 * Functionality for the Count Down Timer block
 */
document.addEventListener("DOMContentLoaded", () => {
	const countDownBlocks = document.querySelectorAll(
		".blockons-count-timer-block .countdown"
	);

	if (countDownBlocks) {
		countDownBlocks.forEach((countDownBlock) => {
			const counterElement = document.getElementById(countDownBlock.id);
			const counterElementParent = counterElement.parentElement;
			const countDownDate = new Date(parseInt(countDownBlock.id)).getTime();
			const onCompleteText = counterElement.getAttribute("data-completeText");
			const onCompleteHide = counterElement.getAttribute("data-completeHide");

			const updateCountdown = () => {
				const now = new Date().getTime();
				const distance = countDownDate - now;

				const days = Math.floor(distance / (1000 * 60 * 60 * 24));
				const hours = Math.floor(
					(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
				)
					.toString()
					.padStart(2, "0");
				const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
					.toString()
					.padStart(2, "0");
				const seconds = Math.floor((distance % (1000 * 60)) / 1000)
					.toString()
					.padStart(2, "0");

				if (days) {
					counterElement
						.querySelector(".count-block.days")
						.classList.remove("blockons-hide");
					counterElement.querySelector(".days .amnt").innerHTML = days;
				} else {
					counterElement
						.querySelector(".count-block.days")
						.classList.add("blockons-hide");
				}
				if (hours) {
					counterElement.querySelector(".hours .amnt").innerHTML = hours;
				}
				if (minutes) {
					counterElement.querySelector(".minutes .amnt").innerHTML = minutes;
				}
				if (seconds) {
					counterElement.querySelector(".seconds .amnt").innerHTML = seconds;
				}

				if (distance < 0) {
					clearInterval(x);
					if (onCompleteText) {
						counterElementParent.classList.add("blockons-expired-hide");
					}
					if (onCompleteHide) {
						counterElementParent.classList.add("blockons-countdown-hide");
					}
				} else {
					if (onCompleteText) {
						counterElementParent.classList.remove("blockons-expired-hide");
					}
					if (onCompleteHide) {
						counterElementParent.classList.remove("blockons-countdown-hide");
					}
				}
			};

			const x = setInterval(updateCountdown, 1000);
		});
	}
});
