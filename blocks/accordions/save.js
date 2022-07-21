/**
 * WordPress dependencies
 */
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: attributes.alignment,
	});

	return (
		<div {...blockProps}>
			<div className="accordion-content">
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

export default Save;
