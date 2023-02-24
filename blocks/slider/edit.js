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
	InnerBlocks,
	__experimentalLinkControl as LinkControl,
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
import GetPostsSelect from "../_components/GetPostsSelect";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import BlockonsLoader from "../_components/BlockonsLoader";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";
import { sliderArrowIcons, colorPickerPalette } from "../block-global";
import { Navigation, Pagination, EffectFade, EffectCoverflow } from "swiper";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import axios from "axios";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			uniqueId,
			alignment,
			sliderSlides,
			position,
			showTitle,
			defaultTitleSize,
			defaultTitleColor,
			showDesc,
			defaultDescSize,
			defaultDescColor,
			imageProportion,
			forceFullWidth,
			infoBg,
			infoBgColor,
			infoBgOpacity,
			imageOverlay,
			imageOverlayColor,
			imageOverlayOpacity,
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
	const site_url = blockonsObj.apiUrl;
	const wcActive = blockonsObj.wcActive;

	const blockProps = useBlockProps({
		className: ``,
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
	const [swiper, setSwiper] = useState(null);

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "center" : newAlignment,
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
	const handleSliderImageRemove = (id) => {
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					image: {},
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};
	const handleUpdateSlideLinkType = (value, id) => {
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					link: {
						type: value,
						value: [],
					},
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};
	const handleUpdateSlideButtons = (value, slideId) => {
		const newSlides = [...sliderSlides];

		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === slideId) {
				let slide = newSlides.find((obj) => obj.id === slideId);

				let theButtons = slide.buttons?.buttons;
				let numItemsToAddOrRemove = value - slide.buttons?.buttons.length;

				if (numItemsToAddOrRemove > 0) {
					for (let i = 1; i <= numItemsToAddOrRemove; i++) {
						theButtons.push({
							id: i + 1,
							link: {},
							color: "#af2dbf",
							fcolor: "#fff",
							text: "Button Text",
						});
					}
				} else if (numItemsToAddOrRemove < 0) {
					theButtons.splice(
						theButtons.length + numItemsToAddOrRemove,
						-numItemsToAddOrRemove
					);
				}

				return {
					...obj,
					buttons: {
						number: value,
						buttons: theButtons,
					},
				};
			}
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};
	const handleUpdateBtnValues = (value, slideId, btn, property) => {
		const newSlides = [...sliderSlides];

		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === slideId) {
				const updatedButtons = [...obj.buttons.buttons];
				updatedButtons[btn] = {
					...updatedButtons[btn],
					[property]: value,
				};

				return {
					...obj,
					buttons: {
						number: obj.buttons.number,
						buttons: updatedButtons,
					},
				};
			}

			return obj;
		});

		setAttributes({ sliderSlides: editedSlideItems });
	};
	const handleUpdateSlideLinkValue = (value, id) => {
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					link: {
						...obj.link,
						value: value,
					},
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};
	const handleUpdateSlideStyle = (value, id, property) => {
		console.log(value);

		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					style: {
						...obj.style,
						[property]: value,
					},
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};
	const handleUpdateSlideTitle = (value, id) => {
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					title: value,
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};
	const handleUpdateSlideText = (value, id) => {
		const newSlides = [...sliderSlides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.id === id)
				return {
					...obj,
					subtitle: value,
				};
			return obj;
		});
		setAttributes({ sliderSlides: editedSlideItems });
	};

	const handleAddItem = (index, position) => {
		const newSlides = [...sliderSlides];

		const blankItem = {
			id: "slide-two",
			title: "Lorem ipsum",
			subtitle:
				"Cras sollicitudin cursus faucibus. Integer mauris lorem, placerat quis aliquam a, ultrices eu velit.",
			buttons: {
				number: 0,
				buttons: [],
			},
			link: {
				type: "none",
				value: [],
			},
			image: {},
			productSlide: {},
			style: {
				position: "",
				imgFull: "",
				bgOverlayColor: "",
				bgOverlayOpacity: "",
				txtBgColor: "",
				txtBgOpacity: "",
				titleSize: "",
				titleColor: "",
				descSize: "",
				descColor: "",
			},
		};

		if (position === "next") {
			newSlides.splice(index + 1, 0, {
				...blankItem,
				id: newSlides.length + 1,
			});
			setTimeout(() => {
				swiper.slideTo(index + 1);
			}, 250);
		} else {
			newSlides.push({
				...blankItem,
				id: newSlides.length + 1,
			});
			setTimeout(() => {
				swiper.slideTo(newSlides.length + 1);
			}, 250);
		}

		setAttributes({ sliderSlides: newSlides });
	};
	const handleDuplicateItem = (index, slideItem) => {
		const newSlides = [...sliderSlides];
		newSlides.splice(index + 1, 0, {
			...slideItem,
			id: Math.floor(Math.random() * 700) + 1,
		});
		setAttributes({ sliderSlides: newSlides });
	};
	const handleDeleteItem = (index) => {
		const newSlides = [...sliderSlides];
		newSlides.splice(index, 1);
		setAttributes({ sliderSlides: newSlides });
	};

	const [loadingProductDetails, setLoadingProductDetails] = useState(false);

	const handleInsertProduct = (selectedProduct, index) => {
		const newSlides = [...sliderSlides];

		const id = selectedProduct ? selectedProduct.value : "";
		if (!id) return;

		setLoadingProductDetails(true);

		async function getProductDetails() {
			return await axios
				.get(site_url + "blcns/v1/product/" + id)
				.then((res) => {
					newSlides.splice(index + 1, 0, {
						id: "product-" + id,
						link: {
							type: "button",
							value: [],
						},
						buttons: {
							number: 1,
							buttons: [
								{
									color: "#af2dbf",
									fcolor: "#fff",
									id: 1,
									link: {
										url: res.data.permalink,
										title: "",
									},
									text: "View Product",
								},
							],
						},
						image: {
							alt: res.data.title,
							id: "",
							url: res.data.featured_media,
						},
						productSlide: selectedProduct,
						title: res.data.title,
						subtitle: res.data.short_desc,
					});
					setAttributes({ sliderSlides: newSlides });

					setLoadingProductDetails(false);

					setTimeout(() => {
						swiper.slideTo(index + 1);
					}, 250);
				});
		}
		getProductDetails();
	};

	const slides = sliderSlides.map((slideItem, index) => (
		<div
			className={`swiper-slide-inner ${
				slideItem.style?.position ? slideItem.style.position : position
			} ${forceFullWidth || imageProportion !== "actual" ? "imgfull" : ""}`}
		>
			<div
				className="blockons-slider-image"
				{...(slideItem.image?.url
					? {
							style: {
								backgroundImage: `url(${slideItem.image.url})`,
							},
					  }
					: {
							style: {
								backgroundImage: `url(${blockonsObj.pluginUrl}assets/images/placeholder.png)`,
							},
					  })}
			>
				{imageOverlay && (
					<div
						className="blockons-slider-imgoverlay"
						style={{
							backgroundColor: slideItem.style?.bgOverlayColor
								? slideItem.style.bgOverlayColor
								: imageOverlayColor,
							opacity:
								slideItem.style?.bgOverlayOpacity ||
								slideItem.style.bgOverlayOpacity === 0
									? slideItem.style.bgOverlayOpacity
									: imageOverlayOpacity,
						}}
					></div>
				)}

				{imageProportion === "actual" ? (
					slideItem.image?.url ? (
						<img src={slideItem.image.url} alt={slideItem.image.alt} />
					) : (
						<img
							src={`${blockonsObj.pluginUrl}assets/images/placeholder.png`}
						/>
					)
				) : (
					<img
						src={`${blockonsObj.pluginUrl}assets/images/${imageProportion}.png`}
					/>
				)}
			</div>

			<div className={`blockons-slider-inner align-${alignment}`}>
				<div className="blockons-slider-inner-slide">
					{infoBg && (
						<div
							className="blockons-slider-content-bg"
							style={{
								backgroundColor: slideItem.style?.txtBgColor
									? slideItem.style.txtBgColor
									: infoBgColor,
								opacity:
									slideItem.style?.txtBgOpacity ||
									slideItem.style.txtBgOpacity === 0
										? slideItem.style.txtBgOpacity
										: infoBgOpacity,
							}}
						></div>
					)}

					{(showTitle || showDesc) && (
						<div className="blockons-slider-content">
							{showTitle && (
								<RichText
									tagName="h4"
									value={slideItem.title}
									className="slider-title"
									onChange={(newValue) =>
										handleUpdateSlideTitle(newValue, slideItem.id)
									}
									allowedFormats={["core/bold", "core/italic"]}
									placeholder="Lorem ipsum"
									disableLineBreaks
									style={{
										fontSize: slideItem.style?.titleSize
											? slideItem.style.titleSize
											: defaultTitleSize,
										color: slideItem.style?.titleColor
											? slideItem.style.titleColor
											: defaultTitleColor,
									}}
								/>
							)}

							{showDesc && (
								<RichText
									tagName="p"
									value={slideItem.subtitle}
									className="slider-desc"
									onChange={(newValue) =>
										handleUpdateSlideText(newValue, slideItem.id)
									}
									allowedFormats={["core/bold", "core/italic"]}
									placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
									disableLineBreaks
									style={{
										fontSize: slideItem.style?.descSize
											? slideItem.style.descSize
											: defaultDescSize,
										color: slideItem.style?.descColor
											? slideItem.style.descColor
											: defaultDescColor,
									}}
								/>
							)}

							{slideItem.link?.type === "button" &&
								slideItem.buttons?.buttons?.length > 0 && (
									<div className="slider-btns">
										{slideItem.buttons?.buttons?.map((button, index) => {
											return (
												<RichText
													tagName="div"
													value={button.text}
													className="slider-btn"
													onChange={(newValue) =>
														handleUpdateBtnValues(
															newValue,
															slideItem.id,
															index,
															"text"
														)
													}
													allowedFormats={["core/bold", "core/italic"]}
													placeholder="Lorem ipsum"
													disableLineBreaks
													style={{
														backgroundColor: button.color,
														color: button.fcolor,
													}}
												/>
											);
										})}
									</div>
								)}
						</div>
					)}
				</div>
			</div>

			<div className="blockons-slider-btns">
				<MediaUpload
					className="components-icon-button components-toolbar__control"
					allowedTypes={["image"]}
					value={slideItem.image}
					onSelect={(media) => handleSliderImageSelect(media, slideItem.id)}
					render={({ open }) => {
						return slideItem.image?.url ? (
							<Button
								className="blockons-sliderimg-button"
								icon="no-alt"
								label="Remove Slide Image"
								onClick={() => handleSliderImageRemove(slideItem.id)}
							/>
						) : (
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
					contentClassName="blockons-editor-popup blockons-link-component"
					position="bottom left"
					renderToggle={({ isOpen, onToggle }) => (
						<Button
							icon="admin-links"
							label={__("Slide Link", "blockons")}
							onClick={onToggle}
						/>
					)}
					renderContent={() => (
						<>
							<SelectControl
								label={__("Link Type", "blockons")}
								value={slideItem.link.type}
								options={[
									{ label: __("None", "blockons"), value: "none" },
									{ label: __("Button Links", "blockons"), value: "button" },
									{ label: __("Full Slide Link", "blockons"), value: "full" },
								]}
								onChange={(newValue) =>
									handleUpdateSlideLinkType(newValue, slideItem.id)
								}
							/>

							{slideItem.link?.type === "button" && (
								<>
									<RangeControl
										label={__("Number of Buttons", "blockons")}
										value={slideItem.buttons?.number}
										onChange={(newValue) =>
											handleUpdateSlideButtons(newValue, slideItem.id)
										}
										min={0}
										max={4}
									/>

									{slideItem.buttons?.number > 0 &&
										slideItem.buttons?.buttons?.map((button, i) => {
											return (
												<>
													<p>{__("Button " + (i + 1), "blockons")}</p>
													<LinkControl
														searchInputPlaceholder={__("Search", "blockons")}
														value={button.link}
														settings={[
															{
																id: "opensInNewTab",
																title: __("Open in new window", "blockons"),
															},
														]}
														onChange={(newValue) => {
															handleUpdateBtnValues(
																newValue,
																slideItem.id,
																i,
																"link"
															);
														}}
														withCreateSuggestion={false}
													/>
													<BlockonsColorpicker
														label={__("Color", "blockons")}
														value={button.color}
														onChange={(newValue) => {
															handleUpdateBtnValues(
																newValue,
																slideItem.id,
																i,
																"color"
															);
														}}
														paletteColors={colorPickerPalette}
													/>
													<BlockonsColorpicker
														label={__("Font Color", "blockons")}
														value={button.fcolor}
														onChange={(newValue) => {
															handleUpdateBtnValues(
																newValue,
																slideItem.id,
																i,
																"fcolor"
															);
														}}
														paletteColors={colorPickerPalette}
													/>
													{i !== slideItem.buttons?.number && (
														<div className="blockons-divider"></div>
													)}
												</>
											);
										})}
								</>
							)}

							{slideItem.link?.type === "full" && (
								<LinkControl
									searchInputPlaceholder={__("Search", "blockons")}
									value={slideItem.link.value}
									settings={[
										{
											id: "opensInNewTab",
											title: __("Open in new window", "blockons"),
										},
									]}
									onChange={(newValue) => {
										handleUpdateSlideLinkValue(newValue, slideItem.id);
									}}
									withCreateSuggestion={false}
								/>
							)}
						</>
					)}
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
								label="Position"
								value={
									slideItem.style?.position
										? slideItem.style.position
										: position
								}
								options={[
									{ label: "Top Left", value: "topleft" },
									{ label: "Top Center", value: "topcenter" },
									{ label: "Top Right", value: "topright" },
									{ label: "Center Left", value: "centerleft" },
									{ label: "Center Center", value: "centercenter" },
									{ label: "Center Right", value: "centerright" },
									{ label: "Bottom Left", value: "bottomleft" },
									{ label: "Bottom Center", value: "bottomcenter" },
									{ label: "Bottom Right", value: "bottomright" },
								]}
								onChange={(newValue) =>
									handleUpdateSlideStyle(newValue, slideItem.id, "position")
								}
							/>

							{imageOverlay && (
								<>
									<div className="blockons-divider"></div>
									<p className="blockons-section-title">
										{__("Background Image Overlay", "blockons")}
									</p>
									<RangeControl
										label={__("Opacity", "blockons")}
										value={
											slideItem.style?.bgOverlayOpacity ||
											slideItem.style.bgOverlayOpacity === 0
												? slideItem.style.bgOverlayOpacity
												: imageOverlayOpacity
										}
										onChange={(newValue) =>
											handleUpdateSlideStyle(
												newValue,
												slideItem.id,
												"bgOverlayOpacity"
											)
										}
										min={0}
										max={1}
										step={0.01}
									/>
									<BlockonsColorpicker
										label={__("Overlay Color", "blockons")}
										value={
											slideItem.style?.bgOverlayColor
												? slideItem.style.bgOverlayColor
												: imageOverlayColor
										}
										onChange={(newValue) =>
											handleUpdateSlideStyle(
												newValue,
												slideItem.id,
												"bgOverlayColor"
											)
										}
										paletteColors={colorPickerPalette}
									/>
								</>
							)}

							{infoBg && (
								<>
									<div className="blockons-divider"></div>
									<p className="blockons-section-title">
										{__("Text Background", "blockons")}
									</p>
									<RangeControl
										label={__("Opacity", "blockons")}
										value={
											slideItem.style?.txtBgOpacity ||
											slideItem.style.txtBgOpacity === 0
												? slideItem.style.txtBgOpacity
												: infoBgOpacity
										}
										onChange={(newValue) =>
											handleUpdateSlideStyle(
												newValue,
												slideItem.id,
												"txtBgOpacity"
											)
										}
										min={0}
										max={1}
										step={0.01}
									/>
									<BlockonsColorpicker
										label={__("Overlay Color", "blockons")}
										value={
											slideItem.style?.txtBgColor
												? slideItem.style.txtBgColor
												: infoBgColor
										}
										onChange={(newValue) =>
											handleUpdateSlideStyle(
												newValue,
												slideItem.id,
												"txtBgColor"
											)
										}
										paletteColors={colorPickerPalette}
									/>
								</>
							)}

							{showTitle && (
								<>
									<div className="blockons-divider"></div>
									<p className="blockons-section-title">
										{__("Title", "blockons")}
									</p>
									<RangeControl
										label={__("Size", "blockons")}
										value={
											slideItem.style?.titleSize ||
											slideItem.style.titleSize === 0
												? slideItem.style.titleSize
												: defaultTitleSize
										}
										onChange={(newValue) =>
											handleUpdateSlideStyle(
												newValue,
												slideItem.id,
												"titleSize"
											)
										}
										min={10}
										max={72}
									/>
									<BlockonsColorpicker
										label={__("Color", "blockons")}
										value={
											slideItem.style?.titleColor
												? slideItem.style.titleColor
												: defaultTitleColor
										}
										onChange={(newValue) =>
											handleUpdateSlideStyle(
												newValue,
												slideItem.id,
												"titleColor"
											)
										}
										paletteColors={colorPickerPalette}
									/>
								</>
							)}

							{showDesc && (
								<>
									<div className="blockons-divider"></div>
									<p className="blockons-section-title">
										{__("Description", "blockons")}
									</p>
									<RangeControl
										label={__("Size", "blockons")}
										value={
											slideItem.style?.descSize ||
											slideItem.style.descSize === 0
												? slideItem.style.descSize
												: defaultDescSize
										}
										onChange={(newValue) =>
											handleUpdateSlideStyle(newValue, slideItem.id, "descSize")
										}
										min={10}
										max={72}
									/>
									<BlockonsColorpicker
										label={__("Color", "blockons")}
										value={
											slideItem.style?.descColor
												? slideItem.style.descColor
												: defaultDescColor
										}
										onChange={(newValue) =>
											handleUpdateSlideStyle(
												newValue,
												slideItem.id,
												"descColor"
											)
										}
										paletteColors={colorPickerPalette}
									/>
								</>
							)}
						</>
					)}
				/>

				<Dropdown
					className="blockons-slide-add"
					contentClassName="blockons-editor-popup blockons-new-slide"
					position="bottom left"
					renderToggle={({ isOpen, onToggle }) => (
						<Button
							icon="plus-alt"
							label={__("Add New", "blockons")}
							onClick={onToggle}
						/>
					)}
					renderContent={() => (
						<>
							{loadingProductDetails ? (
								<div className="loading-product-slide">
									<BlockonsLoader />
									<p>{__("Loading Product Details", "blockons")}</p>
								</div>
							) : (
								<>
									<Button
										className="blockons-slide-add"
										icon="plus-alt"
										onClick={() => handleAddItem(index, "next")}
										variant="secondary"
									>
										{__("Add New Slide - Next Position", "blockons")}
									</Button>
									<Button
										className="blockons-slide-add"
										icon="plus-alt"
										onClick={() => handleAddItem(index, "end")}
										variant="secondary"
									>
										{__("Add New Slide - End of Slider", "blockons")}
									</Button>

									<GetPostsSelect
										label={__("Create a new Product Slide", "blockons")}
										value={slideItem.productSlide}
										onChange={(newValue) => {
											handleInsertProduct(newValue, index);
										}}
										siteurl={site_url}
									/>
								</>
							)}
						</>
					)}
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
					<PanelBody title={__("Slider Design", "blockons")} initialOpen={true}>
						<SelectControl
							label="Slider Style"
							value={position}
							options={[
								{ label: "Top Left", value: "topleft" },
								{ label: "Top Center", value: "topcenter" },
								{ label: "Top Right", value: "topright" },
								{ label: "Center Left", value: "centerleft" },
								{ label: "Center Center", value: "centercenter" },
								{ label: "Center Right", value: "centerright" },
								{ label: "Bottom Left", value: "bottomleft" },
								{ label: "Bottom Center", value: "bottomcenter" },
								{ label: "Bottom Right", value: "bottomright" },
							]}
							onChange={(newValue) =>
								setAttributes({
									position: newValue === undefined ? "centercenter" : newValue,
								})
							}
						/>
						<div className="blockons-divider"></div>

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
									imageProportion: newValue === undefined ? "actual" : newValue,
								})
							}
						/>
						{imageProportion === "actual" && (
							<ToggleControl
								label={__("Force Images Full Width", "blockons")}
								checked={forceFullWidth}
								onChange={(newValue) =>
									setAttributes({ forceFullWidth: newValue })
								}
							/>
						)}
						<div className="blockons-divider"></div>

						<ToggleControl
							label={__("Add Background Image Overlay", "blockons")}
							checked={imageOverlay}
							onChange={(newValue) => setAttributes({ imageOverlay: newValue })}
						/>
						{imageOverlay && (
							<>
								<BlockonsColorpicker
									label={__("Overlay Color", "blockons")}
									value={imageOverlayColor}
									onChange={(colorValue) => {
										setAttributes({
											imageOverlayColor:
												colorValue === undefined ? "#000" : colorValue,
										});
									}}
									paletteColors={colorPickerPalette}
								/>
								<RangeControl
									label={__("Opacity", "blockons")}
									value={imageOverlayOpacity}
									onChange={(newValue) =>
										setAttributes({
											imageOverlayOpacity:
												newValue === undefined ? 0.62 : newValue,
										})
									}
									min={0}
									max={1}
									step={0.01}
								/>
							</>
						)}

						<div className="blockons-divider"></div>

						<ToggleControl
							label={__("Add Text Background", "blockons")}
							checked={infoBg}
							onChange={(newValue) => setAttributes({ infoBg: newValue })}
						/>
						{infoBg && (
							<>
								<BlockonsColorpicker
									label={__("Background Color", "blockons")}
									value={infoBgColor}
									onChange={(colorValue) => {
										setAttributes({
											infoBgColor:
												colorValue === undefined ? "#000" : colorValue,
										});
									}}
									paletteColors={colorPickerPalette}
								/>
								<RangeControl
									label={__("Opacity", "blockons")}
									value={infoBgOpacity}
									onChange={(newValue) =>
										setAttributes({
											infoBgOpacity: newValue === undefined ? 0.62 : newValue,
										})
									}
									min={0}
									max={1}
									step={0.01}
								/>
							</>
						)}

						<div className="blockons-divider"></div>

						<ToggleControl
							label={__("Show Title", "blockons")}
							checked={showTitle}
							onChange={(newValue) => setAttributes({ showTitle: newValue })}
						/>
						{showTitle && (
							<>
								<RangeControl
									label={__("Title Size", "blockons")}
									value={defaultTitleSize}
									onChange={(newValue) =>
										setAttributes({
											defaultTitleSize:
												newValue === undefined ? 1 : parseInt(newValue),
										})
									}
									min={10}
									max={72}
								/>
								<BlockonsColorpicker
									label={__("Color", "blockons")}
									value={defaultTitleColor}
									onChange={(colorValue) =>
										setAttributes({
											defaultTitleColor:
												colorValue === undefined ? "#FFF" : colorValue,
										})
									}
									paletteColors={colorPickerPalette}
								/>
							</>
						)}

						<div className="blockons-divider"></div>

						<ToggleControl
							label={__("Show Description", "blockons")}
							checked={showDesc}
							onChange={(newValue) => setAttributes({ showDesc: newValue })}
						/>
						{showDesc && (
							<>
								<RangeControl
									label={__("Description Size", "blockons")}
									value={defaultDescSize}
									onChange={(newValue) =>
										setAttributes({
											defaultDescSize:
												newValue === undefined ? 1 : parseInt(newValue),
										})
									}
									min={10}
									max={32}
								/>
								<BlockonsColorpicker
									label={__("Color", "blockons")}
									value={defaultDescColor}
									onChange={(colorValue) =>
										setAttributes({
											defaultDescColor:
												colorValue === undefined ? "#e5e5e5" : colorValue,
										})
									}
									paletteColors={colorPickerPalette}
								/>
							</>
						)}
					</PanelBody>
					<PanelBody
						title={__("Slider Settings", "blockons")}
						initialOpen={false}
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
				className={`blockons-slider slider adv-slider ${
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
				<Swiper {...sliderOptions} onSwiper={setSwiper}>
					{slides.map((slideContent, index) => (
						<SwiperSlide>{slideContent}</SwiperSlide>
					))}
				</Swiper>
			</div>
		</div>
	);
};

export default Edit;
