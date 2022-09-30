import React, { useState, useEffect } from "react";
import Loader from "../../../../../src/backend/Loader";
import { __ } from "@wordpress/i18n";

const SideCart = () => {
	const restUrl = wcCartObj.apiUrl;
	const sidecart = wcCartObj.sidecart ? wcCartObj.sidecart : { enabled: false };
	const [isLoading, setIsLoading] = useState(false);

	if (!sidecart?.enabled) return null;

	return (
		<React.Fragment>
			{sidecart.has_icon && (
				<div
					id="blockons-sidecart-icon"
					className={`blockons-side-cart-icon ${sidecart.position}`}
				>
					<span className="fa-solid fa-cart-shopping"></span>
				</div>
			)}

			<div className={`blockons-side-cart-block ${sidecart.position}`}>
				<div className="blockons-side-cart-block-inner">
					<div className="blockons-side-cart-header">
						<div>Your Cart (10 items)</div>
						<div>Spend $10 more to get free shipping</div>
					</div>
					<div className="blockons-side-cart-content blockons-wc-mini-cart-block"></div>
				</div>
			</div>
			<div className="blockons-side-cart-overlay"></div>
		</React.Fragment>
	);
};

export default SideCart;
