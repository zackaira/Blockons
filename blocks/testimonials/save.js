/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from "@wordpress/block-editor";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `${attributes.alignment} layout-${
			attributes.slidesLayout
		} style-${attributes.slidesStyle} ${
			attributes.noShadow ? "no-outer" : ""
		} arrows-${attributes.sliderArrowIcon}`,
	});

	const sliderOptions = {
		type: "slide", // slide | loop | fade
		rewind: attributes.sliderRewind,
		speed: 1000,
		perPage: attributes.slidesNumber,
		perView: 1,
		gap: 10,
		autoplay: false,
		arrows: attributes.sliderArrows,
		pagination: attributes.sliderPagination,
		classes: {
			arrow: "splide__arrow fa-solid",
		},
	};

	const sliderSlideItems = attributes.slides.map((slideItem, index) => {
		return (
			<SplideSlide>
				<div
					className="blockons-slide-inner"
					style={{
						width: attributes.slidesWidth + "%",
						...(attributes.slidesStyle === "two"
							? { backgroundColor: attributes.bgColor }
							: ""),
					}}
				>
					<div
						className="blockons-slide-text"
						style={{
							...(attributes.slidesStyle === "three"
								? { backgroundColor: attributes.bgColor }
								: ""),
							color: attributes.fontColor,
						}}
					>
						{attributes.slidesStyle === "three" && (
							<span
								className="corner"
								style={{
									...(attributes.slidesStyle === "three"
										? { borderColor: attributes.bgColor }
										: ""),
								}}
							></span>
						)}

						{attributes.showQuotes && (
							<FontAwesomeIcon
								iconSize={attributes.quoteSize}
								icon="quote-left"
								style={{
									color: attributes.quotesColor,
									opacity: attributes.quotesOpacity,
								}}
							/>
						)}

						<RichText.Content
							tagName="div"
							value={slideItem.itemText}
							className="blockons-slide-text-txt"
						/>

						{attributes.showQuotes && (
							<FontAwesomeIcon
								iconSize={attributes.quoteSize}
								icon="quote-right"
								style={{
									color: attributes.quotesColor,
									opacity: attributes.quotesOpacity,
								}}
							/>
						)}
					</div>
					<div className="blockons-slide-author">
						{attributes.authIcon && (
							<div
								className={`blockons-slide-author-img ${
									slideItem.itemImg && slideItem.itemImg.url
										? "hasimg"
										: "noimg"
								}`}
								style={{
									...(slideItem.itemImg && slideItem.itemImg.url
										? { backgroundImage: `url(${slideItem.itemImg.url})` }
										: ""),
								}}
							>
								{slideItem.itemImg && !slideItem.itemImg.url && (
									<FontAwesomeIcon icon="user" iconSize={18} />
								)}
							</div>
						)}
						<div className="blockons-slide-author-txt">
							<RichText.Content
								tagName="div"
								value={slideItem.itemAuthor}
								className="blockons-slide-author-txt-auth"
								style={{
									color: attributes.nameColor,
								}}
							/>
							{attributes.authPosition && (
								<RichText.Content
									tagName="div"
									value={slideItem.itemAuthorPos}
									className="blockons-slide-author-txt-pos"
									style={{
										color: attributes.posColor,
									}}
								/>
							)}
						</div>
					</div>
				</div>
			</SplideSlide>
		);
	});

	return (
		<div {...blockProps}>
			<div
				className={`blockons-testimonials-slider`}
				id={attributes.uniqueId}
				data-settings={JSON.stringify(sliderOptions)}
			>
				<div
					className={`blockons-slider-wrap ${
						attributes.controlsOnHover ? "on-hover" : ""
					} arrow-style-${attributes.arrowStyle} pagination-${
						attributes.sliderPagDesign
					}`}
				>
					<Splide>{sliderSlideItems}</Splide>
				</div>
			</div>
		</div>
	);
};

export default Save;
