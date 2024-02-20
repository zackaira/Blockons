import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import axios from "axios";
import Loader from "../../../../../src/backend/Loader";
import PreviewPost from "./PreviewPost";
import PreviewProduct from "./PreviewProduct";

const Preview = ({ restUrl, cpt, postId, set }) => {
	const [postData, setPostData] = useState({});
	const [previewIsLoading, setPreviewIsLoading] = useState(false);

	useEffect(() => {
		setPreviewIsLoading(true);

		let requestUrl = `${restUrl}wp/v2/${
			cpt === "post" ? "posts" : cpt
		}/${postId}`;
		if (cpt === "product") {
			requestUrl = `${restUrl}blcns/v1/product/${postId}`;
		}

		axios
			.get(requestUrl)
			.then((response) => {
				// console.log("response.data", response.data);

				setPostData(response.data);
				setPreviewIsLoading(false);
			})
			.catch((error) => {
				console.error(error);
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
		<PreviewProduct set={set} postData={postData} />
	) : (
		<PreviewPost set={set} postData={postData} />
	);
};

export default Preview;
