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
	TextControl,
	Button,
} from "@wordpress/components";
import { v4 as uuidv4 } from "uuid";
import { Splide } from "@splidejs/react-splide";
import { Video } from "@splidejs/splide-extension-video";
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
			slides,
			sliderStyle,
			sliderArrowIcon,
			controlsOnHover,
			sliderPagination,
			sliderPagDesign,
		},
		setAttributes,
	} = props;

	const blockProps = useBlockProps({
		className: `playbtn-one style-${sliderStyle} arrows-${sliderArrowIcon}`,
	});

	// Slider Settings
	const sliderOptions = {
		heightRatio: 0.5625,
		cover: true,
		rewind: true,
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
		setAttributes({
			uniqueId: uuidv4(),
		});
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
		// instanceRef.current.update();
	};

	// Video Slider Items
	let sliderSlideItems;

	if (slides.length) {
		sliderSlideItems = slides.map((slideItem, index) => {
			return (
				<li
					className="splide__slide"
					// {...(slideItem.itemType === "youtube" && slideItem.itemUrl
					// 	? { "data-splide-youtube": slideItem.itemUrl }
					// 	: "")}
					// {...(slideItem.itemType === "vimeo" && slideItem.itemUrl
					// 	? { "data-splide-vimeo": slideItem.itemUrl }
					// 	: "")}
					// {...(slideItem.itemType === "custom" &&
					// slideItem.customVideo &&
					// slideItem.customVideo.url
					// 	? { "data-splide-html-video": slideItem.customVideo.url }
					// 	: "")}
				>
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
						<div className="play-button"></div>
					</div>

					{slideItem.itemImage && slideItem.itemImage.url ? (
						<img src={slideItem.itemImage.url} />
					) : (
						<img
							src={`${siteObj.pluginUrl}assets/images/videoslider-placeholder.jpg`}
						/>
					)}

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
														<big>722558765</big>
													</b>
												</p>
											)}
											<TextControl
												label="Video Url"
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
																			handleCustomVideoRemove(slideItem.itemId)
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

									<div className="blockons-videos-prev">
										{slideItem.itemType === "youtube" && slideItem.itemUrl && (
											<iframe
												src={`https://www.youtube.com/embed/${slideItem.itemUrl}`}
												width="256"
												height="145"
												frameborder="0"
												allowfullscreen
											></iframe>
										)}
										{slideItem.itemType === "vimeo" && slideItem.itemUrl && (
											<iframe
												src={`https://player.vimeo.com/video/${slideItem.itemUrl}`}
												width="256"
												height="145"
												frameborder="0"
												allowfullscreen
											></iframe>
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
						<SelectControl
							label="Style"
							value={sliderStyle}
							options={[
								{ label: "Plain", value: "one" },
								{ label: "Drop Shadows", value: "two" },
							]}
							onChange={(value) => setAttributes({ sliderStyle: value })}
						/>
					</PanelBody>
					<PanelBody
						title={__("Video Slider Design", "blockons")}
						initialOpen={false}
					>
						EMPTY
					</PanelBody>
					<PanelBody
						title={__("Video Slider Slider Controls", "blockons")}
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

						<ToggleControl
							label={__("Show Controls only on Hover", "blockons")}
							checked={controlsOnHover}
							onChange={(value) => setAttributes({ controlsOnHover: value })}
						/>
					</PanelBody>
				</InspectorControls>
			)}
			<div
				className={`blockons-video-slider`}
				id={uniqueId}
				data-settings={JSON.stringify(sliderOptions)}
			>
				<div
					className={`blockons-video-slider-wrap ${
						controlsOnHover ? "on-hover" : ""
					} pagination-${sliderPagDesign}`}
				>
					<Splide
						onMoved={() => console.log("Slide moved!")}
						options={sliderOptions}
						extensions={{ Video }}
					>
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
			</div>
		</div>
	);
};

export default Edit;
