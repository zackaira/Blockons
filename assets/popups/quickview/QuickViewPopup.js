import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import parse from 'html-react-parser';

const QuickViewPopup = ({ productData, onClose, blockonsQuickviewObj }) => {
	const [addingToCart, setAddingToCart] = useState(false);
	const [currentImage, setCurrentImage] = useState(0);
	const qvOptions = blockonsQuickviewObj?.quickviewOptions || {};

	useEffect(() => {
		if (qvOptions.add_to_cart) {
			console.log('Add to Cart Form Removed');
			return;
		}

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
					if ($form.length) {
						// Enhanced initialization for variation forms
						setTimeout(() => {
							// First, ensure WooCommerce variation script is available
							if (
								typeof jQuery.fn.wc_variation_form ===
								'function'
							) {
								// Initialize the variation form
								$form.wc_variation_form();
							} else {
								// Try alternative initialization
								$form.each(function () {
									const form = jQuery(this);
									if (
										typeof form.wc_variation_form ===
										'function'
									) {
										form.wc_variation_form();
									}
								});
							}

							// Trigger necessary events
							$form.trigger('wc_variation_form');
							$form.trigger('check_variations');

							// Force trigger change events on selects to update variation_id
							$form.find('select').each(function () {
								jQuery(this).trigger('change');
							});

							// Initialize WooCommerce single product features
							if (
								typeof window.wc_single_product_params !==
								'undefined'
							) {
								$container.trigger('wc-enhanced-select-init');
							}

							// Set up variation change listeners
							$form.on(
								'show_variation',
								function (event, variation) {
									const $variationInput = $form.find(
										'input[name="variation_id"]',
									);
									$variationInput.val(variation.variation_id);
								},
							);

							$form.on('hide_variation', function () {
								const $variationInput = $form.find(
									'input[name="variation_id"]',
								);
								$variationInput.val('');
							});

							// Listen for attribute changes
							$form.find('select').on('change', function () {
								// Trigger variation form to recalculate
								setTimeout(() => {
									$form.trigger('check_variations');
								}, 50);
							});
						}, 200);
					}
				}

				// Handle form submission
				$container.find('form.cart').on('submit', function (e) {
					e.preventDefault();

					const $form = jQuery(this);
					const $submitButton = $form.find('button[type="submit"]');

					// Let WooCommerce handle messaging

					// For variable products, check if variation is selected
					if (productData.type === 'variable') {
						const $variationInput = $form.find(
							'input[name="variation_id"]',
						);

						if (!$variationInput.length) {
							return;
						}

						if (
							!$variationInput.val() ||
							$variationInput.val() === '0' ||
							$variationInput.val() === ''
						) {
							// Let WooCommerce handle the validation message
							return;
						}

						// Get all form data for variable products
						let data = $form.serializeArray();

						// Ensure we have the parent product ID for variable products
						const hasParentId = data.find(
							(item) => item.name === 'add-to-cart',
						);
						if (!hasParentId) {
							data.push({
								name: 'add-to-cart',
								value: productData.id,
							});
						}

						// Proceed with AJAX request
						handleAjaxAddToCart(data, $submitButton);
					} else {
						// For simple products
						let data = $form.serializeArray();

						// Add product_id if not present
						if (!data.find((item) => item.name === 'add-to-cart')) {
							data.push({
								name: 'add-to-cart',
								value: productData.id,
							});
						}

						// Proceed with AJAX request
						handleAjaxAddToCart(data, $submitButton);
					}
				});

				const handleAjaxAddToCart = (data, $submitButton) => {
					// Show loading state and disable submit button
					$submitButton.prop('disabled', true);
					setAddingToCart(true);

					// Clear any previous messages
					jQuery('.woocommerce-notices-wrapper').html('');

					// Convert data to proper format for WooCommerce AJAX
					const formData = new FormData();
					data.forEach((item) => {
						formData.append(item.name, item.value);
					});

					// Convert FormData back to regular object for WooCommerce AJAX
					const ajaxData = {};
					for (let [key, value] of formData.entries()) {
						ajaxData[key] = value;
					}

					// Make AJAX request using WooCommerce AJAX endpoint
					jQuery.ajax({
						type: 'POST',
						url: blockonsQuickviewObj.wc_ajax_url
							.toString()
							.replace('%%endpoint%%', 'add_to_cart'),
						data: ajaxData,
						success: function (response) {
							let parsedResponse;

							// Try to parse response if it's a string
							try {
								parsedResponse =
									typeof response === 'string'
										? JSON.parse(response)
										: response;
							} catch (e) {
								parsedResponse = response;
							}

							// Handle WooCommerce messages
							const $noticesWrapper = jQuery(
								'.woocommerce-notices-wrapper',
							);

							// Handle WooCommerce redirect responses - these have error:true but are actually successful
							const isRedirectResponse =
								parsedResponse &&
								parsedResponse.error === true &&
								parsedResponse.product_url;

							// Conservative error detection - only show error if we're absolutely certain
							// WooCommerce successful responses vary, so default to success unless explicitly an error
							const hasExplicitError =
								parsedResponse &&
								!isRedirectResponse && // Don't treat redirect responses as errors
								(parsedResponse.error === true ||
									parsedResponse.success === false ||
									(parsedResponse.data &&
										parsedResponse.data.error === true) ||
									// Only treat string responses as errors if they contain explicit error language
									(typeof parsedResponse === 'string' &&
										parsedResponse
											.toLowerCase()
											.includes('error')) ||
									// Check for common WooCommerce error patterns in data
									(parsedResponse.data &&
										typeof parsedResponse.data ===
											'string' &&
										(parsedResponse.data
											.toLowerCase()
											.includes('please select') ||
											parsedResponse.data
												.toLowerCase()
												.includes('required field'))));

							// Handle empty response - this usually means the product was added successfully
							// but WooCommerce didn't return proper response data
							if (
								!parsedResponse ||
								(typeof parsedResponse === 'string' &&
									parsedResponse.trim() === '')
							) {
								// Show success message
								$noticesWrapper.html(`
									<div class="woocommerce-message" role="alert">
										Product successfully added to cart.
									</div>
								`);

								// Auto-hide success message after 4 seconds
								setTimeout(() => {
									$noticesWrapper.fadeOut();
								}, 4000);

								// Force cart fragment refresh since we don't have response data
								setTimeout(() => {
									// Try to refresh fragments
									jQuery.ajax({
										type: 'POST',
										url: blockonsQuickviewObj.wc_ajax_url
											.toString()
											.replace(
												'%%endpoint%%',
												'get_refreshed_fragments',
											),
										success: function (fragmentResponse) {
											let parsedFragments;
											try {
												parsedFragments =
													typeof fragmentResponse ===
													'string'
														? JSON.parse(
																fragmentResponse,
															)
														: fragmentResponse;
											} catch (e) {
												parsedFragments =
													fragmentResponse;
											}

											if (
												parsedFragments &&
												parsedFragments.fragments
											) {
												// Update cart fragments
												jQuery.each(
													parsedFragments.fragments,
													function (key, value) {
														jQuery(key).replaceWith(
															value,
														);
													},
												);

												// Trigger fragment refresh event
												jQuery(document.body).trigger(
													'wc_fragments_refreshed',
												);

												// Re-initialize Blockons cart components
												setTimeout(() => {
													if (
														typeof window.initializeBlockonsCart ===
														'function'
													) {
														window.initializeBlockonsCart(
															true,
														);
													}
												}, 50);
											}
										},
										error: function () {
											jQuery(document.body).trigger(
												'wc_fragment_refresh',
											);
										},
									});
								}, 100);

								// Trigger standard WooCommerce events
								jQuery(document.body).trigger('added_to_cart', [
									null,
									null,
									jQuery($submitButton),
								]);
								jQuery(document.body).trigger(
									'wc_fragment_refresh',
								);

								// Clear WooCommerce notices to prevent duplicate messages on next page load
								setTimeout(() => {
									jQuery.ajax({
										type: 'POST',
										url: blockonsQuickviewObj.ajaxurl,
										data: {
											action: 'blockons_clear_cart_notices',
											nonce:
												blockonsQuickviewObj.nonce ||
												'',
										},
										success: function (response) {
											// console.log('Cart notices cleared');
										},
										error: function () {
											// console.log(
											// 	'Failed to clear cart notices',
											// );
										},
									});
								}, 200);

								return; // Exit early since we handled the empty response
							}

							if (hasExplicitError) {
								// Show error message
								const errorMsg =
									parsedResponse.data?.message ||
									parsedResponse.message ||
									parsedResponse.data ||
									'Error adding product to cart';
								$noticesWrapper.html(`
									<div class="woocommerce-message woocommerce-error" role="alert">
										${errorMsg}
									</div>
								`);
							} else {
								// Show success message - if we don't have explicit errors, it's success
								// Check if we have a success message in the response
								let successMsg =
									'Product successfully added to cart.';

								// Handle redirect responses specially
								if (isRedirectResponse) {
									successMsg =
										'Product successfully added to cart.';
								} else if (parsedResponse) {
									// Try to extract success message from response
									if (
										parsedResponse.data?.message &&
										!parsedResponse.data.message
											.toLowerCase()
											.includes('error')
									) {
										successMsg =
											parsedResponse.data.message;
									} else if (
										parsedResponse.message &&
										!parsedResponse.message
											.toLowerCase()
											.includes('error')
									) {
										successMsg = parsedResponse.message;
									}
								}

								$noticesWrapper.html(`
									<div class="woocommerce-message" role="alert">
										${successMsg}
									</div>
								`);

								// Auto-hide success message after 4 seconds
								setTimeout(() => {
									$noticesWrapper.fadeOut();
								}, 4000);
							}

							// Update cart fragments if available
							if (parsedResponse && parsedResponse.fragments) {
								jQuery.each(
									parsedResponse.fragments,
									function (key, value) {
										jQuery(key).replaceWith(value);
									},
								);
								jQuery(document.body).trigger(
									'wc_fragments_refreshed',
								);
							}

							// Trigger WooCommerce events
							// For redirect responses, we still need to trigger the added_to_cart event
							const fragmentsToPass =
								parsedResponse && parsedResponse.fragments
									? parsedResponse.fragments
									: null;
							const cartHashToPass =
								parsedResponse && parsedResponse.cart_hash
									? parsedResponse.cart_hash
									: null;

							jQuery(document.body).trigger('added_to_cart', [
								fragmentsToPass,
								cartHashToPass,
								jQuery($submitButton),
							]);

							// Update mini cart if it exists
							jQuery(document.body).trigger(
								'wc_fragment_refresh',
							);

							// Clear WooCommerce notices to prevent duplicate messages on next page load
							setTimeout(() => {
								jQuery.ajax({
									type: 'POST',
									url: blockonsQuickviewObj.ajaxurl,
									data: {
										action: 'blockons_clear_cart_notices',
										nonce: blockonsQuickviewObj.nonce || '',
									},
									success: function (response) {
										// console.log('Cart notices cleared');
									},
									error: function () {
										// console.log(
										// 	'Failed to clear cart notices',
										// );
									},
								});
							}, 200);

							// For redirect responses, we need to manually refresh cart fragments
							if (isRedirectResponse) {
								// Add a small delay to ensure the cart has been updated server-side
								setTimeout(() => {
									// Force refresh cart fragments via AJAX since redirect responses don't include them
									jQuery.ajax({
										type: 'POST',
										url: blockonsQuickviewObj.wc_ajax_url
											.toString()
											.replace(
												'%%endpoint%%',
												'get_refreshed_fragments',
											),
										success: function (fragmentResponse) {
											let parsedFragments;
											try {
												parsedFragments =
													typeof fragmentResponse ===
													'string'
														? JSON.parse(
																fragmentResponse,
															)
														: fragmentResponse;
											} catch (e) {
												parsedFragments =
													fragmentResponse;
											}

											if (
												parsedFragments &&
												parsedFragments.fragments
											) {
												// Update cart fragments
												jQuery.each(
													parsedFragments.fragments,
													function (key, value) {
														jQuery(key).replaceWith(
															value,
														);
													},
												);

												// Trigger fragment refresh event
												jQuery(document.body).trigger(
													'wc_fragments_refreshed',
												);

												// Re-initialize Blockons cart components after fragment update
												setTimeout(() => {
													if (
														typeof window.initializeBlockonsCart ===
														'function'
													) {
														window.initializeBlockonsCart(
															true,
														); // Force re-initialization
													} else {
														const cartIcons =
															document.querySelectorAll(
																'.blockons-wc-mini-cart-block-icon',
															);
														const cartAmount =
															document.querySelector(
																'.blockons-cart-amnt',
															);

														if (
															cartAmount &&
															cartIcons.length
														) {
															cartIcons.forEach(
																(icon) => {
																	// Remove old amount display
																	const oldAmount =
																		icon.querySelector(
																			'.blockons-cart-amnt',
																		);
																	if (
																		oldAmount
																	) {
																		oldAmount.remove();
																	}
																	// Add updated amount
																	const newAmount =
																		cartAmount.cloneNode(
																			true,
																		);
																	icon.appendChild(
																		newAmount,
																	);
																},
															);
														}

														// Update dropdown mini carts
														const dropdownCarts =
															document.querySelectorAll(
																'.wp-block-blockons-wc-mini-cart.cart-dropdown',
															);
														const miniCart =
															document.querySelector(
																'.blockons-mini-crt',
															);

														if (
															miniCart &&
															dropdownCarts.length
														) {
															dropdownCarts.forEach(
																(cart) => {
																	const innerContainer =
																		cart.querySelector(
																			'.blockons-wc-mini-cart-inner',
																		);
																	if (
																		innerContainer
																	) {
																		// Remove old mini cart
																		const oldMiniCart =
																			innerContainer.querySelector(
																				'.blockons-mini-crt',
																			);
																		if (
																			oldMiniCart
																		) {
																			oldMiniCart.remove();
																		}
																		// Add updated mini cart
																		const newMiniCart =
																			miniCart.cloneNode(
																				true,
																			);
																		innerContainer.appendChild(
																			newMiniCart,
																		);
																	}
																},
															);
														}
													}
												}, 50);
											}
										},
										error: function (xhr, status, error) {
											// Fallback: trigger standard refresh events
											jQuery(document.body).trigger(
												'wc_fragment_refresh',
											);
										},
									});
								}, 100); // Small delay to ensure server-side cart update is complete
							}
						},
						error: function (xhr, status, error) {
							// Show network error message
							const $noticesWrapper = jQuery(
								'.woocommerce-notices-wrapper',
							);
							$noticesWrapper.html(`
								<div class="woocommerce-message woocommerce-error" role="alert">
									Network error occurred. Please try again.
								</div>
							`);
						},
						complete: function () {
							// Re-enable submit button and hide loading state
							$submitButton.prop('disabled', false);
							setAddingToCart(false);
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
												className="gallery-nav prev fa-solid fa-chevron-left"
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
												className="gallery-nav next fa-solid fa-chevron-right"
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
					<h3 className="product-title">{productData.title}</h3>

					{!qvOptions.price && (
						<p className="product-price">
							{parse(productData.price)}
						</p>
					)}

					{productData.short_desc && (
						<p className="product-desc">
							{parse(productData.short_desc)}
						</p>
					)}

					{!qvOptions.add_to_cart && (
						<div className="add-to-cart-section">
							{addingToCart && (
								<div className="quickview-loading-state">
									<div className="loading-spinner"></div>
									<span>Adding to cart...</span>
								</div>
							)}

							{/* Container for WooCommerce messages */}
							<div className="woocommerce-notices-wrapper"></div>

							<div
								id="quickview-add-to-cart"
								className="woocommerce"
							></div>
						</div>
					)}

					{!qvOptions.button_to_page && (
						<div className="quickview-goto">
							<a
								href={productData.permalink}
								className="view-product-button button alt wp-element-button"
							>
								{__('Go to Product Page', 'blockons')}
							</a>
						</div>
					)}

					<div className="product-info">
						{!qvOptions.sku && productData.sku && (
							<div className="product-sku">
								SKU: {productData.sku}
							</div>
						)}

						{!qvOptions.categories_tags && (
							<>
								{productData.categories && (
									<div className="product-categories">
										Categories:{' '}
										{productData.categories.map(
											(cat, index) => (
												<span key={cat.id || index}>
													{cat.name}
													{index <
													productData.categories
														.length -
														1
														? ', '
														: ''}
												</span>
											),
										)}
									</div>
								)}

								{productData.tags &&
									productData.tags.length > 0 && (
										<div className="product-tags">
											Tags:{' '}
											{productData.tags.map(
												(tag, index) => (
													<span key={tag.id || index}>
														{tag.name}
														{index <
														productData.tags
															.length -
															1
															? ', '
															: ''}
													</span>
												),
											)}
										</div>
									)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default QuickViewPopup;
