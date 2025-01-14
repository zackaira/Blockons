import { createRoot } from '@wordpress/element';
import SearchWrap from './components/SearchWrap';
import '../search';

document.addEventListener('DOMContentLoaded', () => {
	const searchElements = document.querySelectorAll(
		'.blockons-search-results-wrap',
	);

	if (searchElements.length > 0) {
		searchElements.forEach((searchBlock, index) => {
			const parentBlock = searchBlock.closest(
				'.wp-block-blockons-search',
			);
			if (!parentBlock) return;

			const searchId = parentBlock.id;

			let searchSettings;
			try {
				const settingsAttr = searchBlock.getAttribute('data-settings');
				searchSettings = JSON.parse(settingsAttr || '{}');
			} catch (error) {
				return;
			}

			if (!searchSettings.searchPro) return;

			try {
				const root = createRoot(searchBlock);
				root.render(
					<SearchWrap
						searchId={searchId}
						searchSettings={searchSettings}
					/>,
				);
			} catch (error) {
				console.error(
					`Error rendering search component ${index + 1}:`,
					error,
				);
			}
		});
	}
});
