import React from "react";

const Upgrade = ({ title, description }) => {
	return (
		<React.Fragment>
			<div className={`blockons-gopro`}>
				{title && <h4 className="blockons-gopro-title">{title}</h4>}
				{description && <p className="blockons-gopro-desc">{description}</p>}
			</div>
		</React.Fragment>
	);
};

export default Upgrade;
