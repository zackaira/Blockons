/*
 * Waypoints for the Progress bars to load when InView
 */
window.addEventListener("DOMContentLoaded", function () {
	const progressBars = document.querySelectorAll(".blockons-progressbar");
	const progressBears = document.getElementsByClassName("blockons-progressbar");

	if (progressBears.length) {
		for (const el of progressBears) {
			const pBar = new Waypoint({
				element: el,
				handler: function (direction) {
					// console.log("Trigger point: " + this.triggerPoint);
					el.classList.remove("pb-start");
				},
				offset: "bottom-in-view",
				// enter: function () {
				// 	el.classList.remove("pb-start");
				// },
			});
		}

		// for (let i = 0; i < progressBars.length; i++) {
		// 	console.log(progressBars[i]);
		// 	new Waypoint.Inview({
		// 		element: progressBars[i],
		// 		// enter: function( direction ) {
		// 		enter: function () {
		// 			progressBars[i].classList.remove("pb-start");
		// 		},
		// 	});
		// }
	}
});
