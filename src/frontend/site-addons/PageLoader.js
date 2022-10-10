import React from "react";
import { __ } from "@wordpress/i18n";
import "./pageloader.css";

const PageLoader = ({ pageLoaderOptions }) => {
	const pageLoader = pageLoaderOptions ? pageLoaderOptions : { enabled: false };

	if (!pageLoader.enabled) return null;

	const StyleLoaderColor = pageLoader.loadcolor !== "#AF2DBF" && {
		...(pageLoader.style === "two" ||
		pageLoader.style === "five" ||
		pageLoader.style === "six"
			? { backgroundColor: pageLoader.loadcolor }
			: {}),
		...(pageLoader.style === "one" ||
		pageLoader.style === "three" ||
		pageLoader.style === "four"
			? { borderColor: pageLoader.loadcolor }
			: {}),
	};

	return (
		<React.Fragment>
			<div
				className={`blockons-page-loader`}
				style={{
					...(pageLoader.bgcolor !== "#222"
						? { backgroundColor: pageLoader.bgcolor }
						: {}),
				}}
			>
				{pageLoader.has_text &&
					(pageLoader.text_position === "one" ||
						pageLoader.text_position === "three") && (
						<div
							className={`blockons-pageloader-text ${
								pageLoader.text_position ? pageLoader.text_position : "one"
							}`}
						>
							<div
								className="blockons-pageloader-txt"
								style={{
									...(pageLoader.fcolor !== "#222"
										? { color: pageLoader.fcolor }
										: {}),
								}}
							>
								{pageLoader.text}
							</div>
						</div>
					)}

				<div
					className={`blockons-pageloader-${
						pageLoader.style ? pageLoader.style : "one"
					}`}
				>
					<div className="bpl one" style={StyleLoaderColor}></div>
					<div className="bpl two" style={StyleLoaderColor}></div>
					<div className="bpl three" style={StyleLoaderColor}></div>
					<div className="bpl four" style={StyleLoaderColor}></div>
					<div className="bpl five" style={StyleLoaderColor}></div>
					<div className="bpl six" style={StyleLoaderColor}></div>
					<div className="bpl seven" style={StyleLoaderColor}></div>
					<div className="bpl eight" style={StyleLoaderColor}></div>
					<div className="bpl nine" style={StyleLoaderColor}></div>
					<div className="bpl ten" style={StyleLoaderColor}></div>
					<div className="bpl eleven" style={StyleLoaderColor}></div>
					<div className="bpl twelve" style={StyleLoaderColor}></div>
				</div>

				{pageLoader.has_text &&
					(pageLoader.text_position === "two" ||
						pageLoader.text_position === "four") && (
						<div
							className={`blockons-pageloader-text ${
								pageLoader.text_position ? pageLoader.text_position : "two"
							}`}
						>
							<div
								className="blockons-pageloader-txt"
								style={{
									...(pageLoader.fcolor !== "#222"
										? { color: pageLoader.fcolor }
										: {}),
								}}
							>
								{pageLoader.text}
							</div>
						</div>
					)}
			</div>
		</React.Fragment>
	);
};

export default PageLoader;
