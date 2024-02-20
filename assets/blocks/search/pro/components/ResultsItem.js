import React from "react";
import parse from "html-react-parser";

const ResultsItem = ({ resultItem, set, previewChange }) => {
	return (
		<a
			{...(!set.searchProHasPreview ? { ref: resultItem.url } : {})}
			id={`${resultItem.subtype}-${resultItem.id}`}
			className={`blockons-sresult ${resultItem.subtype}`}
			{...(set.searchProHasPreview
				? { onClick: () => previewChange(resultItem.id) }
				: {})}
		>
			{resultItem.extras.image && set.searchProImage && (
				<div className="blockons-sresult-left">
					<img src={resultItem.extras.image} />
				</div>
			)}
			<div className="blockons-sresult-center">
				{resultItem.title && (
					<h4 className="blockons-sresult-title">{resultItem.title}</h4>
				)}
				{resultItem.extras.excerpt && set.searchProDesc && (
					<p className="blockons-sresult-desc">{resultItem.extras.excerpt}</p>
				)}
			</div>
			{resultItem.subtype === "product" && set.searchProPrice && (
				<div className="blockons-sresult-right">
					{parse(resultItem.extras.price)}
				</div>
			)}
		</a>
	);
};

export default ResultsItem;
