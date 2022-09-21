/**
 * WordPress dependencies
 */
import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
	AlignmentToolbar,
	BlockAlignmentToolbar,
	BlockControls,
	InspectorControls,
	useBlockProps,
	MediaUpload,
} from "@wordpress/block-editor";
import {
	PanelBody,
	Dropdown,
	ToggleControl,
	SelectControl,
	RangeControl,
	Button,
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import { v4 as uuidv4 } from "uuid";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";
import { sliderArrowIcons, colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			uniqueId,
			alignment,
			slideAlign,
			sliderWidth,
			slides,
			carouselType,
			carouselNumber,
			carouselRewind,
			carouselGap,
			captionPosition,
			captionOnHover,
			carouselStyle,
			carouselLayout,
			controlsOnHover,
			carouselArrows,
			arrowStyle,
			carouselArrowIcon,
			carouselPagination,
			carouselPagDesign,
			imageProportion,
			carouselBRadius,
			carouselSidePadding,
			captionBgColor,
			captionBgOpacity,
			captionFontColor,
			captionFontSize,
		},
		setAttributes,
	} = props;

	const [needsReload, setNeedsReload] = useState(false);
	const [initCarouselType, setInitCarouselType] = useState(carouselType);

	const blockProps = useBlockProps({
		className: `align-${alignment} ${slideAlign}-align layout-${carouselLayout} style-${carouselStyle} arrows-${carouselArrowIcon} brad-${carouselBRadius}`,
	});

	// Slider Settings
	const sliderOptions = {
		type: carouselType, // slide | loop | fade
		...(carouselType === "slide"
			? {
					rewind: carouselRewind,
			  }
			: {
					rewind: true,
			  }),
		speed: 1000,
		padding: carouselSidePadding,
		...(carouselType !== "fade" && {
			perPage: carouselNumber,
			perMove: 1,
			gap: carouselNumber >= 2 ? carouselGap : 0,
		}),
		autoplay: false,
		arrows: carouselArrows,
		pagination: carouselPagination,
		classes: {
			arrow: "splide__arrow fa-solid",
		},
	};

	useEffect(() => {
		setInitCarouselType(carouselType);
		setAttributes({
			uniqueId: uuidv4(),
		});
	}, []);

	useEffect(() => {
		const hahha = carouselType !== initCarouselType ? true : false;
		setNeedsReload(hahha);
	}, [carouselType]);

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "left" : newAlignment,
		});
	};

	// Item Controls Functions
	const handleMediaUpload = (media) => {
		const mediaItems = [...media];

		if (mediaItems.length) {
			const editedCarouselItems = mediaItems.map((image) => {
				return {
					imageId: image.id,
					imageUrl: image.url,
					imageAlt: image.alt,
					imageCaption: image.caption,
				};
			});

			// const updatedSlides = [
			// 	...slides.filter(
			// 		(slide) =>
			// 			// !editedCarouselItems.find((item) => slide.imageId === item.imageId)
			// 	),
			// 	...editedCarouselItems,
			// ];

			setAttributes({ slides: editedCarouselItems });
		}
	};

	const handleRemoveItem = (index) => {
		const newSlides = [...slides];
		newSlides.splice(index, 1);
		setAttributes({ slides: newSlides });
	};

	let updateHeight = (slider) => {
		let slide = slider.Components.Slides.getAt(slider.index).slide;
		let sliderTrackParent = slide.closest(".carousel-resize");

		if (sliderTrackParent) {
			setTimeout(() => {
				sliderTrackParent.querySelector(".splide__track").style.height =
					slide.offsetHeight + "px";
			}, 150);
		}
	};

	// Image Carousel Items
	let sliderSlideItems;

	if (slides.length) {
		sliderSlideItems = slides.map((slideItem, index) => {
			return (
				<SplideSlide>
					<div
						className={`blockons-imgcarousel-inner ${
							imageProportion === "square" ||
							imageProportion === "32rectangle" ||
							imageProportion === "43rectangle" ||
							imageProportion === "169panoramic"
								? "imgbg"
								: ""
						}`}
						style={{
							...(imageProportion === "square" ||
							imageProportion === "32rectangle" ||
							imageProportion === "43rectangle" ||
							imageProportion === "169panoramic"
								? {
										background: `url("${slideItem.imageUrl}") center center / cover no-repeat`,
								  }
								: ""),
						}}
					>
						{imageProportion === "actual" ? (
							slideItem.imageUrl && (
								<img src={slideItem.imageUrl} alt={slideItem.alt} />
							)
						) : (
							<img
								src={`${siteObj.pluginUrl}assets/images/${imageProportion}.png`}
								alt={slideItem.alt}
							/>
						)}
					</div>
					{isSelected && (
						<div className="blockons-item-btns">
							<Button
								className="blockons-remove-item"
								icon="no-alt"
								label="Delete Item"
								onClick={() => handleRemoveItem(index)}
							/>
						</div>
					)}
					{(captionPosition === "two" ||
						captionPosition === "three" ||
						captionPosition === "four") &&
						slideItem.imageCaption && (
							<div className="blockons-imgcaption">
								<div
									className="blockons-imgcaption-bg"
									style={{
										backgroundColor: captionBgColor,
										opacity: captionBgOpacity,
									}}
								></div>
								<div
									className="blockons-imgcaption-inner"
									style={{
										fontSize: captionFontSize,
										color: captionFontColor,
									}}
								>
									{slideItem.imageCaption}
								</div>
							</div>
						)}
				</SplideSlide>
			);
		});
	}

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Image Carousel Settings", "blockons")}
						initialOpen={true}
					>
						<MediaUpload
							className="components-icon-button components-toolbar__control"
							addToGallery={true}
							allowedTypes={["image"]}
							value={slides.map((img) => img.imageId)}
							gallery={true}
							onSelect={handleMediaUpload}
							multiple
							render={({ open }) => {
								return (
									<>
										<Button className="blockons-upload-button" onClick={open}>
											{slides.length
												? __("Add / Edit Images")
												: __("Create Image Carousel Gallery")}
										</Button>
									</>
								);
							}}
						/>
						<br />
						<div className="blockons-size-note">
							{__(
								"Note: When changing live settings, move the slider to make it resize properly again.",
								"blockons"
							)}
						</div>

						{slides.length >= 2 && (
							<>
								<br />
								<SelectControl
									label={__("Carousel / Slider Type", "blockons")}
									value={carouselType}
									options={
										carouselNumber === 1
											? [
													{
														label: __("Basic Carousel", "blockons"),
														value: "slide",
													},
													{
														label: __("Loop Carousel", "blockons"),
														value: "loop",
													},
													{
														label: __("Fade", "blockons"),
														value: "fade",
													},
											  ]
											: [
													{
														label: __("Basic Carousel", "blockons"),
														value: "slide",
													},
													{
														label: __("Loop Carousel", "blockons"),
														value: "loop",
													},
											  ]
									}
									onChange={(value) => {
										setAttributes({
											carouselType: value === undefined ? "none" : value,
										});
									}}
									help={__(
										"This setting changes a 'read-only' property in the slider options, if you change this, you will need to 'Save/Update' the post and reload the page to see it work with the new setting.",
										"blockons"
									)}
								/>
								<div className="helplink fixmargin">
									<a
										href="https://blockons.com/documentation/image-carousel-block-or-image-slider/"
										target="_blank"
									>
										{__("Read More")}
									</a>
								</div>

								<UnitControl
									label={__("Carousel / Slider Width", "blockons")}
									value={sliderWidth ? sliderWidth : "100%"}
									onChange={(value) =>
										setAttributes({
											sliderWidth: value,
										})
									}
									units={[
										{ value: "%", label: "%", default: 100 },
										{ value: "px", label: "px", default: 800 },
									]}
									isResetValueOnUnitChange
								/>

								{carouselType !== "fade" && (
									<RangeControl
										label={__("Slides Per View", "blockons")}
										value={carouselNumber}
										onChange={(value) =>
											setAttributes({ carouselNumber: value })
										}
										min={1}
										max={slides.length <= 4 ? slides.length : 5}
									/>
								)}

								{carouselType === "slide" && (
									<ToggleControl
										label={__("Rewind Carousel", "blockons")}
										checked={carouselRewind}
										onChange={(newValue) => {
											setAttributes({
												carouselRewind: newValue,
											});
										}}
									/>
								)}
							</>
						)}
					</PanelBody>
					<PanelBody
						title={__("Image Carousel Design", "blockons")}
						initialOpen={false}
					>
						<SelectControl
							label={__("Image Proportions", "blockons")}
							value={imageProportion}
							options={[
								{ label: __("Actual Image", "blockons"), value: "actual" },
								{ label: __("Square", "blockons"), value: "square" },
								{
									label: __("3:2 Rectangle", "blockons"),
									value: "32rectangle",
								},
								{
									label: __("4:3 Rectangle", "blockons"),
									value: "43rectangle",
								},
								{
									label: __("16:9 Panoramic", "blockons"),
									value: "169panoramic",
								},
							]}
							onChange={(value) => {
								setAttributes({
									imageProportion: value === undefined ? "actual" : value,
								});
							}}
						/>

						<SelectControl
							label={__("Border Radius", "blockons")}
							value={carouselBRadius}
							options={[
								{ label: __("square", "blockons"), value: "one" },
								{ label: __("Rounded", "blockons"), value: "two" },
								{ label: __("More Round", "blockons"), value: "three" },
								{ label: __("Very Round", "blockons"), value: "four" },
							]}
							onChange={(value) => {
								setAttributes({
									carouselBRadius: value === undefined ? "one" : value,
								});
							}}
						/>

						{carouselNumber >= 2 && (
							<RangeControl
								label={__("Slides Gap", "blockons")}
								value={carouselGap}
								onChange={(value) => setAttributes({ carouselGap: value })}
								min={0}
								max={100}
							/>
						)}

						{carouselType === "loop" && (
							<RangeControl
								label={__("Carousel Side Padding", "blockons")}
								value={carouselSidePadding}
								onChange={(value) =>
									setAttributes({ carouselSidePadding: value })
								}
								min={0}
								max={200}
							/>
						)}

						<SelectControl
							label={__("Display Image Caption", "blockons")}
							value={captionPosition}
							options={[
								{ label: __("None", "blockons"), value: "one" },
								{ label: __("Bottom Banner", "blockons"), value: "two" },
								{ label: __("Over Image", "blockons"), value: "three" },
								{ label: __("Below Slide", "blockons"), value: "four" },
							]}
							onChange={(value) => {
								setAttributes({
									captionPosition: value === undefined ? "one" : value,
								});
							}}
						/>
						{(captionPosition === "two" || captionPosition === "three") && (
							<>
								<BlockonsColorpicker
									label={__("Background Color", "blockons")}
									value={captionBgColor}
									onChange={(value) => setAttributes({ captionBgColor: value })}
									paletteColors={colorPickerPalette}
								/>
								<RangeControl
									label={__("Background Opacity", "blockons")}
									value={captionBgOpacity}
									onChange={(value) =>
										setAttributes({ captionBgOpacity: value })
									}
									min={0}
									max={1}
									step={0.01}
								/>
							</>
						)}

						{(captionPosition === "two" ||
							captionPosition === "three" ||
							captionPosition === "four") && (
							<>
								<BlockonsColorpicker
									label={__("Font Color", "blockons")}
									value={captionFontColor}
									onChange={(value) =>
										setAttributes({ captionFontColor: value })
									}
									paletteColors={colorPickerPalette}
								/>
								<RangeControl
									label={__("Font Size", "blockons")}
									value={captionFontSize}
									onChange={(value) =>
										setAttributes({ captionFontSize: value })
									}
									min={11}
									max={32}
								/>
							</>
						)}
						{(captionPosition === "two" || captionPosition === "three") && (
							<ToggleControl
								label={__("Show Caption only on Hover", "blockons")}
								checked={captionOnHover}
								onChange={(value) => setAttributes({ captionOnHover: value })}
							/>
						)}
					</PanelBody>
					<PanelBody
						title={__("Image Carousel Slider Controls", "blockons")}
						initialOpen={false}
					>
						<ToggleControl
							label={__("Show Arrows", "blockons")}
							checked={carouselArrows}
							onChange={(value) => setAttributes({ carouselArrows: value })}
						/>

						{carouselArrows && (
							<>
								{(carouselStyle === "two" || carouselStyle === "three") && (
									<SelectControl
										label="Style"
										value={arrowStyle}
										options={[
											{ label: "Default", value: "one" },
											{ label: "Round", value: "two" },
											{ label: "Icon Only", value: "three" },
										]}
										onChange={(value) => setAttributes({ arrowStyle: value })}
									/>
								)}
								<div className="blockons-icon-text-select">
									<Dropdown
										className="blockons-icon-selecter"
										contentClassName="blockons-editor-popup arrow-selector"
										position="bottom left"
										renderToggle={({ isOpen, onToggle }) => (
											<FontAwesomeIcon
												icon={carouselArrowIcon}
												iconSize={24}
												onClick={onToggle}
											/>
										)}
										renderContent={() =>
											Object.keys(sliderArrowIcons).map((icon) => (
												<FontAwesomeIcon
													icon={icon}
													iconSize={20}
													onClick={() =>
														setAttributes({ carouselArrowIcon: icon })
													}
												/>
											))
										}
									/>
									<p>{__("Select Slider Arrow Icons", "blockons")}</p>
								</div>
							</>
						)}

						<ToggleControl
							label={__("Show Pagination", "blockons")}
							checked={carouselPagination}
							onChange={(value) => setAttributes({ carouselPagination: value })}
						/>
						{carouselPagination && (
							<>
								<SelectControl
									label="Testimonials Layout"
									value={carouselPagDesign}
									options={[
										{ label: "Dots", value: "dots" },
										{ label: "Numbers", value: "numbers" },
									]}
									onChange={(value) =>
										setAttributes({
											carouselPagDesign: value === undefined ? "dots" : value,
										})
									}
								/>
							</>
						)}

						{(carouselArrows || carouselPagination) && (
							<ToggleControl
								label={__("Show Controls only on Hover", "blockons")}
								checked={controlsOnHover}
								onChange={(value) => setAttributes({ controlsOnHover: value })}
							/>
						)}
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					{(captionPosition === "two" || captionPosition === "four") && (
						<AlignmentToolbar value={alignment} onChange={onChangeAlignment} />
					)}
					<BlockAlignmentToolbar
						value={slideAlign}
						controls={["left", "center", "right"]}
						onChange={(value) =>
							setAttributes({
								slideAlign: value === undefined ? "left" : value,
							})
						}
					/>
				</BlockControls>
			}
			<div
				className={`blockons-image-carousel-slider`}
				id={uniqueId}
				data-settings={JSON.stringify(sliderOptions)}
				data-slides={carouselNumber}
				style={{
					width: sliderWidth,
				}}
			>
				<div
					className={`blockons-imgcarousel-wrap ${
						controlsOnHover ? "on-hover" : ""
					} ${carouselNumber === 1 ? "carousel-resize" : ""} ${
						captionOnHover ? "cap-hover" : ""
					} arrow-style-${arrowStyle} pagination-${carouselPagDesign} caption-${captionPosition} ${
						needsReload ? "reload-fix" : ""
					}`}
				>
					{needsReload && (
						<div className="blockons-reload">
							<div className="blockons-reload-block">
								{__(
									"Please save the post and refresh the page to see this new setting take place",
									"blockons"
								)}
							</div>
						</div>
					)}
					{slides.length ? (
						<Splide
							options={sliderOptions}
							onMounted={(slider) => {
								setTimeout(() => {
									updateHeight(slider);
								}, 150);
							}}
							onMove={(slider) => updateHeight(slider)}
							onResize={(slider) => updateHeight(slider)}
							onUpdated={(slider) => updateHeight(slider)}
							onRefresh={(slider) => updateHeight(slider)}
						>
							{sliderSlideItems}
						</Splide>
					) : (
						<div className="blockons-imgcarousel-empty">
							<MediaUpload
								className="components-icon-button components-toolbar__control"
								addToGallery={true}
								allowedTypes={["image"]}
								// value={slides}
								value={slides.map((img) => img.imageId)}
								gallery={true}
								onSelect={handleMediaUpload}
								multiple
								render={({ open }) => {
									return (
										<>
											<Button className="blockons-upload-button" onClick={open}>
												{__("Create Image Carousel Gallery")}
											</Button>
										</>
									);
								}}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Edit;
