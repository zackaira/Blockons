/**
 * WordPress dependencies
 */
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
	ToggleControl,
	SelectControl,
	RangeControl,
	Button,
} from "@wordpress/components";
import { v4 as uuidv4 } from "uuid";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";
import { slugify, sliderArrowIcons } from "../block-global";
import { colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			uniqueId,
			alignment,
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
		},
		setAttributes,
	} = props;

	const [needsReload, setNeedsReload] = useState(false);
	const [initCarouselType, setInitCarouselType] = useState(carouselType);

	const blockProps = useBlockProps({
		className: `align-${alignment} layout-${carouselLayout} style-${carouselStyle} arrows-${carouselArrowIcon}`,
	});

	// const sliderType = carouselType === "slide" ? "slide" : carouselType;

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
		// padding: "5rem",
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

	// console.log(sliderOptions);

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
	const handleItemAuthorChange = (itemAuthor, itemId) => {
		const newSlides = [...slides];
		// Edit the item text and ID (this prevent the edit from editing all instances if the block is duplicated)
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemId:
						itemId === ""
							? Math.floor(Math.random() * 800)
							: slugify(itemAuthor),
					itemAuthor: itemAuthor,
				};
			return obj;
		});
		setAttributes({ slides: editedSlideItems });
	};
	const handleMediaUpload = (media, itemId) => {
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

			const updatedSlides = [
				...slides.filter(
					(slide) =>
						!editedCarouselItems.find((item) => slide.imageId === item.imageId)
				),
				...editedCarouselItems,
			];

			setAttributes({ slides: updatedSlides });
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
			}, 50);
		}
	};

	// Image Carousel Items
	let sliderSlideItems;

	if (slides.length) {
		sliderSlideItems = slides.map((slideItem, index) => {
			return (
				<SplideSlide>
					<div className="blockons-imgcarousel-inner">
						{slideItem.imageUrl && (
							<img src={slideItem.imageUrl} alt={slideItem.alt} />
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
								<div className="blockons-imgcaption-inner">
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
							// value={slides}
							value={slides.map((img) => img.imageId)}
							gallery={true}
							onSelect={handleMediaUpload}
							multiple
							render={({ open }) => {
								return (
									<>
										<Button className="blockons-upload-button" onClick={open}>
											{slides.length
												? __("Add Images to Carousel")
												: __("Create Image Carousel Gallery")}
										</Button>
									</>
								);
							}}
						/>
						<br />

						{slides.length >= 2 && (
							<>
								<br />
								<SelectControl
									label={__("Carousel Loop", "blockons")}
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
										"This setting changes a 'read-only' property in the slider options, please 'Save/Update' the post and reload the page to see it work with the new setting.",
										"blockons"
									)}
								/>
								<div className="helplink fixmargin">
									<a href="#" target="_blank">
										{__("Read More")}
									</a>
								</div>

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

								{carouselNumber >= 2 && (
									<RangeControl
										label={__("Slides Gap", "blockons")}
										value={carouselGap}
										onChange={(value) => setAttributes({ carouselGap: value })}
										min={0}
										max={80}
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

								<SelectControl
									label={__("Display Image Caption", "blockons")}
									value={captionPosition}
									options={[
										{
											label: __("None", "blockons"),
											value: "one",
										},
										{
											label: __("Bottom Banner", "blockons"),
											value: "two",
										},
										{
											label: __("Over Image", "blockons"),
											value: "three",
										},
										{
											label: __("Below Slide", "blockons"),
											value: "four",
										},
									]}
									onChange={(value) => {
										setAttributes({
											captionPosition: value === undefined ? "one" : value,
										});
									}}
								/>
								{(captionPosition === "two" || captionPosition === "three") && (
									<ToggleControl
										label={__("Show Caption only on Hover", "blockons")}
										checked={captionOnHover}
										onChange={(value) =>
											setAttributes({ captionOnHover: value })
										}
									/>
								)}
							</>
						)}
					</PanelBody>
					<PanelBody
						title={__("Image Carousel Design", "blockons")}
						initialOpen={false}
					>
						EMPTY
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
					<AlignmentToolbar value={alignment} onChange={onChangeAlignment} />
				</BlockControls>
			}
			<div
				className={`blockons-image-carousel-slider`}
				id={uniqueId}
				data-settings={JSON.stringify(sliderOptions)}
				data-slides={carouselNumber}
			>
				<div
					className={`blockons-imgcarousel-wrap ${
						controlsOnHover ? "on-hover" : ""
					} ${carouselNumber === 1 ? "carousel-resize" : ""} ${
						captionOnHover ? "cap-hover" : ""
					} arrow-style-${arrowStyle} pagination-${carouselPagDesign} caption-${captionPosition} ${
						needsReload &&
						(initCarouselType === "slide" || initCarouselType === "loop") &&
						carouselType === "fade"
							? "reload-fix"
							: ""
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
												{slides.length
													? __("Add Images to Carousel")
													: __("Create Image Carousel Gallery")}
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
