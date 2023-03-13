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
	__experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import { v4 as uuidv4 } from "uuid";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import { colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			uniqueId,
			alignment,
			maxWidth,
			slideDirection,
			before,
			after,
			labelColor,
			imageLabels,
			imageBefore,
			imageAfter,
			automatic,
			handle,
			handleColor,
		},
		setAttributes,
	} = props;

	const blockProps = useBlockProps({
		className: `align-${alignment}`,
	});

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
						<UnitControl
							label={__("Slider Width", "blockons")}
							value={maxWidth}
							onChange={(value) => setAttributes({ maxWidth: value })}
							units={[
								{ value: "%", label: "%", default: 100 },
								{ value: "px", label: "px", default: 600 },
							]}
							isResetValueOnUnitChange
						/>
						<div className="blockons-divider"></div>

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
								<div className="blockons-divider"></div>
								<BlockonsColorpicker
									label={__("Label Color", "blockons")}
									value={labelColor}
									onChange={(newColor) =>
										setAttributes({ labelColor: newColor })
									}
									paletteColors={colorPickerPalette}
								/>
								<div className="blockons-divider"></div>
							</>
						)}

						<SelectControl
							label={__("Handle Design", "blockons")}
							value={handle}
							options={[
								{ label: __("Handle with Arrows", "blockons"), value: "one" },
								{ label: __("Plain Side Arrows", "blockons"), value: "two" },
								{ label: __("Large Side Arrows", "blockons"), value: "three" },
								{ label: __("Simple Line", "blockons"), value: "four" },
							]}
							onChange={(newValue) =>
								setAttributes({
									handle: newValue === undefined ? "one" : newValue,
								})
							}
						/>
						<BlockonsColorpicker
							label={__("Handle Color", "blockons")}
							value={handleColor}
							onChange={(newColor) => setAttributes({ handleColor: newColor })}
							paletteColors={colorPickerPalette}
						/>
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<AlignmentToolbar value={alignment} onChange={onChangeAlignment} />
				</BlockControls>
			}
			<div
				className={`blockons-image-comparison-wrap handle-${handle}`}
				style={{
					width: maxWidth,
				}}
			>
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
					style={{
						"--divider-color": handleColor,
						"--default-handle-color": handleColor,
						...(handle === "four"
							? {
									"--divider-width": 4,
									"--default-handle-opacity": 0,
							  }
							: {}),
					}}
				>
					<div slot="first" className="before">
						<img
							width="100%"
							src={
								imageBefore?.url
									? imageBefore.url
									: `${blockonsObj.pluginUrl}assets/images/placeholder.png`
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
								style={{
									color: labelColor,
								}}
							/>
						)}
					</div>
					<div slot="second" className="after">
						<img
							width="100%"
							src={
								imageAfter?.url
									? imageAfter.url
									: `${blockonsObj.pluginUrl}assets/images/placeholder2.png`
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
								style={{
									color: labelColor,
								}}
							/>
						)}
					</div>

					{handle === "one" && (
						<div
							className="handle-bar"
							slot="handle"
							style={{ backgroundColor: handleColor, borderColor: handleColor }}
						></div>
					)}
					{handle === "three" && (
						<svg
							slot="handle"
							class="large-arrow-handle"
							xmlns="http://www.w3.org/2000/svg"
							width="100"
							viewBox="-8 -3 16 6"
						>
							<path
								stroke={handleColor}
								d="M -5 -2 L -7 0 L -5 2 M -5 -2 L -5 2 M 5 -2 L 7 0 L 5 2 M 5 -2 L 5 2"
								stroke-width="1"
								fill={handleColor}
								vector-effect="non-scaling-stroke"
							></path>
						</svg>
					)}
				</img-comparison-slider>
			</div>
		</div>
	);
};

export default Edit;
