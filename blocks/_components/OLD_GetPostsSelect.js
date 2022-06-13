/**
 * WordPress dependencies
 */

const { Component } = wp.element;
const { BaseControl, SelectControl } = wp.components;
const { withSelect, withDispatch } = wp.data;
const { compose } = wp.compose;
const { __ } = wp.i18n;

class GetPostsSelect extends Component {
	render() {
		const {
			label,
			multiple = false,
			value,
			onChange,
			posts,
			emptyLabel,
		} = this.props;

		if (!posts) {
			return __("Loading Posts...", "blockons");
		}

		if (posts.length === 0) {
			return __("No Posts to select", "blockons");
		}

		let post = posts[0];

		let options = [];
		let option = { value: "", label: emptyLabel };
		options.push(option);

		// console.log(posts);

		for (let i = 0; i < posts.length; i++) {
			option = {
				value: posts[i].id,
				label: posts[i].title.raw,
			};
			options.push(option);
		}

		return (
			<SelectControl
				multiple={multiple}
				label={label}
				value={value}
				onChange={onChange}
				options={options}
			/>
		);
	}
}

// Fetch the posts by ID
const applyWithSelect = withSelect((select) => {
	const { getEntityRecords } = select("core");

	let query = {
		// include: selected,
		per_page: -1,
		orderby: "title",
		order: "asc",
		status: ["publish", "future"],
	};

	return {
		posts: getEntityRecords("postType", "product", query),
	};
});

// Combine the higher-order components
export default compose([applyWithSelect])(GetPostsSelect);
