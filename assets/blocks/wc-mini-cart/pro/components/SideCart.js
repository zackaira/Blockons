import React from "react";
import { __ } from "@wordpress/i18n";
import "./sidecart.css";

const SideCart = () => {
	// const restUrl = wcCartObj.apiUrl;
	const sidecart = wcCartObj.sidecart ? wcCartObj.sidecart : { enabled: false };

	if (!sidecart?.enabled) return null;

	return (
		<React.Fragment>
			{sidecart.has_icon && (
				<div
					id="blockons-sidecart-icon"
					className={`blockons-side-cart-icon blockons-opencart ${sidecart.position}`}
					style={{
						...(sidecart.icon_bgcolor !== "#333"
							? { backgroundColor: sidecart.icon_bgcolor }
							: {}),
						...(sidecart.icon_color !== "#FFF"
							? { color: sidecart.icon_color }
							: {}),
						...(sidecart.icon_size !== 24
							? { fontSize: sidecart.icon_size + "px" }
							: {}),
						...(sidecart.icon_padding !== 60
							? {
									width: sidecart.icon_padding + "px",
									height: sidecart.icon_padding + "px",
							  }
							: {}),
					}}
				>
					<span
						className={`fa-solid fa-${
							sidecart.icon ? sidecart.icon : "cart-shopping"
						}`}
					></span>
				</div>
			)}

			<div
				className={`blockons-side-cart-block ${sidecart.position}`}
				style={{
					...(sidecart.bgcolor !== "#FFF"
						? { backgroundColor: sidecart.bgcolor }
						: {}),
					...(sidecart.color !== "#000" ? { color: sidecart.color } : {}),
				}}
			>
				<div className="blockons-side-cart-block-inner">
					{(sidecart.header_title || sidecart.header_text) && (
						<div className="blockons-side-cart-header">
							{sidecart.header_title ? <h6>{sidecart.header_title}</h6> : ""}
							{sidecart.header_text ? <p>{sidecart.header_text}</p> : ""}
						</div>
					)}
					<div className="blockons-side-cart-content"></div>
				</div>
			</div>
			<div
				className="blockons-side-cart-overlay blockons-opencart"
				style={{
					...(sidecart.overlay_color !== "#000"
						? { backgroundColor: sidecart.overlay_color }
						: {}),
					...(sidecart.overlay_opacity !== 0.6
						? { opacity: sidecart.overlay_opacity }
						: {}),
				}}
			></div>
		</React.Fragment>
	);
};

export default SideCart;
