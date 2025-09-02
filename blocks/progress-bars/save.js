import { RichText, useBlockProps } from "@wordpress/block-editor";
import { Waypoint } from "react-waypoint";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `front ${attributes.alignment} ${attributes.headElementAlign}-align`,
	});

	const listItemElements = attributes.listItems.map((listItem, index) => {
		return (
			<li
				key={index}
				className={`blockons-progressbar-item`}
				style={{
					marginBottom: attributes.pbItemSpacing + "px",
				}}
			>
				{attributes.pbShowLabel && (
					<div className="blockons-progressbar-desc">
						<RichText.Content
							tagName="div"
							value={listItem.pbText}
							className="blockons-progressbar-item-txt"
							style={{
								fontSize: listItem.textNewSize
									? listItem.textNewSize + "px"
									: attributes.pbItemDescSize + "px",
								color: listItem.textNewColor
									? listItem.textNewColor
									: attributes.pbDescFontColor,
							}}
						/>
					</div>
				)}

				<Waypoint onEnter={attributes._handleWaypointEnter}>
					<div
						className="blockons-progressbar-bar"
						ref={attributes.innerRef}
						style={{
							height: attributes.pbItemHeight + "px",
							backgroundColor: listItem.pbBgColor
								? listItem.pbBgColor
								: attributes.pbBarBgColor,
						}}
					>
						<div
							className="blockons-progressbar-bar-inner"
							style={{
								width: listItem.pbWidth + "%",
								backgroundColor: listItem.pbColor
									? listItem.pbColor
									: attributes.pbBarColor,
							}}
						>
							{attributes.pbShowPercent ? listItem.pbWidth + "%" : ""}
						</div>
					</div>
				</Waypoint>
			</li>
		);
	});

	return (
		<div {...blockProps}>
			<div
				className={`blockons-progressbar-wrap blockons-progressbar-${attributes.pbDesign}`}
			>
				<ul className="blockons-progressbar pb-start">{listItemElements}</ul>
			</div>
		</div>
	);
};

export default Save;
