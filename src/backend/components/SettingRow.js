import React from "react";
import InputToggleSwitch from "./inputs/InputToggleSwitch";
import { blockonsConvertToSlug } from "../helpers";

import Heading from "./UI/Heading";

const SettingRow = (props) => {
	const theTitleSlug = props.slug
		? blockonsConvertToSlug(props.slug)
		: blockonsConvertToSlug(props.title);

	let theInput;
	if (props.inputType === "toggle") {
		theInput = <InputToggleSwitch {...props} />;
	} else if (props.inputType === "heading") {
		return (
			<tr className={"blockons-row"}>
				<td colSpan={2}>
					<Heading {...props} />
				</td>
			</tr>
		);
	}

	return (
		<React.Fragment>
			<tr className={"blockons-row"}>
				<th scope="row">
					<label htmlFor={props.parent != "" ? theTitleSlug : props.value}>
						{props.title}
					</label>
				</th>
				<td>
					<div className="blockons-row-cols">
						<div className="blockons-row-col-left">
							{theInput}
							{props.note ? <p className="snNote">{props.note}</p> : ""}
						</div>
						<div className="blockons-row-col-right">
							{props.documentation && (
								<a
									href={props.documentation}
									target="_blank"
									className="blockonsdoclink"
									title={__("Documentation", "blockons")}
								></a>
							)}
						</div>
					</div>
				</td>
			</tr>
		</React.Fragment>
	);
};

export default SettingRow;