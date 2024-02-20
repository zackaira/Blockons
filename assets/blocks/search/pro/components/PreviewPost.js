import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import parse from "html-react-parser";

const PreviewPost = ({ postData }) => {
	const [postImage, setPostImage] = useState(null);

	useEffect(() => {
		if (postData.featured_media) {
			fetch(`${searchObj.apiUrl}wp/v2/media/${postData.featured_media}`)
				.then((response) => response.json())
				.then((data) => {
					console.log("data", data);
					setPostImage(data.media_details.sizes.medium.source_url);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [postData]);

	return (
		<div className="blockons-search-preview">
			<div className="blockons-search-preview-inner">
				{postImage && <img src={postImage} alt={postData.title.rendered} />}
				{postData.title && (
					<h4 className="blockons-spreview-title">{postData.title.rendered}</h4>
				)}

				{postData.excerpt && (
					<div className="blockons-spreview-content">
						{parse(postData.excerpt.rendered)}
					</div>
				)}
				{postData.link && (
					<div className="blockons-spreview-btns">
						<a href={postData.link}>{__("View Post", "blockons")}</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default PreviewPost;
