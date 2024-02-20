import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SelectControl } from "@wordpress/components";
import axios from "axios";

const BlockonsPostTypeSelect = (props) => {
	const { label, value, onChange, exclude = [], siteurl } = props;
	const [postTypes, setPostTypes] = useState([]);
	const [loadingPostTypes, setLoadingPostTypes] = useState(true);
	const excludedPostTypes = [...exclude];

	useEffect(() => {
		if (!siteurl) return;

		axios.get(siteurl + "blcns/v1/post-types").then((result) => {
			const types = result.data;
			const filteredTypes = Object.values(types).filter(
				(type) => !excludedPostTypes.includes(type.slug)
			);
			setPostTypes(filteredTypes);
			setLoadingPostTypes(false);
		});
	}, []);

	// Map post types to options for SelectControl
	const postTypeOptions = postTypes.map((postType) => ({
		label: postType.name,
		value: postType.slug,
	}));

	return (
		<SelectControl
			label={label}
			value={value}
			options={[
				{
					label: __("Select Post Type", "blockons"),
					value: "",
				},
				...postTypeOptions,
			]}
			onChange={onChange}
			disabled={loadingPostTypes}
		/>
	);
};

export default BlockonsPostTypeSelect;
