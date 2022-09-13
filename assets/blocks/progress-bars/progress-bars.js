/*
 * Waypoints for the Progress bars to load when InView
 */
window.addEventListener("DOMContentLoaded", function () {
	const progressBars = document.querySelectorAll(".blockons-progressbar");

	console.log(progressBars);

	if (progressBars) {
		for (let i = 0; i < progressBars.length; i++) {
			const elem = document.querySelector(`.${progressBars[i].classList[0]}`);

			console.log(elem);

			const pBar = new Waypoint.Inview({
				element: elem,
				// enter: function( direction ) {
				enter: function () {
					progressBars[i].classList.remove("pb-start");
					console.log(progressBars[i]);
				},
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
