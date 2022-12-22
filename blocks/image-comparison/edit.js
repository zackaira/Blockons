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
	ToggleControl,
	SelectControl,
	CheckboxControl,
	TextControl,
	RangeControl,
	ColorPalette,
	Button,
} from "@wordpress/components";
import { v4 as uuidv4 } from "uuid";
import { colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			uniqueId,
			alignment,
			slideDirection,
			before,
			after,
			imageLabels,
			imageBefore,
			imageAfter,
			automatic,
		},
		setAttributes,
	} = props;

	const blockProps = useBlockProps({
		className: `align-${alignment}`,
	});

	useEffect(() => {
		if (!uniqueId) {
			setAttributes({
				uniqueId: uuidv4(),
			});
		}
	}, []);

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "left" : newAlignment,
		});
	};

	// Cover Image
	const handleImageUpload = (media, image) => {
		const addedImage = {
			id: media.id,
			url: media.url,
			alt: media.alt,
			caption: media.caption,
			width: media.width,
			height: media.height,
		};
		setAttributes({ [image]: addedImage });
	};
	const handleImageRemove = (image) => {
		setAttributes({ [image]: {} });
	};

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Image Comparison Settings", "blockons")}
						initialOpen={true}
					>
						<SelectControl
							label={__("Image Display", "blockons")}
							value={slideDirection}
							options={[
								{ label: __("Horizontal", "blockons"), value: "horizontal" },
								{ label: __("Vertical", "blockons"), value: "vertical" },
							]}
							onChange={(newValue) =>
								setAttributes({
									slideDirection:
										newValue === undefined ? "horizontal" : newValue,
								})
							}
						/>
						<div className="blockons-divider"></div>

						<ToggleControl
							label={__("Automatic Slide on Hover", "blockons")}
							checked={automatic}
							onChange={(newValue) => setAttributes({ automatic: newValue })}
						/>
						<div className="blockons-divider"></div>

						<ToggleControl
							label={__("Add Image Labels", "blockons")}
							checked={imageLabels}
							onChange={(newValue) => setAttributes({ imageLabels: newValue })}
						/>
						{imageLabels && (
							<>
								<TextControl
									label={__("Before Label", "blockons")}
									value={before}
									onChange={(newValue) => setAttributes({ before: newValue })}
								/>
								<TextControl
									label={__("After Label", "blockons")}
									value={after}
									onChange={(newValue) => setAttributes({ after: newValue })}
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
			<div className="blockons-image-comparison-wrap">
				<MediaUpload
					className="components-icon-button components-toolbar__control"
					allowedTypes={["image"]}
					value={imageBefore}
					onSelect={(media) => handleImageUpload(media, "imageBefore")}
					render={({ open }) => {
						return (
							<>
								{imageBefore?.url ? (
									<Button
										className="blockons-ic-button before remove fa-xmark"
										onClick={() => handleImageRemove("imageBefore")}
									></Button>
								) : (
									<Button
										className="blockons-ic-button before fa-upload"
										onClick={open}
									></Button>
								)}
							</>
						);
					}}
				/>
				<MediaUpload
					className="components-icon-button components-toolbar__control"
					allowedTypes={["image"]}
					value={imageAfter}
					onSelect={(media) => handleImageUpload(media, "imageAfter")}
					render={({ open }) => {
						return (
							<>
								{imageAfter?.url ? (
									<Button
										className="blockons-ic-button after remove fa-xmark"
										onClick={() => handleImageRemove("imageAfter")}
									></Button>
								) : (
									<Button
										className="blockons-ic-button after fa-upload"
										onClick={open}
									></Button>
								)}
							</>
						);
					}}
				/>

				<img-comparison-slider
					tabindex="0"
					className="rendered"
					{...(automatic ? { hover: "hover" } : { hover: false })}
					direction={slideDirection}
				>
					<div slot="first" className="before">
						<img
							width="100%"
							src={
								imageBefore?.url
									? imageBefore.url
									: "https://img-comparison-slider.sneas.io/demo/images/before.webp"
							}
						/>
						{imageLabels && (
							<RichText
								tagName="div"
								placeholder={__("Before", "blockons")}
								keepPlaceholderOnFocus
								value={before}
								className="blockons-ic-title before"
								onChange={(value) => setAttributes({ before: value })}
							/>
						)}
					</div>
					<div slot="second" className="after">
						<img
							width="100%"
							src={
								imageAfter?.url
									? imageAfter.url
									: "https://img-comparison-slider.sneas.io/demo/images/after.webp"
							}
						/>
						{imageLabels && (
							<RichText
								tagName="div"
								placeholder={__("After", "blockons")}
								keepPlaceholderOnFocus
								value={after}
								className="blockons-ic-title after"
								onChange={(value) => setAttributes({ after: value })}
							/>
						)}
					</div>

					<div className="handle-bar" slot="handle"></div>
				</img-comparison-slider>
			</div>
		</div>
	);
};

export default Edit;
