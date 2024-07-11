import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SelectControl } from "@wordpress/components";
import axios from "axios";

const GetPostsSelect = (props) => {
	const { label, value, onChange, posts, siteurl } = props;

	const [loadingProducts, setLoadingProducts] = useState(false);
	const [allProducts, setAllProducts] = useState([]);

	useEffect(() => {
		if (!siteurl) return;

		setLoadingProducts(true);
		axios.get(siteurl + "blcns/v1/products").then((result) => {
			setAllProducts(result.data);
			setLoadingProducts(false);
		});
	}, []);

	return (
		<div className="post-select-wrap">
			<SelectControl
				label={label}
				value={value}
				options={[
					{
						label: loadingProducts
							? __("Loading...", "blockons")
							: __("Select Product...", "blockons"),
						value: "",
					},
					...allProducts,
				]}
				onChange={onChange}
				disabled={loadingProducts}
			/>
		</div>
	);
};

export default GetPostsSelect;
