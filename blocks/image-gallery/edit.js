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
const Masonry = require("masonry-layout");

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
					itemSelector: ".blockons-gallery-image.masonry",
					columnWidth: ".blockons-gallery-image.masonry",
					percentPosition: true,
				});
				setMasonry(msnry);
			}

			if (masonry) masonry.layout();
		} else {
			if (masonry) masonry.destroy();
		}
	}, [layout]);

	useEffect(() => {
		setTimeout(() => {
			if (masonry) masonry.layout();
		}, 200);
	}, [columns, gridGap]);

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

	const images = galleryImages.map((imageItem, index) => (
		<div
			className={`blockons-gallery-image ${layout}`}
			style={
				layout === "masonry"
					? {
							width: `calc((100% / ${columns}) - (${gridGap}px * 2))`,
							margin: `0 ${gridGap}px ${gridGap * 2}px`,
					  }
					: {
							"--n": `0`,
					  }
			}
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

			{imageItem.imageCaption && (
				<div className="blockons-gallery-caption"></div>
			)}

			<div className="blockons-gallery-btns">
				<Button
					className="blockons-image-delete"
					icon="no-alt"
					label="Delete Image"
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
								<RangeControl
									label={__("Columns", "blockons")}
									value={columns}
									onChange={(newValue) =>
										setAttributes({ columns: parseInt(newValue) })
									}
									min={2}
									max={10}
								/>
								<RangeControl
									label={__("Grid Spacing", "blockons")}
									value={gridGap}
									onChange={(newValue) =>
										setAttributes({ gridGap: parseInt(newValue) })
									}
									min={0}
									max={200}
								/>
								<div className="blockons-divider"></div>

								<SelectControl
									label={__("Gallery Layout", "blockons")}
									value={layout}
									options={[
										{ label: __("Default Grid", "blockons"), value: "grid" },
										{
											label: __("Masonry Layout", "blockons"),
											value: "masonry",
										},
										{
											label: __("Featured Grid", "blockons"),
											value: "featured",
										},
									]}
									onChange={(newValue) => {
										setAttributes({
											layout: newValue === undefined ? "grid" : newValue,
										});
									}}
								/>
							</>
						)}
					</PanelBody>
					<PanelBody
						title={__("Image Settings", "blockons")}
						initialOpen={false}
					>
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
					className={`blockons-gallery ${layout} cols-${columns}`}
					id={uniqueId}
					style={
						layout === "masonry"
							? {
									margin: `0 -${gridGap}px`,
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
