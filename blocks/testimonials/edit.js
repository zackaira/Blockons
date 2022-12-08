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
	RangeControl,
	Button,
} from "@wordpress/components";
import { v4 as uuidv4 } from "uuid";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";
import { slugify, sliderArrowIcons } from "../block-global";
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
			testStyle,
			testLayout,
			showStars,
			showQuotes,
			showPosition,
			showIcon,
			quoteSize,
			bgColor,
			fontColor,
			quotesColor,
			quotesOpacity,
			nameColor,
			posColor,
			transition,
			perView,
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

	const blockProps = useBlockProps({
		className: `align-${alignment} layout-${testLayout} style-${testStyle}`,
	});
	const [needsReload, setNeedsReload] = useState(false);
	const [reloads, setReloads] = useState({ transition, mode });

	useEffect(() => {
		if (!uniqueId) {
			setAttributes({
				uniqueId: uuidv4(),
			});
		}
	}, []);

	const sliderOptions = {
		modules: [Navigation, Pagination, EffectFade, EffectCoverflow],
		autoHeight: true,
		effect: transition,
		slidesPerView: transition === "slide" ? perView : 1,
		spaceBetween: spaceBetween,
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

	useEffect(() => {}, []);

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "left" : newAlignment,
		});
	};

	const handleAddItem = () => {
		const newSlides = [...sliderSlides];
		newSlides.push({
			id: newSlides.length + 1,
			title:
				"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et augue placerat sem condimentum porta quis in quam. Cras dignissim felis gravida volutpat finibus.",
			author: "Joe Soap",
			authorPos: "Owner at Macabee",
			authorImg: {},
			rating: 5,
		});
		setAttributes({ sliderSlides: newSlides });
	};
	const handleDuplicateItem = (index, slideItem) => {
		const newSlides = [...sliderSlides];
		newSlides.splice(index + 1, 0, {
			id: Math.floor(Math.random() * 700) + 1,
			title: slideItem.title,
			author: slideItem.author,
			authorPos: slideItem.authorPos,
			authorImg: slideItem.authorImg,
			rating: slideItem.rating,
		});
		setAttributes({ sliderSlides: newSlides });
	};
	const handleDeleteItem = (index) => {
		const newSlides = [...sliderSlides];
		newSlides.splice(index, 1);
		setAttributes({ sliderSlides: newSlides });
	};

	// Item Controls Functions
	const handleItemAuthorChange = (author, id) => {
		const newSlides = [...sliderSlides];
		// Edit the item text and ID (this prevent the edit from editing all instances if the block is duplicated)
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					id: id === "" ? Math.floor(Math.random() * 800) : slugify(author),
					author: author,
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};
	const handleItemTextChange = (title, id) => {
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					title: title,
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};
	const handleItemAuthorPosChange = (authorPos, id) => {
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					authorPos: authorPos,
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};
	const handleItemRatingChange = (rating, id) => {
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					rating: rating,
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};
	const handleMediaSelect = (media, id) => {
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					authorImg: {
						id: media.id,
						url: media.url,
						alt: media.alt,
					},
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};
	const handleMediaRemove = (id) => {
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					authorImg: {},
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};

	const slides = sliderSlides.map((slideItem, index) => (
		<div className="swiper-slide-inner">
			<div
				className="blockons-slide-text"
				style={{
					...(testStyle === "two" ? { backgroundColor: bgColor } : ""),
					color: fontColor,
				}}
			>
				{showStars && (
					<div className="blockons-star-ratings">
						<span
							className={`fa-solid fa-star blockons-star ${
								slideItem.rating >= 1 ? "checked" : ""
							}`}
							onClick={() => handleItemRatingChange(1, slideItem.id)}
						></span>
						<span
							className={`fa-solid fa-star blockons-star ${
								slideItem.rating >= 2 ? "checked" : ""
							}`}
							onClick={() => handleItemRatingChange(2, slideItem.id)}
						></span>
						<span
							className={`fa-solid fa-star blockons-star ${
								slideItem.rating >= 3 ? "checked" : ""
							}`}
							onClick={() => handleItemRatingChange(3, slideItem.id)}
						></span>
						<span
							className={`fa-solid fa-star blockons-star ${
								slideItem.rating >= 4 ? "checked" : ""
							}`}
							onClick={() => handleItemRatingChange(4, slideItem.id)}
						></span>
						<span
							className={`fa-solid fa-star blockons-star ${
								slideItem.rating >= 5 ? "checked" : ""
							}`}
							onClick={() => handleItemRatingChange(5, slideItem.id)}
						></span>
					</div>
				)}

				{testStyle === "two" && (
					<span
						className="corner"
						style={{
							borderColor: bgColor,
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
					value={slideItem.title}
					multiline={false}
					className="blockons-slide-text-txt"
					onChange={(newText) => handleItemTextChange(newText, slideItem.id)}
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
				{showIcon && (
					<div
						className={`blockons-slide-author-img ${
							slideItem.authorImg && slideItem.authorImg.url
								? "hasimg"
								: "noimg"
						}`}
						style={{
							...(slideItem.authorImg && slideItem.authorImg.url
								? { backgroundImage: `url(${slideItem.authorImg.url})` }
								: ""),
						}}
					>
						<MediaUpload
							className="components-icon-button components-toolbar__control"
							allowedTypes={["image"]}
							value={slideItem.authorImg}
							onSelect={(media) => handleMediaSelect(media, slideItem.id)}
							render={({ open }) => {
								return (
									<>
										{slideItem.authorImg && slideItem.authorImg.url && (
											<Button
												className="blockons-upload-remove"
												onClick={() => handleMediaRemove(slideItem.id)}
											>
												X
											</Button>
										)}
										{slideItem.authorImg && !slideItem.authorImg.url && (
											<Button className="blockons-upload-button" onClick={open}>
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
						value={slideItem.author}
						multiline={false}
						className="blockons-slide-author-txt-auth"
						onChange={(newName) =>
							handleItemAuthorChange(newName, slideItem.id)
						}
						style={{
							color: nameColor,
						}}
					/>
					{showPosition && (
						<RichText
							tagName="div"
							placeholder={__("Position", "blockons")}
							value={slideItem.authorPos}
							multiline={false}
							className="blockons-slide-author-txt-pos"
							onChange={(newAuthorPos) =>
								handleItemAuthorPosChange(newAuthorPos, slideItem.id)
							}
							style={{
								color: posColor,
							}}
						/>
					)}
				</div>
			</div>

			<div className="blockons-slider-btns">
				<Button
					className="blockons-slide-add"
					icon="plus-alt"
					label="Add New Slide"
					onClick={() => handleAddItem(index)}
				/>
				<Button
					className="blockons-slide-duplicate"
					icon="admin-page"
					label="Duplicate Slide"
					onClick={() => handleDuplicateItem(index, slideItem)}
				/>
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
						/>
						<div className="blockons-divider"></div>
						{transition !== "fade" && (
							<>
								<RangeControl
									label={__("Slides Per View", "blockons")}
									value={perView}
									onChange={(newValue) =>
										setAttributes({
											perView: newValue === undefined ? 1 : parseInt(newValue),
										})
									}
									min={1}
									max={sliderSlides.length < 4 ? sliderSlides.length : 4}
								/>
								<div className="blockons-divider"></div>
							</>
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
						/>
						<div className="blockons-divider"></div>
						<RangeControl
							label={__("Space Between Slides", "blockons")}
							value={spaceBetween}
							onChange={(newValue) =>
								setAttributes({
									spaceBetween: newValue === undefined ? 0 : parseInt(newValue),
								})
							}
							min={0}
							max={200}
							step={10}
						/>
					</PanelBody>
					<PanelBody
						title={__("Testimonials Design", "blockons")}
						initialOpen={false}
					>
						<SelectControl
							label="Style"
							value={testStyle}
							options={[
								{ label: "Plain", value: "one" },
								{ label: "Bubble", value: "two" },
							]}
							onChange={(newValue) => setAttributes({ testStyle: newValue })}
						/>
						<SelectControl
							label="Layout"
							value={testLayout}
							options={[
								{ label: "Default Layout", value: "one" },
								{ label: "Side Layout", value: "two" },
								{ label: "Author Top Layout", value: "three" },
							]}
							onChange={(newValue) => setAttributes({ testLayout: newValue })}
						/>
						<div className="blockons-divider"></div>

						<ToggleControl
							label={__("Show Star Rating", "blockons")}
							checked={showStars}
							onChange={(newValue) => setAttributes({ showStars: newValue })}
							help={__(
								"Edit star ratings by clicking on the stars",
								"blockons"
							)}
						/>
						<ToggleControl
							label={__("Show Author Position", "blockons")}
							checked={showPosition}
							onChange={(newValue) => setAttributes({ showPosition: newValue })}
						/>
						<ToggleControl
							label={__("Show Author Image / Icon", "blockons")}
							checked={showIcon}
							onChange={(newValue) => setAttributes({ showIcon: newValue })}
						/>
						<ToggleControl
							label={__("Show Quotes", "blockons")}
							checked={showQuotes}
							onChange={(newValue) => setAttributes({ showQuotes: newValue })}
						/>

						{showQuotes && (
							<>
								<RangeControl
									label={__("Quotes Size", "blockons")}
									value={quoteSize}
									onChange={(newValue) =>
										setAttributes({
											quoteSize:
												newValue === undefined ? 24 : parseInt(newValue),
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
									onChange={(newValue) =>
										setAttributes({
											quotesOpacity: newValue === undefined ? 0.4 : newValue,
										})
									}
									min={0}
									max={1}
									step={0.1}
								/>
								<div className="blockons-divider"></div>
							</>
						)}

						{testStyle === "two" && (
							<>
								<BlockonsColorpicker
									label={__("Background Color", "blockons")}
									value={bgColor}
									onChange={(colorValue) => {
										setAttributes({
											bgColor:
												colorValue === undefined ? "#f0f0f0" : colorValue,
										});
									}}
									paletteColors={colorPickerPalette}
								/>
								<div className="blockons-divider"></div>
							</>
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
						<div className="blockons-divider"></div>

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
						{showPosition && (
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
						title={__("Slider Controls", "blockons")}
						initialOpen={false}
					>
						<ToggleControl
							label={__("Show Navigation", "blockons")}
							checked={navigation}
							onChange={(newValue) => setAttributes({ navigation: newValue })}
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
								/>

								<div className="blockons-icon-select">
									<Dropdown
										className="blockons-icon-selector"
										contentClassName="blockons-editor-popup icon-selector"
										position="bottom right"
										renderToggle={({ isOpen, onToggle }) => (
											<FontAwesomeIcon
												icon={navigationArrow}
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
							onChange={(newValue) => setAttributes({ pagination: newValue })}
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
			<div
				className={`blockons-slider slider ${
					showOnHover ? "controlsOnHover" : ""
				} navigation-${navigationStyle} navigation-${navigationColor} pagination-${paginationStyle} pagination-${paginationColor} ${
					navigationArrow === "ban" ? "default-icon" : "custom-icon"
				} arrows-${navigationArrow}`}
				id={uniqueId}
			>
				{needsReload && (
					<div className="blockons-slider-reload">
						<div className="blockons-slider-reload-inner">
							{__("Please Save or Update and reload the page", "blockons")}
						</div>
					</div>
				)}
				<Swiper {...sliderOptions}>
					{slides.map((slideContent, index) => (
						<SwiperSlide>{slideContent}</SwiperSlide>
					))}
				</Swiper>
			</div>
		</div>
	);
};

export default Edit;
