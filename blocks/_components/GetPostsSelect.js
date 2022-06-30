// WordPress dependencies
import { useState, useEffect } from "@wordpress/element";
import axios from "axios";
import Select from "react-select";

const GetPostsSelect = (props) => {
	const { label, multiple = false, value, onChange, posts, siteurl } = props;

	const [loadingProducts, setLoadingProducts] = useState(false);
	const [allProducts, setAllProducts] = useState([]);

	useEffect(() => {
		if (!siteurl) return;

		setLoadingProducts(true);
		axios.get(siteurl + "/blcns/v1/products").then((result) => {
			setAllProducts(result.data);
			setLoadingProducts(false);
		});
	}, []);

	return (
		<div className="post-select-wrap">
			<p>{label}</p>
			<Select
				// closeMenuOnSelect={true}
				value={value}
				onChange={onChange}
				options={allProducts}
				isLoading={loadingProducts}
				classNamePrefix="blockons-postselect"
				isMulti={multiple}
				placeholder={loadingProducts ? "Loading..." : "Select..."}
				noOptionsMessage={() => "No Products"}
			/>
		</div>
	);
};

// Combine the higher-order components
export default GetPostsSelect;
