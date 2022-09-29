import React, { useState, useEffect } from "react";
import Loader from "../../../../../src/backend/Loader";
import { __ } from "@wordpress/i18n";

const SideCart = () => {
	const restUrl = wcCartObj.apiUrl;
	// const set = searchSettings ? searchSettings : "";
	const [isLoading, setIsLoading] = useState(false);

	if (isLoading)
		return (
			<div className="blockons-side-cart-block loading">
				<Loader />
			</div>
		);

	return (
		<React.Fragment>
			<div className="blockons-side-cart-block">SIDE CART</div>
		</React.Fragment>
	);
};

export default SideCart;
