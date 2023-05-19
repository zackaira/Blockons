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
			<div className="blockons-count-timer-block">
				TIMER: <div className="countdown"></div>
			</div>
		</div>
	);
};

export default Save;
