import { RichText, useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `align-${attributes.align} alignment-${
			attributes.alignment
		} design-${attributes.design} ${
			attributes.design === "two" && attributes.timerStyle !== "one"
				? "style-" + attributes.timerStyle
				: ""
		}`,
	});

	return (
		<div {...blockProps}>
			<div
				className="blockons-count-timer-block hide-timer"
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
							...(attributes.design === "two" &&
							attributes.timerVertSpacing !== 0
								? { margin: `${attributes.timerVertSpacing}px 0` }
								: { margin: `0 ${attributes.timerVertSpacing}px` }),
							...(attributes.design === "two" &&
							attributes.timerHoriSpacing !== 12
								? { padding: `0 ${attributes.timerHoriSpacing}px` }
								: {}),
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
							...(attributes.design === "two" &&
							attributes.timerVertSpacing !== 0
								? { margin: `${attributes.timerVertSpacing}px 0` }
								: { margin: `0 ${attributes.timerVertSpacing}px` }),
							...(attributes.design === "two" &&
							attributes.timerHoriSpacing !== 12
								? { padding: `0 ${attributes.timerHoriSpacing}px` }
								: {}),
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
							...(attributes.design === "two" &&
							attributes.timerVertSpacing !== 0
								? { margin: `${attributes.timerVertSpacing}px 0` }
								: { margin: `0 ${attributes.timerVertSpacing}px` }),
							...(attributes.design === "two" &&
							attributes.timerHoriSpacing !== 12
								? { padding: `0 ${attributes.timerHoriSpacing}px` }
								: {}),
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
							...(attributes.design === "two" &&
							attributes.timerVertSpacing !== 0
								? { margin: `${attributes.timerVertSpacing}px 0` }
								: { margin: `0 ${attributes.timerVertSpacing}px` }),
							...(attributes.design === "two" &&
							attributes.timerHoriSpacing !== 12
								? { padding: `0 ${attributes.timerHoriSpacing}px` }
								: {}),
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
				{attributes.linkType === "button" && (
					<div
						className="blockons-timer-button"
						style={{
							...(attributes.linkButtonBgColor !== "#000"
								? { backgroundColor: attributes.linkButtonBgColor }
								: {}),
							...(attributes.linkButtonFontColor !== "#FFF"
								? { color: attributes.linkButtonFontColor }
								: {}),
							...(attributes.design === "two"
								? { marginTop: attributes.linkButtonSpace }
								: { marginLeft: attributes.linkButtonSpace }),
						}}
					>
						<a
							href={attributes.linkTo}
							{...(attributes.linkTarget ? { target: "_blank" } : {})}
							className="blockons-timer-button-link"
						></a>
						<RichText.Content
							tagName="span"
							value={attributes.linkButtonText}
						/>
					</div>
				)}

				{attributes.onComplete === "one" && (
					<RichText.Content
						tagName="div"
						value={attributes.onCompleteText}
						className="blockons-timer-expired"
						style={{
							fontSize: attributes.afterFontSize,
							...(attributes.afterTextColor !== "#101015"
								? { color: attributes.afterTextColor }
								: {}),
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default Save;
