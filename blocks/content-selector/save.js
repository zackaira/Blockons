import { __ } from "@wordpress/i18n";
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import Select from "react-select";

const Save = ({ attributes }) => {
	const { uniqueId, alignment, options, selectedOption } = attributes;

	const blockProps = useBlockProps.save({
		className: `blockons-ds-contents align-${alignment}`,
		id: uniqueId,
	});

	return (
		<div {...blockProps}>
			{options && options.length > 0 && (
				<div className={`blockons-content-select align-${alignment}`}>
					<div className="blockons-content-select-select">
						<select className="blockons-ds-select">
							{options.map((option, index) => (
								<option value={option.value}>
									{option.attributes.contentLabel}
								</option>
							))}
						</select>
					</div>
				</div>
			)}
			<div
				className={`blockons-ds-contents ${
					!options || options.length < 1 ? "none" : ""
				}`}
			>
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

export default Save;
