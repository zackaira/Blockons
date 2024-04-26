import { InnerBlocks, RichText, useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `style-${attributes.btnStyle}`,
	});

	return (
		<div {...blockProps}>
			<div
				className={`blockons-content-toggle-container isclosed ${
					(attributes.btnStyle === "one" || attributes.btnStyle === "two") &&
					attributes.toggleWithin
						? "btn-inside"
						: ""
				}`}
			>
				<div className="blockons-content-toggle-block">
					<div
						className="blockons-content-toggle-inner"
						style={{
							...(attributes.closedHeight !== 100
								? { minHeight: attributes.closedHeight }
								: {}),
							...((attributes.btnStyle === "one" ||
								attributes.btnStyle === "two") &&
							attributes.toggleWithin
								? { paddingBottom: attributes.toggleTextSize * 2 }
								: {}),
						}}
					>
						<InnerBlocks.Content />
					</div>
				</div>
				<div
					className="blockons-content-toggle"
					{...(attributes.btnStyle === "three" &&
					attributes.toggleBgColor !== "#8B8B8B"
						? { style: { backgroundColor: attributes.toggleBgColor } }
						: {})}
				>
					<div
						className="blockons-content-toggle-grad"
						style={{
							...(attributes.gradHeight !== 80
								? { height: attributes.gradHeight }
								: {}),
							...(attributes.toggleGradColor !== "#FFF"
								? {
										backgroundImage: `linear-gradient(to bottom, rgb(255 255 255 / 0%) 8%, ${attributes.toggleGradColor} 92%)`,
								  }
								: {}),
						}}
					></div>

					<div className="blockons-toggle-button">
						<RichText.Content
							tagName="p"
							className="blockons-toggle-btn open"
							value={attributes.toggleTextOpen}
							style={{
								...(attributes.toggleTextSize
									? { fontSize: attributes.toggleTextSize }
									: {}),
								...(attributes.toggleTextColor !== "#000"
									? { color: attributes.toggleTextColor }
									: {}),
								...(attributes.btnStyle === "two" &&
								attributes.toggleBgColor !== "#8B8B8B"
									? { backgroundColor: attributes.toggleBgColor }
									: {}),
							}}
						/>
						<RichText.Content
							tagName="p"
							className="blockons-toggle-btn closed"
							value={attributes.toggleTextClosed}
							style={{
								...(attributes.toggleTextSize
									? { fontSize: attributes.toggleTextSize }
									: {}),
								...(attributes.toggleTextColor !== "#000"
									? { color: attributes.toggleTextColor }
									: {}),
								...(attributes.btnStyle === "two" &&
								attributes.toggleBgColor !== "#8B8B8B"
									? { backgroundColor: attributes.toggleBgColor }
									: {}),
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Save;
