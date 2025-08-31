import { __, sprintf } from '@wordpress/i18n';
import {
	InspectorControls,
	BlockControls,
	useBlockProps,
	LinkControl,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	Spinner,
	SelectControl,
	RangeControl,
	ToggleControl,
	FontSizePicker,
	ToolbarButton,
	Popover,
	ToolbarGroup,
	Button,
} from '@wordpress/components';
import { useState, useMemo, useEffect, useRef } from '@wordpress/element';
import BlockonsColorPicker from '../_components/BlockonsColorpicker';
import { getIconList, ICON_CATEGORIES, sortIcons } from './icons';

// Add SVG fetching function
const fetchSvg = async (url) => {
	try {
		const response = await fetch(url);
		const text = await response.text();
		// Basic check if it's an SVG
		if (text.includes('<svg')) {
			// Process SVG to use currentColor
			let processedSvg = text
				// Add currentColor to the SVG tag if it doesn't have fill/stroke
				.replace(/<svg(.*?)>/, (match, group) => {
					if (
						!group.includes('fill=') &&
						!group.includes('stroke=')
					) {
						return `<svg${group} fill="currentColor" stroke="currentColor">`;
					}
					return match;
				})
				// Replace any specific colors with currentColor
				.replace(/fill="(?!none)[^"]+"/g, 'fill="currentColor"')
				.replace(/stroke="(?!none)[^"]+"/g, 'stroke="currentColor"')
				// Replace any hex colors
				.replace(/fill:#[0-9a-fA-F]{3,6}/g, 'fill:currentColor')
				.replace(/stroke:#[0-9a-fA-F]{3,6}/g, 'stroke:currentColor')
				// Replace rgb/rgba colors
				.replace(/fill:rgb\([^)]+\)/g, 'fill:currentColor')
				.replace(/stroke:rgb\([^)]+\)/g, 'stroke:currentColor')
				.replace(/fill:rgba\([^)]+\)/g, 'fill:currentColor')
				.replace(/stroke:rgba\([^)]+\)/g, 'stroke:currentColor');

			return processedSvg;
		}
		return null;
	} catch (error) {
		console.error('Error fetching SVG:', error);
		return null;
	}
};

// IconPicker component optimized with memo
const IconPicker = React.memo(
	({
		value,
		onChange,
		selectedPrefix,
		onPrefixChange,
		searchTerm,
		onSearchChange,
	}) => {
		const [isFiltering, setIsFiltering] = useState(false);
		const [isIconsLoading, setIsIconsLoading] = useState(true);

		// Get icons list using useMemo to cache the filtered results
		const filtered = useMemo(() => {
			setIsFiltering(true);
			const searchText = searchTerm.toLowerCase();

			// Filter icons that match the search term
			let results = getIconList().filter((icon) => {
				// If searchText matches a category, use its filter
				const matchingCategory = Object.entries(ICON_CATEGORIES).find(
					([key, category]) => key.toLowerCase() === searchText,
				);

				if (matchingCategory) {
					return matchingCategory[1].filter(icon);
				}

				// Otherwise do regular text search
				const name = icon.name.toLowerCase();
				return name.includes(searchText);
			});

			// Move selected icon to the front if it exists
			if (value) {
				const selectedIconIndex = results.findIndex(
					(icon) => icon.name === value,
				);
				if (selectedIconIndex > -1) {
					const selectedIcon = results.splice(
						selectedIconIndex,
						1,
					)[0];
					results.unshift(selectedIcon);
				}
			}

			setIsFiltering(false);
			return results;
		}, [searchTerm, value]);

		// Effect to handle initial loading of icons
		useEffect(() => {
			setIsIconsLoading(true);
			const frame = requestAnimationFrame(() => {
				setTimeout(() => {
					setIsIconsLoading(false);
				}, 100);
			});
			return () => cancelAnimationFrame(frame);
		}, []);

		return (
			<div className="fa-picker-sidebar">
				<TextControl
					placeholder={__('Search icons...', 'blockons')}
					value={searchTerm}
					onChange={onSearchChange}
					autoComplete="off"
				/>
				<div className="fa-picker-categories">
					{Object.entries(ICON_CATEGORIES).map(([key, category]) => (
						<button
							key={key}
							className={`components-button is-small ${searchTerm.toLowerCase() === key ? 'is-primary' : ''}`}
							onClick={() => {
								// If already selected, clear the filter
								if (searchTerm.toLowerCase() === key) {
									onSearchChange('');
								} else {
									onSearchChange(key);
								}
							}}
						>
							{category.label}
						</button>
					))}
				</div>
				<div className="fa-picker-status">
					{isFiltering || isIconsLoading ? (
						<Spinner />
					) : (
						<p>
							{sprintf(
								__('Showing %d icons', 'blockons'),
								filtered.length,
							)}
						</p>
					)}
				</div>
				{!isIconsLoading ? (
					<div className="fa-grid">
						{filtered.map((icon) => (
							<button
								key={`${icon.prefix}-${icon.name}`}
								className={`fa-btn ${value === icon.name ? 'is-selected' : ''}`}
								onClick={() => {
									onChange(icon.name);
									onPrefixChange(icon.prefix);
								}}
								title={icon.name}
							>
								<i
									className={`${icon.prefix} fa-${icon.name}`}
								/>
							</button>
						))}
					</div>
				) : (
					<div className="fa-grid-loading">
						<Spinner />
						<p>{__('Loading icons...', 'blockons')}</p>
					</div>
				)}
				{!isIconsLoading && filtered.length === 0 && (
					<p className="fa-picker-hint">
						{__('No icons found matching your search', 'blockons')}
					</p>
				)}
			</div>
		);
	},
);

