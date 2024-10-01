// import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";

const TestProduct = ({ settings }) => {
	// const wcActive = Boolean(blockonsObj.wcActive);
	const quickview = settings ? settings : { enabled: false };

	// if (!quickview.enabled) return null;

	return (
		<div className="blockons-test-product">
			<div className="wc-block-grid__product">
				<div className="wc-block-grid__product-link">
					<div className="wc-block-grid__product-onsale">
						<span aria-hidden="true">Sale</span>
					</div>
					<div className="wc-block-grid__product-image">
						{(quickview.position === "three" ||
							quickview.position === "four") && (
							<div className="blockons-quickview three">
								<a className="blockons-quickview-btn" data-id="24">
									{quickview.text ? quickview.text : __("Quick View")}
								</a>
							</div>
						)}
						<img
							src="http://localhost/_themes/wp-content/uploads/2022/05/album-1-300x300.jpg"
							className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
						/>
					</div>
					<div className="wc-block-grid__product-title">Album</div>
				</div>
				<div className="wc-block-grid__product-price price">
					<del aria-hidden="true">
						<span className="woocommerce-Price-amount amount">
							<span className="woocommerce-Price-currencySymbol">R</span>15,20
						</span>
					</del>
					<span className="screen-reader-text">
						Original price was: R15,20.
					</span>
					<ins aria-hidden="true">
						<span className="woocommerce-Price-amount amount">
							<span className="woocommerce-Price-currencySymbol">R</span>12,00
						</span>
					</ins>
					<span className="screen-reader-text">Current price is: R12,00.</span>
				</div>

				<div className="wp-block-button wc-block-grid__product-add-to-cart">
					<a className="wp-block-button">Add to cart</a>
				</div>

				{((quickview.enabled && !quickview.position) ||
					quickview.position === "one" ||
					quickview.position === "two") && (
					<div
						className={`blockons-quickview ${
							quickview.position ? quickview.position : "one"
						}`}
					>
						<a
							className={`blockons-quickview-btn ${
								quickview.position ? quickview.position : ""
							}`}
							data-id="24"
						>
							{quickview.text ? quickview.text : __("Quick View")}
						</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default TestProduct;
