import React from "react";
import { __ } from "@wordpress/i18n";

const BackToTop = ({ bttOptions }) => {
	const bttb = bttOptions ? bttOptions : { enabled: false };

	if (!bttb.enabled) return null;

	const hahaha = () => {
		window.scroll({
			top: 0,
			left: 0,
			behavior: "smooth",
		});
	};

	let scrollPos = 220;
	const bttbtn = document.getElementById("blockons-bttb");

	function checkPosition() {
		if (!bttbtn) return;

		let windowY = window.scrollY;

		if (windowY > scrollPos) {
			bttbtn.classList.add("show-btn");
		} else {
			bttbtn.classList.remove("show-btn");
		}
		// scrollPos = windowY;
	}
	window.addEventListener("scroll", checkPosition);

	return (
		<React.Fragment>
			<div
				className={`blockons-bttbtn ${
					bttb.position ? bttb.position : "right"
				} ${bttb.has_bg ? "hasbg" : "nobg"}`}
				onClick={hahaha}
				style={{
					...(bttb.bgcolor !== "#FFF" ? { backgroundColor: bttb.bgcolor } : {}),
					...(bttb.color !== "#000" ? { color: bttb.color } : {}),
					...(bttb.size !== 50
						? {
								width: bttb.size + "px",
								height: bttb.size + "px",
						  }
						: {}),
					...(bttb.icon_size !== "#000"
						? { fontSize: bttb.icon_size + "px" }
						: {}),
					...(bttb.position === "right" && bttb.side_position !== 12
						? { right: bttb.side_position + "px" }
						: {}),
					...(bttb.position === "left" && bttb.side_position !== 12
						? { left: bttb.side_position + "px" }
						: {}),
					...(bttb.bottom_position !== "#000"
						? { bottom: bttb.bottom_position + "px" }
						: {}),
				}}
			>
				<span
					className={`fa-solid fa-${bttb.icon ? bttb.icon : "arrow-up"}`}
				></span>
			</div>
		</React.Fragment>
	);
};

export default BackToTop;
