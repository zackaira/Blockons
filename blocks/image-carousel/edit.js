import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
	useBlockProps,
	MediaUpload,
} from "@wordpress/block-editor";
import {
	PanelBody,
	Dropdown,
	TextControl,
	ToggleControl,
	SelectControl,
	RangeControl,
	Button,
} from "@wordpress/components";
import { v4 as uuidv4 } from "uuid";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";
import { sliderArrowIcons } from "../block-global";
import { colorPickerPalette } from "../block-global";
import { Navigation, Pagination, EffectFade, EffectCoverflow } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			uniqueId,
			alignment,
			sliderSlides,
			imageProportion,
			forceFullWidth,
			imageRoundness,
			captionPosition,
			captionOnHover,
			captionBgColor,
			captionBgOpacity,
			captionFontSize,
			captionFontColor,
			transition,
			perView,
			autoplay,
			autoplayDelay,
			autoplayDisable,
			mode,
			spaceBetween,
			navigation,
			navigationStyle,
			navigationColor,
			navigationArrow,
			pagination,
			paginationStyle,
			paginationColor,
			showOnHover,
		},
		setAttributes,
	} = props;
	const pluginUrl = blockonsEditorObj.pluginUrl || "";
	const blockProps = useBlockProps({
		className: `align-${alignment}`,
	});
	const [needsReload, setNeedsReload] = useState(false);
	const [reloads, setReloads] = useState({ transition, mode });

	useEffect(() => {
		setAttributes({
			uniqueId: uuidv4(),
		});
	}, []);

	const sliderOptions = {
		modules: [Navigation, Pagination, EffectFade, EffectCoverflow],
		autoHeight: true,
		effect: transition,
		slidesPerView: transition !== "fade" ? perView : 1,
		spaceBetween: perView > 1 ? spaceBetween : 0,
		loop: mode === "loop" ? true : false,
		rewind: mode === "rewind" ? true : false,
		simulateTouch: false,
		navigation: navigation,
		pagination: pagination
			? {
					type: paginationStyle === "fraction" ? "fraction" : "bullets",
					dynamicBullets: paginationStyle === "dynamicBullets" ? true : false,
					clickable: true,
			  }
			: false,
	};

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "center" : newAlignment,
		});
	};

	const handleDeleteItem = (index) => {
		const newSlides = [...sliderSlides];
		newSlides.splice(index, 1);
		setAttributes({ sliderSlides: newSlides });
	};

	// Item Settings
	const handleMediaUpload = (media) => {
		const mediaItems = [...media];

		if (mediaItems.length) {
			const newSlides = mediaItems.map((image) => {
				return {
					imageId: image.id,
					imageUrl: image.url,
					imageAlt: image.alt,
					imageCaption: image.caption,
				};
			});

			setAttributes({ sliderSlides: newSlides });
		}
	};

	const slides = sliderSlides.map((slideItem, index) => (
		<div
			key={index}
			className="swiper-slide-inner"
		>
			<div
				className={`blockons-slider-img ${
					forceFullWidth || imageProportion !== "actual" ? "imgfull" : ""
				} ${imageProportion !== "actual" ? `aspect-ratio ratio-${imageProportion}` : !slideItem.imageUrl ? `aspect-ratio ratio-169panoramic` : ""} ${!slideItem.imageUrl ? `noimg` : ""}`}
			>

				{slideItem.imageUrl ? <div className="aspect-img"><img src={slideItem.imageUrl} alt={slideItem.alt} /></div> : ""}
			</div>

			{captionPosition !== "none" && slideItem.imageCaption && (
				<div
					className="blockons-caption"
					style={
						captionPosition === "below"
							? { backgroundColor: captionBgColor }
							: {}
					}
				>
					{captionPosition === "over" && (
						<div
							className="blockons-caption-bg"
							style={{
								backgroundColor: captionBgColor,
								opacity: captionBgOpacity,
							}}
						></div>
					)}
					<div
						className="blockons-caption-inner"
						style={{
							fontSize: captionFontSize,
							...(captionFontColor !== "#171515"
								? { color: captionFontColor }
								: {}),
						}}
					>
						{slideItem.imageCaption}
					</div>
				</div>
			)}

			<div className="blockons-slider-btns">
				<Button
					className="blockons-slide-delete"
					icon="no-alt"
					label="Delete Slide"
					onClick={() => handleDeleteItem(index)}
				/>
			</div>
		</div>
	));

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Slider Settings", "blockons")}
						initialOpen={true}
					>
						<MediaUpload
							className="components-icon-button components-toolbar__control"
							addToGallery={true}
							allowedTypes={["image"]}
							value={sliderSlides.map((img) => img.imageId)}
							gallery={true}
							onSelect={handleMediaUpload}
							multiple
							render={({ open }) => {
								return (
									<>
										<Button className="blockons-upload-button" onClick={open}>
											{sliderSlides.length
												? __("Add / Edit Images")
												: __("Create Image Slider / Carousel")}
										</Button>
									</>
								);
							}}
						/>

						{sliderSlides.length > 0 && (
							<>
								<br />
								<br />
								<div className="blockons-divider"></div>

								<SelectControl
									label="Transition Type"
									value={transition}
									options={[
										{ label: "Slide", value: "slide" },
										{ label: "Fade", value: "fade" },
										{ label: "Coverflow", value: "coverflow" },
									]}
									onChange={(newValue) => {
										newValue === reloads.transition
											? setNeedsReload(false)
											: setNeedsReload(true);

										setAttributes({ transition: newValue });
									}}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>
								{transition !== "fade" && (
									<RangeControl
										label={__("Slides Per View", "blockons")}
										value={perView}
										onChange={(newValue) =>
											setAttributes({
												perView:
													newValue === undefined ? 1 : parseInt(newValue),
											})
										}
										min={1}
										max={sliderSlides.length < 4 ? sliderSlides.length : 4}
										__next40pxDefaultSize={true}
										__nextHasNoMarginBottom={true}
									/>
								)}

								<SelectControl
									label="Slider Mode"
									value={mode}
									options={[
										{ label: "Default", value: "default" },
										{ label: "Rewind", value: "rewind" },
										{ label: "Infinite Loop", value: "loop" },
									]}
									onChange={(newValue) => {
										newValue === reloads.mode
											? setNeedsReload(false)
											: setNeedsReload(true);

										setAttributes({ mode: newValue });
									}}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>

								<ToggleControl
									label={__("Auto Play", "blockons")}
									checked={autoplay}
									onChange={(newValue) =>
										setAttributes({ autoplay: newValue })
									}
									help={autoplay ? __("Auto Play will ONLY work on the site frontend", "blockons") : ""}
									__nextHasNoMarginBottom={true}
								/>
								{autoplay && (
									<>
										<TextControl
											label={__("Time Delay", "blockons")}
											type="number"
											value={autoplayDelay}
											onChange={(newValue) => 
												setAttributes({ autoplayDelay: newValue })
											}
											help={__("1000 = 1 second", "blockons")}
											__next40pxDefaultSize={true}
											__nextHasNoMarginBottom={true}
										/>
										<ToggleControl
											label={__("Disable on Interaction", "blockons")}
											checked={autoplayDisable}
											onChange={(newValue) =>
												setAttributes({ autoplayDisable: newValue })
											}
											help={__("Disable the Auto Play When the slider is interacted with", "blockons")}
											__nextHasNoMarginBottom={true}
										/>
									</>
								)}
								<div className="blockons-divider"></div>

								{perView > 1 && (
									<RangeControl
										label={__("Space Between Slides", "blockons")}
										value={spaceBetween}
										onChange={(newValue) =>
											setAttributes({
												spaceBetween:
													newValue === undefined ? 0 : parseInt(newValue),
											})
										}
										min={0}
										max={200}
										step={1}
										__next40pxDefaultSize={true}
										__nextHasNoMarginBottom={true}
									/>
								)}
							</>
						)}
					</PanelBody>

					{sliderSlides.length > 0 && (
						<>
							<PanelBody
								title={__("Image Settings", "blockons")}
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
									onChange={(newValue) =>
										setAttributes({
											imageProportion:
												newValue === undefined ? "actual" : newValue,
										})
									}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>
								{imageProportion === "actual" && (
									<ToggleControl
										label={__("Force Images Full Width", "blockons")}
										checked={forceFullWidth}
										onChange={(newValue) =>
											setAttributes({ forceFullWidth: newValue })
										}
										__nextHasNoMarginBottom={true}
									/>
								)}
								<div className="blockons-divider"></div>

								<SelectControl
									label={__("Border Radius", "blockons")}
									value={imageRoundness}
									options={[
										{ label: __("square", "blockons"), value: "square" },
										{ label: __("Rounded", "blockons"), value: "rounded" },
										{ label: __("More Round", "blockons"), value: "rounder" },
										{ label: __("Very Round", "blockons"), value: "round" },
									]}
									onChange={(newValue) => {
										setAttributes({
											imageRoundness:
												newValue === undefined ? "square" : newValue,
										});
									}}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>
								<div className="blockons-divider"></div>

								<SelectControl
									label={__("Caption Position", "blockons")}
									value={captionPosition}
									options={[
										{ label: __("None", "blockons"), value: "none" },
										{ label: __("Below Image", "blockons"), value: "below" },
										{ label: __("Over Image", "blockons"), value: "over" },
									]}
									onChange={(newValue) => {
										setAttributes({
											captionPosition:
												newValue === undefined ? "none" : newValue,
										});
									}}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>
								{captionPosition === "over" && (
									<ToggleControl
										label={__("Only Show Caption on Hover", "blockons")}
										checked={captionOnHover}
										onChange={(newValue) =>
											setAttributes({ captionOnHover: newValue })
										}
										__nextHasNoMarginBottom={true}
									/>
								)}

								{(captionPosition === "below" ||
									captionPosition === "over") && (
									<>
										<div className="blockons-divider"></div>
										<BlockonsColorpicker
											label={__("Background Color", "blockons")}
											value={captionBgColor}
											onChange={(newColor) =>
												setAttributes({ captionBgColor: newColor })
											}
											paletteColors={colorPickerPalette}
										/>
										{captionPosition === "over" && (
											<RangeControl
												label={__("Background Opacity", "blockons")}
												value={captionBgOpacity}
												onChange={(newValue) =>
													setAttributes({ captionBgOpacity: newValue })
												}
												min={0}
												max={1}
												step={0.01}
												__next40pxDefaultSize={true}
												__nextHasNoMarginBottom={true}
											/>
										)}
										<div className="blockons-divider"></div>

										<BlockonsColorpicker
											label={__("Font Color", "blockons")}
											value={captionFontColor}
											onChange={(newColor) =>
												setAttributes({ captionFontColor: newColor })
											}
											paletteColors={colorPickerPalette}
										/>
										<RangeControl
											label={__("Font Size", "blockons")}
											value={captionFontSize}
											onChange={(newValue) =>
												setAttributes({ captionFontSize: parseInt(newValue) })
											}
											min={10}
											max={32}
											__next40pxDefaultSize={true}
											__nextHasNoMarginBottom={true}
										/>
									</>
								)}
							</PanelBody>
							<PanelBody
								title={__("Slider Controls", "blockons")}
								initialOpen={false}
							>
								<ToggleControl
									label={__("Show Navigation", "blockons")}
									checked={navigation}
									onChange={(newValue) =>
										setAttributes({ navigation: newValue })
									}
									__nextHasNoMarginBottom={true}
								/>

								{navigation && (
									<>
										<SelectControl
											label="Style"
											value={navigationStyle}
											options={[
												{ label: "Default", value: "default" },
												{ label: "Round", value: "round" },
												{ label: "Rounded", value: "rounded" },
												{ label: "Square", value: "square" },
											]}
											onChange={(newValue) =>
												setAttributes({ navigationStyle: newValue })
											}
											__next40pxDefaultSize={true}
											__nextHasNoMarginBottom={true}
										/>
										<SelectControl
											label="Color"
											value={navigationColor}
											options={[
												{ label: "Dark", value: "dark" },
												{ label: "Light", value: "light" },
											]}
											onChange={(newValue) =>
												setAttributes({ navigationColor: newValue })
											}
											__next40pxDefaultSize={true}
											__nextHasNoMarginBottom={true}
										/>

										<div className="blockons-icon-select">
											<Dropdown
												contentClassName="blockons-icon-selector"
												popoverProps={{ placement: "bottom-end" }}
												renderToggle={({ isOpen, onToggle }) => (
													<FontAwesomeIcon
														icon={navigationArrow}
														iconSize={24}
														onClick={onToggle}
													/>
												)}
												renderContent={() =>
													Object.keys(sliderArrowIcons).map((icon, index) => (
														<FontAwesomeIcon
															key={index}
															icon={icon}
															iconSize={20}
															onClick={() =>
																setAttributes({ navigationArrow: icon })
															}
														/>
													))
												}
											/>
											<p>{__("Select Slider Arrow Icons", "blockons")}</p>
										</div>
									</>
								)}

								<div className="blockons-divider"></div>

								<ToggleControl
									label={__("Show Pagination", "blockons")}
									checked={pagination}
									onChange={(newValue) =>
										setAttributes({ pagination: newValue })
									}
									__nextHasNoMarginBottom={true}
								/>
								{pagination && (
									<>
										<SelectControl
											label={__("Pagination Type", "blockons")}
											value={paginationStyle}
											options={[
												{ label: "Bullets", value: "bullets" },
												{ label: "Dynamic Bullets", value: "dynamicBullets" },
												{ label: "Numbers", value: "numbers" },
												{ label: "Fraction", value: "fraction" },
											]}
											onChange={(newValue) =>
												setAttributes({
													paginationStyle:
														newValue === undefined ? "bullets" : newValue,
												})
											}
											help={__(
												"Turn the Pagination off and on again to see this change",
												"blockons"
											)}
											__next40pxDefaultSize={true}
											__nextHasNoMarginBottom={true}
										/>
										<SelectControl
											label="Color"
											value={paginationColor}
											options={[
												{ label: "Dark", value: "dark" },
												{ label: "Light", value: "light" },
											]}
											onChange={(newValue) =>
												setAttributes({ paginationColor: newValue })
											}
											__next40pxDefaultSize={true}
											__nextHasNoMarginBottom={true}
										/>
									</>
								)}

								{(navigation || pagination) && (
									<>
										<div className="blockons-divider"></div>
										<ToggleControl
											label={__("Show Controls on Hover", "blockons")}
											checked={showOnHover}
											onChange={(newValue) =>
												setAttributes({ showOnHover: newValue })
											}
											__nextHasNoMarginBottom={true}
										/>
									</>
								)}
							</PanelBody>
						</>
					)}
				</InspectorControls>
			)}
			{
				<BlockControls>
					<AlignmentToolbar value={alignment} onChange={onChangeAlignment} />
				</BlockControls>
			}
			<div
				className={`blockons-slider slider ${
					showOnHover ? "controlsOnHover" : ""
				} navigation-${navigationStyle} navigation-${navigationColor} pagination-${paginationStyle} pagination-${paginationColor} ${
					navigationArrow === "ban" ? "default-icon" : "custom-icon"
				} arrows-${navigationArrow} ${
					captionPosition !== "none"
						? "caption-" + captionPosition
						: "nocaption"
				} ${
					captionPosition === "over" && captionOnHover ? "caption-hover" : ""
				} bradius-${imageRoundness}`}
				id={uniqueId}
			>
				{needsReload && (
					<div className="blockons-slider-reload">
						<div className="blockons-slider-reload-inner">
							{__("Please Save or Update and reload the page", "blockons")}
						</div>
					</div>
				)}

				{slides.length > 0 ? (
					<Swiper {...sliderOptions}>
						{slides.map((slideContent, index) => (
							<SwiperSlide key={index}>{slideContent}</SwiperSlide>
						))}
					</Swiper>
				) : (
					<div className="blockons-imgcarousel-empty">
						<MediaUpload
							className="components-icon-button components-toolbar__control"
							addToGallery={true}
							allowedTypes={["image"]}
							// value={slides}
							value={sliderSlides.map((img) => img.imageId)}
							gallery={true}
							onSelect={handleMediaUpload}
							multiple
							render={({ open }) => {
								return (
									<>
										<Button className="blockons-upload-button" onClick={open}>
											{__("Create Image Slider / Carousel")}
										</Button>
									</>
								);
							}}
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default Edit;
