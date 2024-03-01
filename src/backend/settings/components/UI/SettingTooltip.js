import React from "react";

const SettingTooltip = (props) => {
	return (
		<React.Fragment>
			<div className="blockons-tooltip">
				<span className="blockons-tooltiptxt">{props.tooltip}</span>
			</div>
		</React.Fragment>
	);
};

export default SettingTooltip;
