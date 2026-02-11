import {
	RichText,
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { useEffect, useMemo } from '@wordpress/element';
import { useSelect, dispatch, select } from '@wordpress/data';
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
import {
	PanelBody,
	TextControl,
	TextareaControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import { RICHTEXT_MINIMAL_FORMATS } from '../block-global';

// Constants
const WIDTH_OPTIONS = [
	{ label: '100%', value: '100' },
	{ label: '80%', value: '80' },
	{ label: '75%', value: '75' },
	{ label: '50%', value: '50' },
	{ label: '25%', value: '25' },
	{ label: '20%', value: '20' },
];

// Base date formats without time
const BASE_DATE_FORMATS = [
	{ label: 'YYYY-MM-DD (2024-07-28)', value: 'Y-m-d' },
	{ label: 'MM/DD/YYYY (07-28-2024)', value: 'm/d/Y' },
	{ label: 'DD-MM-YYYY (28-07-2024)', value: 'd-m-Y' },
	{ label: 'YYYY.MM.DD (2024.07.28)', value: 'Y.m.d' },
	{ label: 'MM.DD.YYYY (07.28.2024)', value: 'm.d.Y' },
	{ label: 'DD.MM.YYYY (28.07.2024)', value: 'd.m.Y' },
	{ label: 'MMMM DD, YYYY (November 15, 2024)', value: 'F j, Y' },
	{ label: 'DD MMMM YYYY (15 November 2024)', value: 'j F Y' },
	{ label: 'YYYY MMMM DD (2024 November 15)', value: 'Y F j' },
	{ label: 'MMM DD, YYYY (Nov 15, 2024)', value: 'M j, Y' },
	{ label: 'DD MMM YYYY (15 Nov 2024)', value: 'j M Y' },
	{ label: 'YYYY MMM DD (2024 Nov 15)', value: 'Y M j' },
	{
		label: 'Day, MMMM DD, YYYY (Friday, November 15, 2024)',
		value: 'l, F j, Y',
	},
	{ label: 'Day, MMM DD, YYYY (Fri, Nov 15, 2024)', value: 'D, M j, Y' },
];

// Time format suffixes
const TIME_FORMATS = [
	{ label: '24h (14:30)', value: 'H:i' },
	{ label: '12h (02:30 PM)', value: 'h:i K' },
];

// Utility functions
const getFieldClasses = (baseClass, width) => {
	return [baseClass, `col-${width}`].filter(Boolean).join(' ');
};

const getFormattedExample = (format) => {
	// Create a flatpickr instance just for formatting
	const fp = flatpickr.parseDate(new Date(), format);
	return flatpickr.formatDate(fp, format);
};

// Helper function to combine date and time formats
const getDateTimeFormats = (dateFormat, timeFormat, enableTime = false) => {
	if (!enableTime) return dateFormat;
	return `${dateFormat} - ${timeFormat}`;
};

// Custom hook to get dynamic format options
const useDateFormatOptions = (enableTime) => {
	return useMemo(() => {
		if (!enableTime) {
			return BASE_DATE_FORMATS;
		}

		// Generate combined formats for each date and time combination
		const dateTimeFormats = [];
		BASE_DATE_FORMATS.forEach((dateFormat) => {
			TIME_FORMATS.forEach((timeFormat) => {
				dateTimeFormats.push({
					label: `${dateFormat.label.replace(')', '')} ${timeFormat.label})`,
					value: getDateTimeFormats(
						dateFormat.value,
						timeFormat.value,
					),
				});
			});
		});

		return dateTimeFormats;
	}, [enableTime]);
};

registerBlockType('blockons/form-datepicker', {
	apiVersion: 3,
	title: __('Form Date Picker', 'blockons'),
	icon: 'calendar-alt',
	parent: ['blockons/contact-form'],
	attributes: {
		isPremium: {
			type: 'boolean',
			default: false,
		},
		label: {
			type: 'string',
			default: __('Select Date', 'blockons'),
		},
		description: {
			type: 'string',
			default: '',
		},
		required: {
			type: 'boolean',
			default: false,
		},
		width: {
			type: 'string',
			default: '100',
		},
		placeholder: {
			type: 'string',
			default: __('Select date...', 'blockons'),
		},
		columnSpacing: {
			type: 'number',
			default: 4,
		},
		rowSpacing: {
			type: 'number',
			default: 12,
		},
		textSize: {
			type: 'number',
			default: 15,
		},
		textSpacing: {
			type: 'number',
			default: 5,
		},
		textColor: {
			type: 'string',
			default: '#333',
		},
		showLabels: {
			type: 'boolean',
			default: true,
		},
		inputSize: {
			type: 'number',
			default: 15,
		},
		inputPadHoriz: {
			type: 'number',
			default: 15,
		},
		inputPadVert: {
			type: 'number',
			default: 8,
		},
		inputTextColor: {
			type: 'string',
			default: '#333',
		},
		inputBgColor: {
			type: 'string',
			default: '#f9f9f9',
		},
		inputBorder: {
			type: 'boolean',
			default: true,
		},
		inputBorderColor: {
			type: 'string',
			default: '#dbdbdb',
		},
		inputBorderRadius: {
			type: 'number',
			default: 4,
		},
		enableTime: {
			type: 'boolean',
			default: false,
		},
		dateFormat: {
			type: 'string',
			default: 'Y-m-d',
		},
		timeFormat: {
			type: 'string',
			default: 'H:i',
		},
		minDate: {
			type: 'string',
			default: '',
		},
		maxDate: {
			type: 'string',
			default: '',
		},
	},

	edit: (props) => {
		const { isSelected, attributes, setAttributes, clientId } = props;

		const {
			isPremium,
			label,
			description,
			required,
			width,
			columnSpacing,
			rowSpacing,
			showLabels,
			placeholder,
			textSize,
			textSpacing,
			textColor,
			inputSize,
			inputPadHoriz,
			inputPadVert,
			inputBgColor,
			inputBorder,
			inputBorderColor,
			inputBorderRadius,
			inputTextColor,
			enableTime,
			dateFormat,
			timeFormat,
			minDate,
			maxDate,
		} = attributes;

		const blockProps = useBlockProps({
			className: getFieldClasses('blockons-form-datepicker', width),
		});

		const fieldId = useMemo(
			() => `date-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
			[label],
		);
		const dateFormatOptions = useDateFormatOptions(enableTime);

		// Parent block communication
		const parentClientId = useSelect((select) => {
			const { getBlockParents } = select('core/block-editor');
			const parents = getBlockParents(clientId);
			return parents[0];
		}, []);

		useEffect(() => {
			if (!parentClientId) return;

			const parentBlock =
				select('core/block-editor').getBlock(parentClientId);
			if (!parentBlock) return;

			const code = label.toLowerCase().replace(/[^a-z0-9]/g, '_');
			const existingShortcodes = parentBlock.availableShortcodes || [];
			const filteredShortcodes = existingShortcodes.filter(
				(s) => s.fieldId !== clientId,
			);

			dispatch('core/block-editor').updateBlockAttributes(
				parentClientId,
				{
					availableShortcodes: [
						...filteredShortcodes,
						{
							code,
							label,
							type: 'date',
							fieldId: clientId,
						},
					],
				},
			);
		}, [label, parentClientId]);

		// Memoized styles
		const fieldStyles = useMemo(
			() => ({
				color: textColor,
				fontSize: `${textSize}px`,
				gap: `${textSpacing}px`,
			}),
			[textColor, textSize, textSpacing],
		);

		const labelStyles = useMemo(
			() => ({
				display: showLabels ? 'flex' : 'none',
			}),
			[showLabels],
		);

		const inputStyles = useMemo(
			() => ({
				fontSize: `${inputSize}px`,
				color: inputTextColor,
				padding: `${inputPadVert}px ${inputPadHoriz}px`,
				backgroundColor: inputBgColor,
				borderRadius: `${inputBorderRadius}px`,
				...(inputBorder
					? {
							border: `1px solid ${inputBorderColor}`,
						}
					: {
							border: '0',
						}),
			}),
			[
				inputSize,
				inputTextColor,
				inputPadVert,
				inputPadHoriz,
				inputBorder,
				inputBgColor,
				inputBorderRadius,
				inputBorderColor,
			],
		);

		if (!isPremium) {
			return (
				<div className="blockons-form-upgrade">
					{__('This is a Premium Block feature', 'blockons')}{' '}
					<a href={blockonsEditorObj.upgradeUrl} target="_blank">
						{__('Upgrade', 'blockons')}
					</a>
				</div>
			);
		}

		return (
			<div {...blockProps}>
				{isSelected && (
					<InspectorControls>
						<PanelBody
							title={__('Date Picker Settings', 'blockons')}
							initialOpen={true}
						>
							<TextControl
								label={__('Label', 'blockons')}
								value={label}
								onChange={(value) =>
									setAttributes({ label: value })
								}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
							<TextareaControl
								label={__('Description', 'blockons')}
								value={description}
								onChange={(value) =>
									setAttributes({ description: value })
								}
								__nextHasNoMarginBottom={true}
							/>
							<div className="blockons-divider" />

							<TextControl
								label={__('Input Placeholder Text', 'blockons')}
								value={placeholder}
								onChange={(value) =>
									setAttributes({ placeholder: value })
								}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
							<div className="blockons-divider" />

							<ToggleControl
								label={__('Required', 'blockons')}
								checked={required}
								onChange={(value) =>
									setAttributes({ required: value })
								}
								__nextHasNoMarginBottom={true}
							/>
							<div className="blockons-divider" />

							<ToggleControl
								label={__('Enable Time Selection', 'blockons')}
								checked={enableTime}
								onChange={(value) =>
									setAttributes({ enableTime: value })
								}
								__nextHasNoMarginBottom={true}
							/>
							<div className="blockons-divider" />

							<SelectControl
								label={__('Date Format', 'blockons')}
								value={dateFormat}
								options={BASE_DATE_FORMATS}
								onChange={(value) =>
									setAttributes({ dateFormat: value })
								}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
							{enableTime && (
								<SelectControl
									label={__('Time Format', 'blockons')}
									value={timeFormat}
									options={[
										{
											label: '24 Hour (14:30)',
											value: 'H:i',
										},
										{
											label: '12 Hour (02:30 PM)',
											value: 'h:i K',
										},
									]}
									onChange={(value) =>
										setAttributes({ timeFormat: value })
									}
									__next40pxDefaultSize={true}
									__nextHasNoMarginBottom={true}
								/>
							)}
							<div className="date-format-example">
								<small>
									{__('Example:', 'blockons')}{' '}
									<strong>
										{getFormattedExample(
											getDateTimeFormats(
												dateFormat,
												timeFormat,
												enableTime,
											),
										)}
									</strong>
								</small>
							</div>
							<div className="blockons-divider" />

							<div className="date-range-controls">
								<label className="components-base-control__label">
									{__('Minimum Date', 'blockons')}
								</label>
								<Flatpickr
									value={minDate ? new Date(minDate) : ''}
									options={{
										dateFormat: dateFormat,
										enableTime: enableTime,
										allowInput: false,
										disableMobile: true,
									}}
									className="components-text-control__input"
									placeholder={__(
										'Select minimum date...',
										'blockons',
									)}
									onChange={(dates) => {
										const selectedDate = dates[0]
											? dates[0].toISOString()
											: '';
										setAttributes({
											minDate: selectedDate,
										});
									}}
								/>
								{minDate && (
									<button
										className="components-button is-small is-destructive"
										onClick={() =>
											setAttributes({ minDate: '' })
										}
									>
										{__('Clear Min Date', 'blockons')}
									</button>
								)}
								<br />
								<br />

								<label className="components-base-control__label">
									{__('Maximum Date', 'blockons')}
								</label>
								<Flatpickr
									value={maxDate ? new Date(maxDate) : ''}
									options={{
										dateFormat: dateFormat,
										enableTime: enableTime,
										allowInput: false,
										disableMobile: true,
										minDate: minDate || undefined,
									}}
									className="components-text-control__input"
									placeholder={__(
										'Select maximum date...',
										'blockons',
									)}
									onChange={(dates) => {
										const selectedDate = dates[0]
											? dates[0].toISOString()
											: '';
										setAttributes({
											maxDate: selectedDate,
										});
									}}
								/>
								{maxDate && (
									<button
										className="components-button is-small is-destructive"
										onClick={() =>
											setAttributes({ maxDate: '' })
										}
									>
										{__('Clear Max Date', 'blockons')}
									</button>
								)}
							</div>
							<div className="blockons-divider"></div>

							<SelectControl
								label={__('Width', 'blockons')}
								value={width}
								options={WIDTH_OPTIONS}
								onChange={(value) =>
									setAttributes({ width: value })
								}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
						</PanelBody>
					</InspectorControls>
				)}

				<div className="form-field" style={fieldStyles}>
					<label
						className="form-label radio-label"
						style={labelStyles}
					>
						<RichText
							tagName="p"
							placeholder={__('Date Picker Label', 'blockons')}
							value={label}
							onChange={(value) =>
								setAttributes({ label: value })
							}
							allowedFormats={RICHTEXT_MINIMAL_FORMATS}
						/>
						{required && (
							<span className="required" aria-hidden="true">
								*
							</span>
						)}
					</label>

					{description && (
						<RichText
							tagName="div"
							placeholder={__('Field Description', 'blockons')}
							value={description}
							onChange={(value) =>
								setAttributes({ description: value })
							}
							className="form-description date-description"
							allowedFormats={RICHTEXT_MINIMAL_FORMATS}
						/>
					)}

					<div className="form-control">
						<Flatpickr
							options={{
								enableTime: enableTime,
								dateFormat: enableTime
									? getDateTimeFormats(
											dateFormat,
											timeFormat,
											enableTime,
										)
									: dateFormat,
								minDate: minDate || undefined,
								maxDate: maxDate || undefined,
								disableMobile: true,
							}}
							className="blockons-datepicker"
							style={inputStyles}
							placeholder={placeholder}
							disabled={isSelected}
						/>
					</div>
				</div>
			</div>
		);
	},

	save: ({ attributes }) => {
		const {
			isPremium,
			label,
			description,
			required,
			width,
			columnSpacing,
			rowSpacing,
			showLabels,
			placeholder,
			textSize,
			textSpacing,
			textColor,
			inputSize,
			inputPadHoriz,
			inputPadVert,
			inputBgColor,
			inputBorder,
			inputBorderColor,
			inputBorderRadius,
			inputTextColor,
			enableTime,
			dateFormat,
			timeFormat,
			minDate,
			maxDate,
		} = attributes;

		if (!isPremium) return;

		const blockProps = useBlockProps.save({
			className: getFieldClasses('blockons-form-datepicker', width),
		});

		const fieldId = `date-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

		const fieldStyles = {
			color: textColor,
			fontSize: `${textSize}px`,
			gap: `${textSpacing}px`,
		};

		const labelStyles = {
			display: showLabels ? 'flex' : 'none',
		};

		const inputStyles = {
			fontSize: `${inputSize}px`,
			color: inputTextColor,
			padding: `${inputPadVert}px ${inputPadHoriz}px`,
			backgroundColor: inputBgColor,
			borderRadius: `${inputBorderRadius}px`,
			...(inputBorder
				? {
						border: `1px solid ${inputBorderColor}`,
					}
				: {
						border: '0',
					}),
		};

		return (
			<div {...blockProps}>
				<div className="form-field" style={fieldStyles}>
					<label
						className="form-label date-label"
						htmlFor={fieldId}
						style={labelStyles}
					>
						<RichText.Content value={label} />
						{required && (
							<span className="required" aria-hidden="true">
								*
							</span>
						)}
					</label>

					{description && (
						<div className="form-description date-description">
							<RichText.Content value={description} />
						</div>
					)}

					<div className="form-control">
						<input
							type="text"
							id={fieldId}
							name={fieldId}
							className="blockons-datepicker"
							style={inputStyles}
							required={required}
							data-enable-time={enableTime}
							data-date-format={
								enableTime
									? getDateTimeFormats(
											dateFormat,
											timeFormat,
											enableTime,
										)
									: dateFormat
							}
							data-min-date={minDate}
							data-max-date={maxDate}
							placeholder={placeholder}
							readOnly
						/>
					</div>
				</div>
			</div>
		);
	},
});
