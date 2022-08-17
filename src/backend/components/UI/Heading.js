import React from "react";

const Heading = ({ title, description, marginzero }) => {
	return (
		<React.Fragment>
			<div className={`blockonsheading ${marginzero ? "nomargin" : ""}`}>
				{title && <h4 className="blockonsheading-title">{title}</h4>}
				{description && <p className="blockonsheading-desc">{description}</p>}
			</div>
		</React.Fragment>
	);
};

export default Heading;
