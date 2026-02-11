import {
	RichText,
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { useMemo } from '@wordpress/element';
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
import {
	PanelBody,
	TextControl,
	TextareaControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';
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

const DEFAULT_MIN_HEIGHT = '120px';
const MIN_ROWS = 2;
const MAX_ROWS = 20;
const MIN_LENGTH = 3;

// Utility functions
const getFieldClasses = (baseClass, required, width) => {
	return [
		baseClass,
		required ? 'required-field' : '',
		'form-control',
		`col-${width}`,
	]
		.filter(Boolean)
		.join(' ');
};

const generateTextareaId = (label) => {
	return label
		? `form-textarea-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
		: `form-textarea-${Math.random().toString(36).substring(7)}`;
};

registerBlockType('blockons/form-textarea', {
	apiVersion: 3,
	title: __('Form Textarea', 'blockons'),
	icon: 'text',
	parent: ['blockons/contact-form'],
	attributes: {
		label: {
			type: 'string',
			default: __('Textarea Label', 'blockons'),
		},
		description: {
			type: 'string',
			default: '',
		},
		placeholder: {
			type: 'string',
			default: __('Placeholder text', 'blockons'),
		},
		required: {
			type: 'boolean',
			default: false,
		},
		width: {
			type: 'string',
			default: '100',
		},
		rows: {
			type: 'number',
			default: 4,
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
		inputBgColor: {
			type: 'string',
			default: '#f9f9f9',
		},
		inputTextColor: {
			type: 'string',
			default: '#333',
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
	},

	edit: (props) => {
		const { isSelected, attributes, setAttributes } = props;

		const {
			label,
			placeholder,
			description,
			required,
			rows,
			width,
			columnSpacing,
			rowSpacing,
			showLabels,
			textSize,
			textSpacing,
			textColor,
			inputSize,
			inputPadHoriz,
			inputPadVert,
			inputBgColor,
			inputTextColor,
			inputBorder,
			inputBorderColor,
			inputBorderRadius,
		} = attributes;

		// Memoized values
		const blockProps = useBlockProps({
			className: getFieldClasses(
				'blockons-form-textarea',
				required,
				width,
			),
		});

		const inputId = useMemo(() => generateTextareaId(label), [label]);
		const errorMessageId = `${inputId}-error`;

		const fieldStyles = useMemo(
			() => ({
				color: textColor,
				fontSize: `${textSize}px`,
				gap: `${textSpacing}px`,
			}),
			[textColor, textSize, textSpacing],
		);

		const inputStyles = useMemo(
			() => ({
				fontSize: `${inputSize}px`,
				padding: `${inputPadVert}px ${inputPadHoriz}px`,
				backgroundColor: inputBgColor,
				color: inputTextColor,
				minHeight: DEFAULT_MIN_HEIGHT,
				resize: 'vertical',
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
				inputPadVert,
				inputPadHoriz,
				inputBgColor,
				inputTextColor,
				inputBorder,
				inputBorderColor,
				inputBorderRadius,
			],
		);

		const labelStyles = useMemo(
			() => ({
				display: showLabels ? 'flex' : 'none',
			}),
			[showLabels],
		);

		const commonProps = useMemo(
			() => ({
				id: inputId,
				name: inputId,
				rows,
				placeholder,
				required,
				'aria-required': required,
				'aria-label': label,
				'aria-invalid': false,
				'aria-describedby': errorMessageId,
				className: getFieldClasses('form-textarea', required, width),
				style: inputStyles,
				minLength: MIN_LENGTH,
				spellCheck: 'true',
				disabled: isSelected,
			}),
			[
				inputId,
				rows,
				placeholder,
				required,
				label,
				errorMessageId,
				width,
				inputStyles,
				isSelected,
			],
		);

		return (
			<div {...blockProps}>
				{isSelected && (
					<InspectorControls>
						<PanelBody
							title={__('Textarea Settings', 'blockons')}
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
							<TextControl
								label={__('Placeholder', 'blockons')}
								value={placeholder}
								onChange={(value) =>
									setAttributes({ placeholder: value })
								}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
							<div className="blockons-divider" />

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
								type="number"
								label={__('Rows', 'blockons')}
								value={rows}
								onChange={(value) =>
									setAttributes({ rows: parseInt(value) })
								}
								min={MIN_ROWS}
								max={MAX_ROWS}
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
					{label && (
						<label
							className="form-label"
							htmlFor={inputId}
							style={labelStyles}
						>
							<RichText
								tagName="p"
								placeholder={__('Label', 'blockons')}
								value={label}
								multiline={false}
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
					)}

					{description && (
						<RichText
							tagName="div"
							placeholder={__('Field Description', 'blockons')}
							value={description}
							onChange={(value) =>
								setAttributes({ description: value })
							}
							className="form-description"
							allowedFormats={RICHTEXT_MINIMAL_FORMATS}
						/>
					)}

					<div
						id={errorMessageId}
						className="field-error"
						role="alert"
						aria-live="polite"
					/>

					<div className="form-control">
						<textarea {...commonProps} />
					</div>
				</div>
			</div>
		);
	},

	save: ({ attributes }) => {
		const {
			label,
			placeholder,
			description,
			required,
			rows,
			width,
			columnSpacing,
			rowSpacing,
			showLabels,
			textSize,
			textSpacing,
			textColor,
			inputSize,
			inputPadHoriz,
			inputPadVert,
			inputBgColor,
			inputTextColor,
			inputBorder,
			inputBorderColor,
			inputBorderRadius,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: getFieldClasses(
				'blockons-form-textarea',
				required,
				width,
			),
		});

		const inputId = generateTextareaId(label);
		const errorMessageId = `${inputId}-error`;

		const fieldStyles = {
			color: textColor,
			fontSize: `${textSize}px`,
			gap: `${textSpacing}px`,
		};

		const inputStyles = {
			fontSize: `${inputSize}px`,
			padding: `${inputPadVert}px ${inputPadHoriz}px`,
			backgroundColor: inputBgColor,
			color: inputTextColor,
			minHeight: DEFAULT_MIN_HEIGHT,
			resize: 'vertical',
			borderRadius: `${inputBorderRadius}px`,
			...(inputBorder
				? {
						border: `1px solid ${inputBorderColor}`,
					}
				: {
						border: '0',
					}),
		};

		const labelStyles = {
			display: showLabels ? 'flex' : 'none',
		};

		const commonProps = {
			id: inputId,
			name: inputId,
			rows,
			placeholder,
			required,
			'aria-required': required,
			'aria-label': label,
			'aria-invalid': false,
			'aria-describedby': errorMessageId,
			className: getFieldClasses('form-textarea', required, width),
			style: inputStyles,
			minLength: MIN_LENGTH,
			spellCheck: 'true',
		};

		return (
			<div {...blockProps}>
				<div className="form-field" style={fieldStyles}>
					{label && (
						<label
							className="form-label"
							htmlFor={inputId}
							style={labelStyles}
						>
							<RichText.Content value={label} />
							{required && (
								<span className="required" aria-hidden="true">
									*
								</span>
							)}
						</label>
					)}

					{description && (
						<RichText.Content
							tagName="div"
							value={description}
							className="form-description"
						/>
					)}

					<div
						id={errorMessageId}
						className="field-error"
						role="alert"
						aria-live="polite"
					/>

					<div className="form-control">
						<textarea {...commonProps} />
					</div>
				</div>
			</div>
		);
	},
});
