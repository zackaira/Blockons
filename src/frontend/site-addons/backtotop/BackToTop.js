import React from "react";
import { __ } from "@wordpress/i18n";

const BackToTop = ({ bttOptions, isPro }) => {
	const bttb = bttOptions ? bttOptions : { enabled: false };
	const isPremium = isPro ? isPro : false;

	if (!bttb.enabled) return null;

	const blockonsScrollUp = () => {
		window.scroll({
			top: 0,
			left: 0,
			behavior: "smooth",
		});
	};

	let scrollPos = 220;
	const bttbtn = document.getElementById("blockons-bttb");

	function blockonsCheckPos() {
		if (!bttbtn) return;

		let windowY = window.scrollY;

		if (windowY > scrollPos) {
			bttbtn.classList.add("show-btn");
		} else {
			bttbtn.classList.remove("show-btn");
		}
		// scrollPos = windowY;
	}
	window.addEventListener("scroll", blockonsCheckPos);

	window.addEventListener("load", () => {
		const container = document.querySelector(".blockons-bttbtn-progress");

		if (!container) return;

		const progressBar = document.querySelector(
			".blockons-bttbtn-progress .progress-bar"
		);

		const pct = document.querySelector(".blockons-bttbtn-progress .pct");
		const totalLength = progressBar.getTotalLength();

		progressBar.style.strokeDasharray = totalLength;
		progressBar.style.strokeDashoffset = totalLength;

		window.addEventListener("scroll", () => {
			blockonsSetProgress(container, progressBar, totalLength);
		});
	});

	function blockonsSetProgress(container, progressBar, totalLength) {
		const clientHeight = document.documentElement.clientHeight;
		const scrollHeight = document.documentElement.scrollHeight;
		const scrollTop = document.documentElement.scrollTop;

		const percentage = scrollTop / (scrollHeight - clientHeight);
		if (percentage >= 1) {
			container.classList.add("completed");
		} else {
			container.classList.remove("completed");
		}
		// pct.innerHTML = Math.round(percentage * 100) + "%";
		progressBar.style.strokeDashoffset = totalLength - totalLength * percentage;
	}

	return (
		<React.Fragment>
			{isPremium && bttb.type === "scroll" ? (
				<div
					className={`blockons-bttbtn-progress ${
						bttb.position ? bttb.position : "right"
					} ${bttb.has_bg ? "hasbg" : "nobg"}`}
					onClick={blockonsScrollUp}
					style={{
						...(bttb.color !== "#000" ? { color: bttb.color } : {}),
						...(bttb.icon_size !== 22
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
					{/* <p className="pct">0%</p> */}
					<span
						className={`pct fa-solid fa-${bttb.icon ? bttb.icon : "arrow-up"}`}
					></span>
					<svg
						className="complete"
						width={(bttb.size ? bttb.size : 60).toString()}
						height={bttb.size ? bttb.size : 60}
						viewport="0 0 100 100"
						xmlns="https://www.w3.org/2000/svg"
					>
						<circle
							cx="50%"
							cy="50%"
							r="45%"
							style={{
								...(bttb.bgcolor !== "#FFF" ? { fill: bttb.bgcolor } : {}),
							}}
						></circle>
						<circle
							className="progress-bar"
							cx="50%"
							cy="50%"
							r="45%"
							style={{
								...(bttb.bgcolor !== "#FFF" ? { fill: bttb.bgcolor } : {}),
								...(bttb.strcolor !== "#000" ? { stroke: bttb.strcolor } : {}),
								...(bttb.strwidth !== 2 ? { strokeWidth: bttb.strwidth } : {}),
							}}
						></circle>
					</svg>
				</div>
			) : (
				<div
					className={`blockons-bttbtn ${
						bttb.position ? bttb.position : "right"
					} ${bttb.has_bg ? "hasbg" : "nobg"}`}
					onClick={blockonsScrollUp}
					style={{
						...(bttb.bgcolor !== "#FFF"
							? { backgroundColor: bttb.bgcolor }
							: {}),
						...(bttb.color !== "#000" ? { color: bttb.color } : {}),
						...(bttb.size !== 60
							? {
									width: bttb.size + "px",
									height: bttb.size + "px",
							  }
							: {}),
						...(bttb.bradius !== 4
							? { borderRadius: bttb.bradius + "px" }
							: {}),
						...(bttb.icon_size !== 22
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
			)}
		</React.Fragment>
	);
};

export default BackToTop;
