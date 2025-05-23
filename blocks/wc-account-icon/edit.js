import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	RichText,
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	CheckboxControl,
	TextControl,
	RangeControl,
} from '@wordpress/components';
import BlockonsColorpicker from '../_components/BlockonsColorpicker';
import { colorPickerPalette } from '../block-global';

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			alignment,
			accountUrl,
			hasDropdown,
			dropPosition,
			showDashboard,
			showOrders,
			showDownloads,
			showAddresses,
			showAccountDetails,
			showLogout,
			textDashboard,
			textOrders,
			textDownloads,
			textAddresses,
			textAccountDetails,
			textLogout,
			icon,
			iconSize,
			iconPadding,
			customIcon,
			iconBgColor,
			iconColor,
			dropBgColor,
			dropColor,
		},
		setAttributes,
	} = props;

	const [showDropDown, setShowDropDown] = useState(false);

	const blockProps = useBlockProps({
		className: `align-${alignment}`,
	});

	useEffect(() => {
		if (!accountUrl && wcAccObj) {
			setAttributes({
				accountUrl: wcAccObj.wcAccountUrl,
			});
		}
	}, []);

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? 'left' : newAlignment,
		});
	};
	const onChangeCustomIcon = (value) => {
		setAttributes({ customIcon: value });
	};

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__('WC Account Icon Settings', 'blockons')}
						initialOpen={true}
					>
						<TextControl
							label="Account Page Url"
							value={accountUrl}
							onChange={(newValue) => {
								setAttributes({
									accountUrl:
										newValue === undefined
											? wcAccObj.wcAccountUrl
											: newValue,
								});
							}}
							help={__(
								'Please ensure the account URL is correct, incase the original URL was changed',
								'blockons',
							)}
						/>

						<ToggleControl
							label={__('Add Drop Down Menu', 'blockons')}
							help={__(
								'Add a drop down menu on hover to display account page links.',
								'blockons',
							)}
							checked={hasDropdown}
							onChange={(newValue) =>
								setAttributes({ hasDropdown: newValue })
							}
						/>

						{hasDropdown && (
							<>
								<SelectControl
									label={__('Drop Down Position', 'blockons')}
									value={dropPosition}
									options={[
										{
											label: __(
												'Bottom Right',
												'blockons',
											),
											value: 'bottomright',
										},
										{
											label: __(
												'Bottom Left',
												'blockons',
											),
											value: 'bottomleft',
										},
										{
											label: __('Top Right', 'blockons'),
											value: 'topright',
										},
										{
											label: __('Top Left', 'blockons'),
											value: 'topleft',
										},
									]}
									onChange={(newValue) =>
										setAttributes({
											dropPosition:
												newValue === undefined
													? 'bottomleft'
													: newValue,
										})
									}
								/>

								<ToggleControl // This setting is just for displaying the drop down, value is not saved.
									label={__(
										'Always Show Drop Down',
										'blockons',
									)}
									checked={showDropDown}
									help={__(
										'This will always display the drop down ONLY in the editor',
										'blockons',
									)}
									onChange={() => {
										setShowDropDown((state) => !state);
									}}
								/>
								<CheckboxControl
									label="Dashboard"
									checked={showDashboard}
									onChange={(newValue) =>
										setAttributes({
											showDashboard: newValue,
										})
									}
								/>
								<CheckboxControl
									label="Orders"
									checked={showOrders}
									onChange={(newValue) =>
										setAttributes({ showOrders: newValue })
									}
								/>
								<CheckboxControl
									label="Downloads"
									checked={showDownloads}
									onChange={(newValue) =>
										setAttributes({
											showDownloads: newValue,
										})
									}
								/>
								<CheckboxControl
									label="Addresses"
									checked={showAddresses}
									onChange={(newValue) =>
										setAttributes({
											showAddresses: newValue,
										})
									}
								/>
								<CheckboxControl
									label="Account Details"
									checked={showAccountDetails}
									onChange={(newValue) =>
										setAttributes({
											showAccountDetails: newValue,
										})
									}
								/>
								<CheckboxControl
									label="Logout"
									checked={showLogout}
									onChange={(newValue) =>
										setAttributes({ showLogout: newValue })
									}
								/>
							</>
						)}
					</PanelBody>
					<PanelBody
						title={__('WC Account Icon Design', 'blockons')}
						initialOpen={false}
					>
						<SelectControl
							label={__('Select an Icon', 'blockons')}
							value={icon}
							options={[
								{
									label: __('User Outline', 'blockons'),
									value: 'fa-regular fa-user',
								},
								{
									label: __('User', 'blockons'),
									value: 'fa-solid fa-user',
								},
								{
									label: __('Circle User', 'blockons'),
									value: 'fa-solid fa-circle-user',
								},
								{
									label: __('Person', 'blockons'),
									value: 'fa-solid fa-person',
								},
								{
									label: __('Custom Icon', 'blockons'),
									value: 'custom',
								},
							]}
							onChange={(newIcon) =>
								setAttributes({
									icon:
										newIcon === undefined
											? 'fa-regular fa-user'
											: newIcon,
								})
							}
						/>
						{icon === 'custom' && (
							<>
								<TextControl
									label={__('Icon Name', 'blockons')}
									value={customIcon}
									onChange={onChangeCustomIcon}
									help={__(
										'Add your own custom icon by adding the Font Awesome icon full name',
										'blockons',
									)}
								/>
								<div className="helplink fixmargin">
									<a
										href="https://blockons.com/documentation/adding-a-custom-font-awesome-icon-to-the-block/"
										target="_blank"
									>
										{__('Read More')}
									</a>
								</div>
							</>
						)}

						<RangeControl
							label={__('Icon Size', 'blockons')}
							value={iconSize}
							onChange={(newValue) =>
								setAttributes({
									iconSize:
										newValue === undefined
											? 20
											: parseInt(newValue),
								})
							}
							min={14}
							max={80}
						/>
						<RangeControl
							label={__('Icon Padding', 'blockons')}
							value={iconPadding}
							onChange={(newValue) =>
								setAttributes({
									iconPadding:
										newValue === undefined
											? 20
											: parseInt(newValue),
								})
							}
							min={0}
							max={80}
						/>

						<BlockonsColorpicker
							label={__('Icon Background Color', 'blockons')}
							value={iconBgColor}
							onChange={(colorValue) => {
								setAttributes({
									iconBgColor:
										colorValue === undefined
											? '#FFF'
											: colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						<BlockonsColorpicker
							label={__('Icon Color', 'blockons')}
							value={iconColor}
							onChange={(colorValue) => {
								setAttributes({
									iconColor:
										colorValue === undefined
											? '#000'
											: colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>

						{hasDropdown && (
							<>
								<BlockonsColorpicker
									label={__(
										'Drop Down Background Color',
										'blockons',
									)}
									value={dropBgColor}
									onChange={(colorValue) => {
										setAttributes({
											dropBgColor:
												colorValue === undefined
													? '#FFF'
													: colorValue,
										});
									}}
									paletteColors={colorPickerPalette}
								/>
								<BlockonsColorpicker
									label={__(
										'Drop Down Font Color',
										'blockons',
									)}
									value={dropColor}
									onChange={(colorValue) => {
										setAttributes({
											dropColor:
												colorValue === undefined
													? '#747474'
													: colorValue,
										});
									}}
									paletteColors={colorPickerPalette}
								/>
							</>
						)}
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<AlignmentToolbar
						value={alignment}
						onChange={onChangeAlignment}
					/>
				</BlockControls>
			}
			<div
				className={`blockons-wc-account-icon-block ${
					isSelected && showDropDown ? 'show' : ''
				} ${dropPosition ? dropPosition : 'bottomleft'}`}
			>
				<a
					className={`blockons-wc-account-icon`}
					style={{
						backgroundColor: iconBgColor,
						fontSize: iconSize,
						padding: iconPadding,
					}}
				>
					<span
						className={
							customIcon && icon == 'custom' ? customIcon : icon
						}
						style={{
							color: iconColor,
						}}
					></span>
				</a>
				{hasDropdown && (
					<div
						className="blockons-wc-account-icon-dropdown"
						style={{
							backgroundColor: dropBgColor,
							color: dropColor,
						}}
					>
						{showDashboard && (
							<div className="blockons-wc-account-icon-item">
								<RichText
									tagName="div"
									placeholder={__('Dashboard', 'blockons')}
									value={textDashboard}
									onChange={(newValue) =>
										setAttributes({
											textDashboard:
												newValue === undefined
													? __(
															'Dashboard',
															'blockons',
														)
													: newValue,
										})
									}
								/>
							</div>
						)}
						{showOrders && (
							<div className="blockons-wc-account-icon-item">
								<RichText
									tagName="div"
									placeholder={__('Orders', 'blockons')}
									value={textOrders}
									onChange={(newValue) =>
										setAttributes({
											textOrders:
												newValue === undefined
													? __('Orders', 'blockons')
													: newValue,
										})
									}
								/>
							</div>
						)}
						{showDownloads && (
							<div className="blockons-wc-account-icon-item">
								<RichText
									tagName="div"
									placeholder={__('Downloads', 'blockons')}
									value={textDownloads}
									onChange={(newValue) =>
										setAttributes({
											textDownloads:
												newValue === undefined
													? __(
															'Downloads',
															'blockons',
														)
													: newValue,
										})
									}
								/>
							</div>
						)}
						{showAddresses && (
							<div className="blockons-wc-account-icon-item">
								<RichText
									tagName="div"
									placeholder={__('Addresses', 'blockons')}
									value={textAddresses}
									onChange={(newValue) =>
										setAttributes({
											textAddresses:
												newValue === undefined
													? __(
															'Addresses',
															'blockons',
														)
													: newValue,
										})
									}
								/>
							</div>
						)}
						{showAccountDetails && (
							<div className="blockons-wc-account-icon-item">
								<RichText
									tagName="div"
									placeholder={__(
										'Account Details',
										'blockons',
									)}
									value={textAccountDetails}
									onChange={(newValue) =>
										setAttributes({
											textAccountDetails:
												newValue === undefined
													? __(
															'Account Details',
															'blockons',
														)
													: newValue,
										})
									}
								/>
							</div>
						)}
						{showLogout && (
							<div className="blockons-wc-account-icon-item">
								<RichText
									tagName="div"
									placeholder={__('Logout', 'blockons')}
									value={textLogout}
									onChange={(newValue) =>
										setAttributes({
											textLogout:
												newValue === undefined
													? __('Logout', 'blockons')
													: newValue,
										})
									}
								/>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Edit;
