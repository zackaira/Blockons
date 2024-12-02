import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useMemo } from '@wordpress/element';
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';

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
	title: __('Form Textarea', 'blockons'),
	icon: 'text',
	parent: ['blockons/contact-form'],
	attributes: {
		label: {
			type: 'string',
			default: __('Textarea Label', 'blockons'),
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
		showLabels: {
			type: 'boolean',
			default: true,
		},
		labelSize: {
			type: 'number',
			default: 15,
		},
		labelSpacing: {
			type: 'number',
			default: 5,
		},
		labelColor: {
			type: 'string',
			default: '#333',
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
			required,
			rows,
			width,
			columnSpacing,
			rowSpacing,
			showLabels,
			labelSize,
			labelSpacing,
			labelColor,
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
				color: labelColor,
				fontSize: `${labelSize}px`,
				marginBottom: `${labelSpacing}px`,
				display: showLabels ? 'block' : 'none',
			}),
			[labelColor, labelSize, labelSpacing, showLabels],
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

		const fieldWrapperStyles = {
			marginBottom: `${rowSpacing}px`,
			padding: `0 ${columnSpacing}px`,
			position: 'relative',
		};

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
							/>
							<TextControl
								label={__('Placeholder', 'blockons')}
								value={placeholder}
								onChange={(value) =>
									setAttributes({ placeholder: value })
								}
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
							/>
							<div className="blockons-divider" />

							<ToggleControl
								label={__('Required', 'blockons')}
								checked={required}
								onChange={(value) =>
									setAttributes({ required: value })
								}
							/>
							<div className="blockons-divider" />

							<SelectControl
								label={__('Width', 'blockons')}
								value={width}
								options={WIDTH_OPTIONS}
								onChange={(value) =>
									setAttributes({ width: value })
								}
							/>
						</PanelBody>
					</InspectorControls>
				)}

				<div className="form-field" style={fieldWrapperStyles}>
					{label && (
						<label
							className="form-label"
							htmlFor={inputId}
							style={labelStyles}
						>
							{label}
							{required && (
								<span className="required" aria-hidden="true">
									*
								</span>
							)}
						</label>
					)}
					<div
						id={errorMessageId}
						className="field-error"
						role="alert"
						aria-live="polite"
					/>
					<textarea {...commonProps} />
				</div>
			</div>
		);
	},

	save: ({ attributes }) => {
		const {
			label,
			placeholder,
			required,
			rows,
			width,
			columnSpacing,
			rowSpacing,
			showLabels,
			labelSize,
			labelSpacing,
			labelColor,
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
			color: labelColor,
			fontSize: `${labelSize}px`,
			marginBottom: `${labelSpacing}px`,
			display: showLabels ? 'block' : 'none',
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

		const fieldWrapperStyles = {
			marginBottom: `${rowSpacing}px`,
			padding: `0 ${columnSpacing}px`,
			position: 'relative',
		};

		return (
			<div {...blockProps}>
				<div className="form-field" style={fieldWrapperStyles}>
					{label && (
						<label
							className="form-label"
							htmlFor={inputId}
							style={labelStyles}
						>
							{label}
							{required && (
								<span className="required" aria-hidden="true">
									*
								</span>
							)}
						</label>
					)}
					<div
						id={errorMessageId}
						className="field-error"
						role="alert"
						aria-live="polite"
					/>
					<textarea {...commonProps} />
				</div>
			</div>
		);
	},
});
