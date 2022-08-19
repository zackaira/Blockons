import React from "react";
import InputToggleSwitch from "./inputs/InputToggleSwitch";
import { blockonsConvertToSlug } from "../helpers";

const SettingRow = (props) => {
	return (
		<React.Fragment>
			<div className={`blockons-block ${props.disable ? "disabled" : ""}`}>
				<div className="blockons-block-inner">
					{props.pluginSpecific && (
						<div className="wcbanner">{props.pluginSpecific}</div>
					)}

					<h4 className="blockons-block-title">{props.title}</h4>
					<p className="blockons-block-desc">{props.description}</p>
					<InputToggleSwitch {...props} />
				</div>
			</div>
		</React.Fragment>
	);
};

export default SettingRow;
