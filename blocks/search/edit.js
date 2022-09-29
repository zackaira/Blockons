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
import { v4 as uuidv4 } from "uuid";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import { colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			alignment,
			searchId,
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
			searchProId,
			isPremium,
			searchPro,
			searchProTypes,
			searchProAmnt,
			searchProCats,
			searchProCatsTitle,
			searchProCatsAmnt,
			searchProTags,
			searchProTagsTitle,
			searchProTagsAmnt,
			searchProImage,
			searchProDesc,
			searchProPrice,
		},
		setAttributes,
	} = props;

	const [showSearch, setShowSearch] = useState(false);
	const isPro = Boolean(searchObj.isPremium);
	const wcActive = Boolean(searchObj.wcActive);
	const [showSearchPreview, setShowSearchPreview] = useState(false);

	const blockProps = useBlockProps({
		className: `align-${alignment} ${
			isSelected && showSearch ? "blockons-show" : ""
		} ${searchDisplay === "default" ? "default-search" : "icon-search"}`,
		id: searchId,
	});

	const siteInfo = wp.data.select("core").getSite();

	const searchProOptions = isPremium
		? {
				searchProId,
				searchPro,
				searchProTypes,
				searchProAmnt,
				searchProCats,
				searchProCatsTitle,
				searchProCatsAmnt,
				searchProTags,
				searchProTagsTitle,
				searchProTagsAmnt,
				searchProImage,
				searchProDesc,
				searchProPrice,
		  }
		: { searchPro };

	useEffect(() => {
		setAttributes({ isPremium: isPro }); // SETS PREMIUM

		if (!baseUrl && siteInfo) {
			setAttributes({
				baseUrl: siteInfo.url,
			});
		}
		if (!searchId) {
			setAttributes({
				searchId: "id" + uuidv4(),
			});
		}
		if (!searchProId) {
			setAttributes({
				searchProId: "id" + uuidv4(),
			});
		}
	}, []);

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "left" : newAlignment,
		});
	};
	const onChangeInputText = (newValue) => {
		setAttributes({ textInput: newValue });
	};
	const onChangeButtonText = (newValue) => {
		setAttributes({ textButton: newValue });
	};

	const closePopup = () => {
		setShowSearch(false);
	};

	console.log("Premium: ", isPremium);

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
								onChange={(newValue) =>
									setAttributes({ searchWidthDefault: newValue })
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
								onChange={(newValue) =>
									setAttributes({ searchWidthDropdown: parseInt(newValue) })
								}
								type="number"
							/>
						)}

						{searchDisplay === "popup" && (
							<TextControl
								label={__("Search Width", "blockons")}
								value={searchWidthPopup}
								onChange={(newValue) =>
									setAttributes({ searchWidthPopup: parseInt(newValue) })
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
									onChange={(newValue) =>
										setAttributes({
											searchAlign: newValue === undefined ? "right" : newValue,
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
									onChange={(newValue) =>
										setAttributes({
											iconSize: newValue === undefined ? 17 : newValue,
										})
									}
									min={14}
									max={50}
								/>
								<RangeControl
									label={__("Icon Padding", "blockons")}
									value={iconPadding}
									onChange={(newValue) =>
										setAttributes({
											iconPadding: newValue === undefined ? 5 : newValue,
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
								<div className="blockons-divider"></div>
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
									setAttributes({ searchPro: newValue });
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
											"Please see the frontend for actual results.",
											"blockons"
										)}
									/>

									<SelectControl
										label={__("Search For:", "blockons")}
										value={searchProTypes}
										options={[
											{ label: __("Posts", "blockons"), value: "post" },
											{ label: __("Pages", "blockons"), value: "page" },
											{
												label: __("Products", "blockons"),
												value: "product",
												disabled: wcActive ? false : true,
											},
										]}
										onChange={(newValue) =>
											setAttributes({
												searchProTypes:
													newValue === undefined ? "post" : newValue,
											})
										}
										// multiple={true}
										// className="blockons-multiselect"
									/>
									<TextControl
										label={__("Results Amount to Display", "blockons")}
										value={searchProAmnt}
										onChange={(newValue) =>
											setAttributes({ searchProAmnt: parseInt(newValue) })
										}
										type="number"
									/>

									<div className="blockons-divider"></div>
									<ToggleControl
										label={__("Show Categories in Search", "blockons")}
										checked={searchProCats}
										onChange={(newValue) => {
											setAttributes({ searchProCats: newValue });
										}}
									/>
									{searchProCats && (
										<>
											<TextControl
												label={__("Results Title", "blockons")}
												value={searchProCatsTitle}
												onChange={(newValue) =>
													setAttributes({ searchProCatsTitle: newValue })
												}
											/>
											<TextControl
												label={__("Amount to Display", "blockons")}
												value={searchProCatsAmnt}
												onChange={(newValue) =>
													setAttributes({
														searchProCatsAmnt: parseInt(newValue),
													})
												}
												type="number"
											/>
											<div className="blockons-divider"></div>
										</>
									)}

									<ToggleControl
										label={__("Show Tags in Search", "blockons")}
										checked={searchProTags}
										onChange={(newValue) => {
											setAttributes({ searchProTags: newValue });
										}}
									/>
									{searchProTags && (
										<>
											<TextControl
												label={__("Results Title", "blockons")}
												value={searchProTagsTitle}
												onChange={(newValue) =>
													setAttributes({ searchProTagsTitle: newValue })
												}
											/>
											<TextControl
												label={__("Amount to Display", "blockons")}
												value={searchProTagsAmnt}
												onChange={(newValue) =>
													setAttributes({
														searchProTagsAmnt: parseInt(newValue),
													})
												}
												type="number"
											/>
										</>
									)}

									<div className="blockons-divider"></div>
									<ToggleControl
										label={__("Show Image", "blockons")}
										checked={searchProImage}
										onChange={(newValue) => {
											setAttributes({ searchProImage: newValue });
										}}
									/>
									<ToggleControl
										label={
											searchProTypes === "product"
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
									{searchProTypes === "product" && (
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
					...(searchDisplay === "dropdown" || searchDisplay === "popup"
						? {
								backgroundColor: iconBgColor,
								padding: iconPadding,
								fontSize: iconSize,
						  }
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
								multiline={false}
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
								multiline={false}
							/>
						</div>

						{isPremium && searchPro && (
							<div
								className="blockons-search-results-wrap"
								id={searchProId}
								data-settings={JSON.stringify(searchProOptions)}
							></div>
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
								multiline={false}
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
								multiline={false}
							/>
						</div>
						{isPremium && searchPro && (
							<div
								className="blockons-search-results-wrap"
								id={searchProId}
								data-settings={JSON.stringify(searchProOptions)}
							></div>
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
									multiline={false}
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
									multiline={false}
								/>
							</div>

							{isPremium && searchPro && (
								<div
									className="blockons-search-results-wrap"
									id={searchProId}
									data-settings={JSON.stringify(searchProOptions)}
								></div>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Edit;