const Edit = ({ attributes, setAttributes, isSelected }) => {
	const {
		alignment,
		iconLibrary,
		icon,
		customIconUrl,
		iconSize,
		prefix,
		searchTerm,
		url,
		linkTarget,
		rel,
		iconBorder,
		borderWidth,
		borderColor,
		borderRadius,
	} = attributes;

	const adminUrl = blockonsEditorObj?.adminUrl;
	const isTskActive = blockonsEditorObj?.isTskActive || false;
	const allowedMimeTypes = [
		'image/jpeg',
		'image/png',
		...(isTskActive ? ['image/svg+xml'] : []),
	];
	const allowedFileTypes = isTskActive
		? __('Upload JPG, PNG, or SVG files.', 'blockons')
		: __(
				'Only JPG or PNG files are allowed. Please activate the Theme Site Kit plugin to upload SVG files.',
				'blockons',
			);

	const [isEditingURL, setIsEditingURL] = useState(false);
	const linkButtonRef = useRef();
	const [svgContent, setSvgContent] = useState(null);

	// Add effect to fetch SVG content when customIconUrl changes
	useEffect(() => {
		if (customIconUrl?.endsWith('.svg')) {
			fetchSvg(customIconUrl).then((content) => {
				setSvgContent(content);
			});
		} else {
			setSvgContent(null);
		}
	}, [customIconUrl]);

	const handleSearchChange = (value) => {
		setAttributes({ searchTerm: value });
	};

	// Link handling
	const unlink = () => {
		setAttributes({
			url: undefined,
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

	const handleMediaSelect = (media) => {
		if (!media.type || !allowedMimeTypes.includes(media.mime)) {
			alert(
				sprintf(
					__('Invalid file type. %s', 'blockons'),
					allowedFileTypes,
				),
			);
			return;
		}
		setAttributes({ customIconUrl: media.url });
	};

	return (
		<div className={`blockons-icon-selector align-${alignment}`}>
			<InspectorControls>
				<PanelBody title={__('Select Icon', 'blockons')} initialOpen>
					<SelectControl
						label={__('Icon Library', 'blockons')}
						value={iconLibrary}
						options={[
							{
								label: __('Font Awesome (FREE)', 'blockons'),
								value: 'fontawesome',
							},
							{
								label: __('Custom Icon', 'blockons'),
								value: 'custom',
							},
						]}
						onChange={(val) => {
							setAttributes({
								iconLibrary: val,
								// Reset custom icon when switching back to fontawesome
								...(val === 'fontawesome' && {
									customIconUrl: '',
								}),
							});
						}}
					/>

					<div className="blockons-divider"></div>

					{iconLibrary === 'fontawesome' && (
						<>
							<IconPicker
								value={icon}
								onChange={(val) => {
									setAttributes({
										icon: val,
									});
								}}
								selectedPrefix={prefix}
								onPrefixChange={(val) => {
									setAttributes({
										prefix: val,
									});
								}}
								searchTerm={searchTerm}
								onSearchChange={handleSearchChange}
							/>
						</>
					)}

					{iconLibrary === 'custom' && (
						<>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={handleMediaSelect}
									allowedTypes={['image']}
									render={({ open }) => (
										<div>
											{customIconUrl ? (
												<div className="blockons-custom-icon">
													{customIconUrl.endsWith(
														'.svg',
													) && svgContent ? (
														<div
															className="blockons-sidebar-icon"
															dangerouslySetInnerHTML={{
																__html: svgContent,
															}}
														/>
													) : (
														<div className="blockons-sidebar-icon">
															<img
																src={
																	customIconUrl
																}
															/>
														</div>
													)}
													<div className="blockons-sidebar-btns">
														<Button
															onClick={open}
															variant="secondary"
														>
															{__(
																'Replace Image',
																'blockons',
															)}
														</Button>
														<Button
															onClick={() =>
																setAttributes({
																	customIconUrl:
																		'',
																})
															}
															variant="secondary"
															isDestructive
														>
															{__(
																'Remove',
																'blockons',
															)}
														</Button>
													</div>
												</div>
											) : (
												<Button
													onClick={open}
													variant="secondary"
													className="blockons-upload-icon-button"
												>
													{__(
														'Upload Image',
														'blockons',
													)}
												</Button>
											)}
										</div>
									)}
								/>
							</MediaUploadCheck>
							<p className="components-base-control__help">
								{allowedFileTypes}

								{!isTskActive && (
									<Button
										variant="secondary"
										onClick={() =>
											window.open(`${adminUrl}/plugin-install.php?s=%2522theme%2520site%2520kit%2522&tab=search&type=term`, '_blank')
										}
									>
										{__(
											'Get Theme Site Kit',
											'blockons',
										)}
									</Button>
								)}

								{isTskActive && (
									<span className="blockons-svg-support">
										{' '}
										<span className="dashicons dashicons-yes-alt"></span>
										{__(
											'SVG support enabled Thanks to the Theme Site Kit plugin',
											'blockons',
										)}
									</span>
								)}
							</p>
						</>
					)}
				</PanelBody>

				{((iconLibrary === 'fontawesome' && icon) ||
					(iconLibrary === 'custom' && customIconUrl)) && (
					<PanelBody
						title={__('Icon Settings', 'blockons')}
						initialOpen={false}
					>
						<FontSizePicker
							__next40pxDefaultSize
							fontSizes={[
								{
									name: __('S'),
									slug: 'small',
									size: 48,
								},
								{
									name: __('M'),
									slug: 'medium',
									size: 88,
								},
								{
									name: __('L'),
									slug: 'large',
									size: 120,
								},
								{
									name: __('XL'),
									slug: 'xlarge',
									size: 200,
								},
							]}
							value={iconSize}
							fallbackFontSize={88}
							onChange={(val) => setAttributes({ iconSize: val })}
						/>
						<div className="blockons-divider"></div>

						<RangeControl
							label={__('Border Radius', 'blockons')}
							value={borderRadius}
							onChange={(val) =>
								setAttributes({
									borderRadius: parseInt(val),
								})
							}
							min={0}
							max={200}
						/>

						<div className="blockons-divider"></div>

						<ToggleControl
							label={__('Add Border', 'blockons')}
							checked={iconBorder}
							onChange={(val) =>
								setAttributes({ iconBorder: val })
							}
						/>
						{iconBorder && (
							<>
								<RangeControl
									label={__('Border Width', 'blockons')}
									value={borderWidth}
									onChange={(val) =>
										setAttributes({
											borderWidth: parseInt(val),
										})
									}
									min={1}
									max={20}
								/>
								<BlockonsColorPicker
									label={__('Border Color', 'blockons')}
									value={borderColor}
									onChange={(val) =>
										setAttributes({ borderColor: val })
									}
								/>
							</>
						)}
					</PanelBody>
				)}
			</InspectorControls>

			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon="align-left"
						title={__('Align left', 'blockons')}
						isActive={alignment === 'left'}
						onClick={() => setAttributes({ alignment: 'left' })}
					/>
					<ToolbarButton
						icon="align-center"
						title={__('Align center', 'blockons')}
						isActive={alignment === 'center'}
						onClick={() => setAttributes({ alignment: 'center' })}
					/>
					<ToolbarButton
						icon="align-right"
						title={__('Align right', 'blockons')}
						isActive={alignment === 'right'}
						onClick={() => setAttributes({ alignment: 'right' })}
					/>
				</ToolbarGroup>

				<ToolbarButton
					ref={linkButtonRef}
					icon="admin-links"
					title={__('Link', 'blockons')}
					onClick={() => setIsEditingURL(true)}
					isActive={!!url}
				/>

				{isSelected && isEditingURL && (
					<Popover
						anchor={linkButtonRef.current}
						position="bottom center"
						onClose={() => setIsEditingURL(false)}
					>
						<LinkControl
							className="wp-block-navigation-link__inline-link-input"
							value={{
								url,
								opensInNewTab: linkTarget === '_blank',
								noFollow: rel?.includes('nofollow') || false,
							}}
							onChange={({
								url: newURL = '',
								opensInNewTab,
								noFollow,
							}) => {
								setAttributes({ url: newURL });
								onToggleOpenInNewTab(opensInNewTab);
								onToggleNoFollow(noFollow);
							}}
							onRemove={() => {
								unlink();
								setIsEditingURL(false);
							}}
							forceIsEditingLink={isEditingURL}
							settings={[
								{
									id: 'opensInNewTab',
									title: __('Open in new tab', 'blockons'),
								},
								{
									id: 'noFollow',
									title: __('Mark as nofollow', 'blockons'),
								},
							]}
						/>
					</Popover>
				)}
			</BlockControls>

			<div
				{...useBlockProps({
					className: `blockons-icon-wrap`,
					style: {
						...(iconLibrary === 'fontawesome' &&
							icon && {
								width: iconSize ? `${iconSize}px` : '88px',
								height: iconSize ? `${iconSize}px` : '88px',
								fontSize: iconSize ? `${iconSize}px` : '88px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								aspectRatio: '1/1',
							}),
						borderRadius: borderRadius || '0',
						border: iconBorder
							? `${borderWidth}px solid ${borderColor}`
							: 'none',
						...(iconLibrary === 'custom' && {
							width: iconSize ? `${iconSize}px` : '88px',
							height: iconSize ? `${iconSize}px` : '88px',
							fontSize: iconSize ? `${iconSize}px` : '88px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							aspectRatio: '1/1',
						}),
					},
				})}
			>
				{iconLibrary === 'fontawesome' ? (
					<i
						className={`${prefix} fa-${icon} blockons-icon`}
						style={{
							lineHeight: 1,
							width: '100%',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '100%',
						}}
					/>
				) : (
					<>
						{customIconUrl ? (
							customIconUrl.endsWith('.svg') && svgContent ? (
								<div
									className="blockons-icon-svg"
									style={{
										width: '100%',
										height: '100%',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										aspectRatio: '1/1',
										color: 'currentColor',
									}}
									dangerouslySetInnerHTML={{
										__html: svgContent,
									}}
								/>
							) : (
								<img
									src={customIconUrl}
									alt={__('Custom icon', 'blockons')}
									className="blockons-icon-img"
									style={{
										width: '80%',
										height: '80%',
										objectFit: 'contain',
										aspectRatio: '1/1',
									}}
								/>
							)
						) : (
							<>
								{isSelected ? (
									<MediaUploadCheck>
										<MediaUpload
											onSelect={handleMediaSelect}
											allowedTypes={['image']}
											render={({ open }) => (
												<Button
													onClick={open}
													variant="secondary"
													className="blockons-upload-button-icon"
												>
													<i
														className="fas fa-upload"
														style={{
															width: '100%',
															height: '100%',
															display: 'flex',
															alignItems:
																'center',
															justifyContent:
																'center',
														}}
													></i>
												</Button>
											)}
										/>
									</MediaUploadCheck>
								) : (
									<i
										className="fas fa-upload"
										style={{
											lineHeight: 1,
											width: '100%',
											height: '100%',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: '100%',
										}}
									></i>
								)}
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default Edit;
