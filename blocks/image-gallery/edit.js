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
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import { colorPickerPalette } from "../block-global";
const Masonry = require("masonry-layout");
var imagesLoaded = require("imagesloaded");

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			uniqueId,
			alignment,
			galleryImages,
			columns,
			gridGap,
			layout,
			imageProportion,
			imageHover,
			imageCaption,
			captionOnHover,
			captionAnimation,
		},
		setAttributes,
	} = props;

	const blockProps = useBlockProps({
		className: `align-${alignment}`,
	});
	const [masonry, setMasonry] = useState();

	useEffect(() => {
		if (!uniqueId) {
			setAttributes({
				uniqueId: uuidv4(),
			});
		}
	}, []);

	useEffect(() => {
		if (layout === "masonry") {
			const msnryEle = document.querySelector(".blockons-gallery.masonry");
			if (msnryEle) {
				const msnry = new Masonry(msnryEle, {
					// options
					itemSelector: ".blockons-gallery-item.masonry",
					columnWidth: ".blockons-gallery-item.masonry",
					percentPosition: true,
				});

				imagesLoaded(msnryEle, () => msnry.layout());
				setMasonry(msnry);
			}
		} else {
			if (masonry) masonry.destroy();
		}
	}, [layout]);

	useEffect(() => {
		const msnryEle = document.querySelector(".blockons-gallery.masonry");
		setTimeout(() => {
			if (masonry) imagesLoaded(msnryEle, () => masonry.layout());
		}, 200);
	}, [columns, gridGap, imageProportion, imageCaption]);

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "center" : newAlignment,
		});
	};

	const handleDeleteItem = (index) => {
		const newSlides = [...galleryImages];
		newSlides.splice(index, 1);
		setAttributes({ galleryImages: newSlides });
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

			setAttributes({ galleryImages: newSlides });
		}
	};

	let nValue = 0;
	const images = galleryImages.map((imageItem, index) => {
		const imageCount = index;
		if (imageCount % 11 === 0) nValue++;
		const canFlip =
			(layout === "grid" || layout === "featured") &&
			(imageCaption === "flipup" || imageCaption === "flipside") &&
			imageItem.imageCaption
				? "flip"
				: "";

		return (
			<div
				className={`blockons-gallery-item ${layout} ${canFlip}`}
				style={{
					...(layout === "masonry"
						? {
								width: `calc((100% / ${columns}) - (${Math.floor(
									gridGap / 2
								)}px * 2))`,
								margin: `0 ${Math.floor(gridGap / 2)}px ${gridGap}px`,
						  }
						: {}),
					...(layout === "featured"
						? {
								// backgroundImage: `url(${imageItem.imageUrl})`,
								"--n": nValue - 1,
						  }
						: {}),
				}}
			>
				<div className="blockons-gallery-item-inner">
					{layout === "featured" && imageItem.imageUrl && (
						<div className="blockons-gallery-img">
							<img src={imageItem.imageUrl} alt={imageItem.alt} />
						</div>
					)}
					{(layout === "grid" || layout === "masonry") && (
						<div
							className="blockons-gallery-img"
							style={{
								...(imageProportion !== "actual"
									? {
											backgroundImage: `url(${imageItem.imageUrl})`,
									  }
									: {}),
							}}
						>
							{imageProportion === "actual" ? (
								imageItem.imageUrl && (
									<img src={imageItem.imageUrl} alt={imageItem.alt} />
								)
							) : (
								<img
									src={`${blockonsObj.pluginUrl}assets/images/${imageProportion}.png`}
									alt={imageItem.alt}
								/>
							)}
						</div>
					)}

					{imageCaption !== "none" && imageItem.imageCaption && (
						<div className="blockons-gallery-caption">
							<div className="blockons-gallery-caption-inner">
								{imageItem.imageCaption}
							</div>
						</div>
					)}
				</div>

				<div className="blockons-gallery-btns">
					<Button
						className="blockons-image-delete"
						icon="no-alt"
						label="Delete Image"
						onClick={() => handleDeleteItem(index)}
					/>
				</div>
			</div>
		);
	});

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Gallery Settings", "blockons")}
						initialOpen={true}
					>
						<MediaUpload
							className="components-icon-button components-toolbar__control"
							addToGallery={true}
							allowedTypes={["image"]}
							value={galleryImages.map((img) => img.imageId)}
							gallery={true}
							onSelect={handleMediaUpload}
							multiple
							render={({ open }) => {
								return (
									<Button className="blockons-upload-button" onClick={open}>
										{galleryImages.length
											? __("Add / Edit Images")
											: __("Create Image Gallery")}
									</Button>
								);
							}}
						/>
						<br />

						{galleryImages.length > 1 && (
							<>
								<br />
								<div className="blockons-divider"></div>
								<SelectControl
									label={__("Gallery Layout", "blockons")}
									value={layout}
									options={[
										{ label: __("Grid Layout", "blockons"), value: "grid" },
										{
											label: __("Masonry Layout", "blockons"),
											value: "masonry",
										},
										{
											label: __("Featured Grid Layout", "blockons"),
											value: "featured",
										},
									]}
									onChange={(newValue) => {
										setAttributes({
											layout: newValue === undefined ? "grid" : newValue,
										});

										if (
											imageCaption === "flipup" ||
											imageCaption === "flipside"
										)
											setAttributes({ imageCaption: "none" });
									}}
								/>

								<div className="blockons-divider"></div>

								{(layout === "grid" || layout === "masonry") && (
									<RangeControl
										label={__("Columns", "blockons")}
										value={columns}
										onChange={(newValue) =>
											setAttributes({ columns: parseInt(newValue) })
										}
										min={2}
										max={10}
									/>
								)}
								<RangeControl
									label={__("Grid Spacing", "blockons")}
									value={gridGap}
									onChange={(newValue) =>
										setAttributes({ gridGap: parseInt(newValue) })
									}
									min={0}
									max={60}
								/>
							</>
						)}
					</PanelBody>
					<PanelBody
						title={__("Image Settings", "blockons")}
						initialOpen={false}
					>
						{layout !== "featured" && (
							<>
								<SelectControl
									label={__("Image Proportions", "blockons")}
									value={imageProportion}
									options={[
										{
											label: __("Actual Image", "blockons"),
											value: "actual",
										},
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
								/>
								<div className="blockons-divider"></div>
							</>
						)}

						<SelectControl
							label={__("Image Caption", "blockons")}
							value={imageCaption}
							options={
								layout === "masonry"
									? [
											{ label: __("None", "blockons"), value: "none" },
											{
												label: __("Over Image Plain Text", "blockons"),
												value: "plain",
											},
											{
												label: __("Over Image Bottom", "blockons"),
												value: "bottom",
											},
											{
												label: __("Over Image Centered", "blockons"),
												value: "over",
											},
											{ label: __("Below Image", "blockons"), value: "below" },
									  ]
									: [
											{ label: __("None", "blockons"), value: "none" },
											{
												label: __("Plain text on Image", "blockons"),
												value: "plain",
											},
											{
												label: __("Bottom Banner", "blockons"),
												value: "bottom",
											},
											{
												label: __("Centered Banner", "blockons"),
												value: "over",
											},
											{ label: __("Below Image", "blockons"), value: "below" },
											{
												label: __("Flip Card (Up)", "blockons"),
												value: "flipup",
											},
											{
												label: __("Flip Card (Side)", "blockons"),
												value: "flipside",
											},
									  ]
							}
							onChange={(newValue) =>
								setAttributes({
									imageCaption: newValue === undefined ? "none" : newValue,
								})
							}
							help={
								imageCaption === "flipup" || imageCaption === "flipside"
									? __(
											"Cards will only 'flip' if the image has a caption",
											"blockons"
									  )
									: ""
							}
						/>

						{(imageCaption === "plain" ||
							imageCaption === "bottom" ||
							imageCaption === "over") && (
							<>
								<ToggleControl
									label={__("Show Caption on Hover", "blockons")}
									checked={captionOnHover}
									onChange={(newValue) =>
										setAttributes({ captionOnHover: newValue })
									}
								/>
								{captionOnHover && (
									<SelectControl
										label={__("Caption Animation", "blockons")}
										value={captionAnimation}
										options={
											imageCaption === "bottom"
												? [
														{ label: __("Fade In", "blockons"), value: "fade" },
														{
															label: __("Zoom In", "blockons"),
															value: "zoomin",
														},
														{
															label: __("Zoom Out", "blockons"),
															value: "zoomout",
														},
														{
															label: __("Slide In", "blockons"),
															value: "slide",
														},
												  ]
												: [
														{ label: __("Fade In", "blockons"), value: "fade" },
														{
															label: __("Zoom In", "blockons"),
															value: "zoomin",
														},
														{
															label: __("Zoom Out", "blockons"),
															value: "zoomout",
														},
												  ]
										}
										onChange={(newValue) =>
											setAttributes({
												captionAnimation:
													newValue === undefined ? "fade" : newValue,
											})
										}
									/>
								)}
							</>
						)}
						<div className="blockons-divider"></div>

						<SelectControl
							label={__("Image Hover Effect", "blockons")}
							value={imageHover}
							options={[
								{ label: __("None", "blockons"), value: "none" },
								{
									label: __("Color to Greyscale", "blockons"),
									value: "togreyscale",
								},
								{
									label: __("Greyscale to Color", "blockons"),
									value: "tocolor",
								},
								{ label: __("Grow", "blockons"), value: "grow" },
								{ label: __("Shrink", "blockons"), value: "shrink" },
								{
									label: __("Normal to Blurry", "blockons"),
									value: "toblur",
								},
								{
									label: __("Blurry to Normal", "blockons"),
									value: "tonormal",
								},
								{ label: __("Zoom", "blockons"), value: "zoom" },
								{ label: __("Zoom Long", "blockons"), value: "zoomlong" },
							]}
							onChange={(newValue) =>
								setAttributes({
									imageHover: newValue === undefined ? "none" : newValue,
								})
							}
						/>
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<AlignmentToolbar value={alignment} onChange={onChangeAlignment} />
				</BlockControls>
			}

			{images.length > 0 ? (
				<div
					className={`blockons-gallery ${layout} cols-${columns} ${
						imageProportion !== "actual" ? "imgfull" : ""
					} caption-${imageCaption} effect-${imageHover} ${
						(imageCaption === "plain" ||
							imageCaption === "bottom" ||
							imageCaption === "over") &&
						captionOnHover
							? `caption-hover caption-${captionAnimation}`
							: ""
					}`}
					id={uniqueId}
					style={
						layout === "masonry"
							? {
									margin: `0 -${Math.floor(gridGap / 2)}px`,
							  }
							: {
									"grid-gap": gridGap,
							  }
					}
				>
					{images.map((image, index) => image)}
				</div>
			) : (
				<div className="blockons-gallery-select">
					<MediaUpload
						className="components-icon-button components-toolbar__control"
						addToGallery={true}
						allowedTypes={["image"]}
						// value={images}
						value={galleryImages.map((img) => img.imageId)}
						gallery={true}
						onSelect={handleMediaUpload}
						multiple
						render={({ open }) => {
							return (
								<Button className="blockons-upload-button" onClick={open}>
									{__("Create Image Gallery")}
								</Button>
							);
						}}
					/>
				</div>
			)}
		</div>
	);
};

export default Edit;
