/**
 * WordPress dependencies
 */
import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
	RichText,
	AlignmentToolbar,
	BlockAlignmentToolbar,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from "@wordpress/block-editor";
import {
	PanelBody,
	Dropdown,
	ToggleControl,
	SelectControl,
	TextControl,
	RangeControl,
	DateTimePicker,
} from "@wordpress/components";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import {
	formatDateTime,
	colorPickerPalette,
	minimalRichText,
} from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			align,
			alignment,
			selectedDateTime,
			linkType,
			linkTo,
			linkTarget,
			linkButtonText,
			linkButtonBgColor,
			linkButtonFontColor,
			hasBeforeText,
			beforeText,
			hasAfterText,
			afterText,
			onComplete,
			onCompleteText,
			onCompleteHide,
			design,
			bgColor,
			beforeTextColor,
			beforeFontSize,
			afterTextColor,
			afterFontSize,
			counterPadding,
			txtDays,
			txtHours,
			txtMinutes,
			txtSeconds,
			numberSize,
			numberColor,
			numberTextSize,
			numberTextColor,
			timerSpacing,
		},
		setAttributes,
	} = props;
	const [currentInterval, setCurrentInterval] = useState(0);
	const todayPlusOneDay = new Date().setDate(new Date().getDate() + 1);
	const dateTime = selectedDateTime ? selectedDateTime : todayPlusOneDay;

	const blockProps = useBlockProps({
		className: `align-${align} alignment-${alignment} design-${design}`,
	});

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? "left" : newAlignment,
		});
	};

	console.log("EDIT - selectedDateTime", selectedDateTime);

	useEffect(() => {
		setAttributes({
			selectedDateTime: dateTime,
		});
	}, []);

	useEffect(() => {
		if (selectedDateTime) {
			if (currentInterval) clearInterval(currentInterval);
			const currentTimer = runCountDownTimer(
				selectedDateTime,
				dateTime,
				design
			);
			setCurrentInterval(currentTimer);
		}
	}, [selectedDateTime]);

	console.log("EDIT - selectedDateTime2", selectedDateTime);

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Timer Settings", "blockons")}
						initialOpen={true}
					>
						{selectedDateTime ? (
							<Dropdown
								className="blockons-datetime-selecter"
								contentClassName="blockons-editor-popup"
								popoverProps={{ placement: "bottom-end" }}
								renderToggle={({ isOpen, onToggle }) => (
									<TextControl
										hideLabelFromVision={true}
										value={formatDateTime(selectedDateTime)}
										readOnly={true}
										onClick={onToggle}
									/>
								)}
								renderContent={() => (
									<DateTimePicker
										currentDate={selectedDateTime}
										onChange={(newDate) =>
											setAttributes({
												selectedDateTime:
													newDate === undefined
														? formatDateTime(todayPlusOneDay).toString()
														: newDate.toString(),
											})
										}
										is12Hour={true}
										__nextRemoveHelpButton
										__nextRemoveResetButton
									/>
								)}
							/>
						) : (
							<div>Loading...</div>
						)}
						<div className="blockons-divider"></div>

						<SelectControl
							label={__("Link To URL", "blockons")}
							value={linkType}
							options={[
								{ label: __("None", "blockons"), value: "none" },
								{ label: __("Button link", "blockons"), value: "button" },
								{ label: __("Link whole block", "blockons"), value: "full" },
							]}
							onChange={(newValue) =>
								setAttributes({
									linkType: newValue === undefined ? "none" : newValue,
								})
							}
							__nextHasNoMarginBottom
							help={
								linkType === "button" || linkType === "full"
									? "Links will only work on the website frontend."
									: ""
							}
						/>
						{(linkType === "button" || linkType === "full") && (
							<>
								<TextControl
									label="Link URL"
									value={linkTo}
									onChange={(newValue) => {
										setAttributes({
											linkTo: newValue,
										});
									}}
								/>
								<ToggleControl
									label={__("Open in new window", "blockons")}
									checked={linkTarget}
									onChange={(newValue) => {
										setAttributes({
											linkTarget: newValue,
										});
									}}
								/>
								{linkType === "button" && (
									<>
										<BlockonsColorpicker
											label={__("Button Background Color", "blockons")}
											value={linkButtonBgColor}
											onChange={(colorValue) => {
												setAttributes({
													linkButtonBgColor:
														colorValue === undefined ? "#000" : colorValue,
												});
											}}
											paletteColors={colorPickerPalette}
										/>
										<BlockonsColorpicker
											label={__("Button Text Color", "blockons")}
											value={linkButtonFontColor}
											onChange={(colorValue) => {
												setAttributes({
													linkButtonFontColor:
														colorValue === undefined ? "#FFF" : colorValue,
												});
											}}
											paletteColors={colorPickerPalette}
										/>
									</>
								)}
							</>
						)}
						<div className="blockons-divider"></div>

						<SelectControl
							label={__("Timer Design", "blockons")}
							value={design}
							options={[
								{ label: __("Plain Text", "blockons"), value: "one" },
								{ label: __("Block Design", "blockons"), value: "two" },
							]}
							onChange={(newValue) =>
								setAttributes({
									design: newValue === undefined ? "one" : newValue,
								})
							}
							__nextHasNoMarginBottom
						/>

						<div className="blockons-divider"></div>

						<ToggleControl
							label={__("Add Text Before", "blockons")}
							checked={hasBeforeText}
							onChange={(newValue) => {
								setAttributes({
									hasBeforeText: newValue,
								});
							}}
						/>
						{hasBeforeText && (
							<TextControl
								value={beforeText}
								onChange={(newValue) => {
									setAttributes({
										beforeText: newValue,
									});
								}}
							/>
						)}

						<ToggleControl
							label={__("Add Text After", "blockons")}
							checked={hasAfterText}
							onChange={(newValue) => {
								setAttributes({
									hasAfterText: newValue,
								});
							}}
						/>
						{hasAfterText && (
							<TextControl
								value={afterText}
								onChange={(newValue) => {
									setAttributes({
										afterText: newValue,
									});
								}}
							/>
						)}
						<div className="blockons-divider"></div>

						<SelectControl
							label={__("On timer Complete", "blockons")}
							value={onComplete}
							options={[
								{ label: __("Show Text", "blockons"), value: "one" },
								{ label: __("Hide Element", "blockons"), value: "two" },
							]}
							onChange={(newValue) =>
								setAttributes({
									onComplete: newValue === undefined ? "one" : newValue,
								})
							}
							__nextHasNoMarginBottom
						/>

						{onComplete === "one" && (
							<TextControl
								value={onCompleteText}
								onChange={(newValue) => {
									setAttributes({
										onCompleteText: newValue,
									});
								}}
								help="This text will be shown when the timer count down is complete."
							/>
						)}
						{onComplete === "two" && (
							<TextControl
								value={onCompleteHide}
								onChange={(newValue) => {
									setAttributes({
										onCompleteHide: newValue,
									});
								}}
								help="Add the class or id of the element you want to hide when the timer count down is complete.\nclass: .class-name, id: #id-name"
							/>
						)}
					</PanelBody>
					<PanelBody
						title={__("Design Settings", "blockons")}
						initialOpen={false}
					>
						<BlockonsColorpicker
							label={__("Background Color", "blockons")}
							value={bgColor}
							onChange={(colorValue) => {
								setAttributes({
									bgColor: colorValue === undefined ? "" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						<RangeControl
							label={__("Padding", "blockons")}
							value={counterPadding}
							onChange={(newValue) =>
								setAttributes({
									counterPadding:
										newValue === undefined ? 0 : parseInt(newValue),
								})
							}
							min={0}
							max={250}
						/>

						{hasBeforeText && (
							<>
								<div className="blockons-divider"></div>
								<p>{__("Before Text", "blockons")}</p>
								<RangeControl
									label={__("Font Size", "blockons")}
									value={beforeFontSize}
									onChange={(newValue) =>
										setAttributes({
											beforeFontSize:
												newValue === undefined ? 16 : parseInt(newValue),
										})
									}
									min={11}
									max={82}
								/>
								<BlockonsColorpicker
									label={__("Text Color", "blockons")}
									value={beforeTextColor}
									onChange={(colorValue) => {
										setAttributes({
											beforeTextColor:
												colorValue === undefined ? "#000" : colorValue,
										});
									}}
									paletteColors={colorPickerPalette}
								/>
								<div className="blockons-divider"></div>
							</>
						)}

						{hasAfterText && (
							<>
								<p>{__("After Text", "blockons")}</p>
								<RangeControl
									label={__("Font Size", "blockons")}
									value={afterFontSize}
									onChange={(newValue) =>
										setAttributes({
											afterFontSize:
												newValue === undefined ? 16 : parseInt(newValue),
										})
									}
									min={11}
									max={82}
								/>
								<BlockonsColorpicker
									label={__("Text Color", "blockons")}
									value={afterTextColor}
									onChange={(colorValue) => {
										setAttributes({
											afterTextColor:
												colorValue === undefined ? "#000" : colorValue,
										});
									}}
									paletteColors={colorPickerPalette}
								/>
							</>
						)}

						<div className="blockons-divider"></div>

						<p>{__("Timer Design", "blockons")}</p>
						<RangeControl
							label={__("Text Size", "blockons")}
							value={numberTextSize}
							onChange={(newValue) =>
								setAttributes({
									numberTextSize:
										newValue === undefined ? 16 : parseInt(newValue),
								})
							}
							min={11}
							max={82}
						/>
						<BlockonsColorpicker
							label={__("Text Color", "blockons")}
							value={numberTextColor}
							onChange={(colorValue) => {
								setAttributes({
									numberTextColor:
										colorValue === undefined ? "#101015" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						<RangeControl
							label={__("Timer Digits Size", "blockons")}
							value={numberSize}
							onChange={(newValue) =>
								setAttributes({
									numberSize: newValue === undefined ? 16 : parseInt(newValue),
								})
							}
							min={11}
							max={82}
						/>
						<BlockonsColorpicker
							label={__("Timer Digits Color", "blockons")}
							value={numberColor}
							onChange={(colorValue) => {
								setAttributes({
									numberColor:
										colorValue === undefined ? "#101015" : colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						<div className="blockons-divider"></div>
						<RangeControl
							label={__("Spacing", "blockons")}
							value={timerSpacing}
							onChange={(newValue) =>
								setAttributes({
									timerSpacing: newValue === undefined ? 0 : parseInt(newValue),
								})
							}
							min={0}
							max={120}
						/>
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<BlockAlignmentToolbar
						value={align}
						controls={["left", "center", "right"]}
						onChange={(newValue) => {
							setAttributes({
								align: newValue === undefined ? "left" : newValue,
							});
						}}
					/>
					{design === "two" && (
						<AlignmentToolbar value={alignment} onChange={onChangeAlignment} />
					)}
				</BlockControls>
			}
			<div
				className="blockons-count-timer-block"
				style={{
					...(bgColor ? { backgroundColor: bgColor } : {}),
					...(counterPadding ? { padding: counterPadding } : {}),
				}}
			>
				{linkType === "full" && (
					<a
						href={linkTo}
						className="blockons-timer-link"
						{...(linkTarget ? { target: "_blank" } : {})}
					></a>
				)}

				{hasBeforeText && (
					<RichText
						tagName={"span"}
						placeholder={__("Special:", "blockons")}
						keepPlaceholderOnFocus
						value={beforeText}
						className="blockons-countdown-before"
						onChange={(value) => setAttributes({ beforeText: value })}
						allowedFormats={minimalRichText}
						disableLineBreaks={true}
						style={{
							fontSize: beforeFontSize,
							...(beforeTextColor !== "#101015"
								? { color: beforeTextColor }
								: {}),
						}}
					/>
				)}
				<div
					className="countdown"
					id={dateTime}
					style={{
						...(!hasBeforeText ? { marginLeft: 0 } : {}),
						...(!hasAfterText ? { marginRight: 0 } : {}),
					}}
					{...(onComplete === "one"
						? { "data-completeText": onCompleteText }
						: {})}
					{...(onComplete === "two"
						? { "data-completeHide": onCompleteHide }
						: {})}
				>
					<div
						className="count-block days"
						style={{
							...(design === "two"
								? { margin: `${timerSpacing}px 0` }
								: { margin: `0 ${timerSpacing}px` }),
						}}
					>
						<div
							className="amnt days"
							style={{
								...(numberSize !== 16 ? { fontSize: numberSize } : {}),
								...(numberColor !== "#101015" ? { color: numberColor } : {}),
							}}
						></div>
						<RichText
							tagName={"div"}
							placeholder={__("days", "blockons")}
							keepPlaceholderOnFocus
							value={txtDays}
							className="txt"
							onChange={(value) => setAttributes({ txtDays: value })}
							allowedFormats={minimalRichText}
							disableLineBreaks={true}
							style={{
								...(numberTextSize !== 16 ? { fontSize: numberTextSize } : {}),
								...(numberTextColor !== "#101015"
									? { color: numberTextColor }
									: {}),
							}}
						/>
					</div>
					<div
						className="count-block hours"
						style={{
							...(design === "two"
								? { margin: `${timerSpacing}px 0` }
								: { margin: `0 ${timerSpacing}px` }),
						}}
					>
						<div
							className="amnt hours"
							style={{
								...(numberSize !== 16 ? { fontSize: numberSize } : {}),
								...(numberColor !== "#101015" ? { color: numberColor } : {}),
							}}
						></div>
						<RichText
							tagName={"div"}
							placeholder={__("hours", "blockons")}
							keepPlaceholderOnFocus
							value={txtHours}
							className="txt"
							onChange={(value) => setAttributes({ txtHours: value })}
							allowedFormats={minimalRichText}
							disableLineBreaks={true}
							style={{
								...(numberTextSize !== 16 ? { fontSize: numberTextSize } : {}),
								...(numberTextColor !== "#101015"
									? { color: numberTextColor }
									: {}),
							}}
						/>
					</div>
					<div
						className="count-block minutes"
						style={{
							...(design === "two"
								? { margin: `${timerSpacing}px 0` }
								: { margin: `0 ${timerSpacing}px` }),
						}}
					>
						<div
							className="amnt minutes"
							style={{
								...(numberSize !== 16 ? { fontSize: numberSize } : {}),
								...(numberColor !== "#101015" ? { color: numberColor } : {}),
							}}
						></div>
						<RichText
							tagName={"div"}
							placeholder={__("minutes", "blockons")}
							keepPlaceholderOnFocus
							value={txtMinutes}
							className="txt"
							onChange={(value) => setAttributes({ txtMinutes: value })}
							allowedFormats={minimalRichText}
							disableLineBreaks={true}
							style={{
								...(numberTextSize !== 16 ? { fontSize: numberTextSize } : {}),
								...(numberTextColor !== "#101015"
									? { color: numberTextColor }
									: {}),
							}}
						/>
					</div>
					<div
						className="count-block seconds"
						style={{
							...(design === "two"
								? { margin: `${timerSpacing}px 0` }
								: { margin: `0 ${timerSpacing}px` }),
						}}
					>
						<div
							className="amnt seconds"
							style={{
								...(numberSize !== 16 ? { fontSize: numberSize } : {}),
								...(numberColor !== "#101015" ? { color: numberColor } : {}),
							}}
						></div>
						<RichText
							tagName={"div"}
							placeholder={__("seconds", "blockons")}
							keepPlaceholderOnFocus
							value={txtSeconds}
							className="txt"
							onChange={(value) => setAttributes({ txtSeconds: value })}
							allowedFormats={minimalRichText}
							disableLineBreaks={true}
							style={{
								...(numberTextSize !== 16 ? { fontSize: numberTextSize } : {}),
								...(numberTextColor !== "#101015"
									? { color: numberTextColor }
									: {}),
							}}
						/>
					</div>
				</div>
				{hasAfterText && (
					<RichText
						tagName={"span"}
						placeholder={__("until the discount ends.", "blockons")}
						keepPlaceholderOnFocus
						value={afterText}
						className="blockons-countdown-after"
						onChange={(value) => setAttributes({ afterText: value })}
						allowedFormats={minimalRichText}
						disableLineBreaks={true}
						style={{
							fontSize: afterFontSize,
							...(afterTextColor !== "#101015"
								? { color: afterTextColor }
								: {}),
						}}
					/>
				)}
				{/* {linkType === "button" && (
					<a
						href={linkTo}
						{...(linkTarget ? { target: "_blank" } : {})}
						className="blockons-button"
					>
						<RichText
							tagName={"span"}
							placeholder={linkButtonText}
							keepPlaceholderOnFocus
							value={linkButtonText}
							onChange={(value) => setAttributes({ linkButtonText: value })}
							allowedFormats={minimalRichText}
							disableLineBreaks={true}
							style={{
								...(linkButtonBgColor !== "#000"
									? { backgroundColor: linkButtonBgColor }
									: {}),
								...(linkButtonFontColor !== "#FFF"
									? { color: linkButtonFontColor }
									: {}),
							}}
						/>
					</a>
				)} */}

				{onComplete === "one" && (
					<RichText
						tagName={"div"}
						keepPlaceholderOnFocus
						value={onCompleteText}
						className="blockons-timer-expired"
						onChange={(value) => setAttributes({ onCompleteText: value })}
						allowedFormats={minimalRichText}
						disableLineBreaks={true}
					/>
				)}
			</div>
		</div>
	);
};

function runCountDownTimer(elementId, dateTime) {
	const counterElement = document.getElementById(elementId);
	const counterElementParent = counterElement.parentElement;
	const countDownDate = new Date(dateTime).getTime();
	const onCompleteText = counterElement.getAttribute("data-completeText");
	const onCompleteHide = counterElement.getAttribute("data-completeHide");

	const updateCountdown = () => {
		const now = new Date().getTime();
		const distance = countDownDate - now;

		const days = Math.floor(distance / (1000 * 60 * 60 * 24));
		const hours = Math.floor(
			(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		)
			.toString()
			.padStart(2, "0");
		const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
			.toString()
			.padStart(2, "0");
		const seconds = Math.floor((distance % (1000 * 60)) / 1000)
			.toString()
			.padStart(2, "0");

		if (days) {
			counterElement
				.querySelector(".count-block.days")
				.classList.remove("blockons-hide");
			counterElement.querySelector(".days .amnt").innerHTML = days;
		} else {
			counterElement
				.querySelector(".count-block.days")
				.classList.add("blockons-hide");
		}
		if (hours) {
			counterElement.querySelector(".hours .amnt").innerHTML = hours;
		}
		if (minutes) {
			counterElement.querySelector(".minutes .amnt").innerHTML = minutes;
		}
		if (seconds) {
			counterElement.querySelector(".seconds .amnt").innerHTML = seconds;
		}

		if (distance < 0) {
			clearInterval(x);
			if (onCompleteText) {
				counterElementParent.classList.add("blockons-expired-hide");
			}
			if (onCompleteHide) {
				counterElementParent.classList.add("blockons-countdown-hide");
			}
		} else {
			if (onCompleteText) {
				counterElementParent.classList.remove("blockons-expired-hide");
			}
			if (onCompleteHide) {
				counterElementParent.classList.remove("blockons-countdown-hide");
			}
		}
	};

	const x = setInterval(updateCountdown, 1000);
	return x;
}

export default Edit;
