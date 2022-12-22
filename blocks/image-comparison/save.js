/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `align-${attributes.alignment}`,
	});

	return (
		<div {...blockProps}>
			<div class="img-comp-container-outer">
			<img-comparison-slider tabindex="0" class="rendered">
					<img
						slot="first"
						width="100%"
						src="https://img-comparison-slider.sneas.io/demo/images/before.webp"
					/>
					<img
						slot="second"
						width="100%"
						src="https://img-comparison-slider.sneas.io/demo/images/after.webp"
					/>
				</img-comparison-slider>
			</div>
		</div>
	);
};

export default Save;
