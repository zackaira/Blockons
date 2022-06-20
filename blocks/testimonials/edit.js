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
} from "@wordpress/block-editor";
import {
	PanelBody,
	Dropdown,
	ToggleControl,
	SelectControl,
	CheckboxControl,
	TextControl,
	RangeControl,
	ColorPalette,
	Icon,
	Button,
} from "@wordpress/components";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";
import { slugify, iconListIcons } from "../block-global";

// Add / Remove Slides
// const MutationPlugin = (slider) => {
// 	const observer = new MutationObserver(function (mutations) {
// 		mutations.forEach(function (mutation) {
// 			slider.update();
// 		});
// 	});

// 	const config = { childList: true };
// 	slider.on("created", () => {
// 		observer.observe(slider.container, config);
// 	});
// 	slider.on("destroyed", () => {
// 		observer.disconnect();
// 	});
// };

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			alignment,
			slides,
			slidesLayout,
			sliderArrows,
			sliderPagination,
		},
		setAttributes,
	} = props;

	const blockProps = useBlockProps({
		className: `${alignment} layout-${slidesLayout}`,
	});

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "none" : "align-" + newAlignment,
		});
	};

	// Item Controls Functions
	const handleItemIconSizeChange = (itemIconSize, itemId) => {
		const newSlides = [...slides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemIconSize: itemIconSize,
				};
			return obj;
		});
		setAttributes({ slides: editedSlideItems });
	};
	const handleItemTextChange = (itemText, itemId) => {
		const newSlides = [...slides];
		const editedSlideItems = newSlides.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemText: itemText,
				};
			return obj;
		});
		setAttributes({ slides: editedSlideItems });
	};
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

	// Add Slide
	const handleAddItem = () => {
		const newSlides = [...slides];
		newSlides.push({
			itemId: newSlides.length + 1,
			itemText: "",
		});
		setAttributes({ slides: newSlides });
		// instanceRef.current.update();
	};

	const handleRemoveItem = (index) => {
		const newSlides = [...slides];
		newSlides.splice(index, 1);
		setAttributes({ slides: newSlides });
		// instanceRef.current.update();
	};

	const handleDuplicateItem = (index, text) => {
		const newSlides = [...slides];
		newSlides.splice(index + 1, 0, {
			itemId: Math.floor(Math.random() * 700) + 1,
			itemText: text,
		});
		setAttributes({ slides: newSlides });
		// instanceRef.current.update();
	};

	useEffect(() => {
		instanceRef.current.update();
	}, [handleAddItem, handleRemoveItem, handleDuplicateItem]);

	// Slider Settings
	const [currentSlide, setCurrentSlide] = useState(0);
	const [loaded, setLoaded] = useState(false);
	const [sliderRef, instanceRef] = useKeenSlider({
		initial: 0,
		slideChanged(slider) {
			setCurrentSlide(slider.track.details.rel);
		},
		created() {
			setLoaded(true);
		},
	});

	// Testimonials Arrows
	function SlideArrow(props) {
		const disabeld = props.disabled ? " arrow--disabled" : "";
		return (
			<div
				onClick={props.onClick}
				className={`slider-arrow ${
					props.left ? "arrow-left" : "arrow-right"
				} ${disabeld}`}
			>
				<FontAwesomeIcon
					size={24}
					icon={props.left ? "arrow-left" : "arrow-right"}
				/>
			</div>
		);
	}

	// Testimonials Items
	let sliderSlideItems;

	if (slides.length) {
		sliderSlideItems = slides.map((slideItem, index) => {
			return (
				<div className="keen-slider__slide" key={index}>
					<div className="blockons-slide-inner">
						<div className="blockons-slide-text">
							<RichText
								tagName="div"
								placeholder={__("Testimonial Text", "blockons")}
								value={slideItem.itemText}
								multiline={false}
								className="blockons-slide-text-txt"
								onChange={(newText) =>
									handleItemTextChange(newText, slideItem.itemId)
								}
							/>
						</div>
						<div className="blockons-slide-author">
							<div
								className={`blockons-slide-author-img ${
									slideItem.itemImg ? "hasImg" : "noImg"
								}`}
							>
								{slideItem.itemImg ? (
									<img src="" alt={slideItem.itemAuthor} />
								) : (
									<FontAwesomeIcon icon="user" size={18} />
								)}
							</div>
							<RichText
								tagName="div"
								placeholder={__("Testimonial By", "blockons")}
								value={slideItem.itemAuthor}
								multiline={false}
								className="blockons-slide-author-txt"
								onChange={(newName) =>
									handleItemAuthorChange(newName, slideItem.itemId)
								}
							/>
						</div>
					</div>
					<div className="blockons-item-btns">
						<Dropdown
							className="blockons-item-level-settings"
							contentClassName="blockons-editor-popup"
							position="bottom right"
							renderToggle={({ isOpen, onToggle }) => (
								<Button
									icon="art"
									label={__("Slide Settings", "blockons")}
									onClick={onToggle}
									aria-expanded={isOpen}
								/>
							)}
							renderContent={() => <>Settings coming soon...</>}
						/>
						<Button
							className="blockons-duplicate-item"
							icon="admin-page"
							label="Duplicate Item"
							onClick={() => handleDuplicateItem(index, slideItem.itemText)}
						/>
						<Button
							className="blockons-remove-item"
							icon="no-alt"
							label="Delete Item"
							onClick={() => handleRemoveItem(index)}
						/>
					</div>
				</div>
			);
		});
	}

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Testimonials Settings", "blockons")}
						initialOpen={true}
					>
						<SelectControl
							label="Testimonials Layout"
							value={slidesLayout}
							options={[
								{ label: "Default", value: "one" },
								{ label: "Side Layout", value: "two" },
							]}
							onChange={(value) => setAttributes({ slidesLayout: value })}
						/>
					</PanelBody>
					<PanelBody
						title={__("Testimonials Design", "blockons")}
						initialOpen={false}
					>
						empty
					</PanelBody>
					<PanelBody
						title={__("Testimonials Slider Controls", "blockons")}
						initialOpen={false}
					>
						<ToggleControl // This setting is just for displaying the drop down, value is not saved.
							label={__("Show Search", "blockons")}
							checked={sliderArrows}
							onChange={(value) => setAttributes({ sliderArrows: value })}
						/>
						<ToggleControl // This setting is just for displaying the drop down, value is not saved.
							label={__("Show Pagination", "blockons")}
							checked={sliderPagination}
							onChange={(value) => setAttributes({ sliderPagination: value })}
						/>
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<AlignmentToolbar value={alignment} onChange={onChangeAlignment} />
				</BlockControls>
			}
			<div className={`blockons-testimonials-slider`}>
				<div className="blockons-slider-wrap">
					<div ref={sliderRef} className="blockons-slider keen-slider">
						{sliderSlideItems}
					</div>
					{loaded && instanceRef.current && sliderArrows && (
						<>
							<SlideArrow
								left
								className="slider-arrow arrow-left"
								onClick={(e) =>
									e.stopPropagation() || instanceRef.current?.prev()
								}
								disabled={currentSlide === 0}
							/>

							<SlideArrow
								className="slider-arrow arrow-right"
								onClick={(e) =>
									e.stopPropagation() || instanceRef.current?.next()
								}
								disabled={
									currentSlide ===
									instanceRef.current.track.details.slides.length - 1
								}
							/>
						</>
					)}

					{loaded && instanceRef.current && sliderPagination && (
						<div className="slider-pagination">
							{[
								...Array(
									instanceRef.current.track.details.slides.length
								).keys(),
							].map((idx) => {
								return (
									<button
										key={idx}
										onClick={() => {
											instanceRef.current?.moveToIdx(idx);
										}}
										className={"dot" + (currentSlide === idx ? " active" : "")}
									></button>
								);
							})}
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
