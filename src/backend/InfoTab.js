import React from "react";
import parse from "html-react-parser";

const InfoTab = (props) => {
	// const wcActive = Boolean(blockonsObj.wcActive);
	const isPremium = props.isPro ? props.isPro : "";
	const upgradeUrl = props.upgrade ? props.upgrade : "";

	return (
		<React.Fragment>
			<div className="blockonsInfoTab">
				<h2>Blockons</h2>

				<p>blah blah blah</p>

				<div className="blockonsVideo">
					<a
						href="https://www.youtube.com/watch?v=4fCIDCcDgaU"
						target="_blank"
						className="blockonsVideoIn"
					></a>
				</div>

				<h4>some more blah blah</h4>

				<p>ha ha blah blah</p>

				<div className="blockonsDashBtns">
					<a
						href="http://wpsitechat.com/documentation/"
						target="_blank"
						className="button blockonsDashBtn"
					>
						Documentation
					</a>
					<a
						href="http://wpsitechat.com/faqs/"
						target="_blank"
						className="button blockonsDashBtn"
					>
						FAQ's
					</a>
				</div>
			</div>
		</React.Fragment>
	);
};

export default InfoTab;
