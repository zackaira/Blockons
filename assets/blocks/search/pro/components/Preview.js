import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import axios from "axios";
import Loader from "../../../../../src/backend/Loader";
import PreviewPost from "./PreviewPost";
import PreviewProduct from "./PreviewProduct";

const Preview = ({ restUrl, cpt, postId, set }) => {
	const [postData, setPostData] = useState({});
	const [previewIsLoading, setPreviewIsLoading] = useState(false);

	if (!cpt || !postId) {
		return <div>{__("No post found", "blockons")}</div>;
	}

	useEffect(() => {
		setPreviewIsLoading(true);

		let requestUrl = `${restUrl}blcns/v1/post/${postId}`;
		if (cpt === "product") {
			requestUrl = `${restUrl}blcns/v1/product/${postId}`;
		}

		axios
			.get(requestUrl)
			.then((response) => {
				if (response?.data) setPostData(response.data);
				setPreviewIsLoading(false);
			})
			.catch((error) => {
				console.error(error);
				setPreviewIsLoading(false);
			});
	}, [postId]);

	if (previewIsLoading) {
		return (
			<div className="blockons-search-preview loading">
				<Loader />
			</div>
		);
	}

	return cpt === "product" ? (
		<PreviewProduct postData={postData} />
	) : (
		<PreviewPost postData={postData} />
	);
};

export default Preview;
