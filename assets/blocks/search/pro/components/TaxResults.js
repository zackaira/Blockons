import React from "react";

const TaxResults = ({ taxItems, title }) => {
	return (
		<div className="blockons-sresult-catags">
			<h6 className="blockons-sresult-head">{title}</h6>
			{taxItems.map((item) => (
				<a
					key={item.id}
					href={item.url}
					className={`blockons-tresult ${item.type}`}
				>
					{item.title}
				</a>
			))}
		</div>
	);
};

export default TaxResults;
