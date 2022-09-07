/**
 * WordPress dependencies
 */
import { useEffect } from "@wordpress/element";
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
			slidesNumber,
			slides,
			slidesStyle,
			noShadow,
			slidesLayout,
			slidesWidth,
			sliderRewind,
			showStars,
			authPosition,
			authIcon,
			showQuotes,
			quoteSize,
			controlsOnHover,
			sliderAuto,
			sliderArrows,
			arrowStyle,
			sliderArrowIcon,
			sliderPagination,
			sliderPagDesign,
			bgColor,
			fontColor,
			quotesColor,
			quotesOpacity,
			nameColor,
			posColor,
		},
		setAttributes,
	} = props;

	const blockProps = useBlockProps({
		className: `align-${alignment} layout-${slidesLayout} style-${slidesStyle} ${
			noShadow ? "no-outer" : ""
		} arrows-${sliderArrowIcon}`,
	});

	// Slider Settings
	const sliderOptions = {
		type: "slide", // slide | loop | fade
		rewind: sliderRewind,
		speed: 1000,
		perPage: slidesNumber,
		perView: 1,
		gap: 10,
		autoplay: false,
		arrows: sliderArrows,
		pagination: sliderPagination,
		classes: {
			arrow: "splide__arrow fa-solid",
		},
	};

	useEffect(() => {
		setAttributes({
			uniqueId: uuidv4(),
		});
	}, []);

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
	const handleItemRatingChange = (itemRating, itemId) => {
		const newSlides = [...slides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemRating: itemRating,
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
			itemImg: {},
			itemRating: 5,
		});
		setAttributes({ slides: newSlides });
	};

	const handleRemoveItem = (index) => {
		const newSlides = [...slides];
		newSlides.splice(index, 1);
		setAttributes({ slides: newSlides });
	};

	const handleDuplicateItem = (
		index,
		text,
		author,
		position,
		image,
		rating
	) => {
		const newSlides = [...slides];
		newSlides.splice(index + 1, 0, {
			itemId: Math.floor(Math.random() * 700) + 1,
			itemText: text,
			itemAuthor: author,
			itemAuthorPos: position,
			itemImg: image,
			itemRating: rating,
		});
		setAttributes({ slides: newSlides });
		// instanceRef.current.update();
	};

	// Testimonials Items
	let sliderSlideItems;

	if (slides.length) {
		sliderSlideItems = slides.map((slideItem, index) => {
			return (
				<SplideSlide>
					<div
						className="blockons-slide-inner"
						style={{
							width: slidesWidth + "%",
							...(slidesStyle === "two" ? { backgroundColor: bgColor } : ""),
						}}
					>
						<div
							className="blockons-slide-text"
							style={{
								...(slidesStyle === "three"
									? { backgroundColor: bgColor }
									: ""),
								color: fontColor,
							}}
						>
							{showStars && (
								<div className="blockons-star-ratings">
									<span
										className={`fa-solid fa-star blockons-star ${
											slideItem.itemRating >= 1 ? "checked" : ""
										}`}
										onClick={() => handleItemRatingChange(1, slideItem.itemId)}
									></span>
									<span
										className={`fa-solid fa-star blockons-star ${
											slideItem.itemRating >= 2 ? "checked" : ""
										}`}
										onClick={() => handleItemRatingChange(2, slideItem.itemId)}
									></span>
									<span
										className={`fa-solid fa-star blockons-star ${
											slideItem.itemRating >= 3 ? "checked" : ""
										}`}
										onClick={() => handleItemRatingChange(3, slideItem.itemId)}
									></span>
									<span
										className={`fa-solid fa-star blockons-star ${
											slideItem.itemRating >= 4 ? "checked" : ""
										}`}
										onClick={() => handleItemRatingChange(4, slideItem.itemId)}
									></span>
									<span
										className={`fa-solid fa-star blockons-star ${
											slideItem.itemRating >= 5 ? "checked" : ""
										}`}
										onClick={() => handleItemRatingChange(5, slideItem.itemId)}
									></span>
								</div>
							)}

							{slidesStyle === "three" && (
								<span
									className="corner"
									style={{
										...(slidesStyle === "three"
											? { borderColor: bgColor }
											: ""),
									}}
								></span>
							)}

							{showQuotes && (
								<FontAwesomeIcon
									iconSize={quoteSize}
									icon="quote-left"
									style={{
										color: quotesColor,
										opacity: quotesOpacity,
									}}
								/>
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
								<FontAwesomeIcon
									iconSize={quoteSize}
									icon="quote-right"
									style={{
										color: quotesColor,
										opacity: quotesOpacity,
									}}
								/>
							)}
						</div>
						<div className="blockons-slide-author">
							{authIcon && (
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
															onClick={() =>
																handleMediaRemove(slideItem.itemId)
															}
														>
															X
														</Button>
													)}
													{slideItem.itemImg && !slideItem.itemImg.url && (
														<Button
															className="blockons-upload-button"
															onClick={open}
														>
															<FontAwesomeIcon
																icon="user"
																iconSize={18}
																color={"inherit"}
															/>
														</Button>
													)}
												</>
											);
										}}
									/>
								</div>
							)}
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
									style={{
										color: nameColor,
									}}
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
										style={{
											color: posColor,
										}}
									/>
								)}
							</div>
						</div>
					</div>
					{isSelected && (
						<div className="blockons-item-btns">
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
										slideItem.itemImg,
										slideItem.itemRating
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
							max={4}
						/>

						<SelectControl
							label="Style"
							value={slidesStyle}
							options={[
								{ label: "Plain", value: "one" },
								{ label: "Drop Shadows", value: "two" },
								{ label: "Bubble", value: "three" },
							]}
							onChange={(value) => setAttributes({ slidesStyle: value })}
						/>
						{slidesStyle === "two" && (
							<ToggleControl
								label={__("Remove Outer Shadow", "blockons")}
								checked={noShadow}
								onChange={(value) => setAttributes({ noShadow: value })}
							/>
						)}
						<SelectControl
							label="Layout"
							value={slidesLayout}
							options={[
								{ label: "Default Layout", value: "one" },
								{ label: "Side Layout", value: "two" },
								{ label: "Author Top Layout", value: "three" },
							]}
							onChange={(value) => setAttributes({ slidesLayout: value })}
						/>

						<RangeControl
							label={__("Inner Content Width", "blockons")}
							value={slidesWidth}
							onChange={(value) =>
								setAttributes({
									slidesWidth: value === undefined ? 75 : value,
								})
							}
							min={30}
							max={100}
						/>

						<ToggleControl
							label={__("Auto Play", "blockons")}
							checked={sliderAuto}
							onChange={(value) => setAttributes({ sliderAuto: value })}
							help={__(
								"This will only work on the site front-end. Turn on 'Rewind Slider' for an infinite loop",
								"blockons"
							)}
						/>

						<ToggleControl
							label={__("Rewind Slider", "blockons")}
							checked={sliderRewind}
							onChange={(value) => setAttributes({ sliderRewind: value })}
						/>
					</PanelBody>
					<PanelBody
						title={__("Testimonials Design", "blockons")}
						initialOpen={false}
					>
						<ToggleControl
							label={__("Show Star Rating", "blockons")}
							checked={showStars}
							onChange={(value) => setAttributes({ showStars: value })}
							help={__(
								"Edit star ratings by clicking on the stars",
								"blockons"
							)}
						/>

						<ToggleControl
							label={__("Show Author Position", "blockons")}
							checked={authPosition}
							onChange={(value) => setAttributes({ authPosition: value })}
						/>
						<ToggleControl
							label={__("Show Author Image / Icon", "blockons")}
							checked={authIcon}
							onChange={(value) => setAttributes({ authIcon: value })}
						/>
						<ToggleControl
							label={__("Show Quotes", "blockons")}
							checked={showQuotes}
							onChange={(value) => setAttributes({ showQuotes: value })}
						/>
						{showQuotes && (
							<>
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
								<BlockonsColorpicker
									label={__("Quotes Color", "blockons")}
									value={quotesColor}
									onChange={(colorValue) => {
										setAttributes({
											quotesColor:
												colorValue === undefined ? "#000" : colorValue,
										});
									}}
									paletteColors={colorPickerPalette}
								/>
								<RangeControl
									label={__("Quotes Opacity", "blockons")}
									value={quotesOpacity}
									onChange={(value) =>
										setAttributes({
											quotesOpacity: value === undefined ? 0.4 : value,
										})
									}
									min={0}
									max={1}
									step={0.1}
								/>
							</>
						)}

						{(slidesStyle === "two" || slidesStyle === "three") && (
							<BlockonsColorpicker
								label={__("Background Color", "blockons")}
								value={bgColor}
								onChange={(colorValue) => {
									setAttributes({
										bgColor: colorValue === undefined ? "#f9f9f9" : colorValue,
									});
								}}
								paletteColors={colorPickerPalette}
							/>
						)}

						<BlockonsColorpicker
							label={__("Font Color", "blockons")}
							value={fontColor}
							onChange={(colorValue) => {
								setAttributes({
									fontColor: colorValue === undefined ? "#4f4f4f" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>

						<BlockonsColorpicker
							label={__("Author Name Color", "blockons")}
							value={nameColor}
							onChange={(colorValue) => {
								setAttributes({
									nameColor: colorValue === undefined ? "#4f4f4f" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>

						{authPosition && (
							<BlockonsColorpicker
								label={__("Author Position Color", "blockons")}
								value={posColor}
								onChange={(colorValue) => {
									setAttributes({
										posColor: colorValue === undefined ? "#4f4f4f" : colorValue,
									});
								}}
								paletteColors={colorPickerPalette}
							/>
						)}
					</PanelBody>
					<PanelBody
						title={__("Testimonials Slider Controls", "blockons")}
						initialOpen={false}
					>
						<ToggleControl
							label={__("Show Arrows", "blockons")}
							checked={sliderArrows}
							onChange={(value) => setAttributes({ sliderArrows: value })}
						/>

						{sliderArrows && (
							<>
								{(slidesStyle === "two" || slidesStyle === "three") && (
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

						<ToggleControl
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

						{(sliderArrows || sliderPagination) && (
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
				className={`blockons-testimonials-slider`}
				id={uniqueId}
				data-settings={JSON.stringify(sliderOptions)}
			>
				{sliderSlideItems ? (
					<>
						<div
							className={`blockons-slider-wrap ${
								controlsOnHover ? "on-hover" : ""
							} arrow-style-${arrowStyle} pagination-${sliderPagDesign}`}
						>
							<Splide options={sliderOptions}>{sliderSlideItems}</Splide>
						</div>
						{isSelected && (
							<div
								className={`blockons-add-new ${
									sliderSlideItems === undefined ? "no-slides" : "has-slides"
								}`}
							>
								<Button variant="secondary" onClick={handleAddItem}>
									{__("Add Another testimonial", "blockons")}
								</Button>
							</div>
						)}
					</>
				) : (
					<div className="blockons-noslides">
						<div className="blockons-add-new">
							<Button variant="secondary" onClick={handleAddItem}>
								{__("Add your first slide", "blockons")}
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Edit;
