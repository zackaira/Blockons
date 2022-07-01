/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from "@wordpress/block-editor";
import { v4 as uuidv4 } from "uuid";
import { Splide } from "@splidejs/react-splide";
import { Video } from "@splidejs/splide-extension-video";
import "@splidejs/react-splide/css";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `playbtn-one style-${attributes.sliderStyle} arrows-${attributes.sliderArrowIcon}`,
	});

	const sliderOptions = {
		heightRatio: 0.5625,
		cover: true,
		rewind: true,
		speed: 1000,
		video: {
			loop: true,
			// mute: true,
		},
		arrows: true,
		pagination: attributes.sliderPagination,
		classes: {
			arrow: "splide__arrow fa-solid",
		},
	};

	const sliderSlideItems = attributes.slides.map((slideItem, index) => {
		return (
			<li
				className="splide__slide"
				{...(slideItem.itemType === "youtube" && slideItem.itemUrl
					? { "data-splide-youtube": slideItem.itemUrl }
					: "")}
				{...(slideItem.itemType === "vimeo" && slideItem.itemUrl
					? { "data-splide-vimeo": slideItem.itemUrl }
					: "")}
				{...(slideItem.itemType === "custom" &&
				slideItem.customVideo &&
				slideItem.customVideo.url
					? { "data-splide-html-video": slideItem.customVideo.url }
					: "")}
			>
				<div
					className="splide-custom-slide"
					style={{
						...(slideItem.itemImage && slideItem.itemImage.url
							? {
									background: `url("${slideItem.itemImage.url}") center center / cover no-repeat`,
							  }
							: ""),
					}}
				>
					<div className="play-button"></div>
				</div>

				{slideItem.itemImage && slideItem.itemImage.url ? (
					<img src={slideItem.itemImage.url} />
				) : (
					<img
						src={`${siteObj.pluginUrl}assets/images/videoslider-placeholder.jpg`}
					/>
				)}
			</li>
		);
	});

	return (
		<div {...blockProps}>
			<div
				className={`blockons-video-slider`}
				id={attributes.uniqueId}
				data-settings={JSON.stringify(sliderOptions)}
			>
				<div
					className={`blockons-video-slider-wrap ${
						attributes.controlsOnHover ? "on-hover" : ""
					} pagination-${attributes.sliderPagDesign}`}
				>
					<Splide>{sliderSlideItems}</Splide>
				</div>
			</div>
		</div>
	);
};

export default Save;
