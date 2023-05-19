/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `align-${attributes.align} alignment-${attributes.alignment} design-${attributes.design}`,
	});

	console.log("SAVE - selectedDateTime", attributes.selectedDateTime);

	return (
		<div {...blockProps}>
			<div
				className="blockons-count-timer-block"
				style={{
					...(attributes.bgColor
						? { backgroundColor: attributes.bgColor }
						: {}),
					...(attributes.counterPadding
						? { padding: attributes.counterPadding }
						: {}),
				}}
			>
				{attributes.linkType === "full" && (
					<a
						href={attributes.linkTo}
						className="blockons-timer-link"
						{...(attributes.linkTarget ? { target: "_blank" } : {})}
					></a>
				)}

				{attributes.hasBeforeText && (
					<RichText.Content
						tagName="span"
						value={attributes.beforeText}
						className="blockons-countdown-before"
						style={{
							fontSize: attributes.beforeFontSize,
							...(attributes.beforeTextColor !== "#101015"
								? { color: attributes.beforeTextColor }
								: {}),
						}}
					/>
				)}
				<div
					className="countdown"
					id={attributes.selectedDateTime}
					style={{
						...(!attributes.hasBeforeText ? { marginLeft: 0 } : {}),
						...(!attributes.hasAfterText ? { marginRight: 0 } : {}),
					}}
					{...(attributes.onComplete === "one"
						? { "data-completeText": attributes.onCompleteText }
						: {})}
					{...(attributes.onComplete === "two"
						? { "data-completeHide": attributes.onCompleteHide }
						: {})}
				>
					<div
						className="count-block days"
						style={{
							...(attributes.design === "two"
								? { margin: `${attributes.timerSpacing}px 0` }
								: { margin: `0 ${attributes.timerSpacing}px` }),
						}}
					>
						<div
							className="amnt days"
							style={{
								...(attributes.numberSize !== 16
									? { fontSize: attributes.numberSize }
									: {}),
								...(attributes.numberColor !== "#101015"
									? { color: attributes.numberColor }
									: {}),
							}}
						></div>
						<RichText.Content
							tagName="div"
							value={attributes.txtDays}
							className="txt"
							style={{
								...(attributes.numberTextSize !== 16
									? { fontSize: attributes.numberTextSize }
									: {}),
								...(attributes.numberTextColor !== "#101015"
									? { color: attributes.numberTextColor }
									: {}),
							}}
						/>
					</div>
					<div
						className="count-block hours"
						style={{
							...(attributes.design === "two"
								? { margin: `${attributes.timerSpacing}px 0` }
								: { margin: `0 ${attributes.timerSpacing}px` }),
						}}
					>
						<div
							className="amnt hours"
							style={{
								...(attributes.numberSize !== 16
									? { fontSize: attributes.numberSize }
									: {}),
								...(attributes.numberColor !== "#101015"
									? { color: attributes.numberColor }
									: {}),
							}}
						></div>
						<RichText.Content
							tagName="div"
							value={attributes.txtHours}
							className="txt"
							style={{
								...(attributes.numberTextSize !== 16
									? { fontSize: attributes.numberTextSize }
									: {}),
								...(attributes.numberTextColor !== "#101015"
									? { color: attributes.numberTextColor }
									: {}),
							}}
						/>
					</div>
					<div
						className="count-block minutes"
						style={{
							...(attributes.design === "two"
								? { margin: `${attributes.timerSpacing}px 0` }
								: { margin: `0 ${attributes.timerSpacing}px` }),
						}}
					>
						<div
							className="amnt minutes"
							style={{
								...(attributes.numberSize !== 16
									? { fontSize: attributes.numberSize }
									: {}),
								...(attributes.numberColor !== "#101015"
									? { color: attributes.numberColor }
									: {}),
							}}
						></div>
						<RichText.Content
							tagName="div"
							value={attributes.txtMinutes}
							className="txt"
							style={{
								...(attributes.numberTextSize !== 16
									? { fontSize: attributes.numberTextSize }
									: {}),
								...(attributes.numberTextColor !== "#101015"
									? { color: attributes.numberTextColor }
									: {}),
							}}
						/>
					</div>
					<div
						className="count-block seconds"
						style={{
							...(attributes.design === "two"
								? { margin: `${attributes.timerSpacing}px 0` }
								: { margin: `0 ${attributes.timerSpacing}px` }),
						}}
					>
						<div
							className="amnt seconds"
							style={{
								...(attributes.numberSize !== 16
									? { fontSize: attributes.numberSize }
									: {}),
								...(attributes.numberColor !== "#101015"
									? { color: attributes.numberColor }
									: {}),
							}}
						></div>
						<RichText.Content
							tagName="div"
							value={attributes.txtSeconds}
							className="txt"
							style={{
								...(attributes.numberTextSize !== 16
									? { fontSize: attributes.numberTextSize }
									: {}),
								...(attributes.numberTextColor !== "#101015"
									? { color: attributes.numberTextColor }
									: {}),
							}}
						/>
					</div>
				</div>
				{attributes.hasAfterText && (
					<RichText.Content
						tagName="span"
						value={attributes.afterText}
						className="blockons-countdown-after"
						style={{
							fontSize: attributes.afterFontSize,
							...(attributes.afterTextColor !== "#101015"
								? { color: attributes.afterTextColor }
								: {}),
						}}
					/>
				)}
				{/* {attributes.linkType === "button" && (
					<a
						href={attributes.linkTo}
						{...(attributes.linkTarget ? { target: "_blank" } : {})}
						className="blockons-button"
					>
						<RichText.Content
							tagName="span"
							value={attributes.linkButtonText}
							style={{
								...(attributes.linkButtonBgColor !== "#000"
									? { backgroundColor: attributes.linkButtonBgColor }
									: {}),
								...(attributes.linkButtonFontColor !== "#FFF"
									? { color: attributes.linkButtonFontColor }
									: {}),
							}}
						/>
					</a>
				)} */}

				{attributes.onComplete === "one" && (
					<RichText.Content
						tagName="div"
						value={attributes.onCompleteText}
						className="blockons-timer-expired"
						style={{
							...(attributes.linkButtonBgColor !== "#000"
								? { backgroundColor: attributes.linkButtonBgColor }
								: {}),
							...(attributes.linkButtonFontColor !== "#FFF"
								? { color: attributes.linkButtonFontColor }
								: {}),
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default Save;
