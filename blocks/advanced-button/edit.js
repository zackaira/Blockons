import { useState, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import {
	BlockControls,
	InspectorControls,
	RichText,
	LinkControl,
	useBlockProps,
	InnerBlocks,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	ToolbarGroup,
	ToolbarButton,
	SelectControl,
	RangeControl,
	Popover,
	Button,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import { v4 as uuidv4 } from 'uuid';
import { minimalRichText } from '../block-global';
import ColorSelector from '../_components/ColorSelector';
import UpgradeTip from '../_components/UpgradeTip';
import {
	MODAL_TEMPLATE,
	VIEWCONTENT_TEMPLATE,
	BUTTON_ANIMATION_OPTIONS,
} from './button-utils';
import GetPostsSelect from '../_components/GetPostsSelect';

function Edit(props) {
	const { attributes, setAttributes, className, isSelected, clientId } =
		props;
	const {
		alignment,
		text,
		buttonAction,
		buttonAnimation,
		buttonUrl,
		rel,
		linkTarget,
		productId,
		modalType,
		modalShow,
		modalId,
		modalWidth,
		viewContentId,
		viewContentShow,
		textHoverColor,
		BackgroundHoverColor,
		borderRadius,
		hasborder,
		borderWidth,
		borderColor,
		isPremium,
	} = attributes;
	const isPro = Boolean(blockonsEditorObj.isPremium) || false;
	const wcActive = Boolean(blockonsEditorObj.wcActive) || false;
	const upgradeUrl = blockonsEditorObj.upgradeUrl || '';
	const apiUrl = blockonsEditorObj.apiUrl || '';
	const [isEditingURL, setIsEditingURL] = useState(false);
	const linkButtonRef = useRef();

	// Get the dispatch functions
	const { insertBlocks, replaceInnerBlocks } =
		useDispatch('core/block-editor');

	// Get dispatchers for opening the pattern inserter
	const { setIsInserterOpened } = useDispatch('core/edit-post');
	const { setInserterActiveTab } = useDispatch('core/block-editor');

	// Get inner blocks to check if content exists and check for WooCommerce parent blocks and query blocks
	const {
		innerBlocks,
		hasInnerBlocks,
		isInWooCommerceCollection,
		isInQueryBlock,
	} = useSelect(
		(select) => {
			const { getBlocks, getBlockOrder, getBlockParents, getBlock } =
				select('core/block-editor');
			const blocks = getBlocks(clientId);

			// Get all parent block IDs
			const parentIds = getBlockParents(clientId);

			// WooCommerce collection blocks that support quick view
			const wcCollectionBlocks = [
				'woocommerce/product-collection',
				'woocommerce/handpicked-products',
				'woocommerce/product-best-sellers',
				'woocommerce/product-category',
				'woocommerce/product-new',
				'woocommerce/product-on-sale',
				'woocommerce/product-tag',
				'woocommerce/product-top-rated',
				'woocommerce/products',
			];

			// Check if any parent block is a WooCommerce collection block
			const isInWCCollection = parentIds.some((parentId) => {
				const parentBlock = getBlock(parentId);
				return (
					parentBlock && wcCollectionBlocks.includes(parentBlock.name)
				);
			});

			// Check if any parent block is a query block
			const isInQuery = parentIds.some((parentId) => {
				const parentBlock = getBlock(parentId);
				return parentBlock && parentBlock.name === 'core/query';
			});

			return {
				innerBlocks: blocks,
				hasInnerBlocks: getBlockOrder(clientId).length > 0,
				isInWooCommerceCollection: isInWCCollection,
				isInQueryBlock: isInQuery,
			};
		},
		[clientId],
	);

	const blockProps = useBlockProps({
		className: `blockons-adv-button ${buttonAction === 'modal' ? ' blockons-modal-trigger' : ''} ${buttonAction === 'viewcontent' ? ' blockons-viewcontent-trigger' : ''} ${buttonAction === 'quickview' ? ' blockons-quickview-trigger' : ''} ${buttonAnimation !== 'none' ? `animate-${buttonAnimation}` : ''}`,
		style: {
			...(textHoverColor && {
				'--blockons-btn-hover-text-color': textHoverColor,
			}),
			...(BackgroundHoverColor && {
				'--blockons-btn-hover-bg-color': BackgroundHoverColor,
			}),
			...(hasborder &&
				borderRadius && {
					borderRadius: `${borderRadius}px`,
				}),
			...(hasborder &&
				borderWidth && {
					borderWidth: `${borderWidth}px`,
				}),
			...(hasborder &&
				borderColor && {
					borderColor: borderColor,
				}),
		},
		...(buttonAction === 'quickview'
			? {
					'data-product-id': productId || '{{product_id}}',
				}
			: {}),
	});

	useEffect(() => {
		setAttributes({ isPremium: isPro }); // SETS PREMIUM
	}, []);

	// Generate unique modalId on every mount (handles duplication automatically)
	useEffect(() => {
		setAttributes({
			modalId: uuidv4(),
		});
	}, [setAttributes]);

	// Generate unique viewContentId when needed
	useEffect(() => {
		if (buttonAction === 'viewcontent') {
			setAttributes({
				viewContentId: uuidv4(),
			});
		}
	}, [buttonAction, setAttributes]);

	// Auto-set button URL for WooCommerce collections and query blocks
	const { currentPostId, currentPostUrl } = useSelect((select) => {
		const { getCurrentPostId } = select('core/editor');
		const { getEditedPostAttribute } = select('core/editor');

		// In the block editor context, we need to get the current post being edited
		const postId = getCurrentPostId();

		// For WooCommerce products, we'll use the product permalink
		// For query blocks, we'll use the post permalink
		let postUrl = '';
		if (postId) {
			// This will be the URL of the current post/product being edited
			postUrl = getEditedPostAttribute('link') || '';
		}

		return {
			currentPostId: postId,
			currentPostUrl: postUrl,
		};
	}, []);

	// Auto-set URL for WooCommerce collections
	useEffect(() => {
		// Save the WooCommerce collection state as an attribute
		setAttributes({
			inWooCommerceCollection: isInWooCommerceCollection,
		});

		if (
			isInWooCommerceCollection &&
			buttonAction === 'link' &&
			!buttonUrl
		) {
			// In WooCommerce collections, we want to link to the product single page
			// Since we're in the editor context, we'll set a placeholder that will be
			// dynamically replaced on the frontend with the actual product URL
			setAttributes({
				buttonUrl: '{{product_permalink}}',
			});
		}
	}, [isInWooCommerceCollection, buttonAction, buttonUrl, setAttributes]);

	// Auto-set URL for query blocks
	useEffect(() => {
		if (isInQueryBlock && buttonAction === 'link' && !buttonUrl) {
			// In query blocks, we want to link to the post single page
			// Since we're in the editor context, we'll set a placeholder that will be
			// dynamically replaced on the frontend with the actual post URL
			setAttributes({
				buttonUrl: '{{post_permalink}}',
			});
		}
	}, [isInQueryBlock, buttonAction, buttonUrl, setAttributes]);

	// Handle modal type change with confirmation
	const handleModalTypeChange = (value) => {
		// If switching to pattern mode and there are existing inner blocks
		if (value === 'pattern' && hasInnerBlocks) {
			const confirmed = window.confirm(
				__(
					'Switching to Pattern mode will remove all existing modal content. Are you sure you want to continue?',
					'blockons',
				),
			);

			if (confirmed) {
				// Clear all inner blocks
				replaceInnerBlocks(clientId, [], false);
				setAttributes({ modalType: value });
			}
			// If not confirmed, don't change the modalType
		} else {
			// Safe to change without confirmation
			setAttributes({ modalType: value });
		}
	};

	// Open Pattern Inserter to Patterns tab
	const openPatternInserter = () => {
		// Open the inserter sidebar
		setIsInserterOpened(true);

		// Set the active tab to patterns (if supported)
		try {
			setInserterActiveTab('patterns');
		} catch (error) {
			// Fallback - some WordPress versions may not support this
			console.warn('Could not set inserter tab to patterns:', error);
		}
	};

	// Open pattern creation page
	const openPatternCreation = () => {
		const url =
			'/wp-admin/site-editor.php?path=%2Fpatterns&categoryType=wp_block&categoryId=blockons-popup-modals';
		window.open(url, '_blank', 'noopener,noreferrer');
	};

	// Link handling
	const unlink = () => {
		setAttributes({
			buttonUrl: undefined,
			linkTarget: undefined,
			rel: undefined,
		});
		setIsEditingURL(false);
	};

	const onToggleOpenInNewTab = (value) => {
		const newLinkTarget = value ? '_blank' : undefined;

		let updatedRel = rel
			? rel.split(' ').filter((r) => r !== 'nofollow' && r !== 'noopener')
			: [];

		// Maintain nofollow if it was present
		if (rel?.includes('nofollow')) {
			updatedRel.unshift('nofollow');
		}

		// Add noopener if opening in new tab
		if (newLinkTarget) {
			updatedRel.push('noopener');
		}

		setAttributes({
			linkTarget: newLinkTarget,
			rel: updatedRel.length ? updatedRel.join(' ') : undefined,
		});
	};

	const onToggleNoFollow = (value) => {
		let updatedRel = rel
			? rel.split(' ').filter((r) => r !== 'nofollow' && r !== 'noopener')
			: [];

		// Add nofollow first if enabled
		if (value) {
			updatedRel.unshift('nofollow');
		}

		// Add noopener if opening in new tab
		if (linkTarget === '_blank') {
			updatedRel.push('noopener');
		}

		setAttributes({
			rel: updatedRel.length ? updatedRel.join(' ') : undefined,
		});
	};

	return (
		<div className="blockons-adv-button-block-wrapper">
			<div
				className={`blockons-adv-button-block align-${alignment} type-${buttonAction}`}
			>
				{isSelected && (
					<>
						<InspectorControls>
							<PanelBody
								title={__(
									'Advanced Button Settings',
									'blockons',
								)}
							>
								<SelectControl
									label={__('Button Animation', 'blockons')}
									value={buttonAnimation}
									options={BUTTON_ANIMATION_OPTIONS}
									onChange={(value) =>
										setAttributes({
											buttonAnimation: value,
										})
									}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>

								<div className="blockons-divider"></div>

								<SelectControl
									label={__('Button Action', 'blockons')}
									value={buttonAction}
									options={[
										{
											label: __(
												'Simple Link',
												'blockons',
											),
											value: 'link',
										},
										{
											label: isPremium
												? __(
														'Click to View Content',
														'blockons',
													)
												: __(
														'Click to View Content (Pro)',
														'blockons',
													),
											value: 'viewcontent',
											disabled:
												isInQueryBlock ||
												isInWooCommerceCollection,
										},
										{
											label: isPremium
												? __(
														'Open Popup Modal',
														'blockons',
													)
												: __(
														'Open Popup Modal (Pro)',
														'blockons',
													),
											value: 'modal',
											disabled:
												isInQueryBlock ||
												isInWooCommerceCollection,
										},
										{
											label: isPremium
												? __(
														'Product Quick View',
														'blockons',
													)
												: __(
														'Product Quick View (Pro)',
														'blockons',
													),
											value: 'quickview',
											disabled:
												!wcActive || isInQueryBlock,
										},
									]}
									onChange={(value) =>
										setAttributes({ buttonAction: value })
									}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
									help={
										buttonAction === 'modal'
											? __(
													'Build your popup modal content using InnerBlocks or insert from WordPress Patterns.',
													'blockons',
												)
											: buttonAction === 'quickview'
												? __(
														'Open a product quick view modal when the button is clicked. This option is only available when the button is placed inside WooCommerce product collection blocks.',
														'blockons',
													)
												: buttonAction === 'viewcontent'
													? __(
															'Build content with InnerBlocks and only display it when the button is clicked.',
															'blockons',
														)
													: buttonAction === 'link'
														? __(
																'Open a link when the button is clicked.',
																'blockons',
															)
														: ''
									}
								/>

								{buttonAction === 'quickview' &&
									!isInWooCommerceCollection && (
										<>
											{isPremium &&
												!isInWooCommerceCollection && (
													<>
														<div className="blockons-divider"></div>

														<GetPostsSelect
															label={__(
																'Select Post',
																'blockons',
															)}
															value={productId}
															onChange={(
																newValue,
															) =>
																setAttributes({
																	productId:
																		parseInt(
																			newValue,
																		),
																})
															}
															siteurl={apiUrl}
														/>
													</>
												)}

											<UpgradeTip
												text={__(
													'This feature is only available in Blockons Pro.',
													'blockons',
												)}
												upgradeUrl={upgradeUrl}
												newTab
											/>
											<UpgradeTip
												text={__(
													'Also Place this button inside a WooCommerce product collection blocks to enable the Product Quick View option.',
													'blockons',
												)}
											/>
										</>
									)}

								{!isPremium && buttonAction === 'link' && (
									<UpgradeTip
										text={__(
											'Blockons Pro offers more button actions and features such as building Modal Popups, displaying new content when the button is clicked, and also adding Product Quick View to your WooCommerce Products.',
											'blockons',
										)}
										upgradeUrl={upgradeUrl}
										newTab
									/>
								)}

								{isPremium &&
									buttonAction === 'viewcontent' && (
										<>
											<div className="blockons-divider"></div>

											<ToggleControl
												label={__(
													'Show Content when Selected',
													'blockons',
												)}
												checked={viewContentShow}
												onChange={(value) =>
													setAttributes({
														viewContentShow: value,
													})
												}
												__nextHasNoMarginBottom={true}
												help={__(
													'Toggle to show/hide the expandable content in the editor.',
													'blockons',
												)}
											/>
										</>
									)}

								{(buttonAction === 'modal' ||
									buttonAction === 'viewcontent') && (
									<>
										{isPremium ? (
											<>
												<div className="blockons-divider"></div>

												<SelectControl
													label={__(
														'Modal Content Type',
														'blockons',
													)}
													value={modalType}
													options={[
														{
															label: __(
																'Build with InnerBlocks',
																'blockons',
															),
															value: 'innerblocks',
														},
														{
															label: __(
																'Insert WordPress Pattern',
																'blockons',
															),
															value: 'pattern',
														},
													]}
													onChange={
														handleModalTypeChange
													}
													__next40pxDefaultSize={true}
													__nextHasNoMarginBottom={
														true
													}
													help={
														modalType === 'pattern'
															? __(
																	'Use the Pattern Inserter to drag patterns into your modal content area.',
																	'blockons',
																)
															: __(
																	'Build your modal content using blocks directly.',
																	'blockons',
																)
													}
												/>

												{modalType === 'pattern' && (
													<>
														<div className="blockons-divider"></div>

														<div
															style={{
																display: 'flex',
																alignItems:
																	'center',
																gap: '12px',
																marginBottom:
																	'8px',
															}}
														>
															<Button
																variant="secondary"
																onClick={
																	openPatternInserter
																}
																style={{
																	flex: 1,
																}}
															>
																{__(
																	'Browse Patterns',
																	'blockons',
																)}
															</Button>
															<Button
																variant="link"
																onClick={
																	openPatternCreation
																}
																style={{
																	fontSize:
																		'12px',
																	textDecoration:
																		'none',
																	whiteSpace:
																		'nowrap',
																}}
															>
																{__(
																	'Create New →',
																	'blockons',
																)}
															</Button>
														</div>

														<p
															style={{
																marginTop: '0',
																fontSize:
																	'12px',
																color: '#757575',
															}}
														>
															{__(
																'Simply drag a pattern into the modal content area.',
																'blockons',
															)}
														</p>
													</>
												)}

												<div className="blockons-divider"></div>

												<ToggleControl
													label={__(
														'Show Modal when Selected',
														'blockons',
													)}
													checked={modalShow}
													onChange={(value) =>
														setAttributes({
															modalShow: value,
														})
													}
													__nextHasNoMarginBottom={
														true
													}
												/>

												<div className="blockons-divider"></div>

												<UnitControl
													label={__(
														'Modal Width',
														'blockons',
													)}
													value={modalWidth}
													onChange={(newValue) =>
														setAttributes({
															modalWidth:
																newValue,
														})
													}
													units={[
														{
															value: 'px',
															label: 'px',
															default: 780,
														},
														{
															value: '%',
															label: '%',
															default: 80,
														},
													]}
													isResetValueOnUnitChange
													__next40pxDefaultSize={true}
												/>
											</>
										) : (
											<UpgradeTip
												text={__(
													'This feature is only available in Blockons Pro.',
													'blockons',
												)}
												upgradeUrl={upgradeUrl}
												newTab
											/>
										)}
									</>
								)}
							</PanelBody>
						</InspectorControls>

						<InspectorControls group="color">
							<ColorSelector
								label={__('Text Hover Color', 'blockons')}
								value={textHoverColor}
								onChange={(colorValue) => {
									setAttributes({
										textHoverColor: colorValue,
									});
								}}
							/>
							<ColorSelector
								label={__('Background Hover Color', 'blockons')}
								value={BackgroundHoverColor}
								onChange={(colorValue) => {
									setAttributes({
										BackgroundHoverColor: colorValue,
									});
								}}
								nomargin
							/>
						</InspectorControls>

						<InspectorControls group="dimensions">
							<RangeControl
								label={__('Button Border Radius', 'blockons')}
								value={borderRadius}
								onChange={(newValue) =>
									setAttributes({ borderRadius: newValue })
								}
								className="blockons-set-full"
								min={0}
								max={120}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>

							<ToggleControl
								label={__('Add Border', 'blockons')}
								checked={hasborder}
								onChange={(val) =>
									setAttributes({ hasborder: val })
								}
								__nextHasNoMarginBottom={true}
							/>

							{hasborder && (
								<>
									<RangeControl
										label={__('Border Width', 'blockons')}
										value={borderWidth}
										onChange={(val) =>
											setAttributes({ borderWidth: val })
										}
										min={1}
										max={20}
										className="blockons-set-full"
										__next40pxDefaultSize={true}
										__nextHasNoMarginBottom={true}
									/>
									<ColorSelector
										label={__('Border Color', 'blockons')}
										value={borderColor}
										onChange={(colorValue) => {
											setAttributes({
												borderColor: colorValue,
											});
										}}
										nomargin
									/>
								</>
							)}
						</InspectorControls>

						<BlockControls>
							<ToolbarGroup>
								<ToolbarButton
									icon="align-left"
									title={__('Align left', 'blockons')}
									isActive={alignment === 'left'}
									onClick={() =>
										setAttributes({ alignment: 'left' })
									}
								/>
								<ToolbarButton
									icon="align-center"
									title={__('Align center', 'blockons')}
									isActive={alignment === 'center'}
									onClick={() =>
										setAttributes({ alignment: 'center' })
									}
								/>
								<ToolbarButton
									icon="align-right"
									title={__('Align right', 'blockons')}
									isActive={alignment === 'right'}
									onClick={() =>
										setAttributes({ alignment: 'right' })
									}
								/>
							</ToolbarGroup>

							{buttonAction === 'link' && (
								<ToolbarGroup>
									<ToolbarButton
										ref={linkButtonRef}
										icon="admin-links"
										title={__('Link', 'blockons')}
										onClick={() => setIsEditingURL(true)}
										isActive={!!buttonUrl}
									/>
								</ToolbarGroup>
							)}

							{isEditingURL && (
								<Popover
									anchor={linkButtonRef.current}
									className={`blockons-adv-btn-link-popover ${
										buttonUrl === '{{product_permalink}}' ||
										buttonUrl === '{{post_permalink}}'
											? 'hide-url-input'
											: ''
									}`}
									position="bottom center"
									onClose={() => setIsEditingURL(false)}
								>
									{(isInWooCommerceCollection ||
										isInQueryBlock) &&
										(buttonUrl ===
											'{{product_permalink}}' ||
											buttonUrl ===
												'{{post_permalink}}') && (
											<div
												style={{
													padding: '8px 12px',
													fontSize: '12px',
													color: '#757575',
													borderBottom:
														'1px solid #e0e0e0',
												}}
											>
												{(isInWooCommerceCollection ||
													isInQueryBlock) &&
													(buttonUrl ===
														'{{product_permalink}}' ||
														buttonUrl ===
															'{{post_permalink}}') && (
														<>
															{__(
																'🔗 Auto-linking to post page',
																'blockons',
															)}
															<br />
															<span
																style={{
																	fontSize:
																		'11px',
																	fontStyle:
																		'italic',
																}}
															>
																{__(
																	'This will automatically link to the post page in the collection.',
																	'blockons',
																)}
															</span>
														</>
													)}
											</div>
										)}
									<LinkControl
										className="wp-block-navigation-link__inline-link-input"
										value={{
											url:
												buttonUrl ===
													'{{product_permalink}}' ||
												buttonUrl ===
													'{{post_permalink}}'
													? ''
													: buttonUrl,
											opensInNewTab:
												linkTarget === '_blank',
											noFollow:
												rel?.includes('nofollow') ||
												false,
										}}
										onChange={({
											url: newUrl = '',
											opensInNewTab,
											noFollow,
										}) => {
											setAttributes({
												buttonUrl: newUrl,
											});
											onToggleOpenInNewTab(opensInNewTab);
											onToggleNoFollow(noFollow);
										}}
										onRemove={() => {
											// When removing, reset to auto URL if applicable
											if (isInWooCommerceCollection) {
												setAttributes({
													buttonUrl:
														'{{product_permalink}}',
												});
											} else if (isInQueryBlock) {
												setAttributes({
													buttonUrl:
														'{{post_permalink}}',
												});
											} else {
												unlink();
											}
											setIsEditingURL(false);
										}}
										forceIsEditingLink={isEditingURL}
										settings={[
											{
												id: 'opensInNewTab',
												title: __(
													'Open in new tab',
													'blockons',
												),
											},
											{
												id: 'noFollow',
												title: __(
													'Mark as nofollow',
													'blockons',
												),
											},
										]}
									/>
								</Popover>
							)}
						</BlockControls>
					</>
				)}

				<div
					{...blockProps}
					style={{ position: 'relative', ...blockProps.style }}
				>
					<RichText
						tagName={'div'}
						className={`blockons-adv-btn`}
						role="textbox"
						aria-multiline="true"
						aria-label={__('Button text', 'blockons')}
						placeholder={__('Add text…', 'blockons')}
						value={text}
						onChange={(value) => setAttributes({ text: value })}
						allowedFormats={minimalRichText}
						{...(isPremium && buttonAction === 'modal'
							? {
									'data-modal-id': modalId,
								}
							: {})}
						{...(isPremium && buttonAction === 'viewcontent'
							? {
									'data-viewcontent-id': viewContentId,
								}
							: {})}
					/>
				</div>
			</div>

			{isPremium && buttonAction === 'modal' && (
				<div
					id={modalId}
					className={`blockons-modal blockons-modal-innerblocks ${!modalShow ? 'blockons-modal-hidden' : ''}`}
				>
					<div
						className="blockons-modal-inner"
						style={{
							maxWidth: modalWidth,
						}}
					>
						<InnerBlocks
							template={
								modalType === 'innerblocks'
									? MODAL_TEMPLATE
									: []
							}
						/>
					</div>
				</div>
			)}

			{isPremium && buttonAction === 'viewcontent' && (
				<div
					id={viewContentId}
					className={`blockons-viewcontent ${!viewContentShow ? 'blockons-viewcontent-hidden' : ''}`}
				>
					<div
						className="blockons-viewcontent-inner"
						style={{
							maxWidth: modalWidth,
						}}
					>
						<InnerBlocks template={VIEWCONTENT_TEMPLATE} />
					</div>
				</div>
			)}
		</div>
	);
}

export default Edit;
