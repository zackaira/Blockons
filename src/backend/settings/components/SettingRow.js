import { __ } from "@wordpress/i18n";
import InputToggleSwitch from "./inputs/InputToggleSwitch";
import InputSelect from "./inputs/InputSelect";
import InputText from "./inputs/InputText";
import InputRange from "./inputs/InputRange";
import ColorPicker from "./inputs/ColorPicker";
import SettingTooltip from "./UI/SettingTooltip";
import Upgrade from "./UI/Upgrade";
import { blockonsConvertToSlug } from "../../helpers";

import Heading from "./UI/Heading";

const SettingRow = (props) => {
	const theTitleSlug = props.slug
		? blockonsConvertToSlug(props.slug)
		: blockonsConvertToSlug(props.title);

	let theInput;
	if (props.inputType === "upgrade") {
		return (
			<tr className="blockons-row upgrade">
				<td colSpan={2}>
					<Upgrade {...props} />
				</td>
			</tr>
		);
	} else if (props.inputType === "toggle") {
		theInput = <InputToggleSwitch {...props} />;
	} else if (props.inputType === "select") {
		theInput = <InputSelect {...props} />;
	} else if (props.inputType === "range") {
		theInput = <InputRange {...props} />;
	} else if (props.inputType === "colorpicker") {
		theInput = <ColorPicker {...props} />;
	} else if (props.inputType === "heading") {
		return (
			<tr className="blockons-row heading">
				<td colSpan={2}>
					<Heading {...props} />
				</td>
			</tr>
		);
	} else {
		theInput = <InputText {...props} />;
	}

	return (
		<tr className="blockons-row">
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
						{props.tooltip && <SettingTooltip tooltip={props.tooltip} />}

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
	);
};

export default SettingRow;
