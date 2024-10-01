// import React from "react";
import { __ } from "@wordpress/i18n";

const ScrollIndicator = ({ scrollInOptions }) => {
	const scrollInd = scrollInOptions ? scrollInOptions : { enabled: false };

	if (!scrollInd.enabled) return null;

	function blockonsScrollProgress() {
		const winScroll =
			document.body.scrollTop || document.documentElement.scrollTop;
		const height =
			document.documentElement.scrollHeight -
			document.documentElement.clientHeight;
		const scrolled = (winScroll / height) * 100;

		const scrollIndicator = document.getElementById("blockons-scrollind");
		if (scrollIndicator) {
			scrollIndicator.style.width = scrolled + "%";
		}
	}
	window.addEventListener("scroll", blockonsScrollProgress);

	return (
		<div
			className={`blockons-scroll-indicator ${
				scrollInd.position ? scrollInd.position : "top"
			} ${scrollInd.has_bg ? "hasbg" : "nobg"}`}
			style={{
				...(scrollInd.bgcolor !== "#ccc"
					? { backgroundColor: scrollInd.bgcolor }
					: {}),
				...(scrollInd.height !== 6 ? { height: scrollInd.height + "px" } : {}),
			}}
		>
			<div
				className="progressbar"
				id="blockons-scrollind"
				style={{
					...(scrollInd.color !== "#af2dbf"
						? { backgroundColor: scrollInd.color }
						: {}),
					...(scrollInd.height !== 6
						? { height: scrollInd.height + "px" }
						: {}),
				}}
			></div>
		</div>
	);
};

export default ScrollIndicator;
