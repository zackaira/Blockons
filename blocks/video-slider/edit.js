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
	TextControl,
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
import { blockonsSlideVideoAction } from "./video-actions";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			uniqueId,
			alignment,
			sliderSlides,
			sliderStyle,
			sliderRoundNess,
			sliderBorderWidth,
			sliderOuterRound,
			sliderBorderColor,
			transition,
			mode,
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
		className: `align-${alignment} style-${sliderStyle} rn-${sliderRoundNess}`,
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
		slidesPerView: 1,
		spaceBetween: 0,
		loop: mode === "loop" ? true : false,
		rewind: mode === "rewind" ? true : false,
		simulateTouch: false,
		navigation: navigation,
		pagination: pagination
			? {
					type: paginationStyle === "fraction" ? "fraction" : "bullets",
					dynamicBullets: paginationStyle === "dynamicBullets" ? true : false,
					clickable: false,
			  }
			: false,
	};

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "left" : newAlignment,
		});
	};

	const handleAddItem = () => {
		const newSlides = [...sliderSlides];
		newSlides.push({
			id: newSlides.length + 1,
			videoType: "youtube",
			videoId: "",
			coverImage: {},
			customVideo: {},
		});
		setAttributes({ sliderSlides: newSlides });
	};
	const handleDuplicateItem = (index, slideItem) => {
		const newSlides = [...sliderSlides];
		newSlides.splice(index + 1, 0, {
			id: Math.floor(Math.random() * 700) + 1,
			videoType: slideItem.videoType,
			videoId: slideItem.videoId,
			coverImage: slideItem.coverImage,
			customVideo: slideItem.customVideo,
		});
		setAttributes({ sliderSlides: newSlides });
	};
	const handleDeleteItem = (index) => {
		const newSlides = [...sliderSlides];
		newSlides.splice(index, 1);
		setAttributes({ sliderSlides: newSlides });
	};

	// Item Controls Functions
	const handleItemVideoType = (videoType, id) => {
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					videoType: videoType,
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};
	const handleItemVideoUrl = (videoId, id) => {
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					videoId: videoId,
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};
	// Custom Video
	const handleCustomVideoSelect = (media, id) => {
		console.log(media);
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					customVideo: {
						id: media.id,
						url: media.url,
					},
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};
	const handleCustomVideoRemove = (id) => {
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					customVideo: {},
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};
	// Cover Image
	const handleCoverImageSelect = (media, id) => {
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					coverImage: {
						id: media.id,
						url: media.url,
						alt: media.alt,
					},
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};
	const handleCoverImageRemove = (id) => {
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					coverImage: {},
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};

	const slides = sliderSlides.map((slideItem, index) => (
		<div className="swiper-slide-inner blockons-videos">
			<div className="swiper-slide-video">
				{slideItem.videoType === "youtube" && slideItem.videoId && (
					<iframe
						className="blockons-video youtube"
						width="560"
						height="315"
						src={`https://www.youtube.com/embed/${slideItem.videoId}?enablejsapi=1`}
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>
				)}

				{slideItem.videoType === "vimeo" && slideItem.videoId && (
					<iframe
						className="blockons-video vimeo"
						src={`https://player.vimeo.com/video/${slideItem.videoId}?h=55b3242b2e&title=0&byline=0&portrait=0`}
						frameborder="0"
						allow="autoplay; fullscreen; picture-in-picture"
					></iframe>
				)}

				{slideItem.videoType === "custom" && slideItem.customVideo?.url && (
					<video className="blockons-video custom" controls>
						<source src={slideItem.customVideo.url} type="video/mp4"></source>
						{/* <source src="movie.ogg" type="video/ogg"></source> */}
						{__("Your browser does not support the video tag.", "blockons")}
					</video>
				)}
			</div>

			<div
				className="swiper-slide-img"
				style={{
					...(slideItem.coverImage && slideItem.coverImage.url
						? { backgroundImage: `url(${slideItem.coverImage.url})` }
						: {
								backgroundImage: `url(${blockonsObj.pluginUrl}assets/images/videoslider-placeholder.jpg)`,
						  }),
				}}
			>
				{(((slideItem.videoType === "youtube" ||
					slideItem.videoType === "vimeo") &&
					slideItem.videoId) ||
					(slideItem.videoType === "custom" && slideItem.customVideo?.url)) && (
					<div
						className={`play-button`}
						title={__("The video only plays on the frontend", "blockons")}
					></div>
				)}
			</div>

			<div className="blockons-slider-btns">
				<Dropdown
					className="blockons-vslider-media-settings"
					contentClassName="blockons-editor-popup"
					position="bottom left"
					renderToggle={({ isOpen, onToggle }) => (
						<Button
							icon="format-video"
							label={__("Upload Image and Video", "blockons")}
							onClick={onToggle}
						/>
					)}
					renderContent={() => (
						<>
							<SelectControl
								label="Video Type"
								value={slideItem.videoType}
								options={[
									{ label: "YouTube", value: "youtube" },
									{ label: "Vimeo", value: "vimeo" },
									{ label: "Upload Video", value: "custom" },
								]}
								onChange={(newType) =>
									handleItemVideoType(newType, slideItem.id)
								}
							/>
							{(slideItem.videoType === "youtube" ||
								slideItem.videoType === "vimeo") && (
								<>
									{slideItem.videoType === "youtube" && (
										<p className="blockons-hint">
											{__("Please enter ONLY the video ID", "blockons")}
											<br />
											Eg: youtube.com/watch?v=
											<b>
												<big>Byr4Lr6qUaY</big>
											</b>
										</p>
									)}

									{slideItem.videoType === "vimeo" && (
										<p className="blockons-hint">
											{__("Please enter ONLY the video ID", "blockons")}
											<br />
											Eg: vimeo.com/
											<b>
												<big>230574607</big>
											</b>
										</p>
									)}
									<TextControl
										label="Video ID"
										value={slideItem.videoId}
										onChange={(newId) =>
											handleItemVideoUrl(newId, slideItem.id)
										}
									/>
								</>
							)}
							{slideItem.videoType === "custom" && (
								<>
									<p className="blockons-hint">
										{__("Please ONLY upload mp4 Video", "blockons")}
										<br />
										Eg: VideoName
										<b>
											<big>.mp4</big>
										</b>
									</p>
									<MediaUpload
										className="components-icon-button components-toolbar__control"
										allowedTypes={["video"]}
										value={slideItem.customVideo}
										onSelect={(media) =>
											handleCustomVideoSelect(media, slideItem.id)
										}
										render={({ open }) => {
											return (
												<>
													{slideItem.customVideo && slideItem.customVideo.url && (
														<Button
															className="blockons-upload-button remove"
															onClick={() =>
																handleCustomVideoRemove(slideItem.id)
															}
														>
															{__("Remove Video", "blockons")}
														</Button>
													)}
													{slideItem.customVideo && !slideItem.customVideo.url && (
														<Button
															className="blockons-upload-button"
															onClick={open}
														>
															{__("Upload a Custom Video", "blockons")}
														</Button>
													)}
												</>
											);
										}}
									/>
								</>
							)}

							<div className="blockons-videos-prev">
								{slideItem.videoType === "youtube" && slideItem.videoId && (
									<a
										href={`https://www.youtube.com/watch?v=${slideItem.videoId}`}
										target="_blank"
										className="blockons-confirm-button"
									>
										{__("Check video link", "blockons")}
									</a>
								)}
								{slideItem.videoType === "vimeo" && slideItem.videoId && (
									<a
										href={`https://vimeo.com/${slideItem.videoId}`}
										target="_blank"
										className="blockons-confirm-button"
									>
										{__("Check video link", "blockons")}
									</a>
								)}
								{slideItem.videoType === "custom" &&
									slideItem.customVideo?.url && (
										<video controls width="250">
											<source
												src={slideItem.customVideo.url}
												type="video/mp4"
											/>
										</video>
									)}
							</div>

							<p>{__("Slide Cover Image", "blockons")}</p>
							<MediaUpload
								className="components-icon-button components-toolbar__control"
								allowedTypes={["image"]}
								value={slideItem.coverImage}
								onSelect={(media) =>
									handleCoverImageSelect(media, slideItem.id)
								}
								render={({ open }) => {
									return (
										<>
											{slideItem.coverImage && slideItem.coverImage.url && (
												<div className="blockons-upload-imgpreview">
													<div className="blockons-upload-imgpreview-img">
														<img src={slideItem.coverImage.url} />
													</div>
													<Button
														className="blockons-upload-button remove"
														onClick={() => handleCoverImageRemove(slideItem.id)}
													>
														{__("Remove Cover Image", "blockons")}
													</Button>
												</div>
											)}
											{slideItem.coverImage && !slideItem.coverImage.url && (
												<Button
													className="blockons-upload-button"
													onClick={open}
												>
													{__("Upload a Cover Image", "blockons")}
												</Button>
											)}
										</>
									);
								}}
							/>
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
							]}
							onChange={(newValue) => {
								newValue === reloads.transition
									? setNeedsReload(false)
									: setNeedsReload(true);

								setAttributes({ transition: newValue });
							}}
						/>

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
					</PanelBody>
					<PanelBody title={__("Video Design", "blockons")} initialOpen={false}>
						<SelectControl
							label="Style"
							value={sliderStyle}
							options={[
								{ label: "Plain", value: "one" },
								{ label: "Drop Shadow", value: "two" },
								{ label: "Bordered", value: "three" },
							]}
							onChange={(newValue) => setAttributes({ sliderStyle: newValue })}
						/>
						<div className="blockons-divider"></div>

						<SelectControl
							label="Slider Roundness"
							value={sliderRoundNess}
							options={[
								{ label: "Square", value: "square" },
								{ label: "Rounded", value: "rounded" },
								{ label: "More Round", value: "rounder" },
								{ label: "Very Round", value: "round" },
							]}
							onChange={(newValue) =>
								setAttributes({
									sliderRoundNess: newValue === undefined ? "square" : newValue,
								})
							}
						/>
						{sliderStyle === "three" && (
							<>
								<RangeControl
									label={__("Border Width", "blockons")}
									value={sliderBorderWidth}
									onChange={(newValue) =>
										setAttributes({
											sliderBorderWidth:
												newValue === undefined ? 10 : parseInt(newValue),
										})
									}
									min={2}
									max={80}
								/>
								<RangeControl
									label={__("Outer Border Radius", "blockons")}
									value={sliderOuterRound}
									onChange={(newValue) =>
										setAttributes({
											sliderOuterRound:
												newValue === undefined ? 4 : parseInt(newValue),
										})
									}
									min={0}
									max={100}
								/>
								<BlockonsColorpicker
									label={__("Border Color", "blockons")}
									value={sliderBorderColor}
									onChange={(colorValue) => {
										setAttributes({
											sliderBorderColor:
												colorValue === undefined ? "#000" : colorValue,
										});
									}}
									paletteColors={colorPickerPalette}
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
				className={`blockons-slider video-slider ${
					showOnHover ? "controlsOnHover" : ""
				} navigation-${navigationStyle} navigation-${navigationColor} pagination-${paginationStyle} pagination-${paginationColor} ${
					navigationArrow === "ban" ? "default-icon" : "custom-icon"
				} arrows-${navigationArrow}`}
				id={uniqueId}
				style={{
					...(sliderStyle === "three"
						? {
								padding: sliderBorderWidth,
								borderRadius: sliderOuterRound,
								backgroundColor: sliderBorderColor,
						  }
						: ""),
				}}
			>
				{needsReload && (
					<div className="blockons-slider-reload">
						<div className="blockons-slider-reload-inner">
							{__("Please Save or Update and reload the page", "blockons")}
						</div>
					</div>
				)}
				<Swiper
					{...sliderOptions}
					onSwiper={() => blockonsSlideVideoAction()}
					onSlideChange={() => blockonsSlideVideoAction()}
				>
					{slides.map((slideContent) => (
						<SwiperSlide>{slideContent}</SwiperSlide>
					))}
				</Swiper>
			</div>
		</div>
	);
};

export default Edit;
