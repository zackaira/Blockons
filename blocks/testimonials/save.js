/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from "@wordpress/block-editor";
import { useKeenSlider } from "keen-slider/react";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `${attributes.alignment} items-${attributes.slidesLayout}`,
	});

	// const [sliderRef, instanceRef] = useKeenSlider({
	// 	initial: 0,
	// 	loop: true,
	// 	animation: {
	// 		duration: 1500,
	// 	},
	// 	slideChanged(slider) {
	// 		setCurrentSlide(slider.track.details.rel);
	// 	},
	// 	created() {
	// 		setLoaded(true);
	// 	},
	// });

	const sliderSlideItems = attributes.slides.map((slideItem, index) => {
		return <div className="keen-slider__slide">slider item</div>;
	});

	return (
		<div {...blockProps}>
			{/* <div className={`blockons-list-align`}>
				<div ref={sliderRef} className="keen-slider">
					{sliderSlideItems}
				</div>
			</div> */}
		</div>
	);
};

export default Save;
