import React from "react";
import { __ } from "@wordpress/i18n";
import parse from "html-react-parser";

const PreviewProduct = ({ set, postData }) => {
	// console.log(set);

	return (
		<div className="blockons-search-preview">
			<div className="blockons-search-preview-inner">
				{postData.featured_media && set.searchProImage && (
					<img src={postData.featured_media} alt={postData.title} />
				)}
				{postData.title && (
					<h4 className="blockons-spreview-title">{postData.title}</h4>
				)}
				{postData.price && set.searchProPrice && (
					<div className="blockons-spreview-price">{parse(postData.price)}</div>
				)}

				{postData.short_desc && set.searchProDesc && (
					<p className="blockons-spreview-desc">{parse(postData.short_desc)}</p>
				)}
				{postData.content && (
					<div className="blockons-spreview-content">
						{parse(postData.content)}
					</div>
				)}
				{postData.permalink && (
					<div className="blockons-spreview-btns">
						<a href={postData.permalink}>{__("View Product", "blockons")}</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default PreviewProduct;
