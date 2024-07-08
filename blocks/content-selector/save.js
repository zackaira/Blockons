import { __ } from "@wordpress/i18n";
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import Select from "react-select";

const Save = ({ attributes }) => {
	const {
		uniqueId,
		alignment,
		emptyFirstOption,
		emptyFirstText,
		options,
		selectedOption,
		selectMinWidth,
		selectVertPadding,
		selectHorizPadding,
		selectBorderRadius,
		selectBgColor,
		selectFontColor,
		selectBorder,
		selectBorderColor,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `ds-contents`,
		id: uniqueId,
	});

	return (
		<div {...blockProps}>
			{options && options.length > 0 && (
				<div className={`blockons-content-select align-${alignment}`}>
					<div
						className="blockons-content-select-select"
						style={{
							minWidth: selectMinWidth,
						}}
					>
						<select
							className={`blockons-ds-select ${
								!selectBorder ? "noborder" : ""
							}`}
							onChange={() => console.log("changed")}
							style={{
								padding: `${selectVertPadding}px ${
									selectHorizPadding * 2
								}px ${selectVertPadding}px ${selectHorizPadding}px`,
								borderRadius: `${selectBorderRadius}px`,
								backgroundColor: selectBgColor,
								color: selectFontColor,
								borderColor: selectBorderColor,
							}}
						>
							{emptyFirstOption && <option value="">{emptyFirstText}</option>}
							{options.map((option, index) => (
								<option value={option.clientId}>
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
