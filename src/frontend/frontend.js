import { createRoot } from '@wordpress/element';
import PageLoader from './site-addons/pageloader/PageLoader';
import BackToTop from './site-addons/backtotop/BackToTop';
import ScrollIndicator from './site-addons/scrollindicator/ScrollIndicator';
import SiteBy from './site-addons/siteby/SiteBy';
import './frontend.css';

document.addEventListener('DOMContentLoaded', () => {
	const isPremium = Boolean(blockonsFrontendObj.isPremium);
	const blockonsOptions = blockonsFrontendObj.blockonsOptions;

	/*
	 * Site Addons
	 */
	// Website Page Loader
	const blockonsPageLoader = document.getElementById('blockons-pageloader');
	if (blockonsPageLoader) {
		const root = createRoot(blockonsPageLoader);
		root.render(
			<PageLoader
				pageLoaderOptions={blockonsOptions?.pageloader}
				isPro={isPremium}
			/>,
		);

		setTimeout(() => {
			document.body.classList.remove('blockons-page-loading');

			setTimeout(() => {
				document.getElementById('blockons-pageloader').remove();
			}, 400);
		}, 200);
	}

	// Back To Top Button
	const blockonsBttb = document.getElementById('blockons-bttb');
	if (typeof blockonsBttb !== undefined && blockonsBttb !== null) {
		const root = createRoot(blockonsBttb);
		root.render(
			<BackToTop bttOptions={blockonsOptions?.bttb} isPro={isPremium} />,
		);
	}

	// Page Scroll Indicator
	const blockonsScrollInd = document.getElementById(
		'blockons-scroll-indicator',
	);
	if (typeof blockonsScrollInd !== undefined && blockonsScrollInd !== null) {
		const root = createRoot(blockonsScrollInd);
		root.render(
			<ScrollIndicator
				scrollInOptions={blockonsOptions?.scrollindicator}
				isPro={isPremium}
			/>,
		);
	}

	// Site By
	const blockonsSiteBy = document.getElementById('blockons-siteby');
	if (typeof blockonsSiteBy !== undefined && blockonsSiteBy !== null) {
		const root = createRoot(blockonsSiteBy);
		root.render(
			<SiteBy
				sitebyOptions={blockonsOptions?.siteby}
				isPro={isPremium}
			/>,
		);
	}

	/*
	 * Block Extensions
	 */
	// Blockons Tooltips
	if (blockonsOptions?.tooltips?.enabled) {
		import('./extensions/tooltips.js').then((Tooltips) => {
			Tooltips.initializeTooltips(blockonsOptions?.tooltips);
		});
	}
});
