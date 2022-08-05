/**
 * WordPress dependencies
 */
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `design-${attributes.accordionDesign} ${
			attributes.closeAll ? "close-all" : ""
		}`,
	});

	return (
		<div {...blockProps}>
			<div className="accordions-wrap">
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

export default Save;
