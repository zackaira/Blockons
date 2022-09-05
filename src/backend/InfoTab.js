import React from "react";
import { __ } from "@wordpress/i18n";
import parse from "html-react-parser";

const InfoTab = (props) => {
	// const wcActive = Boolean(siteObj.wcActive);
	const isPremium = props.isPro ? props.isPro : "";
	const upgradeUrl = props.upgrade ? props.upgrade : "";

	return (
		<React.Fragment>
			<div className="blockonsInfoTab">
				<div className="blockons-header addspace">
					<h3 className="blockons-title">
						{__("Welcome to Blockons!", "blockons")}
					</h3>
					<p>
						{__(
							"We're building WordPress editor blocks to make it easier for you to build visually appealing and very professional looking pages for your website.",
							"blockons"
						)}
					</p>
					<a
						href="https://blockons.com/"
						target="_blank"
						className="blockons-button"
					>
						{__("Visit Our Website", "blockons")}
					</a>
					{/* <a
						href="https://www.blockons.com/go-pro"
						target="_blank"
						className="blockons-button primary"
					>
						View Blockons Pro
					</a> */}
				</div>

				<div className="blockons-video addspace">
					<h3 className="blockons-title">
						{__("Watch our video on using the Blockons plugin", "blockons")}
					</h3>
					<p>
						{__(
							"Blockons is design to be intuitive and the settings do have help hints, but you can also watch our video to get a better understanding of how the Blockons plugins works. Enjoy!",
							"blockons"
						)}
					</p>
					<a
						href="https://www.youtube.com/watch?v=4fCIDCcDgaU"
						target="_blank"
						className="blockons-button primary"
					>
						Video Embed
					</a>
				</div>

				<div className="blockons-help">
					<h4 className="blockons-title">
						{__("Support & Documentation", "blockons")}
					</h4>

					<p>
						{__(
							"Read through our ever-growing documentation on our website. Read the Frequently Asked Questions for any answers you may be looking for... Or get in contact with our support if you need help with anything regarding the Blockons plugin.",
							"blockons"
						)}
					</p>

					<a
						href="https://blockons.com/documentation/"
						target="_blank"
						className="blockons-button primary"
					>
						{__("Documentation", "blockons")}
					</a>
					<a
						href="https://blockons.com/support/faqs/"
						target="_blank"
						className="blockons-button"
					>
						{__("FAQ's", "blockons")}
					</a>
					<a
						href="https://blockons.com/support/"
						target="_blank"
						className="blockons-button"
					>
						{__("Get Support", "blockons")}
					</a>
				</div>
			</div>
		</React.Fragment>
	);
};

export default InfoTab;
