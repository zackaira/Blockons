/**
 * Functionality to show/hide the Blockons Tabs
 */
document.addEventListener("DOMContentLoaded", () => {
	const tabBlocks = document.querySelectorAll(".wp-block-blockons-tabs");

	console.log(tabBlocks);

	tabBlocks.forEach((tabBlock, i) => {
		const activeTabId = tabBlock.querySelectorAll(".blockons-tab.active").id;

		console.log(activeTabId);

		// tabLabels.forEach((tab, i) => {
		// 	const selectedTab = tab.querySelector(".blockons-tab.active").id;

		// 	console.log(selectedTab);
		// }); // tabLabels forEach
	}); // tabBlocks forEach
}); // DOMContentLoaded
