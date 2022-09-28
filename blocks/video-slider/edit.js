/**
 * WordPress dependencies
 */
import { useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
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
	TextControl,
	Button,
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import { v4 as uuidv4 } from "uuid";
import { Splide } from "@splidejs/react-splide";
import { Video } from "@splidejs/splide-extension-video";
import "@splidejs/react-splide/css";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";
import { sliderArrowIcons } from "../block-global";
import { colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			uniqueId,
			sliderWidth,
			sliderRewind,
			sliderAlign,
			slides,
			sliderStyle,
			sliderRoundNess,
			sliderBorderWidth,
			sliderOuterRound,
			sliderBorderColor,
			sliderArrowIcon,
			controlsOnHover,
			sliderPagination,
			sliderPagDesign,
		},
		setAttributes,
	} = props;

	const blockProps = useBlockProps({
		className: `${sliderAlign}-align playbtn-one style-${sliderStyle} arrows-${sliderArrowIcon} rn-${sliderRoundNess}`,
	});

	// Slider Settings
	const sliderOptions = {
		heightRatio: 0.5625,
		cover: true,
		rewind: sliderRewind,
		speed: 1000,
		video: {
			loop: true,
			// mute: true,
		},
		arrows: true,
		pagination: sliderPagination,
		classes: {
			arrow: "splide__arrow fa-solid",
		},
	};

	useEffect(() => {
		if (!uniqueId) {
			setAttributes({
				uniqueId: uuidv4(),
			});
		}
	}, []);

	// Item Controls Functions
	const handleItemVideoType = (itemType, itemId) => {
		const newSlides = [...slides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemType: itemType,
				};
			return obj;
		});
		setAttributes({ slides: editedSlideItems });
	};
	const handleItemVideoUrl = (itemUrl, itemId) => {
		const newSlides = [...slides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemUrl: itemUrl,
				};
			return obj;
		});
		setAttributes({ slides: editedSlideItems });
	};
	// Custom Video
	const handleCustomVideoSelect = (media, itemId) => {
		console.log(media);
		const newSlides = [...slides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					customVideo: {
						id: media.id,
						url: media.url,
					},
				};
			return obj;
		});
		setAttributes({ slides: editedSlideItems });
	};
	const handleCustomVideoRemove = (itemId) => {
		const newSlides = [...slides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					customVideo: {},
				};
			return obj;
		});
		setAttributes({ slides: editedSlideItems });
	};
	// Cover Image
	const handleCoverImageSelect = (media, itemId) => {
		const newSlides = [...slides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemImage: {
						id: media.id,
						url: media.url,
						alt: media.alt,
					},
				};
			return obj;
		});
		setAttributes({ slides: editedSlideItems });
	};
	const handleCoverImageRemove = (itemId) => {
		const newSlides = [...slides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemImage: {},
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
			itemType: "youtube",
			itemUrl: "",
			itemImage: {},
			customVideo: {},
		});
		setAttributes({ slides: newSlides });
	};

	const handleRemoveItem = (index) => {
		const newSlides = [...slides];
		newSlides.splice(index, 1);
		setAttributes({ slides: newSlides });
	};

	const handleDuplicateItem = (index, type, url, image, cVideo) => {
		const newSlides = [...slides];
		newSlides.splice(index + 1, 0, {
			itemId: Math.floor(Math.random() * 700) + 1,
			itemType: type,
			itemUrl: url,
			itemImage: image,
			customVideo: cVideo,
		});
		setAttributes({ slides: newSlides });
	};

	// Video Slider Items
	let sliderSlideItems;

	if (slides.length) {
		sliderSlideItems = slides.map((slideItem, index) => {
			return (
				<li className="splide__slide">
					<div
						className="splide-custom-slide"
						style={{
							...(slideItem.itemImage && slideItem.itemImage.url
								? {
										background: `url("${slideItem.itemImage.url}") center center / cover no-repeat`,
								  }
								: ""),
						}}
					>
						<div
							className="play-button"
							title={__("The video only plays on the frontend", "blockons")}
						></div>
					</div>

					<img
						src={`${siteObj.pluginUrl}assets/images/videoslider-placeholder.jpg`}
					/>

					{isSelected && (
						<div className="blockons-item-btns">
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
											value={slideItem.itemType}
											options={[
												{ label: "YouTube", value: "youtube" },
												{ label: "Vimeo", value: "vimeo" },
												{ label: "Upload Video", value: "custom" },
											]}
											onChange={(newType) =>
												handleItemVideoType(newType, slideItem.itemId)
											}
										/>
										{(slideItem.itemType === "youtube" ||
											slideItem.itemType === "vimeo") && (
											<>
												{slideItem.itemType === "youtube" && (
													<p className="blockons-hint">
														{__("Please enter ONLY the video ID", "blockons")}
														<br />
														Eg: youtube.com/watch?v=
														<b>
															<big>Byr4Lr6qUaY</big>
														</b>
													</p>
												)}

												{slideItem.itemType === "vimeo" && (
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
													value={slideItem.itemUrl}
													onChange={(newUrl) =>
														handleItemVideoUrl(newUrl, slideItem.itemId)
													}
												/>
											</>
										)}
										{slideItem.itemType === "custom" && (
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
														handleCustomVideoSelect(media, slideItem.itemId)
													}
													render={({ open }) => {
														return (
															<>
																{slideItem.customVideo &&
																	slideItem.customVideo.url && (
																		<Button
																			className="blockons-upload-button remove"
																			onClick={() =>
																				handleCustomVideoRemove(
																					slideItem.itemId
																				)
																			}
																		>
																			{__("Remove Video", "blockons")}
																		</Button>
																	)}
																{slideItem.customVideo &&
																	!slideItem.customVideo.url && (
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

										{/* TRY REMOVING HTTPS BELOW: HERE and see if it fixes the YouTube error */}

										<div className="blockons-videos-prev">
											{slideItem.itemType === "youtube" && slideItem.itemUrl && (
												<a
													href={`https://www.youtube.com/watch?v=${slideItem.itemUrl}`}
													target="_blank"
													className="blockons-confirm-button"
												>
													{__("Check video link", "blockons")}
												</a>
											)}
											{slideItem.itemType === "vimeo" && slideItem.itemUrl && (
												<a
													href={`https://vimeo.com/${slideItem.itemUrl}`}
													target="_blank"
													className="blockons-confirm-button"
												>
													{__("Check video link", "blockons")}
												</a>
											)}
											{slideItem.itemType === "custom" &&
												slideItem.customVideo &&
												slideItem.customVideo.url && (
													<video controls width="250">
														<source
															src={slideItem.customVideo.url}
															type="video/mp4"
														/>
													</video>
												)}
										</div>

										{/* TRY REMOVING HTTPS ABOVE: HERE and see if it fixes the YouTube error */}

										<p>{__("Slide Cover Image", "blockons")}</p>
										<MediaUpload
											className="components-icon-button components-toolbar__control"
											allowedTypes={["image"]}
											value={slideItem.itemImage}
											onSelect={(media) =>
												handleCoverImageSelect(media, slideItem.itemId)
											}
											render={({ open }) => {
												return (
													<>
														{slideItem.itemImage && slideItem.itemImage.url && (
															<div className="blockons-upload-imgpreview">
																<div className="blockons-upload-imgpreview-img">
																	<img src={slideItem.itemImage.url} />
																</div>
																<Button
																	className="blockons-upload-button remove"
																	onClick={() =>
																		handleCoverImageRemove(slideItem.itemId)
																	}
																>
																	{__("Remove Cover Image", "blockons")}
																</Button>
															</div>
														)}
														{slideItem.itemImage && !slideItem.itemImage.url && (
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
								className="blockons-duplicate-item"
								icon="admin-page"
								label="Duplicate Item"
								onClick={() =>
									handleDuplicateItem(
										index,
										slideItem.itemType,
										slideItem.itemUrl,
										slideItem.itemImage,
										slideItem.customVideo
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
				</li>
			);
		});
	}

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Video Slider Settings", "blockons")}
						initialOpen={true}
					>
						<UnitControl
							label={__("Slider Width", "blockons")}
							value={sliderWidth}
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

						<ToggleControl
							label={__("Rewind Slider", "blockons")}
							checked={sliderRewind}
							onChange={(newValue) => setAttributes({ sliderRewind: newValue })}
						/>

						<SelectControl
							label="Style"
							value={sliderStyle}
							options={[
								{ label: "Plain", value: "one" },
								{ label: "Drop Shadows", value: "two" },
								{ label: "Bordered", value: "three" },
							]}
							onChange={(newValue) => setAttributes({ sliderStyle: newValue })}
						/>
					</PanelBody>
					<PanelBody
						title={__("Video Slider Design", "blockons")}
						initialOpen={false}
					>
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
								setAttributes({ sliderRoundNess: newValue })
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
						title={__("Video Slider Controls", "blockons")}
						initialOpen={false}
					>
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
											onClick={() => setAttributes({ sliderArrowIcon: icon })}
										/>
									))
								}
							/>
							<p>{__("Select Slider Arrow Icons", "blockons")}</p>
						</div>

						<ToggleControl
							label={__("Show Pagination", "blockons")}
							checked={sliderPagination}
							onChange={(newValue) =>
								setAttributes({ sliderPagination: newValue })
							}
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
									onChange={(newValue) =>
										setAttributes({
											sliderPagDesign:
												newValue === undefined ? "dots" : newValue,
										})
									}
								/>
							</>
						)}

						<ToggleControl
							label={__("Show Controls only on Hover", "blockons")}
							checked={controlsOnHover}
							onChange={(newValue) =>
								setAttributes({ controlsOnHover: newValue })
							}
						/>
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<BlockAlignmentToolbar
						value={sliderAlign}
						controls={["left", "center", "right"]}
						onChange={(newValue) => {
							setAttributes({
								sliderAlign: newValue === undefined ? "left" : newValue,
							});
						}}
					/>
				</BlockControls>
			}
			<div
				className={`blockons-video-slider`}
				id={uniqueId}
				data-settings={JSON.stringify(sliderOptions)}
				style={{
					maxWidth: sliderWidth,
				}}
			>
				{sliderSlideItems ? (
					<>
						<div
							className={`blockons-video-slider-wrap ${
								controlsOnHover ? "on-hover" : ""
							} pagination-${sliderPagDesign}`}
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
							<Splide options={sliderOptions} extensions={{ Video }}>
								{sliderSlideItems}
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
