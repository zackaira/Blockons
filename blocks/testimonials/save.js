/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from "@wordpress/block-editor";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `${attributes.alignment} items-${attributes.listItemsLayout}`,
	});

	const [refCallback, slider, sliderNode] = useKeenSlider(
		{
			slideChanged() {
				console.log("slide changed");
			},
		},
		[
			// add plugins here
		]
	);

	const sliderSlideItems = attributes.listItems.map((listItem, index) => {
		return <div className="keen-slider__slide">slider item</div>;
	});

	return (
		<div {...blockProps}>
			<div className={`blockons-list-align`}>
				<div ref={refCallback} className="keen-slider">
					{sliderSlideItems}
				</div>
			</div>
		</div>
	);
};

export default Save;
