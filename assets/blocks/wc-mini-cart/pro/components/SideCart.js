import React, { useState, useEffect } from "react";
import Loader from "../../../../../src/backend/Loader";
import { __ } from "@wordpress/i18n";

const SideCart = () => {
	const restUrl = wcCartObj.apiUrl;
	// const set = searchSettings ? searchSettings : "";
	const [isLoading, setIsLoading] = useState(false);

	return (
		<React.Fragment>
			<div id="blockons-sidecart-icon" className="blockons-side-cart-icon">
				<span className="fa-solid fa-cart-shopping"></span>
			</div>

			<div className="blockons-side-cart-block">
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
