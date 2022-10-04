import React from "react";
import { __ } from "@wordpress/i18n";

const PageLoader = ({ pageLoaderOptions }) => {
	const pageLoader = pageLoaderOptions ? pageLoaderOptions : { enabled: false };

	if (!pageLoader.enabled) return null;

	return (
		<React.Fragment>
			<div className={`blockons-page-loader`}>Page Loader</div>
		</React.Fragment>
	);
};

export default PageLoader;
