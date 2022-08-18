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
		type: "slide", // slide | loop | fade
		rewind: true,
		speed: 1000,
		perPage: 1,
		perView: 1,
		gap: 10,
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
	const handleMediaSelect = (media, itemId) => {
		const newSlides = [...slides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemImg: {
						id: media.id,
						url: media.url,
						alt: media.alt,
					},
				};
			return obj;
		});
		setAttributes({ slides: editedSlideItems });
	};
	const handleMediaRemove = (itemId) => {
		const newSlides = [...slides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemImg: {},
				};
			return obj;
		});
		setAttributes({ slides: editedSlideItems });
	};

	// Add Slide
	// const handleAddItem = () => {
	// 	const newSlides = [...slides];
	// 	newSlides.push({
	// 		itemId: newSlides.length + 1,
	// 		itemText:
	// 			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec et augue placerat sem condimentum porta quis in quam. Cras dignissim felis gravida volutpat finibus.",
	// 		itemAuthor: "Joe Soap",
	// 		itemAuthorPos: "Owner at Macabee",
	// 		itemImg: {},
	// 	});
	// 	setAttributes({ slides: newSlides });
	// };

	// const handleRemoveItem = (index) => {
	// 	const newSlides = [...slides];
	// 	newSlides.splice(index, 1);
	// 	setAttributes({ slides: newSlides });
	// };

	// const handleDuplicateItem = (index, text, author, position, image) => {
	// 	const newSlides = [...slides];
	// 	newSlides.splice(index + 1, 0, {
	// 		itemId: Math.floor(Math.random() * 700) + 1,
	// 		itemText: text,
	// 		itemAuthor: author,
	// 		itemAuthorPos: position,
	// 		itemImg: image,
	// 	});
	// 	setAttributes({ slides: newSlides });
	// 	// instanceRef.current.update();
	// };

	// Image Carousel Items
	let sliderSlideItems;

	if (slides.length) {
		sliderSlideItems = slides.map((slideItem, index) => {
			return (
				<SplideSlide>
					<div className="blockons-imgcarousel-inner">image here</div>
					{/* {isSelected && (
						<div className="blockons-item-btns">
							<Button
								className="blockons-duplicate-item"
								icon="admin-page"
								label="Duplicate Item"
								onClick={() =>
									handleDuplicateItem(
										index,
										slideItem.itemText,
										slideItem.itemAuthor,
										slideItem.itemAuthorPos,
										slideItem.itemImg
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
					)} */}
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
						EMPTY
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
					<Splide options={sliderOptions}>{sliderSlideItems}</Splide>
				</div>
				{isSelected && (
					<div
						className={`blockons-add-new ${
							sliderSlideItems === undefined ? "no-slides" : "has-slides"
						}`}
					>
						<Button variant="secondary" onClick={() => {}}>
							{__("Add Another Slide", "blockons")}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Edit;
