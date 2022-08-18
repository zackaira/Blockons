import "./admin.css";
/*
 * Blockons Admin JS
 */
document.addEventListener("DOMContentLoaded", function () {
	const blockonsRm_FsMenuLinks = document.querySelectorAll(
		".fs-submenu-item.blockons"
	);
	if (blockonsRm_FsMenuLinks) {
		blockonsRm_FsMenuLinks.forEach((item) => {
			item.closest("li").remove();
		});
	}

	//   const rateClick = document.querySelector(".wasc-rating-click");
	//   const rateShow = document.querySelector(".wasc-notice-rate");

	//   if (rateClick) {
	//     rateClick.addEventListener("click", () => {
	//       rateClick.style.display = "none";
	//       rateShow.style.display = "block";
	//     });
	//   }
});
