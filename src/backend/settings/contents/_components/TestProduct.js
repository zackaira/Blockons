// import { useState } from "@wordpress/element";
import { __ } from '@wordpress/i18n';
import Swal from 'sweetalert2';
import 'animate.css';

const TestProduct = ({ settings }) => {
	const quickview = settings ? settings : { enabled: false };

	const handleQuickView = (e) => {
		e.preventDefault();

		Swal.fire({
			html: `
                <div class="blockons-quickview-popup flex">
                    <div class="bqv-col left">
                        <img  src="http://localhost/_themes/wp-content/uploads/2022/05/album-1-300x300.jpg" alt="Album" />
                    </div>
                    <div class="bqv-col right">
                        <h2 class="bqv-title">Album</h2>
                        <div class="bqv-price">
                            <del class="">
                                <span class="woocommerce-Price-currencySymbol">R</span>15,20
                            </del>
                            <ins class="">
                                <span class="woocommerce-Price-currencySymbol">R</span>12,00
                            </ins>
                        </div>
                        <div class="bqv-desc">
                            <p>Product description goes here. You can fetch and display the actual product description.</p>
                        </div>
                        <button class="bqv-btn">
                            Add to Cart
                        </button>

						<div class="bqv-quickview-goto">Go to Product Page</div>

						<div class="bqv-info">
							SKU: woo-product<br />
							Categories: Category1, Category2<br />
							Tags: tagFour, tagOne, tagThree, tagTwo
						</div>
                    </div>
                </div>
            `,
			showCloseButton: true,
			showConfirmButton: false,
			showDenyButton: false,
			width: 'auto',
			position: 'center',
			customClass: {
				container: 'blockons-popup-container',
				popup: 'blockons-popup-swal',
			},
			showClass: {
				popup: `
					animate__animated
					animate__zoomIn
					animate__faster`,
			},
			hideClass: {
				popup: `
					animate__animated
					animate__zoomOut
					animate__faster`,
			},
		});
	};

	return (
		<div className="blockons-test-product">
			<div className="wc-block-grid__product">
				<div className="wc-block-grid__product-link">
					<div className="wc-block-grid__product-onsale">
						<span aria-hidden="true">Sale</span>
					</div>
					<div className="wc-block-grid__product-image">
						{(quickview.position === 'three' ||
							quickview.position === 'four') && (
							<div className="blockons-quickview three">
								<a
									className="blockons-quickview-btn"
									data-id="24"
									onClick={handleQuickView}
								>
									{quickview.text
										? quickview.text
										: __('Quick View')}
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
							<span className="woocommerce-Price-currencySymbol">
								R
							</span>
							15,20
						</span>
					</del>
					<span className="screen-reader-text">
						Original price was: R15,20.
					</span>
					<ins aria-hidden="true">
						<span className="woocommerce-Price-amount amount">
							<span className="woocommerce-Price-currencySymbol">
								R
							</span>
							12,00
						</span>
					</ins>
					<span className="screen-reader-text">
						Current price is: R12,00.
					</span>
				</div>

				<div className="wp-block-button wc-block-grid__product-add-to-cart">
					<a className="wp-block-button">Add to cart</a>
				</div>

				{((quickview.enabled && !quickview.position) ||
					quickview.position === 'one' ||
					quickview.position === 'two') && (
					<div
						className={`blockons-quickview ${
							quickview.position ? quickview.position : 'one'
						}`}
					>
						<a
							className={`blockons-quickview-btn ${
								quickview.position ? quickview.position : ''
							}`}
							data-id="24"
							onClick={handleQuickView}
						>
							{quickview.text ? quickview.text : __('Quick View')}
						</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default TestProduct;
