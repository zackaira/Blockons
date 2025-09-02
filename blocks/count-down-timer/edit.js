import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	RichText,
	AlignmentToolbar,
	BlockAlignmentToolbar,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Dropdown,
	ToggleControl,
	SelectControl,
	TextControl,
	RangeControl,
	DateTimePicker,
} from '@wordpress/components';
import BlockonsColorpicker from '../_components/BlockonsColorpicker';
import {
	formatDateTime,
	colorPickerPalette,
	minimalRichText,
} from '../block-global';

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
			linkButtonSpace,
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
			timerVertSpacing,
			timerHoriSpacing,
			timerStyle,
		},
		setAttributes,
	} = props;
	const [currentInterval, setCurrentInterval] = useState(0);
	const todayPlusOneDay = new Date().setDate(new Date().getDate() + 1);
	const dateTime = selectedDateTime ? selectedDateTime : todayPlusOneDay;

	const blockProps = useBlockProps({
		className: `align-${align} alignment-${alignment} design-${design} ${
			design === 'two' && timerStyle !== 'one'
				? 'style-' + timerStyle
				: ''
		}`,
	});

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment: newAlignment === undefined ? 'left' : newAlignment,
		});
	};

	useEffect(() => {
		setAttributes({
			selectedDateTime: dateTime,
		});
	}, []);

	useEffect(() => {
		if (selectedDateTime) {
			const currentTimer = runCountDownTimer(
				selectedDateTime,
				dateTime,
				onCompleteText,
				onCompleteHide,
			);
			setCurrentInterval(currentTimer);

			const counterParent =
				document.getElementById(selectedDateTime)?.parentElement || '';
			if (
				counterParent &&
				counterParent.classList.contains('hide-timer')
			) {
				setTimeout(() => {
					counterParent.classList.remove('hide-timer');
				}, 400);
			}
		}
	}, [selectedDateTime]);

	useEffect(() => {
		return () => {
			if (currentInterval) clearInterval(currentInterval);
		};
	}, [currentInterval]);

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__('Timer Settings', 'blockons')}
						initialOpen={true}
					>
						{selectedDateTime ? (
							<Dropdown
								className="blockons-datetime-selecter"
								contentClassName="blockons-editor-popup"
								popoverProps={{ placement: 'bottom-end' }}
								renderToggle={({ isOpen, onToggle }) => (
									<TextControl
										hideLabelFromVision={true}
										value={formatDateTime(selectedDateTime)}
										readOnly={true}
										onClick={onToggle}
										__next40pxDefaultSize={true}
										__nextHasNoMarginBottom={true}
									/>
								)}
								renderContent={() => (
									<DateTimePicker
										currentDate={selectedDateTime}
										onChange={(newDate) =>
											setAttributes({
												selectedDateTime:
													newDate === undefined
														? todayPlusOneDay
														: new Date(
																newDate,
															).getTime(),
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
							label={__('Timer Design', 'blockons')}
							value={design}
							options={[
								{
									label: __('Plain Text', 'blockons'),
									value: 'one',
								},
								{
									label: __('Block Design', 'blockons'),
									value: 'two',
								},
							]}
							onChange={(newValue) =>
								setAttributes({
									design:
										newValue === undefined
											? 'one'
											: newValue,
								})
							}
							help={__(
								"Adjust all colors, sizing and spacing in the 'Design Settings' panel further down.",
								'blockons',
							)}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>
						<div className="blockons-divider"></div>

						<SelectControl
							label={__('Link To URL', 'blockons')}
							value={linkType}
							options={[
								{
									label: __('None', 'blockons'),
									value: 'none',
								},
								{
									label: __('Button link', 'blockons'),
									value: 'button',
								},
								{
									label: __('Link whole block', 'blockons'),
									value: 'full',
								},
							]}
							onChange={(newValue) =>
								setAttributes({
									linkType:
										newValue === undefined
											? 'none'
											: newValue,
								})
							}
							help={
								linkType === 'button' || linkType === 'full'
									? 'Links will only work on the website frontend.'
									: ''
							}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>
						{(linkType === 'button' || linkType === 'full') && (
							<>
								<TextControl
									label="Link URL"
									value={linkTo}
									onChange={(newValue) => {
										setAttributes({
											linkTo: newValue,
										});
									}}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>
								<ToggleControl
									label={__('Open in new window', 'blockons')}
									checked={linkTarget}
									onChange={(newValue) => {
										setAttributes({
											linkTarget: newValue,
										});
									}}
									__nextHasNoMarginBottom={true}
								/>
								{linkType === 'button' && (
									<>
										<BlockonsColorpicker
											label={__(
												'Button Background Color',
												'blockons',
											)}
											value={linkButtonBgColor}
											onChange={(colorValue) => {
												setAttributes({
													linkButtonBgColor:
														colorValue === undefined
															? '#000'
															: colorValue,
												});
											}}
											paletteColors={colorPickerPalette}
										/>
										<BlockonsColorpicker
											label={__(
												'Button Text Color',
												'blockons',
											)}
											value={linkButtonFontColor}
											onChange={(colorValue) => {
												setAttributes({
													linkButtonFontColor:
														colorValue === undefined
															? '#FFF'
															: colorValue,
												});
											}}
											paletteColors={colorPickerPalette}
										/>
										<RangeControl
											label={__('Spacing', 'blockons')}
											value={linkButtonSpace}
											onChange={(newValue) =>
												setAttributes({
													linkButtonSpace:
														newValue === undefined
															? 8
															: parseInt(
																	newValue,
																),
												})
											}
											min={0}
											max={200}
											__next40pxDefaultSize={true}
											__nextHasNoMarginBottom={true}
										/>
									</>
								)}
							</>
						)}
						<div className="blockons-divider"></div>

						<ToggleControl
							label={__('Add Text Before', 'blockons')}
							checked={hasBeforeText}
							onChange={(newValue) => {
								setAttributes({
									hasBeforeText: newValue,
								});
							}}
							__nextHasNoMarginBottom={true}
						/>
						{hasBeforeText && (
							<TextControl
								value={beforeText}
								onChange={(newValue) => {
									setAttributes({
										beforeText: newValue,
									});
								}}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
						)}

						<ToggleControl
							label={__('Add Text After', 'blockons')}
							checked={hasAfterText}
							onChange={(newValue) => {
								setAttributes({
									hasAfterText: newValue,
								});
							}}
							__nextHasNoMarginBottom={true}
						/>
						{hasAfterText && (
							<TextControl
								value={afterText}
								onChange={(newValue) => {
									setAttributes({
										afterText: newValue,
									});
								}}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
						)}
						<div className="blockons-divider"></div>

						<SelectControl
							label={__('On timer Complete', 'blockons')}
							value={onComplete}
							options={[
								{
									label: __('Show Text', 'blockons'),
									value: 'one',
								},
								{
									label: __('Hide Element', 'blockons'),
									value: 'two',
								},
							]}
							onChange={(newValue) =>
								setAttributes({
									onComplete:
										newValue === undefined
											? 'one'
											: newValue,
								})
							}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>

						{onComplete === 'one' && (
							<TextControl
								value={onCompleteText}
								onChange={(newValue) => {
									setAttributes({
										onCompleteText: newValue,
									});
								}}
								help="This text will be shown when the timer count down is complete."
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
						)}
						{onComplete === 'two' && (
							<TextControl
								value={onCompleteHide}
								onChange={(newValue) => {
									setAttributes({
										onCompleteHide: newValue,
									});
								}}
								help="Add the class or id of the element you want to hide when the timer count down is complete.\nclass: .class-name, id: #id-name"
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
						)}
					</PanelBody>
					<PanelBody
						title={__('Design Settings', 'blockons')}
						initialOpen={false}
					>
						<BlockonsColorpicker
							label={__('Background Color', 'blockons')}
							value={bgColor}
							onChange={(colorValue) => {
								setAttributes({
									bgColor:
										colorValue === undefined
											? ''
											: colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						<RangeControl
							label={__('Padding', 'blockons')}
							value={counterPadding}
							onChange={(newValue) =>
								setAttributes({
									counterPadding:
										newValue === undefined
											? 0
											: parseInt(newValue),
								})
							}
							min={0}
							max={250}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>

						{hasBeforeText && (
							<>
								<div className="blockons-divider"></div>
								<p>{__('Before Text', 'blockons')}</p>
								<RangeControl
									label={__('Font Size', 'blockons')}
									value={beforeFontSize}
									onChange={(newValue) =>
										setAttributes({
											beforeFontSize:
												newValue === undefined
													? 16
													: parseInt(newValue),
										})
									}
									min={11}
									max={82}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>
								<BlockonsColorpicker
									label={__('Text Color', 'blockons')}
									value={beforeTextColor}
									onChange={(colorValue) => {
										setAttributes({
											beforeTextColor:
												colorValue === undefined
													? '#000'
													: colorValue,
										});
									}}
									paletteColors={colorPickerPalette}
								/>
								<div className="blockons-divider"></div>
							</>
						)}

						{hasAfterText && (
							<>
								<p>{__('After Text', 'blockons')}</p>
								<RangeControl
									label={__('Font Size', 'blockons')}
									value={afterFontSize}
									onChange={(newValue) =>
										setAttributes({
											afterFontSize:
												newValue === undefined
													? 16
													: parseInt(newValue),
										})
									}
									min={11}
									max={82}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>
								<BlockonsColorpicker
									label={__('Text Color', 'blockons')}
									value={afterTextColor}
									onChange={(colorValue) => {
										setAttributes({
											afterTextColor:
												colorValue === undefined
													? '#000'
													: colorValue,
										});
									}}
									paletteColors={colorPickerPalette}
								/>
							</>
						)}

						<div className="blockons-divider"></div>

						<p>{__('Timer Design', 'blockons')}</p>
						<RangeControl
							label={__('Text Size', 'blockons')}
							value={numberTextSize}
							onChange={(newValue) =>
								setAttributes({
									numberTextSize:
										newValue === undefined
											? 16
											: parseInt(newValue),
								})
							}
							min={11}
							max={82}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>
						<BlockonsColorpicker
							label={__('Text Color', 'blockons')}
							value={numberTextColor}
							onChange={(colorValue) => {
								setAttributes({
									numberTextColor:
										colorValue === undefined
											? '#101015'
											: colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						<RangeControl
							label={__('Timer Digits Size', 'blockons')}
							value={numberSize}
							onChange={(newValue) =>
								setAttributes({
									numberSize:
										newValue === undefined
											? 16
											: parseInt(newValue),
								})
							}
							min={11}
							max={82}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>
						<BlockonsColorpicker
							label={__('Timer Digits Color', 'blockons')}
							value={numberColor}
							onChange={(colorValue) => {
								setAttributes({
									numberColor:
										colorValue === undefined
											? '#101015'
											: colorValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						<div className="blockons-divider"></div>

						{design === 'two' && (
							<>
								<SelectControl
									label={__('Style', 'blockons')}
									value={timerStyle}
									options={[
										{
											label: __('Plain', 'blockons'),
											value: 'one',
										},
										{
											label: __('Clock', 'blockons'),
											value: 'two',
										},
										{
											label: __(
												'Line Divider',
												'blockons',
											),
											value: 'three',
										},
									]}
									onChange={(newValue) =>
										setAttributes({
											timerStyle:
												newValue === undefined
													? 'one'
													: newValue,
										})
									}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>
								<div className="blockons-divider"></div>
							</>
						)}

						{design === 'two' && (
							<RangeControl
								label={__('Horizontal Spacing', 'blockons')}
								value={timerHoriSpacing}
								onChange={(newValue) =>
									setAttributes({
										timerHoriSpacing:
											newValue === undefined
												? 12
												: parseInt(newValue),
									})
								}
								min={0}
								max={120}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
						)}

						<RangeControl
							label={
								design === 'two'
									? __('Vertical Spacing', 'blockons')
									: __('Spacing', 'blockons')
							}
							value={timerVertSpacing}
							onChange={(newValue) =>
								setAttributes({
									timerVertSpacing:
										newValue === undefined
											? 0
											: parseInt(newValue),
								})
							}
							min={0}
							max={120}
							__next40pxDefaultSize={true}
							__nextHasNoMarginBottom={true}
						/>
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<BlockAlignmentToolbar
						value={align}
						controls={['left', 'center', 'right']}
						onChange={(newValue) => {
							setAttributes({
								align:
									newValue === undefined ? 'left' : newValue,
							});
						}}
					/>
					{design === 'two' && (
						<AlignmentToolbar
							value={alignment}
							onChange={onChangeAlignment}
						/>
					)}
				</BlockControls>
			}
			<div
				className="blockons-count-timer-block hide-timer"
				style={{
					...(bgColor ? { backgroundColor: bgColor } : {}),
					...(counterPadding ? { padding: counterPadding } : {}),
				}}
			>
				{linkType === 'full' && (
					<a
						href={linkTo}
						className="blockons-timer-link"
						{...(linkTarget ? { target: '_blank' } : {})}
					></a>
				)}

				{hasBeforeText && (
					<RichText
						tagName={'span'}
						placeholder={__('Special:', 'blockons')}
						value={beforeText}
						className="blockons-countdown-before"
						onChange={(value) =>
							setAttributes({ beforeText: value })
						}
						allowedFormats={minimalRichText}
						disableLineBreaks={true}
						style={{
							fontSize: beforeFontSize,
							...(beforeTextColor !== '#101015'
								? { color: beforeTextColor }
								: {}),
						}}
					/>
				)}
				<div
					className="countdown"
					id={selectedDateTime}
					style={{
						...(!hasBeforeText ? { marginLeft: 0 } : {}),
						...(!hasAfterText ? { marginRight: 0 } : {}),
					}}
					{...(onComplete === 'one'
						? { 'data-completetext': onCompleteText }
						: {})}
					{...(onComplete === 'two'
						? { 'data-completehide': onCompleteHide }
						: {})}
				>
					<div
						className="count-block days"
						style={{
							...(design === 'two' && timerVertSpacing !== 0
								? { margin: `${timerVertSpacing}px 0` }
								: { margin: `0 ${timerVertSpacing}px` }),
							...(design === 'two' && timerHoriSpacing !== 12
								? { padding: `0 ${timerHoriSpacing}px` }
								: {}),
						}}
					>
						<div
							className="amnt days"
							style={{
								...(numberSize !== 16
									? { fontSize: numberSize }
									: {}),
								...(numberColor !== '#101015'
									? { color: numberColor }
									: {}),
							}}
						></div>
						<RichText
							tagName={'div'}
							placeholder={__('days', 'blockons')}
							value={txtDays}
							className="txt"
							onChange={(value) =>
								setAttributes({ txtDays: value })
							}
							allowedFormats={minimalRichText}
							disableLineBreaks={true}
							style={{
								...(numberTextSize !== 16
									? { fontSize: numberTextSize }
									: {}),
								...(numberTextColor !== '#101015'
									? { color: numberTextColor }
									: {}),
							}}
						/>
					</div>
					<div
						className="count-block hours"
						style={{
							...(design === 'two' && timerVertSpacing !== 0
								? { margin: `${timerVertSpacing}px 0` }
								: { margin: `0 ${timerVertSpacing}px` }),
							...(design === 'two' && timerHoriSpacing !== 12
								? { padding: `0 ${timerHoriSpacing}px` }
								: {}),
						}}
					>
						<div
							className="amnt hours"
							style={{
								...(numberSize !== 16
									? { fontSize: numberSize }
									: {}),
								...(numberColor !== '#101015'
									? { color: numberColor }
									: {}),
							}}
						></div>
						<RichText
							tagName={'div'}
							placeholder={__('hours', 'blockons')}
							value={txtHours}
							className="txt"
							onChange={(value) =>
								setAttributes({ txtHours: value })
							}
							allowedFormats={minimalRichText}
							disableLineBreaks={true}
							style={{
								...(numberTextSize !== 16
									? { fontSize: numberTextSize }
									: {}),
								...(numberTextColor !== '#101015'
									? { color: numberTextColor }
									: {}),
							}}
						/>
					</div>
					<div
						className="count-block minutes"
						style={{
							...(design === 'two' && timerVertSpacing !== 0
								? { margin: `${timerVertSpacing}px 0` }
								: { margin: `0 ${timerVertSpacing}px` }),
							...(design === 'two' && timerHoriSpacing !== 12
								? { padding: `0 ${timerHoriSpacing}px` }
								: {}),
						}}
					>
						<div
							className="amnt minutes"
							style={{
								...(numberSize !== 16
									? { fontSize: numberSize }
									: {}),
								...(numberColor !== '#101015'
									? { color: numberColor }
									: {}),
							}}
						></div>
						<RichText
							tagName={'div'}
							placeholder={__('minutes', 'blockons')}
							value={txtMinutes}
							className="txt"
							onChange={(value) =>
								setAttributes({ txtMinutes: value })
							}
							allowedFormats={minimalRichText}
							disableLineBreaks={true}
							style={{
								...(numberTextSize !== 16
									? { fontSize: numberTextSize }
									: {}),
								...(numberTextColor !== '#101015'
									? { color: numberTextColor }
									: {}),
							}}
						/>
					</div>
					<div
						className="count-block seconds"
						style={{
							...(design === 'two' && timerVertSpacing !== 0
								? { margin: `${timerVertSpacing}px 0` }
								: { margin: `0 ${timerVertSpacing}px` }),
							...(design === 'two' && timerHoriSpacing !== 12
								? { padding: `0 ${timerHoriSpacing}px` }
								: {}),
						}}
					>
						<div
							className="amnt seconds"
							style={{
								...(numberSize !== 16
									? { fontSize: numberSize }
									: {}),
								...(numberColor !== '#101015'
									? { color: numberColor }
									: {}),
							}}
						></div>
						<RichText
							tagName={'div'}
							placeholder={__('seconds', 'blockons')}
							value={txtSeconds}
							className="txt"
							onChange={(value) =>
								setAttributes({ txtSeconds: value })
							}
							allowedFormats={minimalRichText}
							disableLineBreaks={true}
							style={{
								...(numberTextSize !== 16
									? { fontSize: numberTextSize }
									: {}),
								...(numberTextColor !== '#101015'
									? { color: numberTextColor }
									: {}),
							}}
						/>
					</div>
				</div>
				{hasAfterText && (
					<RichText
						tagName={'span'}
						placeholder={__('until the discount ends.', 'blockons')}
						value={afterText}
						className="blockons-countdown-after"
						onChange={(value) =>
							setAttributes({ afterText: value })
						}
						allowedFormats={minimalRichText}
						disableLineBreaks={true}
						style={{
							fontSize: afterFontSize,
							...(afterTextColor !== '#101015'
								? { color: afterTextColor }
								: {}),
						}}
					/>
				)}
				{linkType === 'button' && (
					<div
						className="blockons-timer-button"
						style={{
							...(linkButtonBgColor !== '#000'
								? { backgroundColor: linkButtonBgColor }
								: {}),
							...(linkButtonFontColor !== '#FFF'
								? { color: linkButtonFontColor }
								: {}),
							...(design === 'two'
								? { marginTop: linkButtonSpace }
								: { marginLeft: linkButtonSpace }),
						}}
					>
						<a
							href={linkTo}
							{...(linkTarget ? { target: '_blank' } : {})}
							className="blockons-timer-button-link"
						></a>
						<RichText
							tagName={'span'}
							placeholder={linkButtonText}
							value={linkButtonText}
							onChange={(value) =>
								setAttributes({ linkButtonText: value })
							}
							allowedFormats={minimalRichText}
							disableLineBreaks={true}
						/>
					</div>
				)}

				{onComplete === 'one' && (
					<RichText
						tagName={'div'}
						value={onCompleteText}
						className="blockons-timer-expired"
						onChange={(value) =>
							setAttributes({ onCompleteText: value })
						}
						allowedFormats={minimalRichText}
						disableLineBreaks={true}
						style={{
							fontSize: afterFontSize,
							...(afterTextColor !== '#101015'
								? { color: afterTextColor }
								: {}),
						}}
					/>
				)}
			</div>
		</div>
	);
};

function runCountDownTimer(
	elementId,
	dateTime,
	onCompleteText,
	onCompleteHide,
) {
	const counterElement = document.getElementById(elementId);
	const counterElementParent = counterElement?.parentElement || '';
	const countDownDate = new Date(dateTime).getTime();

	if (!counterElement || !counterElementParent) return;

	const updateCountdown = () => {
		const now = new Date().getTime();
		const distance = countDownDate - now;

		const days = Math.floor(distance / (1000 * 60 * 60 * 24));
		const hours = Math.floor(
			(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
		)
			.toString()
			.padStart(2, '0');
		const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
			.toString()
			.padStart(2, '0');
		const seconds = Math.floor((distance % (1000 * 60)) / 1000)
			.toString()
			.padStart(2, '0');

		if (days) {
			counterElement
				.querySelector('.count-block.days')
				.classList.remove('blockons-hide');
			counterElement.querySelector('.days .amnt').innerHTML = days;
		} else {
			counterElement
				.querySelector('.count-block.days')
				.classList.add('blockons-hide');
		}
		if (hours) {
			counterElement.querySelector('.hours .amnt').innerHTML = hours;
		}
		if (minutes) {
			counterElement.querySelector('.minutes .amnt').innerHTML = minutes;
		}
		if (seconds) {
			counterElement.querySelector('.seconds .amnt').innerHTML = seconds;
		}

		if (distance < 0) {
			clearInterval(interval);
			if (onCompleteText) {
				counterElementParent.classList.add('blockons-expired-hide');
			}
			if (onCompleteHide) {
				counterElementParent.classList.add('blockons-countdown-hide');
			}
			if (
				counterElementParent.classList.contains(
					'blockons-countdown-hide',
				)
			) {
				counterElementParent.classList.remove(
					'blockons-countdown-hide',
				);
			}
		} else {
			if (onCompleteText) {
				counterElementParent.classList.remove('blockons-expired-hide');
			}
			if (onCompleteHide) {
				counterElementParent.classList.remove(
					'blockons-countdown-hide',
				);
			}
		}
	};

	const interval = setInterval(updateCountdown, 1000);
	return interval;
}

export default Edit;
