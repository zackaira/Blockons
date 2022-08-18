/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: attributes.alignment,
	});

	return (
		<div {...blockProps}>
			<div className={`blockons-marketing-button-block`}></div>
			table of contents
		</div>
	);
};

export default Save;
