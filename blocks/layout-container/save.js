/**
 * WordPress dependencies
 */
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `design-styling`,
	});

	return (
		<div {...blockProps}>
			<div className="layout-container-wrap">
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

export default Save;
