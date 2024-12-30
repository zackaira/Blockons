const { addFilter } = wp.hooks;
const { useState, useEffect } = wp.element;
const { __ } = wp.i18n;
const {
	registerFormatType,
	unregisterFormatType,
	applyFormat,
	removeFormat,
	getActiveFormat,
} = wp.richText;
const { BlockControls, MediaUpload } = wp.blockEditor;
const {
	ToolbarGroup,
	Dropdown,
	ToolbarButton,
	ToggleControl,
	TextControl,
	TextareaControl,
	SelectControl,
	Button,
	ColorPicker,
	ColorIndicator,
} = wp.components;
const { useSelect, dispatch } = wp.data;
const isPremium = Boolean(blockonsEditorObj.isPremium);
const tooltipDefaults = blockonsEditorObj?.blockonsOptions?.tooltips || {
	enabled: false,
};

const BlockonsInlineBlockTooltip = ({ isActive, onChange, value }) => {
	const selectedBlock = useSelect((select) => {
		return select('core/block-editor').getSelectedBlock();
	}, []);

	// console.log("selectedBlock", selectedBlock);

	const allowedBlocks = [
		'core/paragraph',
		'core/heading',
		'core/list-item',
		'blockons/line-heading',
	];
	if (
		!tooltipDefaults.enabled ||
		!selectedBlock ||
		!allowedBlocks.includes(selectedBlock.name)
	) {
		return null;
	}

	const activeFormat = getActiveFormat(value, 'blockons/inline-tooltip');
	const [selectedTooltip, setSelectedTooltip] = useState({
		style: tooltipDefaults?.style || 'underlined',
		theme: tooltipDefaults?.theme || 'one',
		title: '',
		text: '',
		icon: '',
		image: '',
		color: tooltipDefaults?.color || '#424242',
		fcolor: tooltipDefaults?.fcolor || '#000',
		pcolor: tooltipDefaults?.pcolor || '#424242',
		pfcolor: tooltipDefaults?.pfcolor || '#FFF',
	});

	useEffect(() => {
		if (activeFormat) {
			const attributes =
				Object.keys(activeFormat.attributes).length > 0
					? activeFormat.attributes
					: Object.keys(activeFormat.unregisteredAttributes).length >
						  0
						? activeFormat.unregisteredAttributes
						: '';

			setSelectedTooltip({
				style:
					attributes['data-style'] ||
					tooltipDefaults?.style ||
					'underlined',
				theme:
					attributes['data-theme'] || tooltipDefaults?.theme || 'one',
				title: attributes['data-title'] || '',
				text: attributes['data-text'] || '',
				icon: attributes['data-icon'] || '',
				image: attributes['data-image'] || '',
				color:
					attributes['data-color'] ||
					tooltipDefaults?.color ||
					'#424242',
				fcolor:
					attributes['data-fcolor'] ||
					tooltipDefaults?.fcolor ||
					'#000',
				pcolor:
					attributes['data-pcolor'] ||
					tooltipDefaults?.pcolor ||
					'#424242',
				pfcolor:
					attributes['data-pfcolor'] ||
					tooltipDefaults?.pfcolor ||
					'#FFF',
			});
		} else {
			setSelectedTooltip({
				style: tooltipDefaults?.style || 'underlined',
				theme: tooltipDefaults?.theme || 'one',
				title: '',
				text: '',
				icon: '',
				image: '',
				color: tooltipDefaults?.color || '#424242',
				fcolor: tooltipDefaults?.fcolor || '#000',
				pcolor: tooltipDefaults?.pcolor || '#424242',
				pfcolor: tooltipDefaults?.pfcolor || '#FFF',
			});
		}
	}, [activeFormat]);

	const handleTooltipChange = (property) => (newValue) => {
		setSelectedTooltip((prevState) => ({
			...prevState,
			[property]: newValue,
		}));
	};

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<Dropdown
						className="blockons-tooltip-settings-dropdown"
						contentClassName="blockons-tooltip-settings-popover"
						popoverProps={{ placement: 'bottom-start' }}
						renderToggle={({ isOpen, onToggle }) => (
							<ToolbarButton
								icon={
									<span className="dashicons dashicons-format-status"></span>
								}
								title="Blockons Tooltip"
								onClick={onToggle}
								isActive={isActive}
							/>
						)}
						renderContent={() => (
							<div className="blockons-tooltip-settings">
								<TextControl
									label={__('Tooltip Title', 'blockons')}
									value={selectedTooltip.title}
									onChange={handleTooltipChange('title')}
								/>
								<TextareaControl
									label={__('Tooltip Text', 'blockons')}
									value={selectedTooltip.text}
									onChange={handleTooltipChange('text')}
								/>
								{isPremium && (
									<p className="tooltip-link-hint">
										{__('Add links', 'blockons')}: (Blockons
										[*https://blockons.com/])
									</p>
								)}
								<div className="blockons-divider"></div>

								<div className="blockons-tooltip-extra">
									<div className="blockons-tooltip-color-wrap">
										{!isPremium && (
											<Dropdown
												className="blockons-tooltip-color disabled"
												contentClassName="blockons-tooltip-color-picker"
												renderToggle={({
													isOpen,
													onToggle,
												}) => (
													<ToolbarButton
														icon={
															<span className="dashicons dashicons-admin-appearance"></span>
														}
														title={__(
															'Blockons Tooltip',
															'blockons',
														)}
														onClick={onToggle}
														isActive={isOpen}
														className="btn-disabled"
													/>
												)}
												renderContent={() => (
													<>
														<p>
															{__(
																'Blockons Pro offers advanced Tooltips with more customization options.',
																'blockons',
															)}
														</p>
													</>
												)}
											/>
										)}
										{isPremium && activeFormat && (
											<Dropdown
												className="blockons-tooltip-color"
												contentClassName="blockons-tooltip-color-picker"
												renderToggle={({
													isOpen,
													onToggle,
												}) => (
													<ToolbarButton
														icon={
															<span className="dashicons dashicons-admin-appearance"></span>
														}
														title={__(
															'Blockons Tooltip',
															'blockons',
														)}
														onClick={onToggle}
														isActive={isOpen}
													/>
												)}
												renderContent={() => (
													<>
														<SelectControl
															label={__(
																'Tooltip Link Style',
																'blockons',
															)}
															value={
																selectedTooltip.style
															}
															options={[
																{
																	label: 'Underlined',
																	value: 'underlined',
																},
																{
																	label: 'Underline Dashed',
																	value: 'dashed',
																},
																{
																	label: 'Highlighted',
																	value: 'highlight',
																},
															]}
															onChange={handleTooltipChange(
																'style',
															)}
														/>
														<div className="blockons-tooltip-clrs">
															<Dropdown
																className="blockons-tooltip-color"
																contentClassName="blockons-tooltip-color-picker"
																renderToggle={({
																	isOpen,
																	onToggle,
																}) => (
																	<Button
																		variant="link"
																		onClick={
																			onToggle
																		}
																		className="blockons-colorpicker-btn"
																	>
																		<ColorIndicator
																			colorValue={
																				selectedTooltip.color
																			}
																		/>
																		<span>
																			{__(
																				'Tooltip Link Color',
																				'blockons',
																			)}
																		</span>
																	</Button>
																)}
																renderContent={() => (
																	<>
																		<ColorPicker
																			color={
																				selectedTooltip.color
																			}
																			onChange={handleTooltipChange(
																				'color',
																			)}
																			defaultValue="#f4f4f4"
																		/>
																	</>
																)}
															/>
															{(selectedTooltip.theme !==
																'one' ||
																selectedTooltip.theme !==
																	'two') && (
																<Dropdown
																	className="blockons-tooltip-color"
																	contentClassName="blockons-tooltip-color-picker"
																	renderToggle={({
																		isOpen,
																		onToggle,
																	}) => (
																		<Button
																			variant="link"
																			onClick={
																				onToggle
																			}
																			className="blockons-colorpicker-btn"
																		>
																			<ColorIndicator
																				colorValue={
																					selectedTooltip.fcolor
																				}
																			/>
																			<span>
																				{__(
																					'Font Color',
																					'blockons',
																				)}
																			</span>
																		</Button>
																	)}
																	renderContent={() => (
																		<>
																			<ColorPicker
																				color={
																					selectedTooltip.fcolor
																				}
																				onChange={handleTooltipChange(
																					'fcolor',
																				)}
																				defaultValue="#f4f4f4"
																			/>
																		</>
																	)}
																/>
															)}
														</div>
														<div className="blockons-divider"></div>

														<TextControl
															label={__(
																'Tooltip Icon',
																'blockons',
															)}
															value={
																selectedTooltip.icon
															}
															onChange={handleTooltipChange(
																'icon',
															)}
															help={__(
																'Add the CSS class names of the Font Awesome icon to be displayed in the Tooltip',
																'blockons',
															)}
														/>
														<div className="blockons-divider"></div>

														<SelectControl
															label={__(
																'Tooltip Popup Theme',
																'blockons',
															)}
															value={
																selectedTooltip.theme
															}
															options={[
																{
																	label: 'Dark',
																	value: 'one',
																},
																{
																	label: 'Light',
																	value: 'two',
																},
																{
																	label: 'Custom Color',
																	value: 'custom',
																},
															]}
															onChange={handleTooltipChange(
																'theme',
															)}
														/>
														<div className="blockons-divider"></div>

														{selectedTooltip.theme ===
															'custom' && (
															<>
																<div className="blockons-tooltip-clrs">
																	<Dropdown
																		className="blockons-tooltip-color"
																		contentClassName="blockons-tooltip-color-picker"
																		renderToggle={({
																			isOpen,
																			onToggle,
																		}) => (
																			<Button
																				variant="link"
																				onClick={
																					onToggle
																				}
																				className="blockons-colorpicker-btn"
																			>
																				<ColorIndicator
																					colorValue={
																						selectedTooltip.pcolor
																					}
																				/>
																				<span>
																					{__(
																						'Popup Color',
																						'blockons',
																					)}
																				</span>
																			</Button>
																		)}
																		renderContent={() => (
																			<>
																				<ColorPicker
																					color={
																						selectedTooltip.pcolor
																					}
																					onChange={handleTooltipChange(
																						'pcolor',
																					)}
																					defaultValue="#d6c0ff"
																				/>
																			</>
																		)}
																	/>
																	{(selectedTooltip.theme !==
																		'one' ||
																		selectedTooltip.theme !==
																			'two') && (
																		<Dropdown
																			className="blockons-tooltip-color"
																			contentClassName="blockons-tooltip-color-picker"
																			renderToggle={({
																				isOpen,
																				onToggle,
																			}) => (
																				<Button
																					variant="link"
																					onClick={
																						onToggle
																					}
																					className="blockons-colorpicker-btn"
																				>
																					<ColorIndicator
																						colorValue={
																							selectedTooltip.pfcolor
																						}
																					/>
																					<span>
																						{__(
																							'Popup Font Color',
																							'blockons',
																						)}
																					</span>
																				</Button>
																			)}
																			renderContent={() => (
																				<>
																					<ColorPicker
																						color={
																							selectedTooltip.pfcolor
																						}
																						onChange={handleTooltipChange(
																							'pfcolor',
																						)}
																						defaultValue="#000"
																					/>
																				</>
																			)}
																		/>
																	)}
																</div>
																<div className="blockons-divider"></div>
															</>
														)}

														<MediaUpload
															className="components-icon-button components-toolbar__control"
															allowedTypes={[
																'image',
															]}
															value={
																selectedTooltip.image
															}
															onSelect={(media) =>
																handleTooltipChange(
																	'image',
																)(media.url)
															}
															render={({
																open,
															}) => {
																return selectedTooltip?.image ? (
																	<div className="blockons-tooltip-imgpreview">
																		<div className="blockons-tooltip-imgpreview-img">
																			<img
																				src={
																					selectedTooltip.image
																				}
																			/>
																		</div>
																		<Button
																			className="blockons-tt-upload-button remove"
																			onClick={() => {
																				handleTooltipChange(
																					'image',
																				)(
																					'',
																				);
																			}}
																		>
																			{__(
																				'Remove Image',
																				'blockons',
																			)}
																		</Button>
																	</div>
																) : (
																	<Button
																		className="blockons-tt-upload-button"
																		icon="format-image"
																		onClick={
																			open
																		}
																	>
																		{__(
																			'Add a Tooltip Image',
																			'blockons',
																		)}
																	</Button>
																);
															}}
														/>

														<p className="note-link">
															<a
																href="https://blockons.com/documentation/content-tooltips/#adding-tooltips"
																target="_blank"
															>
																{__(
																	'Read more on adding Tooltips',
																	'blockons',
																)}
															</a>
														</p>
													</>
												)}
											/>
										)}
									</div>

									<div
										className={`blockons-tooltip-preview  ${selectedTooltip.theme}`}
									>
										{isPremium &&
										selectedTooltip.style ===
											'highlight' ? (
											<mark
												className={`blockons-tooltip-style ${selectedTooltip.style}`}
												style={{
													backgroundColor:
														selectedTooltip.color,
													...(selectedTooltip.fcolor
														? {
																color: selectedTooltip.fcolor,
															}
														: {}),
												}}
											>
												Tooltip Preview
											</mark>
										) : (
											<span
												className={`blockons-tooltip-style ${selectedTooltip.style}`}
												{...(isPremium
													? {
															style: {
																...(selectedTooltip.color
																	? {
																			borderBottomColor:
																				selectedTooltip.color,
																		}
																	: {}),
																...(selectedTooltip.fcolor
																	? {
																			color: selectedTooltip.fcolor,
																		}
																	: {}),
															},
														}
													: {})}
											>
												Tooltip Preview
											</span>
										)}
										{isPremium && selectedTooltip.icon && (
											<span
												className={`blockons-icon ${selectedTooltip.icon}`}
												style={{
													color: selectedTooltip.color,
												}}
											></span>
										)}
										<div
											className={`blockons-tooltip-preview-tooltip`}
											{...(isPremium &&
											selectedTooltip.theme === 'custom'
												? {
														style: {
															backgroundColor:
																selectedTooltip.pcolor,
															color: selectedTooltip.pfcolor,
														},
													}
												: {})}
										>
											{isPremium &&
												selectedTooltip.image && (
													<div className="blockons-tooltip-img">
														<div className="blockons-tooltip-img-prvw">
															Image
														</div>
													</div>
												)}
											<h6 className="preview-title">
												Tooltip Title
											</h6>
											<p className="preview-text">
												Some example text.
											</p>

											<span
												className="blockons-tooltip-arrow"
												{...(isPremium &&
												selectedTooltip.theme ===
													'custom'
													? {
															style: {
																borderTopColor:
																	selectedTooltip.pcolor,
															},
														}
													: {})}
											></span>
										</div>
									</div>
								</div>
								<div
									className={`blockons-tooltip-btns ${
										activeFormat ? 'active' : ''
									}`}
								>
									<Button
										variant="secondary"
										className="blockons-tooltip-button"
										onClick={() => {
											onChange(
												applyFormat(value, {
													type: 'blockons/inline-tooltip',
													attributes: {
														'data-style':
															selectedTooltip.style,
														'data-theme':
															selectedTooltip.theme,
														'data-title':
															selectedTooltip.title,
														'data-text':
															selectedTooltip.text,
														'data-icon':
															selectedTooltip.icon,
														'data-image':
															selectedTooltip.image,
														'data-color':
															selectedTooltip.color,
														'data-fcolor':
															selectedTooltip.fcolor,
														'data-pcolor':
															selectedTooltip.pcolor,
														'data-pfcolor':
															selectedTooltip.pfcolor,
													},
												}),
											);
										}}
										disabled={
											!selectedTooltip.title &&
											!selectedTooltip.text
										}
									>
										{activeFormat &&
										(selectedTooltip.title ||
											selectedTooltip.text)
											? __('Update Tooltip', 'blockons')
											: __('Add Tooltip', 'blockons')}
									</Button>
									{activeFormat && (
										<Button
											variant="secondary"
											className="blockons-tooltip-button remove"
											onClick={() => {
												onChange(
													removeFormat(
														value,
														'blockons/inline-tooltip',
													),
												);
											}}
											icon="no-alt"
											title={__(
												'Remove Tooltip',
												'blockons',
											)}
										></Button>
									)}
								</div>
							</div>
						)}
					/>
				</ToolbarGroup>
			</BlockControls>
		</>
	);
};

registerFormatType('blockons/inline-tooltip', {
	title: 'Blockons Tooltip',
	tagName: 'span',
	className: 'blockons-inline-tooltip',
	edit: BlockonsInlineBlockTooltip,
});
