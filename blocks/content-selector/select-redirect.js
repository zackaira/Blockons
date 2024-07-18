document.addEventListener("DOMContentLoaded", () => {
	const dsContents = document.querySelectorAll(".ds-contents");

	if (dsContents.length > 0) {
		for (let i = 0; i < dsContents.length; i++) {
			const dynamicSelect = document.getElementById(dsContents[i].id);
			const dsSelect = dynamicSelect.querySelector(".blockons-ds-select");

			let interval; // Declare the interval variable outside the event listener

			if (dsSelect.value) {
				const selectedOption = dsSelect.value;
				const selectedContent = document.querySelector(
					`.blockons-ds-content.content-ds-${selectedOption}`
				);

				if (selectedContent) {
					selectedContent.classList.add("active");
				}
			}

			dsSelect.addEventListener("change", function () {
				// Clear the existing interval if any
				if (interval) {
					clearInterval(interval);
				}

				const selectedOption = dsSelect.value;
				const selectedContent = document.querySelector(
					`.blockons-ds-content.content-ds-${selectedOption}`
				);

				dsContents[i]
					.querySelectorAll(".blockons-ds-content")
					.forEach((content) => {
						content.classList.remove("active");
					});

				if (selectedContent) {
					selectedContent.classList.add("active");

					const countDown = selectedContent.querySelector(".blockons-dscount");

					if (countDown) {
						let count = parseInt(countDown.getAttribute("data-count"));
						const redirect = countDown.getAttribute("data-redirect");

						if (count && redirect) {
							const cancelButton = document.createElement("span");
							cancelButton.textContent = "Cancel";
							cancelButton.classList.add("blockons-ds-cancel");
							countDown.parentNode.appendChild(cancelButton);

							interval = setInterval(() => {
								countDown.textContent = count;
								count--;

								if (count < 0) {
									clearInterval(interval);
									window.location.href = redirect;
								}
							}, 1000);

							// Add event listener to cancel the countdown
							cancelButton.addEventListener("click", () => {
								const allTxt = selectedContent.querySelector(
									".blockons-ds-countdown-txt"
								);
								clearInterval(interval);
								allTxt.textContent = "Redirect cancelled";
							});
						}
					}
				}
			});
		}
	}
});
