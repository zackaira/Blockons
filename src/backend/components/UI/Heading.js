import React from "react";

const Heading = ({ title, description, nomargin }) => {
	return (
		<React.Fragment>
			<div className={`blockonsheading ${nomargin ? "nomargin" : ""}`}>
				{title && <h4 className="blockonsheading-title">{title}</h4>}
				{description && <p className="blockonsheading-desc">{description}</p>}
			</div>
		</React.Fragment>
	);
};

export default Heading;
