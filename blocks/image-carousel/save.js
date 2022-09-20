/**
 * WordPress dependencies
 */
import { useBlockProps } from "@wordpress/block-editor";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `align-${attributes.alignment} ${attributes.slideAlign}-align layout-${attributes.carouselLayout} style-${attributes.carouselStyle} arrows-${attributes.carouselArrowIcon} brad-${attributes.carouselBRadius}`,
	});

	const sliderOptions = {
		type: attributes.carouselType,
		...(attributes.carouselType === "slide"
			? {
					rewind: attributes.carouselRewind,
			  }
			: {
					rewind: true,
			  }),
		speed: 1000,
		padding: attributes.carouselSidePadding,
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
				<div
					className={`blockons-imgcarousel-inner ${
						attributes.imageProportion === "square" ||
						attributes.imageProportion === "32rectangle" ||
						attributes.imageProportion === "43rectangle" ||
						attributes.imageProportion === "169panoramic"
							? "imgbg"
							: ""
					}`}
					style={{
						...(attributes.imageProportion === "square" ||
						attributes.imageProportion === "32rectangle" ||
						attributes.imageProportion === "43rectangle" ||
						attributes.imageProportion === "169panoramic"
							? {
									background: `url("${slideItem.imageUrl}") center center / cover no-repeat`,
							  }
							: ""),
					}}
				>
					{attributes.imageProportion === "actual" ? (
						slideItem.imageUrl && (
							<img src={slideItem.imageUrl} alt={slideItem.alt} />
						)
					) : (
						<img
							src={`${siteObj.pluginUrl}assets/images/${attributes.imageProportion}.png`}
							alt={slideItem.alt}
						/>
					)}
				</div>
				{(attributes.captionPosition === "two" ||
					attributes.captionPosition === "three" ||
					attributes.captionPosition === "four") &&
					slideItem.imageCaption && (
						<div className="blockons-imgcaption">
							<div
								className="blockons-imgcaption-bg"
								style={{
									backgroundColor: attributes.captionBgColor,
									opacity: attributes.captionBgOpacity,
								}}
							></div>
							<div
								className="blockons-imgcaption-inner"
								style={{
									fontSize: attributes.captionFontSize,
									color: attributes.captionFontColor,
								}}
							>
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
				style={{
					width: attributes.sliderWidth,
				}}
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
