/*
 * Waypoints for the Progress bars to load when InView
 */
document.addEventListener("DOMContentLoaded", function () {
	const progressBars = document.querySelectorAll(".blockons-progressbar");

	if (!progressBars) return;

	for (let i = 0; i < progressBars.length; i++) {
		new Waypoint.Inview({
			element: progressBars[i],
			// enter: function( direction ) {
			enter: function () {
				progressBars[i].classList.remove("pb-start");
			},
		});
	}
});
