import { RichText, useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `align-${attributes.alignment} headalign-${attributes.headVertAlign} ${attributes.headElementAlign}-align width-${attributes.headWidthSet}`,
	});

	return (
		<div {...blockProps}>
			<div
				className={`blockons-lheading-wrap`}
				style={{
					...(attributes.headWidthSet === "outer"
						? { width: attributes.headOuterWidth }
						: ""),
				}}
			>
				{(attributes.alignment === "right" ||
					attributes.alignment === "center") && (
					<div
						className="blockons-lheading-before"
						style={{
							borderBottom: `${attributes.lineWidth}px ${attributes.lineStyle} ${attributes.lineColor}`,
							...(attributes.headWidthSet === "line"
								? { width: attributes.headLineWidth }
								: ""),
						}}
					/>
				)}
				<RichText.Content
					tagName={attributes.hTag}
					value={attributes.headingTitle}
					className="blockons-lheading-text"
					style={{
						color: attributes.fontColor,
						...(attributes.headFontSize
							? { fontSize: attributes.headFontSize + "px" }
							: ""),
					}}
				/>
				{(attributes.alignment === "left" ||
					attributes.alignment === "center") && (
					<div
						className="blockons-lheading-after"
						style={{
							borderBottom: `${attributes.lineWidth}px ${attributes.lineStyle} ${attributes.lineColor}`,
							...(attributes.headWidthSet === "line"
								? { width: attributes.headLineWidth }
								: ""),
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default Save;
