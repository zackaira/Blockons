/**
 * WordPress dependencies
 */
import { useBlockProps } from "@wordpress/block-editor";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `align-${attributes.alignment} layout-${attributes.carouselLayout} style-${attributes.carouselStyle} arrows-${attributes.carouselArrowIcon}`,
	});

	const sliderOptions = {
		type: attributes.carouselType, // slide | loop | fade
		...(attributes.carouselType === "slide"
			? {
					rewind: attributes.carouselRewind,
			  }
			: {
					rewind: true,
			  }),
		speed: 1000,
		// padding: "5rem",
		...(attributes.carouselType !== "fade" && {
			perPage: attributes.carouselNumber,
			perMove: 1,
			gap: attributes.carouselNumber >= 2 ? attributes.carouselGap : 0,
		}),
		autoplay: false,
		arrows: attributes.carouselArrows,
		pagination: attributes.carouselPagination,
		classes: {
			arrow: "splide__arrow fa-solid",
		},
	};

	const sliderSlideItems = attributes.slides.map((slideItem, index) => {
		return (
			<SplideSlide>
				<div className="blockons-imgcarousel-inner">
					{slideItem.imageUrl && (
						<img src={slideItem.imageUrl} alt={slideItem.alt} />
					)}
				</div>
				{(attributes.captionPosition === "two" ||
					attributes.captionPosition === "three" ||
					attributes.captionPosition === "four") &&
					slideItem.imageCaption && (
						<div className="blockons-imgcaption">
							<div className="blockons-imgcaption-inner">
								{slideItem.imageCaption}
							</div>
						</div>
					)}
			</SplideSlide>
		);
	});

	return (
		<div {...blockProps}>
			<div
				className={`blockons-image-carousel-slider`}
				id={attributes.uniqueId}
				data-settings={JSON.stringify(sliderOptions)}
				data-slides={attributes.carouselNumber}
			>
				<div
					className={`blockons-imgcarousel-wrap ${
						attributes.controlsOnHover ? "on-hover" : ""
					} ${attributes.carouselNumber === 1 ? "carousel-resize" : ""} ${
						attributes.captionOnHover ? "cap-hover" : ""
					} arrow-style-${attributes.arrowStyle} pagination-${
						attributes.carouselPagDesign
					} caption-${attributes.captionPosition}`}
				>
					<Splide>{sliderSlideItems}</Splide>
				</div>
			</div>
		</div>
	);
};

export default Save;
