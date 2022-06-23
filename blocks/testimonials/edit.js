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
	MediaUpload,
} from "@wordpress/block-editor";
import {
	PanelBody,
	Dropdown,
	ToggleControl,
	SelectControl,
	CheckboxControl,
	TextControl,
	RangeControl,
	ColorPalette,
	Icon,
	Button,
} from "@wordpress/components";
import { Splide, SplideTrack, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";
import { slugify, sliderArrowIcons } from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			alignment,
			slidesNumber,
			slides,
			slidesLayout,
			slidesWidth,
			sliderLoop,
			controlsOnHover,
			authPosition,
			showQuotes,
			quoteSize,
			sliderArrows,
			sliderArrowIcon,
			sliderPagination,
			sliderPagDesign,
		},
		setAttributes,
	} = props;

	const blockProps = useBlockProps({
		className: `${alignment} layout-${slidesLayout}`,
	});

	// Slider Settings
	const sliderOptions = {
		type: "slide",
		rewind: true,
		speed: 1000,
		// autoplay: false,
		// interval: 4000, // For autoplay
		// pauseOnHover: false, // For autoplay
		arrows: sliderArrows,
		pagination: sliderPagination,
	};

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "none" : "align-" + newAlignment,
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
	const handleItemTextChange = (itemText, itemId) => {
		const newSlides = [...slides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemText: itemText,
				};
			return obj;
		});
		setAttributes({ slides: editedSlideItems });
	};
	const handleItemAuthorPosChange = (itemAuthorPos, itemId) => {
		const newSlides = [...slides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemAuthorPos: itemAuthorPos,
				};
			return obj;
		});
		setAttributes({ slides: editedSlideItems });
	};
	const handleMediaSelect = (media, itemId) => {
		const newSlides = [...slides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemImg: {
						id: media.id,
						url: media.url,
						alt: media.alt,
					},
				};
			return obj;
		});
		setAttributes({ slides: editedSlideItems });
	};
	const handleMediaRemove = (itemId) => {
		const newSlides = [...slides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemImg: {},
				};
			return obj;
		});
		setAttributes({ slides: editedSlideItems });
	};

	// Add Slide
	const handleAddItem = () => {
		const newSlides = [...slides];
		newSlides.push({
			itemId: newSlides.length + 1,
			itemText:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et augue placerat sem condimentum porta quis in quam. Cras dignissim felis gravida volutpat finibus.",
			itemAuthor: "Joe Soap",
			itemAuthorPos: "Owner at Macabee",
			itemImg: "",
		});
		setAttributes({ slides: newSlides });
	};

	const handleRemoveItem = (index) => {
		const newSlides = [...slides];
		newSlides.splice(index, 1);
		setAttributes({ slides: newSlides });
	};

	const handleDuplicateItem = (index, text, author, position, image) => {
		const newSlides = [...slides];
		newSlides.splice(index + 1, 0, {
			itemId: Math.floor(Math.random() * 700) + 1,
			itemText: text,
			itemAuthor: author,
			itemAuthorPos: position,
			itemImg: image,
		});
		setAttributes({ slides: newSlides });
		// instanceRef.current.update();
	};

	// Testimonials Arrows
	function SlideArrow({ prev }) {
		return (
			<button
				className={`splide__arrow ${
					prev ? "splide__arrow--prev" : "splide__arrow--next"
				}`}
			>
				<FontAwesomeIcon
					size={24}
					icon={
						prev ? sliderArrowIcon.replace("right", "left") : sliderArrowIcon
					}
				/>
			</button>
		);
	}

	// Testimonials Items
	let sliderSlideItems;

	if (slides.length) {
		sliderSlideItems = slides.map((slideItem, index) => {
			return (
				<SplideSlide>
					<div
						className="blockons-slide-inner"
						style={{
							maxWidth: slidesWidth,
						}}
					>
						<div className="blockons-slide-text">
							{showQuotes && (
								<FontAwesomeIcon iconSize={quoteSize} icon="quote-left" />
							)}
							<RichText
								tagName="div"
								placeholder={__("Testimonial Text", "blockons")}
								value={slideItem.itemText}
								multiline={false}
								className="blockons-slide-text-txt"
								onChange={(newText) =>
									handleItemTextChange(newText, slideItem.itemId)
								}
							/>
							{showQuotes && (
								<FontAwesomeIcon iconSize={quoteSize} icon="quote-right" />
							)}
						</div>
						<div className="blockons-slide-author">
							<div
								className={`blockons-slide-author-img ${
									slideItem.itemImg && slideItem.itemImg.url
										? "hasimg"
										: "noimg"
								}`}
								style={{
									...(slideItem.itemImg && slideItem.itemImg.url
										? { backgroundImage: `url(${slideItem.itemImg.url})` }
										: ""),
								}}
							>
								<MediaUpload
									className="components-icon-button components-toolbar__control"
									allowedTypes={["image"]}
									value={slideItem.itemImg}
									onSelect={(media) =>
										handleMediaSelect(media, slideItem.itemId)
									}
									render={({ open }) => {
										return (
											<>
												{slideItem.itemImg && slideItem.itemImg.url && (
													<Button
														className="blockons-upload-remove"
														onClick={() => handleMediaRemove(slideItem.itemId)}
													>
														X
													</Button>
												)}
												{slideItem.itemImg && !slideItem.itemImg.url && (
													<Button
														className="blockons-upload-button"
														onClick={open}
													>
														<FontAwesomeIcon icon="user" iconSize={18} />
													</Button>
												)}
											</>
										);
									}}
								/>
							</div>
							<div className="blockons-slide-author-txt">
								<RichText
									tagName="div"
									placeholder={__("Author", "blockons")}
									value={slideItem.itemAuthor}
									multiline={false}
									className="blockons-slide-author-txt-auth"
									onChange={(newName) =>
										handleItemAuthorChange(newName, slideItem.itemId)
									}
								/>
								{authPosition && (
									<RichText
										tagName="div"
										placeholder={__("Position", "blockons")}
										value={slideItem.itemAuthorPos}
										multiline={false}
										className="blockons-slide-author-txt-pos"
										onChange={(newAuthorPos) =>
											handleItemAuthorPosChange(newAuthorPos, slideItem.itemId)
										}
									/>
								)}
							</div>
						</div>
					</div>
					<div className="blockons-item-btns">
						<Dropdown
							className="blockons-item-level-settings"
							contentClassName="blockons-editor-popup"
							position="bottom right"
							renderToggle={({ isOpen, onToggle }) => (
								<Button
									icon="art"
									label={__("Slide Settings", "blockons")}
									onClick={onToggle}
									aria-expanded={isOpen}
								/>
							)}
							renderContent={() => <>Settings coming soon...</>}
						/>
						<Button
							className="blockons-duplicate-item"
							icon="admin-page"
							label="Duplicate Item"
							onClick={() =>
								handleDuplicateItem(
									index,
									slideItem.itemText,
									slideItem.itemAuthor,
									slideItem.itemAuthorPos,
									slideItem.itemImg
								)
							}
						/>
						<Button
							className="blockons-remove-item"
							icon="no-alt"
							label="Delete Item"
							onClick={() => handleRemoveItem(index)}
						/>
					</div>
				</SplideSlide>
			);
		});
	}

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Testimonials Settings", "blockons")}
						initialOpen={true}
					>
						<RangeControl
							label={__("Number of Slides to Show", "blockons")}
							value={slidesNumber}
							onChange={(value) =>
								setAttributes({
									slidesNumber: value === undefined ? 1 : value,
								})
							}
							min={1}
							max={3}
						/>

						<SelectControl
							label="Testimonials Layout"
							value={slidesLayout}
							options={[
								{ label: "Default Layout", value: "one" },
								{ label: "Side Layout", value: "two" },
								{ label: "Author Top Layout", value: "three" },
							]}
							onChange={(value) => setAttributes({ slidesLayout: value })}
						/>

						<RangeControl
							label={__("Content Max Width", "blockons")}
							value={slidesWidth}
							onChange={(value) =>
								setAttributes({
									slidesWidth: value === undefined ? 800 : value,
								})
							}
							min={400}
							max={1000}
						/>

						<ToggleControl // This setting is just for displaying the drop down, value is not saved.
							label={__("Loop/Infinite Sliding", "blockons")}
							checked={sliderLoop}
							onChange={(value) => setAttributes({ sliderLoop: value })}
						/>
						<ToggleControl // This setting is just for displaying the drop down, value is not saved.
							label={__("Show Controls only on Hover", "blockons")}
							checked={controlsOnHover}
							onChange={(value) => setAttributes({ controlsOnHover: value })}
						/>
						<ToggleControl // This setting is just for displaying the drop down, value is not saved.
							label={__("Show Author Position", "blockons")}
							checked={authPosition}
							onChange={(value) => setAttributes({ authPosition: value })}
						/>
						<ToggleControl // This setting is just for displaying the drop down, value is not saved.
							label={__("Show Quotes", "blockons")}
							checked={showQuotes}
							onChange={(value) => setAttributes({ showQuotes: value })}
						/>
						{showQuotes && (
							<RangeControl
								label={__("Quotes Size", "blockons")}
								value={quoteSize}
								onChange={(value) =>
									setAttributes({
										quoteSize: value === undefined ? 24 : value,
									})
								}
								min={18}
								max={54}
							/>
						)}
					</PanelBody>
					<PanelBody
						title={__("Testimonials Design", "blockons")}
						initialOpen={false}
					>
						empty
					</PanelBody>
					<PanelBody
						title={__("Testimonials Slider Controls", "blockons")}
						initialOpen={false}
					>
						<ToggleControl // This setting is just for displaying the drop down, value is not saved.
							label={__("Show Arrows", "blockons")}
							checked={sliderArrows}
							onChange={(value) => setAttributes({ sliderArrows: value })}
						/>

						{sliderArrows && (
							<>
								<div className="blockons-icon-text-select">
									<Dropdown
										className="blockons-icon-selecter"
										contentClassName="blockons-editor-popup"
										position="bottom right"
										renderToggle={({ isOpen, onToggle }) => (
											<FontAwesomeIcon
												icon={sliderArrowIcon}
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
														setAttributes({ sliderArrowIcon: icon })
													}
												/>
											))
										}
									/>
									<p>{__("Select Slider Arrow Icons", "blockons")}</p>
								</div>
							</>
						)}

						<ToggleControl // This setting is just for displaying the drop down, value is not saved.
							label={__("Show Pagination", "blockons")}
							checked={sliderPagination}
							onChange={(value) => setAttributes({ sliderPagination: value })}
						/>
						{sliderPagination && (
							<>
								<SelectControl
									label="Testimonials Layout"
									value={sliderPagDesign}
									options={[
										{ label: "Dots", value: "dots" },
										{ label: "Numbers", value: "numbers" },
									]}
									onChange={(value) =>
										setAttributes({
											sliderPagDesign: value === undefined ? "dots" : value,
										})
									}
								/>
							</>
						)}
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<AlignmentToolbar value={alignment} onChange={onChangeAlignment} />
				</BlockControls>
			}
			<div className={`blockons-testimonials-slider`}>
				<div
					className={`blockons-slider-wrap ${
						controlsOnHover ? "on-hover" : ""
					}`}
				>
					<Splide
						hasTrack={false}
						options={sliderOptions}
						onMounted={(splide, prev, next) => {
							console.log("Mounted");
							console.log(splide);

							// const bar = splide.root.querySelector(".my-slider-progress-bar");
							// const end = splide.Components.Controller.getEnd() + 1;
							// bar.style.width = String((100 * (splide.index + 1)) / end) + "%";
						}}
						onMove={(splide, prev, next) => {
							console.log("Moved");

							// const bar = splide.root.querySelector(".my-slider-progress-bar");
							// const end = splide.Components.Controller.getEnd() + 1;
							// bar.style.width = String((100 * (splide.index + 1)) / end) + "%";
						}}
					>
						<SplideTrack>{sliderSlideItems}</SplideTrack>

						{sliderArrows && (
							<div className="splide__arrows">
								<SlideArrow prev />
								<SlideArrow />
							</div>
						)}

						<div className="splide__progress">
							<div className="splide__progress__bar" />
						</div>
					</Splide>
				</div>
				{isSelected && (
					<div
						className={`blockons-add-new ${
							sliderSlideItems === undefined ? "no-slides" : "has-slides"
						}`}
					>
						<Button variant="secondary" onClick={handleAddItem}>
							{__("Add Another Slide", "blockons")}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Edit;
