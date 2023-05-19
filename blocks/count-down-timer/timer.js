/**
 * Functionality to show/hide the Blockons Accordions
 */
document.addEventListener("DOMContentLoaded", () => {
	const countDownBlocks = document.querySelectorAll(
		".blockons-count-timer-block .countdown"
	);

	console.log("countDownBlocks: ", countDownBlocks);

	if (countDownBlocks) {
		countDownBlocks.forEach((countDownBlock, index) => {
			console.log("countDownBlock: ", countDownBlock, index);

			const countDownDate = new Date("May 18, 2023 15:01:00").getTime();

			const updateCountdown = () => {
				const now = new Date().getTime();
				const distance = countDownDate - now;

				const days = Math.floor(distance / (1000 * 60 * 60 * 24));
				const hours = Math.floor(
					(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
				);
				const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((distance % (1000 * 60)) / 1000);

				countDownBlock.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;

				if (distance < 0) {
					clearInterval(x);
					countDownBlock.innerHTML = "EXPIRED";
				}
			};

			const x = setInterval(updateCountdown, 1000);
		});
	}
});
