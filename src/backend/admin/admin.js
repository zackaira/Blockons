import "./admin.css";
/*
 * Blockons Admin JS
 */
document.addEventListener("DOMContentLoaded", function () {
	const blockonsRemFsLinks = document.querySelectorAll(
		".fs-submenu-item.blockons"
	);
	if (blockonsRemFsLinks) {
		blockonsRemFsLinks.forEach((item) => {
			item.closest("li").remove();
		});
	}
});
