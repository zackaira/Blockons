import React, { useState } from "react";
import { __ } from "@wordpress/i18n";
import { blockonsStringReplaceForLink } from "../../../backend/helpers";
import parse from "html-react-parser";
import "./siteby.css";

const SiteBy = ({ sitebyOptions, isPro, isAdmin }) => {
	const siteby = sitebyOptions ? sitebyOptions : { enabled: false };
	const isPremium = isPro ? Boolean(isPro) : false;
	const inAdmin = isAdmin ? Boolean(isAdmin) : false;
	const [siteByOn, setSiteByOn] = useState(false);

	console.log("siteBy", siteby);

	if (!siteby.enabled) return null;

	return (
		<div
			className={`blockons-siteby ${isAdmin ? "inadmin" : ""} ${
				siteby.position !== "bottom" ? siteby.position : "bottom"
			} ${siteByOn ? "ison" : ""}`}
			{...(siteby.position !== "bottom"
				? {
						style: {
							width: `${siteby.size}px`,
						},
				  }
				: {})}
		>
			{siteby.position !== "bottom" && (
				<div
					className={`blockons-siteby-icon fa-solid ${
						siteby.icon !== "custom" ? siteby.icon : siteby.cicon
					}`}
					onClick={() => setSiteByOn(!siteByOn)}
					style={{
						width: `${siteby.size}px`,
						height: `${siteby.size}px`,
						fontSize: `${siteby.iconsize}px`,
						backgroundColor: siteby.iconbgcolor,
						color: siteby.iconcolor,
					}}
				></div>
			)}

			<div
				className={`blockons-siteby-block-wrap ${
					siteby.position === "bottom" ? "bottom" : "icon"
				}`}
			>
				<div
					className={`blockons-siteby-block ${
						siteby.position === "bottom" ? "bottom" : "icon"
					}`}
					{...(siteby.position !== "bottom"
						? {
								style: {
									height: `${siteby.size}px`,
									backgroundColor: siteby.bgcolor,
									color: siteby.color,
								},
						  }
						: {})}
				>
					{parse(blockonsStringReplaceForLink(siteby.text))}
				</div>
			</div>
		</div>
	);
};

export default SiteBy;
