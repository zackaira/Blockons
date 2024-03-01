import React from "react";
import { blockonsConvertToSlug } from "../../../helpers";

const InputText = (props) => {
	const inputTitleSlug = blockonsConvertToSlug(props.slug)
		? blockonsConvertToSlug(props.slug)
		: blockonsConvertToSlug(props.title);

	const prefix = props.prefix ? props.prefix : "";
	const suffix = props.suffix ? props.suffix : "";

	return (
		<React.Fragment>
			{prefix && <span className="prefix">{prefix}</span>}
			{props.inputType === "text" ? (
				<input
					type="text"
					id={inputTitleSlug}
					name={inputTitleSlug}
					placeholder={props.placeholder}
					value={props.value || ""}
					onChange={props.onChange}
					className="regular-text"
				/>
			) : props.inputType === "number" ? (
				<input
					type="number"
					id={inputTitleSlug}
					name={inputTitleSlug}
					placeholder={props.placeholder}
					value={props.value || ""}
					onChange={props.onChange}
					className="small-text"
				/>
			) : (
				<textarea
					id={inputTitleSlug}
					name={inputTitleSlug}
					value={props.value || ""}
					placeholder={props.placeholder}
					onChange={props.onChange}
					className="regular-text"
					rows="5"
				></textarea>
			)}
			{suffix && <span className="suffix">{suffix}</span>}
		</React.Fragment>
	);
};

export default InputText;
