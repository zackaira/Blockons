import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import parse from 'html-react-parser';

const QuickViewPopup = ({ productData, onClose, blockonsQuickviewObj }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [addingToCart, setAddingToCart] = useState(false);
	const [addToCartMessage, setAddToCartMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [currentImage, setCurrentImage] = useState(0);

	useEffect(() => {
		const addToCartContainer = document.getElementById(
			'quickview-add-to-cart',
		);

		if (addToCartContainer && productData.add_to_cart_form) {
			// Insert the add to cart form
			addToCartContainer.innerHTML = productData.add_to_cart_form;

			if (typeof jQuery !== 'undefined') {
				const $container = jQuery(addToCartContainer);

				// Initialize variation forms if present
				if (productData.type === 'variable') {
					const $form = $container.find('.variations_form');
					if (
						$form.length &&
						typeof $form.wc_variation_form === 'function'
					) {
						$form.wc_variation_form();
					}
				}

				// Handle form submission
				$container.find('form.cart').on('submit', function (e) {
					e.preventDefault();

					const $form = jQuery(this);
					const $submitButton = $form.find('button[type="submit"]');

					// For variable products, check if variation is selected
					if (productData.type === 'variable') {
						const $variationInput = $form.find(
							'input[name="variation_id"]',
						);
						if (!$variationInput.val()) {
							setErrorMessage(
								'Please select product options before adding to cart.',
							);
							return;
						}

						// For variable products, we only want to send the variation data
						if ($variationInput.val()) {
							// Filter the form data to only include necessary fields
							const data = $form
								.serializeArray()
								.filter(
									(item) =>
										item.name === 'variation_id' ||
										item.name === 'quantity' ||
										item.name.startsWith('attribute_'),
								);

							// Add the variation_id as the product_id
							data.push({
								name: 'product_id',
								value: $variationInput.val(),
							});

							// Add action for WooCommerce
							data.push({
								name: 'action',
								value: 'wc_ajax_add_to_cart',
							});

							// Proceed with AJAX request
							handleAjaxAddToCart(data, $submitButton);
						}
					} else {
						// For simple products, proceed as normal
						let data = $form.serializeArray();

						// Add product_id if not present
						if (!data.find((item) => item.name === 'product_id')) {
							data.push({
								name: 'product_id',
								value: productData.id,
							});
						}

						// Add action for WooCommerce
						data.push({
							name: 'action',
							value: 'wc_ajax_add_to_cart',
						});

						// Proceed with AJAX request
						handleAjaxAddToCart(data, $submitButton);
					}
				});

				const handleAjaxAddToCart = (data, $submitButton) => {
					// Disable submit button and show loading state
					$submitButton.prop('disabled', true);
					setAddingToCart(true);
					setErrorMessage('');
					setAddToCartMessage('');

					// Make AJAX request
					jQuery.ajax({
						type: 'POST',
						url: blockonsQuickviewObj.wc_ajax_url
							.toString()
							.replace('%%endpoint%%', 'add_to_cart'),
						data: data,
						success: function (response) {
							if (response.error) {
								setErrorMessage(
									response.message || 'Error adding to cart',
								);
							} else {
								setAddToCartMessage(
									'Product added to cart successfully!',
								);
								setTimeout(() => setAddToCartMessage(''), 3000);

								// Update cart fragments
								if (response.fragments) {
									jQuery.each(
										response.fragments,
										function (key, value) {
											jQuery(key).replaceWith(value);
										},
									);
									jQuery(document.body).trigger(
										'wc_fragments_refreshed',
									);
								}

								// Trigger WooCommerce events
								jQuery(document.body).trigger('added_to_cart', [
									response.fragments,
									response.cart_hash,
									jQuery($submitButton),
								]);
							}
						},
						error: function (xhr, status, error) {
							setErrorMessage(
								'Error occurred while adding to cart. Please try again.',
							);
						},
						complete: function () {
							setTimeout(() => {
								setAddingToCart(false);
							}, 23000);
							$submitButton.prop('disabled', false);
						},
					});
				};

				// Handle quantity buttons
				const initQuantityButtons = () => {
					const $quantityInputs = $container.find(
						'.quantity:not(.buttons_added) .qty',
					);
					if ($quantityInputs.length) {
						$quantityInputs.each(function () {
							const $input = jQuery(this);
							const $parent = $input.parent();
							if (!$parent.hasClass('buttons_added')) {
								$parent
									.addClass('buttons_added')
									.prepend(
										'<input type="button" value="-" class="minus" />',
									)
									.append(
										'<input type="button" value="+" class="plus" />',
									);
							}
						});
					}
				};

				initQuantityButtons();

				// Handle quantity button clicks
				$container.on('click', '.plus, .minus', function () {
					const $btn = jQuery(this);
					const $qty = $btn.closest('.quantity').find('.qty');
					const currentVal = parseFloat($qty.val());
					const max = parseFloat($qty.attr('max'));
					const min = parseFloat($qty.attr('min'));
					const step = parseFloat($qty.attr('step')) || 1;

					if ($btn.hasClass('plus')) {
						if (max && currentVal >= max) {
							$qty.val(max);
						} else {
							$qty.val(currentVal + step);
						}
					} else {
						if (min && currentVal <= min) {
							$qty.val(min);
						} else if (currentVal > 0) {
							$qty.val(currentVal - step);
						}
					}

					$qty.trigger('change');
				});

				// Reinitialize quantity buttons when variation changes
				if (productData.type === 'variable') {
					jQuery(document.body).on('show_variation', function () {
						initQuantityButtons();
					});
				}
			}

			setIsLoading(false);
		}

		// Cleanup
		return () => {
			if (addToCartContainer) {
				const $container = jQuery(addToCartContainer);
				$container.find('form.cart').off('submit');
				$container.off('click', '.plus, .minus');
				if (productData.type === 'variable') {
					jQuery(document.body).off('show_variation');
				}
			}
		};
	}, [productData.add_to_cart_form]);

	return (
		<div className="quickview-popup">
			<div className="quickview-product">
				<div className="quickview-product-left">
					<div className="quickview-gallery">
						<div className="main-image">
							{productData.gallery_images &&
								productData.gallery_images[currentImage] && (
									<>
										<img
											src={
												productData.gallery_images[
													currentImage
												].full
											}
											alt={
												productData.gallery_images[
													currentImage
												].alt
											}
											className="quickview-image"
										/>
										{currentImage > 0 && (
											<button
												className="gallery-nav prev sa-solid sa-chevron-left"
												onClick={() =>
													setCurrentImage(
														(prev) => prev - 1,
													)
												}
											></button>
										)}
										{currentImage <
											productData.gallery_images.length -
												1 && (
											<button
												className="gallery-nav next sa-solid sa-chevron-right"
												onClick={() =>
													setCurrentImage(
														(prev) => prev + 1,
													)
												}
											></button>
										)}
									</>
								)}
						</div>

						{productData.gallery_images &&
							productData.gallery_images.length > 1 && (
								<div className="gallery-thumbnails">
									{productData.gallery_images.map(
										(image, index) => (
											<div
												key={index}
												className={`gallery-thumbnail ${currentImage === index ? 'active' : ''}`}
												onClick={() =>
													setCurrentImage(index)
												}
											>
												<img
													src={image.thumbnail}
													alt={image.alt}
													className="thumbnail-image"
												/>
											</div>
										),
									)}
								</div>
							)}
					</div>
				</div>
				<div className="quickview-product-right">
					<h2 className="product-title">{productData.title}</h2>
					<p className="product-price">{parse(productData.price)}</p>
					{productData.short_desc && (
						<p className="product-desc">
							{parse(productData.short_desc)}
						</p>
					)}

					<div className="add-to-cart-section">
						{addingToCart && (
							<div className="adding-to-cart-message">
								Adding to cart...
							</div>
						)}

						{errorMessage && (
							<div className="message error-message">
								{errorMessage}
							</div>
						)}

						{addToCartMessage && (
							<div className="message success-message">
								{addToCartMessage}
							</div>
						)}

						<div
							id="quickview-add-to-cart"
							className="woocommerce"
						></div>
					</div>

					<div className="quickview-goto">
						<a
							href={productData.permalink}
							className="view-product-button button alt wp-element-button"
						>
							{__('Go to Product Page', 'blockons')}
						</a>
					</div>

					<div className="product-info">
						{productData.sku && (
							<div className="product-sku">
								SKU: {productData.sku}
							</div>
						)}

						{productData.categories && (
							<div className="product-categories">
								Categories:{' '}
								{productData.categories.map((cat, index) => (
									<>
										<span key={index}>{cat.name}</span>
										{index <
										productData.categories.length - 1
											? ', '
											: ''}
									</>
								))}
							</div>
						)}

						{productData.tags && productData.tags.length > 0 && (
							<div className="product-tags">
								Tags:{' '}
								{productData.tags.map((tag, index) => (
									<>
										<span key={index}>{tag.name}</span>
										{index < productData.tags.length - 1
											? ', '
											: ''}
									</>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default QuickViewPopup;
