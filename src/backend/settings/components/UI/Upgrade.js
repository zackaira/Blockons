import React from "react";
import { __ } from "@wordpress/i18n";

const Upgrade = ({ title, description, upgradeUrl, proFeatures }) => {
	return (
		<React.Fragment>
			<div className={`blockons-gopro`}>
				<div className="blockons-gopro-head">
					<div className="blockons-gopro-head-txt">
						{title && <h4 className="blockons-gopro-title">{title}</h4>}
						{description && (
							<p className="blockons-gopro-desc">{description}</p>
						)}
					</div>
					{upgradeUrl && (
						<div className="blockons-gopro-head-go">
							<a href={upgradeUrl}>
								{__("Upgrade to Blockons Pro", "blockons")}
							</a>
						</div>
					)}
				</div>
				<div className="blockons-gopro-features">
					{proFeatures && (
						<ul className="blockons-gopro-features">
							{proFeatures.map((feature, index) => (
								<li key={index}>{feature}</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</React.Fragment>
	);
};

export default Upgrade;
