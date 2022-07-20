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
			<ul className="tab-labels" role="tablist" aria-label="tabbed content">
				{attributes.tabLabelsArray.map((label, i) => {
					return (
						<li
							className={i == 0 ? "tab-label active" : "tab-label"}
							role="tab"
							aria-selected={i == 0 ? "true" : "false"}
							aria-controls={label}
							tabindex="0"
						>
							{label}
						</li>
					);
				})}
			</ul>
			<div className="tab-content">
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

export default Save;
