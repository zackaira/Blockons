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
	TextControl,
	SelectControl,
	RangeControl,
	Button,
} from "@wordpress/components";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import GetPostsSelect from "../_components/GetPostsSelect";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";
import { slugify, sliderArrowIcons } from "../block-global";
import { colorPickerPalette } from "../block-global";
import { Navigation, Pagination, EffectFade, EffectCoverflow } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

const Edit = (props) => {
	const site_url = blockonsObj.apiUrl;
	const {
		isSelected,
		attributes: {
			uniqueId,
			alignment,
			sliderSlides,
			sliderLinks,
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
	const wcActive = blockonsObj.wcActive;

	const blockProps = useBlockProps({
		className: `align-${alignment}`,
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

	console.log(sliderSlides);

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

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "left" : newAlignment,
		});
	};
	// Slider Settings
	const handleSliderImageSelect = (media, id) => {
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					image: {
						id: media.id,
						url: media.url,
						alt: media.alt,
					},
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};
	const handleUpdateSlideLink = (value, id, attr) => {
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					link: {
						...obj.link,
						[attr]: value,
					},
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};
	const handleUpdateSlideButton = (value, id, attr) => {
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					button: {
						...obj.button,
						[attr]: value,
					},
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};

	const handleAddItem = () => {
		const newSlides = [...sliderSlides];
		newSlides.push({
			id: newSlides.length + 1,
			title: "New Title",
		});
		setAttributes({ sliderSlides: newSlides });
	};
	const handleDuplicateItem = (index, slideItem) => {
		const newSlides = [...sliderSlides];
		newSlides.splice(index + 1, 0, {
			id: Math.floor(Math.random() * 700) + 1,
			title: slideItem.title,
		});
		setAttributes({ sliderSlides: newSlides });
	};
	const handleDeleteItem = (index) => {
		const newSlides = [...sliderSlides];
		newSlides.splice(index, 1);
		setAttributes({ sliderSlides: newSlides });
	};

	const slides = sliderSlides.map((slideItem, index) => (
		<div className="swiper-slide-inner">
			<div
				className="blockons-slider-image"
				{...(slideItem.image?.url
					? {
							style: {
								backgroundImage: `url(${slideItem.image.url})`,
							},
					  }
					: {})}
			></div>

			<div className="blockons-slider-inner">
				<div className="blockons-slider-content-bg">BG</div>

				<div className="blockons-slider-content">
					<h4 className="slider-title">{`${slideItem.title} (${slideItem.id})`}</h4>

					<p className="slider-desc">{`${slideItem.subtitle}`}</p>

					{sliderLinks === "button" ||
						(slideItem.link.type === "button" && slideItem.button?.text && (
							<RichText
								tagName="div"
								value={slideItem.button?.text}
								className="slider-button"
								onChange={(newValue) =>
									handleUpdateSlideButton(newValue, slideItem.id, "text")
								}
								allowedFormats={["core/bold", "core/italic"]}
								placeholder={__("Slide Link", "blockons")}
								disableLineBreaks
								style={{
									backgroundColor: slideItem.button?.color,
									color: slideItem.button?.fcolor,
								}}
							/>
						))}
				</div>
			</div>

			<div className="blockons-slider-btns">
				<MediaUpload
					className="components-icon-button components-toolbar__control"
					allowedTypes={["image"]}
					value={slideItem.image}
					onSelect={(media) => handleSliderImageSelect(media, slideItem.id)}
					render={({ open }) => {
						return (
							<Button
								className="blockons-sliderimg-button"
								icon="format-image"
								label={__("Add Slide Image", "blockons")}
								onClick={open}
							/>
						);
					}}
				/>
				<Dropdown
					className="blockons-slide-settings"
					contentClassName="blockons-editor-popup"
					position="bottom left"
					renderToggle={({ isOpen, onToggle }) => (
						<Button
							icon="admin-settings"
							label={__("Slide Settings", "blockons")}
							onClick={onToggle}
						/>
					)}
					renderContent={() => (
						<>
							<SelectControl
								label="Slide Link"
								value={slideItem.link.type}
								options={[
									{ label: "Button Link", value: "button" },
									{ label: "Link Full Slide", value: "full" },
									{ label: "None", value: "none" },
								]}
								onChange={(newValue) =>
									handleUpdateSlideLink(newValue, slideItem.id, "type")
								}
							/>

							{slideItem.link.type !== "none" && (
								<>
									<TextControl
										label="Slide Link URL"
										value={slideItem.link.url}
										onChange={(newValue) =>
											handleUpdateSlideLink(newValue, slideItem.id, "url")
										}
									/>
									<ToggleControl
										label={__("Open in new window", "blockons")}
										checked={slideItem.link.target}
										onChange={(newValue) =>
											handleUpdateSlideLink(newValue, slideItem.id, "target")
										}
									/>
								</>
							)}

							{slideItem.link.type === "button" && (
								<>
									<div className="blockons-divider"></div>

									<p>{__("Button", "blockons")}</p>
									<BlockonsColorpicker
										label={__("Color", "blockons")}
										value={slideItem.button.color}
										onChange={(colorValue) =>
											handleUpdateSlideButton(colorValue, slideItem.id, "color")
										}
										paletteColors={colorPickerPalette}
									/>
									<BlockonsColorpicker
										label={__("Font Color", "blockons")}
										value={slideItem.button.fcolor}
										onChange={(colorValue) =>
											handleUpdateSlideButton(
												colorValue,
												slideItem.id,
												"fcolor"
											)
										}
										paletteColors={colorPickerPalette}
									/>
								</>
							)}
						</>
					)}
				/>
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
						{transition !== "fade" && (
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
					<PanelBody title={__("Slider Posts", "blockons")} initialOpen={false}>
						<SelectControl
							label="Slide Links"
							value={sliderLinks}
							options={[
								{ label: "Button Link", value: "button" },
								{ label: "Link Full Slide", value: "full" },
								{ label: "None", value: "none" },
							]}
							onChange={(newValue) =>
								setAttributes({
									sliderLinks: newValue === undefined ? "button" : newValue,
								})
							}
						/>
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
				className={`blockons-slider ${
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
