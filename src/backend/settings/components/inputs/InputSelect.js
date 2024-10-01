import { blockonsConvertToSlug } from "../../../helpers";

const InputSelect = (props) => {
	const selectTitleSlug = blockonsConvertToSlug(props.slug)
		? blockonsConvertToSlug(props.slug)
		: blockonsConvertToSlug(props.title);
	const selectOptions = props.options;

	return (
		<>
			<select
				id={selectTitleSlug}
				name={selectTitleSlug}
				onChange={props.onChange}
				value={props.value || props.defaultValue}
				className={`snSelect ${props.className || ""}`}
			>
				{Object.entries(selectOptions).map(([key, value]) => (
					<option value={key} key={key}>
						{value}
					</option>
				))}
			</select>
		</>
	);
};

export default InputSelect;
