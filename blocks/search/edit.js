/**
 * WordPress dependencies
 */
import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
	RichText,
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from "@wordpress/block-editor";
import {
	PanelBody,
	ToggleControl,
	TextControl,
	SelectControl,
	RangeControl,
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import { colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			alignment,
			baseUrl,
			searchWidthDefault,
			searchWidthDropdown,
			searchWidthPopup,
			searchDisplay,
			textInput,
			textButton,
			iconSize,
			iconPadding,
			iconBgColor,
			iconColor,
			searchAlign,
			searchBgColor,
			searchBtnBgColor,
			searchBtnColor,
			searchPro,
			searchPro_key,
			searchPro_secret,
			searchProTypes,
			searchProCats,
			searchProTags,
			searchProImage,
			searchProDesc,
			searchProPrice,
			searchProMore,
		},
		setAttributes,
	} = props;

	const [showSearch, setShowSearch] = useState(false);
	const isPremium = searchObj.isPremium === "1" ? true : false;
	const [showSearchPreview, setShowSearchPreview] = useState(false);

	const blockProps = useBlockProps({
		className: `align-${alignment} ${
			isSelected && showSearch ? "blockons-show" : ""
		} ${searchDisplay === "default" ? "default-search" : "icon-search"}`,
	});

	const siteInfo = wp.data.select("core").getSite();

	useEffect(() => {
		if (!baseUrl && siteInfo) {
			setAttributes({
				baseUrl: siteInfo.url,
			});
		}
	}, []);

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "left" : newAlignment,
		});
	};
	const onChangeInputText = (value) => {
		setAttributes({ textInput: value });
	};
	const onChangeButtonText = (value) => {
		setAttributes({ textButton: value });
	};

	const closePopup = () => {
		setShowSearch(false);
	};

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Search Settings", "blockons")}
						initialOpen={true}
					>
						<SelectControl
							label={__("Search Display", "blockons")}
							value={searchDisplay}
							options={[
								{ label: __("Default", "blockons"), value: "default" },
								{
									label: __("Icon with Drop Down", "blockons"),
									value: "dropdown",
								},
								{ label: __("Icon with Popup", "blockons"), value: "popup" },
							]}
							onChange={(newDisplay) =>
								setAttributes({
									searchDisplay:
										newDisplay === undefined ? "dropdown" : newDisplay,
								})
							}
						/>

						{searchDisplay === "default" && (
							<UnitControl
								label={__("Search Width", "blockons")}
								value={searchWidthDefault}
								onChange={(value) =>
									setAttributes({
										searchWidthDefault: value,
									})
								}
								units={[
									{ value: "px", label: "px", default: 300 },
									{ value: "%", label: "%", default: 50 },
								]}
								isResetValueOnUnitChange
							/>
						)}

						{searchDisplay === "dropdown" && (
							<TextControl
								label={__("Search Width", "blockons")}
								value={searchWidthDropdown}
								onChange={(value) =>
									setAttributes({
										searchWidthDropdown: value,
									})
								}
								type="number"
							/>
						)}

						{searchDisplay === "popup" && (
							<TextControl
								label={__("Search Width", "blockons")}
								value={searchWidthPopup}
								onChange={(value) =>
									setAttributes({
										searchWidthPopup: value,
									})
								}
								type="number"
							/>
						)}

						{(searchDisplay === "popup" || searchDisplay === "dropdown") && (
							<>
								<div className="blockons-divider"></div>
								<ToggleControl
									label={__("Show Search", "blockons")}
									checked={showSearch}
									help={__(
										"This will always display the search ONLY in the editor",
										"blockons"
									)}
									onChange={() => {
										setShowSearch((state) => !state);
									}}
								/>
							</>
						)}

						{searchDisplay === "dropdown" && (
							<>
								<div className="blockons-divider"></div>
								<SelectControl
									label={__("Align Drop Down Search", "blockons")}
									value={searchAlign}
									options={[
										{
											label: __("Bottom Right", "blockons"),
											value: "bottomright",
										},
										{
											label: __("Bottom Left", "blockons"),
											value: "bottomleft",
										},
										{
											label: __("Bottom Center", "blockons"),
											value: "bottomcenter",
										},
										{ label: __("Top Right", "blockons"), value: "topright" },
										{ label: __("Top Left", "blockons"), value: "topleft" },
										{ label: __("Top Center", "blockons"), value: "topcenter" },
										{ label: __("Left", "blockons"), value: "left" },
										{ label: __("Right", "blockons"), value: "right" },
									]}
									onChange={(value) =>
										setAttributes({
											searchAlign: value === undefined ? "right" : value,
										})
									}
								/>
							</>
						)}
					</PanelBody>
					<PanelBody
						title={__("Search Design", "blockons")}
						initialOpen={false}
					>
						{(searchDisplay === "popup" || searchDisplay === "dropdown") && (
							<>
								<RangeControl
									label={__("Icon Size", "blockons")}
									value={iconSize}
									onChange={(value) =>
										setAttributes({
											iconSize: value === undefined ? 17 : value,
										})
									}
									min={14}
									max={50}
								/>
								<RangeControl
									label={__("Icon Padding", "blockons")}
									value={iconPadding}
									onChange={(value) =>
										setAttributes({
											iconPadding: value === undefined ? 5 : value,
										})
									}
									min={0}
									max={50}
								/>
								<div className="blockons-divider"></div>

								<BlockonsColorpicker
									label={__("Icon Background Color", "blockons")}
									value={iconBgColor}
									onChange={(colorValue) => {
										setAttributes({
											iconBgColor:
												colorValue === undefined ? "#FFF" : colorValue,
										});
									}}
									paletteColors={colorPickerPalette}
								/>

								<BlockonsColorpicker
									label={__("Icon Color", "blockons")}
									value={iconColor}
									onChange={(colorValue) => {
										setAttributes({
											iconColor: colorValue === undefined ? "#000" : colorValue,
										});
									}}
									paletteColors={colorPickerPalette}
								/>
							</>
						)}

						{searchDisplay === "popup" && (
							<BlockonsColorpicker
								label={__("Search Background Color", "blockons")}
								value={searchBgColor}
								onChange={(colorValue) => {
									setAttributes({
										searchBgColor:
											colorValue === undefined ? "#FFF" : colorValue,
									});
								}}
								paletteColors={colorPickerPalette}
							/>
						)}

						<BlockonsColorpicker
							label={__("Button Background Color", "blockons")}
							value={searchBtnBgColor}
							onChange={(colorValue) => {
								setAttributes({
									searchBtnBgColor:
										colorValue === undefined ? "#000" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>

						<BlockonsColorpicker
							label={__("Button Font Color", "blockons")}
							value={searchBtnColor}
							onChange={(colorValue) => {
								setAttributes({
									searchBtnColor:
										colorValue === undefined ? "#FFF" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
					</PanelBody>

					{isPremium && (
						<PanelBody
							title={__("Predictive Search", "blockons")}
							initialOpen={false}
						>
							<ToggleControl
								label={__("Enable Predictive Search", "blockons")}
								checked={searchPro}
								onChange={(newValue) => {
									setAttributes({
										searchPro: newValue,
									});
								}}
							/>

							{searchPro && (
								<>
									<div className="blockons-divider"></div>
									<ToggleControl
										label={__("Show Preview", "blockons")}
										checked={showSearchPreview}
										onChange={() => {
											setShowSearchPreview((state) => !state);
										}}
										help={__(
											"Please check the frontend search for real life testing.",
											"blockons"
										)}
									/>
									<SelectControl
										label={__("Search For:", "blockons")}
										value={searchProTypes}
										options={[
											{ label: __("Posts", "blockons"), value: "post" },
											{ label: __("Pages", "blockons"), value: "page" },
											{ label: __("Products", "blockons"), value: "products" },
										]}
										onChange={(newValue) =>
											setAttributes({
												searchProTypes:
													newValue === undefined ? "['post']" : newValue,
											})
										}
										// multiple={true}
										// className="blockons-multiselect"
									/>

									{
										// searchProTypes.includes("products") && (
										searchProTypes === "products" && (
											<>
												<div className="helplink fixmargin">
													{__(
														"To search Products, we need an API key. Please create an API key and enter the Consumer key and secret below.",
														"blockons"
													)}
													<br />
													<br />
													<a
														href={
															searchObj.adminUrl +
															"/admin.php?page=wc-settings&tab=advanced&section=keys"
														}
														target="_blank"
													>
														{__("Create an API key", "blockons")}
													</a>
												</div>
												<TextControl
													label={__("Consumer Key", "blockons")}
													value={searchPro_key}
													onChange={(value) =>
														setAttributes({
															searchPro_key: value,
														})
													}
													type="string"
												/>
												<TextControl
													label={__("Consumer Key", "blockons")}
													value={searchPro_secret}
													onChange={(value) =>
														setAttributes({
															searchPro_secret: value,
														})
													}
													type="string"
												/>
											</>
										)
									}

									<div className="blockons-divider"></div>
									<ToggleControl
										label={__("Show Categories in Search", "blockons")}
										checked={searchProCats}
										onChange={(newValue) => {
											setAttributes({
												searchProCats: newValue,
											});
										}}
									/>
									<ToggleControl
										label={__("Show Tags in Search", "blockons")}
										checked={searchProTags}
										onChange={(newValue) => {
											setAttributes({
												searchProTags: newValue,
											});
										}}
									/>

									<div className="blockons-divider"></div>
									<ToggleControl
										label={__("Show Image", "blockons")}
										checked={searchProImage}
										onChange={(newValue) => {
											setAttributes({
												searchProImage: newValue,
											});
										}}
									/>
									<ToggleControl
										label={
											searchProTypes === "products"
												? __("Show Product Short Description", "blockons")
												: __("Show Post Excerpt", "blockons")
										}
										checked={searchProDesc}
										onChange={(newValue) => {
											setAttributes({
												searchProDesc: newValue,
											});
										}}
									/>
									{searchProTypes === "products" && (
										<ToggleControl
											label={__("Show Product Price", "blockons")}
											checked={searchProPrice}
											onChange={(newValue) => {
												setAttributes({
													searchProPrice: newValue,
												});
											}}
										/>
									)}

									<div className="blockons-divider"></div>
									<SelectControl
										label={__("See All / More Link", "blockons")}
										value={searchProMore}
										options={[
											{ label: __("See All", "blockons"), value: "all" },
											{ label: __("Load More", "blockons"), value: "more" },
											{ label: __("None", "blockons"), value: "none" },
										]}
										onChange={(newValue) =>
											setAttributes({
												searchProMore:
													newValue === undefined ? "all" : newValue,
											})
										}
									/>
								</>
							)}
						</PanelBody>
					)}
				</InspectorControls>
			)}
			{
				<BlockControls>
					<AlignmentToolbar value={alignment} onChange={onChangeAlignment} />
				</BlockControls>
			}
			<div
				className={`blockons-search-block ${
					searchDisplay === "dropdown" && searchAlign ? searchAlign : ""
				} ${searchDisplay === "default" ? "nopad" : ""} ${
					showSearchPreview ? "search-on" : ""
				}`}
				style={{
					backgroundColor: iconBgColor,
					fontSize: iconSize,
					...(searchDisplay === "dropdown" || searchDisplay === "popup"
						? { padding: iconPadding }
						: ""),
				}}
			>
				{searchDisplay === "default" && (
					<div
						className="blockons-search-default"
						style={{
							width: searchWidthDefault,
						}}
					>
						<div className="blockons-search-inner">
							<RichText
								tagName="div"
								value={textInput}
								className="blockons-search-input"
								onChange={onChangeInputText}
								allowedFormats={["core/bold", "core/italic"]}
								placeholder={__("Add Placeholder...", "blockons")}
							/>
							<RichText
								tagName="div"
								value={textButton}
								className="blockons-search-button"
								onChange={onChangeButtonText}
								style={{
									backgroundColor: searchBtnBgColor,
									color: searchBtnColor,
								}}
								allowedFormats={["core/bold", "core/italic"]}
							/>
						</div>
						{isPremium && isSelected && showSearchPreview && (
							<div id="blockons-search-results-wrap"></div>
						)}
					</div>
				)}

				{(searchDisplay === "dropdown" || searchDisplay === "popup") && (
					<span
						className="fa-solid fa-magnifying-glass"
						style={{
							color: iconColor,
						}}
					></span>
				)}

				{searchDisplay === "dropdown" && (
					<div
						className="blockons-search-dropdown"
						style={{
							width: searchWidthDropdown + "px",
							...(searchAlign === "bottomcenter" || searchAlign === "topcenter"
								? { marginLeft: "-" + searchWidthDropdown / 2 + "px" }
								: ""),
						}}
					>
						<div className="blockons-search-inner">
							<RichText
								tagName="div"
								value={textInput}
								className="blockons-search-input"
								onChange={onChangeInputText}
								allowedFormats={["core/bold", "core/italic"]}
								placeholder={__("Add Placeholder...", "blockons")}
							/>
							<RichText
								tagName="div"
								value={textButton}
								className="blockons-search-button"
								onChange={onChangeButtonText}
								style={{
									backgroundColor: searchBtnBgColor,
									color: searchBtnColor,
								}}
								allowedFormats={["core/bold", "core/italic"]}
							/>
						</div>
						{isPremium && isSelected && showSearchPreview && (
							<div id="blockons-search-results-wrap"></div>
						)}
					</div>
				)}
			</div>

			{searchDisplay === "popup" && (
				<>
					<div
						className="blockons-search-popup-overlay"
						onClick={closePopup}
					></div>
					<div className="blockons-search-popup-wrapper">
						<div
							className="blockons-search-popup"
							style={{
								width: searchWidthPopup + "px",
								backgroundColor: searchBgColor,
							}}
						>
							<div
								className="blockons-close fas fa-x"
								onClick={closePopup}
							></div>
							<div className="blockons-search-inner">
								<RichText
									tagName="div"
									value={textInput}
									className="blockons-search-input"
									onChange={onChangeInputText}
									allowedFormats={["core/bold", "core/italic"]}
									placeholder={__("Add Placeholder...", "blockons")}
								/>
								<RichText
									tagName="div"
									value={textButton}
									className="blockons-search-button"
									onChange={onChangeButtonText}
									style={{
										backgroundColor: searchBtnBgColor,
										color: searchBtnColor,
									}}
									allowedFormats={["core/bold", "core/italic"]}
								/>
							</div>
							{isPremium && isSelected && showSearchPreview && (
								<div id="blockons-search-results-wrap"></div>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Edit;
