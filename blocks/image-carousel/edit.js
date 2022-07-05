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
	MediaPlaceholder,
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
import { Splide, SplideSlide } from "@splidejs/react-splide";
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
			alignment,
			slidesNumber,
			slides,
			slidesStyle,
			noShadow,
			slidesLayout,
			slidesWidth,
			sliderRewind,
			controlsOnHover,
			sliderArrows,
			arrowStyle,
			sliderArrowIcon,
			sliderPagination,
			sliderPagDesign,
			bgColor,
		},
		setAttributes,
	} = props;

	const blockProps = useBlockProps({
		className: `align-${alignment} layout-${slidesLayout} style-${slidesStyle} ${
			noShadow ? "no-outer" : ""
		} arrows-${sliderArrowIcon}`,
	});

	// Slider Settings
	const sliderOptions = {
		type: "loop", // slide | loop | fade
		rewind: true,
		speed: 1000,
		// padding: "5rem",
		// perPage: 1,
		// perView: 1,
		height: "100%",
		autoplay: false,
		arrows: true,
		pagination: true,
		classes: {
			arrow: "splide__arrow fa-solid",
		},
	};

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

	// Item Controls Functions
	const handleItemAuthorChange = (itemAuthor, itemId) => {
		const newSlides = [...slides];
		// Edit the item text and ID (this prevent the edit from editing all instances if the block is duplicated)
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemId:
						itemId === ""
							? Math.floor(Math.random() * 800)
							: slugify(itemAuthor),
					itemAuthor: itemAuthor,
				};
			return obj;
		});
		setAttributes({ slides: editedSlideItems });
	};
	const handleMediaUpload = (media, itemId) => {
		const mediaItems = [...media];

		if (mediaItems.length) {
			const editedCarouselItems = mediaItems.map((image) => {
				return {
					imageId: image.id,
					imageUrl: image.url,
					imageAlt: image.alt,
					imageCaption: image.caption,
				};
			});

			const updatedSlides = [
				...slides.filter(
					(slide) =>
						!editedCarouselItems.find((item) => slide.imageId === item.imageId)
				),
				...editedCarouselItems,
			];

			setAttributes({ slides: updatedSlides });
		}
	};
	// const handleMediaRemove = (itemId) => {
	// 	const newSlides = [...slides];
	// 	const editedSlideItems = newSlides.map((obj) => {
	// 		if (obj.itemId === itemId)
	// 			return {
	// 				...obj,
	// 				itemImg: {},
	// 			};
	// 		return obj;
	// 	});
	// 	setAttributes({ slides: editedSlideItems });
	// };

	// Add Slide
	const handleAddItem = () => {
		const newSlides = [...slides];
		newSlides.push({
			imageId: newSlides.length + 1,
			imageUrl: "",
			imageAlt: "",
			imageCaption: "",
		});
		setAttributes({ slides: newSlides });
	};

	const handleRemoveItem = (index) => {
		const newSlides = [...slides];
		newSlides.splice(index, 1);
		setAttributes({ slides: newSlides });
	};

	// Image Carousel Items
	let sliderSlideItems;

	if (slides.length) {
		sliderSlideItems = slides.map((slideItem, index) => {
			return (
				<SplideSlide>
					<div className="blockons-imgcarousel-inner">
						{slideItem.imageUrl && (
							<img src={slideItem.imageUrl} alt={slideItem.alt} />
						)}
					</div>
					{isSelected && (
						<div className="blockons-item-btns">
							<Button
								className="blockons-remove-item"
								icon="no-alt"
								label="Delete Item"
								onClick={() => handleRemoveItem(index)}
							/>
						</div>
					)}
				</SplideSlide>
			);
		});
	}

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Image Carousel Settings", "blockons")}
						initialOpen={true}
					>
						<MediaUpload
							className="components-icon-button components-toolbar__control"
							addToGallery={true}
							allowedTypes={["image"]}
							// value={slides}
							value={slides.map((img) => img.imageId)}
							gallery={true}
							onSelect={handleMediaUpload}
							multiple
							render={({ open }) => {
								return (
									<>
										<Button className="blockons-upload-button" onClick={open}>
											{slides.length
												? __("Add Images to Carousel")
												: __("Create Image Carousel Gallery")}
										</Button>
									</>
								);
							}}
						/>
					</PanelBody>
					<PanelBody
						title={__("Image Carousel Design", "blockons")}
						initialOpen={false}
					>
						EMPTY
					</PanelBody>
					<PanelBody
						title={__("Image Carousel Slider Controls", "blockons")}
						initialOpen={false}
					>
						EMPTY
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<AlignmentToolbar value={alignment} onChange={onChangeAlignment} />
				</BlockControls>
			}
			<div
				className={`blockons-image-carousel-slider`}
				id={uniqueId}
				data-settings={JSON.stringify(sliderOptions)}
			>
				<div
					className={`blockons-imgcarousel-wrap ${
						controlsOnHover ? "on-hover" : ""
					} arrow-style-${arrowStyle} pagination-${sliderPagDesign}`}
				>
					{slides.length ? (
						<Splide options={sliderOptions}>{sliderSlideItems}</Splide>
					) : (
						<div className="blockons-imgcarousel-empty">
							<MediaUpload
								className="components-icon-button components-toolbar__control"
								addToGallery={true}
								allowedTypes={["image"]}
								// value={slides}
								value={slides.map((img) => img.imageId)}
								gallery={true}
								onSelect={handleMediaUpload}
								multiple
								render={({ open }) => {
									return (
										<>
											<Button className="blockons-upload-button" onClick={open}>
												{slides.length
													? __("Add Images to Carousel")
													: __("Create Image Carousel Gallery")}
											</Button>
										</>
									);
								}}
							/>
						</div>
					)}
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
