/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from "@wordpress/block-editor";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: attributes.alignment,
	});

	const listItemElements = attributes.listItems.map((listItem, index) => {
		return (
			<li
				className="blockons-list-item"
				style={{
					marginBottom: attributes.listItemSpacing,
					fontSize: attributes.listItemFontSize,
				}}
			>
				<div
					className="blockons-list-item-icon"
					style={{
						marginRight: attributes.listItemIconSpacing,
						fontSize: attributes.listItemIconSize,
					}}
				>
					<FontAwesomeIcon icon={listItem.itemIcon} />
				</div>
				<RichText.Content
					tagName="div"
					value={listItem.itemText}
					className="blockons-list-item-text"
				/>
			</li>
		);
	});

	return (
		<div {...blockProps}>
			<div className={`blockons-list-align`}>
				<ul className="blockons-list-wrap">{listItemElements}</ul>
			</div>
		</div>
	);
};

export default Save;
