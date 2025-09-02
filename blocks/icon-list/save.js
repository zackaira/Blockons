import { RichText, useBlockProps } from "@wordpress/block-editor";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `${attributes.alignment} items-${attributes.listItemsLayout}`,
	});

	const listItemElements = attributes.listItems.map((listItem, index) => {
		return (
			<li
				key={index}
				className="blockons-list-item"
				style={{
					...(attributes.listItemsLayout === "horizontal"
						? { marginRight: attributes.listItemSpacing }
						: { marginBottom: attributes.listItemSpacing }),
					fontSize: listItem.itemTextSize
						? listItem.itemTextSize
						: attributes.listItemFontSize,
					color: listItem.itemTextColor
						? listItem.itemTextColor
						: attributes.listItemFontColor,
				}}
			>
				<div
					className="blockons-list-item-icon"
					style={{
						marginRight: listItem.itemSpacing
							? listItem.itemSpacing
							: attributes.listItemIconSpacing,
						fontSize: listItem.itemIconSize
							? listItem.itemIconSize
							: attributes.listItemIconSize,
						color: listItem.itemIconColor
							? listItem.itemIconColor
							: attributes.listItemIconColor,
					}}
				>
					<FontAwesomeIcon icon={listItem.itemIcon} />
				</div>
				{listItem.itemText && (
					<RichText.Content
						tagName="div"
						value={listItem.itemText}
						className="blockons-list-item-text"
					/>
				)}
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
