import React from "react";
import { __ } from "@wordpress/i18n";
import parse from "html-react-parser";

const PreviewPost = ({ postData }) => {
	if (!postData) return <div>{__("No post found", "blockons")}</div>;

	return (
		<div className="blockons-search-preview">
			<div className="blockons-search-preview-inner">
				{postData.featured_media && (
					<img src={postData.featured_media} alt={postData.title} />
				)}
				{postData.title && (
					<h4 className="blockons-spreview-title">{postData.title}</h4>
				)}

				{postData.excerpt && (
					<div className="blockons-spreview-content">
						{parse(postData.excerpt)}
					</div>
				)}
				{postData.permalink && (
					<div className="blockons-spreview-btns">
						<a href={postData.permalink}>{__("View Post", "blockons")}</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default PreviewPost;
