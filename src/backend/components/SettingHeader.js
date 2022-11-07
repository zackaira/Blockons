import React from "react";

const SettingHeader = ({ title, description }) => {
	return (
		<React.Fragment>
			<div className="blockons-header">
				{title && <h3 className="blockons-title">{title}</h3>}
				{description && <p>{description}</p>}
			</div>
		</React.Fragment>
	);
};

export default SettingHeader;
