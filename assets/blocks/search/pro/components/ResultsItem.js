import React from "react";
import parse from "html-react-parser";

const ResultsItem = ({ searchItem, set, previewChange }) => {
	if (!searchItem) return;

	return (
		<a
			{...(!set.searchProHasPreview ? { href: searchItem.url } : {})}
			id={`${searchItem.subtype}-${searchItem.id}`}
			className={`blockons-sresult ${searchItem.subtype}`}
			{...(set.searchProHasPreview
				? { onClick: () => previewChange(searchItem.id) }
				: {})}
		>
			{set.searchProImage && searchItem.extras.image && (
				<div className="blockons-sresult-left">
					<img src={searchItem.extras.image} />
				</div>
			)}
			<div className="blockons-sresult-center">
				{searchItem.title && (
					<h4 className="blockons-sresult-title">{parse(searchItem.title)}</h4>
				)}
				{set.searchProDesc && searchItem.extras.excerpt && (
					<p className="blockons-sresult-desc">
						{parse(searchItem.extras.excerpt)}
					</p>
				)}
			</div>
			{searchItem.subtype === "product" && set.searchProPrice && (
				<div className="blockons-sresult-right">
					{parse(searchItem.extras.price)}
				</div>
			)}
		</a>
	);
};

export default ResultsItem;
