/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `${attributes.alignment} ${attributes.layout}`,
	});

	return (
		<div {...blockProps}>
			<div className={`blockons-featured-product-block`}></div>
			table of contents
		</div>
	);
};

export default Save;
