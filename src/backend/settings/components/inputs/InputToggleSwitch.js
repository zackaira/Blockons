import React from "react";
import { blockonsConvertToSlug } from "../../../helpers";

const InputToggleSwitch = ({ slug, title, value, onChange }) => {
	const inputTitleSlug = blockonsConvertToSlug(slug)
		? blockonsConvertToSlug(slug)
		: blockonsConvertToSlug(title);
	const isChecked = value ? true : false;

	return (
		<React.Fragment>
			<label className="toggle-switch">
				<input
					id={inputTitleSlug}
					name={inputTitleSlug}
					type="checkbox"
					onChange={onChange}
					checked={isChecked}
					className="toggle-switch-checkbox"
				/>
				<span className="toggle-switch-slider"></span>
			</label>
		</React.Fragment>
	);
};

export default InputToggleSwitch;
