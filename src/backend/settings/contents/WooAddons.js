import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import SettingHeader from '../components/SettingHeader';
import SettingRow from '../components/SettingRow';
import SettingGroup from '../components/SettingGroup';
import TestProduct from './_components/TestProduct';

const WooAddons = ({
	blockonsOptions,
	handleSettingChange,
	isPremium,
	upgradeUrl,
	showSidecartPreview,
	setShowSidecartPreview,
}) => {
	const [quickviewPreview, setQuickviewPreview] = useState(false);

	const onSettingChange = (e) => {
		handleSettingChange(e);
	};

	const onShowSidecart = (e) => {
		setShowSidecartPreview(e);
	};

	return (
		<>
			<SettingHeader
				title={__('WooCommerce Addons', 'blockons')}
				description={__(
					'Add extra, useful features to your WooCommerce online store',
					'blockons',
				)}
			/>

			<table className="form-table" role="presentation">
				<tbody>
					<>
						<SettingRow
							title={__('WooCommerce Side Cart', 'blockons')}
							description={__(
								'Add a slide-out cart to your WooCommerce Mini Cart blocks',
								'blockons',
							)}
							inputType="heading"
							// nomargin
						/>
						<SettingRow
							title={__('Enable Side Cart', 'blockons')}
							slug="sidecart_enabled"
							value={blockonsOptions.sidecart?.enabled}
							inputType="toggle"
							onChange={onSettingChange}
							note={
								blockonsOptions.sidecart?.enabled
									? __(
											'Add the CSS class "blockons-opencart" to any element(s) to trigger the Side Cart open or close, or use the WC Mini Cart block with the Side Cart option.',
											'blockons',
										)
									: ''
							}
						/>

						{blockonsOptions.sidecart?.enabled && (
							<>
								<SettingRow
									title={__('Preview Side Cart', 'blockons')}
									slug="sidecart_preview"
									value={showSidecartPreview}
									inputType="toggle"
									onChange={() =>
										onShowSidecart((state) => !state)
									}
								/>

								{isPremium ? (
									<>
										<SettingRow
											title={__('Position', 'blockons')}
											slug="sidecart_position"
											value={
												blockonsOptions.sidecart
													?.position
											}
											inputType="select"
											options={{
												right: __('Right', 'blockons'),
												left: __('Left', 'blockons'),
											}}
											onChange={onSettingChange}
										/>

										<SettingGroup
											label={__(
												'Edit Side Cart Icon',
												'blockons',
											)}
										>
											<SettingRow
												title={__(
													'Enable Icon',
													'blockons',
												)}
												slug="sidecart_has_icon"
												value={
													blockonsOptions.sidecart
														?.has_icon
												}
												inputType="toggle"
												onChange={onSettingChange}
											/>

											{blockonsOptions.sidecart
												?.has_icon && (
												<>
													<SettingRow
														title={__(
															'Select Icon',
															'blockons',
														)}
														slug="sidecart_icon"
														value={
															blockonsOptions
																.sidecart?.icon
														}
														inputType="select"
														options={{
															'cart-shopping': __(
																'Shopping Cart',
																'blockons',
															),
															'cart-arrow-down':
																__(
																	'Cart Arrow Down',
																	'blockons',
																),
															'basket-shopping':
																__(
																	'Shopping Basket',
																	'blockons',
																),
															suitcase: __(
																'Shopping Suitcase',
																'blockons',
															),
															bucket: __(
																'Bucket',
																'blockons',
															),
														}}
														onChange={
															onSettingChange
														}
													/>

													<SettingRow
														title={__(
															'Background Color',
															'blockons',
														)}
														slug="sidecart_icon_bgcolor"
														value={
															blockonsOptions
																.sidecart
																?.icon_bgcolor
														}
														inputType="colorpicker"
														defaultValue="#FFF"
														onChange={
															onSettingChange
														}
													/>
													<SettingRow
														title={__(
															'Icon Color',
															'blockons',
														)}
														slug="sidecart_icon_color"
														value={
															blockonsOptions
																.sidecart
																?.icon_color
														}
														inputType="colorpicker"
														defaultValue="#333"
														onChange={
															onSettingChange
														}
													/>

													<SettingRow
														title={__(
															'Width / Height',
															'blockons',
														)}
														slug="sidecart_icon_padding"
														value={
															blockonsOptions
																.sidecart
																?.icon_padding
														}
														inputType="range"
														defaultValue={60}
														min={40}
														max={100}
														suffix="px"
														onChange={
															onSettingChange
														}
													/>
													<SettingRow
														title={__(
															'Size',
															'blockons',
														)}
														slug="sidecart_icon_size"
														value={
															blockonsOptions
																.sidecart
																?.icon_size
														}
														inputType="range"
														defaultValue={24}
														min={12}
														max={72}
														// step={0.01}
														suffix="px"
														onChange={
															onSettingChange
														}
													/>

													<SettingRow
														title={__(
															'Show Cart Amount',
															'blockons',
														)}
														slug="sidecart_has_amount"
														value={
															blockonsOptions
																.sidecart
																?.has_amount
														}
														inputType="toggle"
														onChange={
															onSettingChange
														}
													/>
													{blockonsOptions.sidecart
														?.has_amount && (
														<>
															<SettingRow
																title={__(
																	'Background Color',
																	'blockons',
																)}
																slug="sidecart_amount_bgcolor"
																value={
																	blockonsOptions
																		.sidecart
																		?.amount_bgcolor
																}
																inputType="colorpicker"
																defaultValue="#000"
																onChange={
																	onSettingChange
																}
															/>
															<SettingRow
																title={__(
																	'Font Color',
																	'blockons',
																)}
																slug="sidecart_amount_fcolor"
																value={
																	blockonsOptions
																		.sidecart
																		?.amount_fcolor
																}
																inputType="colorpicker"
																defaultValue="#FFF"
																onChange={
																	onSettingChange
																}
															/>
														</>
													)}
												</>
											)}
										</SettingGroup>

										<SettingGroup
											label={__(
												'Edit Side Cart',
												'blockons',
											)}
										>
											<SettingRow
												title={__('Header Title')}
												slug="sidecart_header_title"
												value={
													blockonsOptions.sidecart
														?.header_title
												}
												placeholder="Your Cart"
												inputType="text"
												onChange={onSettingChange}
											/>
											<SettingRow
												title={__('Header text')}
												slug="sidecart_header_text"
												value={
													blockonsOptions.sidecart
														?.header_text
												}
												placeholder="Your Cart"
												inputType="text"
												onChange={onSettingChange}
											/>

											<SettingRow
												title={__(
													'Background Color',
													'blockons',
												)}
												slug="sidecart_bgcolor"
												value={
													blockonsOptions.sidecart
														?.bgcolor
												}
												inputType="colorpicker"
												defaultValue="#FFF"
												onChange={onSettingChange}
											/>
											<SettingRow
												title={__(
													'Font Color',
													'blockons',
												)}
												slug="sidecart_color"
												value={
													blockonsOptions.sidecart
														?.color
												}
												inputType="colorpicker"
												defaultValue="#333"
												onChange={onSettingChange}
											/>

											<SettingRow
												title={__(
													'Overlay Color',
													'blockons',
												)}
												slug="sidecart_overlay_color"
												value={
													blockonsOptions.sidecart
														?.overlay_color
												}
												inputType="colorpicker"
												defaultValue="#000"
												onChange={onSettingChange}
											/>
											<SettingRow
												title={__(
													'Opacity',
													'blockons',
												)}
												slug="sidecart_overlay_opacity"
												value={
													blockonsOptions.sidecart
														?.overlay_opacity
												}
												inputType="range"
												defaultValue={0.6}
												min={0}
												max={1}
												step={0.01}
												onChange={onSettingChange}
												suffix=""
											/>
										</SettingGroup>
									</>
								) : (
									<SettingRow
										inputType="upgrade"
										title={__(
											'WooCommerce Side Cart',
											'blockons',
										)}
										description={__(
											'Upgrade to Blockons Pro to add WooCommerce Side Cart to your store.',
											'blockons',
										)}
										upgradeUrl={upgradeUrl}
										proFeatures={[
											__(
												'Neat Slide in Cart with real-time updates.',
												'blockons',
											),
											__(
												'Fully Customizable Icon & Side Cart.',
												'blockons',
											),
											__(
												'Boost conversions with WooCommerce Side Cart.',
												'blockons',
											),
										]}
									/>
								)}
							</>
						)}

						{/* <SettingRow
							title={__('Product Quick View', 'blockons')}
							description={__(
								'Add Product Quick View popups to the WooCommerce core product blocks, letting users view all product details without leaving the page.',
								'blockons',
							)}
							inputType="heading"
						/>
						<SettingRow
							title={__('Enable Product Quick View', 'blockons')}
							slug="quickview_enabled"
							value={blockonsOptions.quickview?.enabled}
							inputType="toggle"
							onChange={onSettingChange}
							tooltip={__(
								'This will add Product Quick View settings to the WooCommerce core product blocks in the Editor.',
								'blockons',
							)}
							documentation="#"
						/>

						{blockonsOptions.quickview?.enabled && (
							<>
								<SettingRow
									title={__('Quick View Preview', 'blockons')}
									slug="quickview_preview"
									value={quickviewPreview}
									inputType="toggle"
									onChange={() =>
										setQuickviewPreview(!quickviewPreview)
									}
								/>

								{isPremium ? (
									<>
										<SettingRow
											title={__(
												'Quick View Position',
												'blockons',
											)}
											slug="quickview_position"
											value={
												blockonsOptions.quickview
													?.position
											}
											inputType="select"
											options={{
												one: __(
													'Default Button',
													'blockons',
												),
												two: __(
													'Plain Text',
													'blockons',
												),
												three: __(
													'Over Image',
													'blockons',
												),
												// four: __("Over Image Icon", "blockons"),
											}}
											onChange={onSettingChange}
										/>
										<SettingRow
											title={__(
												'Button Text',
												'blockons',
											)}
											slug="quickview_text"
											value={
												blockonsOptions.quickview?.text
											}
											placeholder={__(
												'Quick View',
												'blockons',
											)}
											inputType="text"
											onChange={onSettingChange}
										/>
									</>
								) : (
									<SettingRow
										inputType="upgrade"
										title={__(
											'Quick View for WooCommerce',
											'blockons',
										)}
										description={__(
											'Upgrade to Blockons Pro to add quick view you your WooCommerce products.',
											'blockons',
										)}
										upgradeUrl={upgradeUrl}
										proFeatures={[
											__(
												'Boost Conversions & keep your shoppers engaged',
												'blockons',
											),
											__(
												'View products in a popup without leaving the shop page',
												'blockons',
											),
											__(
												'Fully Customizable Popup Design',
												'blockons',
											),
										]}
									/>
								)}
							</>
						)}

						{blockonsOptions.quickview?.enabled &&
							quickviewPreview && (
								<TestProduct
									settings={blockonsOptions?.quickview}
								/>
							)} */}
					</>
				</tbody>
			</table>

			<div className="blockons-more">
				{__('More Add-Ons Coming Soon...', 'blockons')}
			</div>
			<p className="center">
				{__(
					'Get in touch and let us know which add-ons you need for your site.',
					'blockons',
				)}
			</p>
		</>
	);
};

export default WooAddons;
