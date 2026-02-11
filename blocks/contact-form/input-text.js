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
import { RICHTEXT_MINIMAL_FORMATS } from '../block-global';

// Constants
const INPUT_TYPES = [
	{ label: __('Text', 'blockons'), value: 'text' },
	{ label: __('Email', 'blockons'), value: 'email' },
	{ label: __('Number', 'blockons'), value: 'number' },
	{ label: __('URL', 'blockons'), value: 'url' },
];

const WIDTH_OPTIONS = [
	{ label: '100%', value: '100' },
	{ label: '80%', value: '80' },
	{ label: '75%', value: '75' },
	{ label: '50%', value: '50' },
	{ label: '25%', value: '25' },
	{ label: '20%', value: '20' },
];

// Utility functions
const getInputPattern = (type) => {
	switch (type) {
		case 'email':
			return '[^@\\s]+@[^@\\s]+\\.[^@\\s]+';
		case 'url':
			return 'https?:\\/\\/.+';
		case 'number':
			return '[0-9]*';
		default:
			return undefined;
	}
};

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

const generateInputId = (label) => {
	return label
		? `form-input-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
		: `form-input-${Math.random().toString(36).substring(7)}`;
};

registerBlockType('blockons/form-text-input', {
	apiVersion: 3,
	title: __('Form Text Input', 'blockons'),
	icon: 'text',
	parent: ['blockons/contact-form'],
	attributes: {
		label: {
			type: 'string',
			default: __('Input Label', 'blockons'),
		},
		placeholder: {
			type: 'string',
			default: __('Placeholder text', 'blockons'),
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
		inputType: {
			type: 'string',
			default: 'text',
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
		const { isSelected, attributes, setAttributes, clientId } = props;

		const {
			label,
			placeholder,
			description,
			required,
			inputType,
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
				'blockons-form-text-input',
				required,
				width,
			),
		});

		const inputId = useMemo(() => generateInputId(label), [label]);
		const errorMessageId = `${inputId}-error`;

		const inputStyles = useMemo(
			() => ({
				fontSize: `${inputSize}px`,
				padding: `${inputPadVert}px ${inputPadHoriz}px`,
				backgroundColor: inputBgColor,
				color: inputTextColor,
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

		const commonProps = useMemo(
			() => ({
				id: inputId,
				name: inputId,
				type: inputType,
				placeholder,
				required,
				'aria-required': required,
				'aria-label': label,
				'aria-invalid': false,
				'aria-describedby': errorMessageId,
				className: getFieldClasses('form-input', required, width),
				style: inputStyles,
				pattern: getInputPattern(inputType),
				disabled: isSelected,
			}),
			[
				inputId,
				inputType,
				placeholder,
				required,
				label,
				errorMessageId,
				inputStyles,
				isSelected,
				width,
			],
		);

		// Parent block updates
		const parentClientId = useSelect((select) => {
			const { getBlockParents } = select('core/block-editor');
			const parents = getBlockParents(clientId);
			return parents[0];
		}, []);

		useEffect(() => {
			if (!parentClientId || !['text', 'email'].includes(inputType))
				return;

			const parentBlock =
				select('core/block-editor').getBlock(parentClientId);
			if (!parentBlock) return;

			const { updateBlockAttributes } = dispatch('core/block-editor');
			const code = label.toLowerCase().replace(/[^a-z0-9]/g, '_');

			const existingShortcodes =
				parentBlock.attributes.availableShortcodes || [];
			const filteredShortcodes = existingShortcodes.filter(
				(s) => s.fieldId !== clientId,
			);

			updateBlockAttributes(parentClientId, {
				availableShortcodes: [
					...filteredShortcodes,
					{ code, label, type: inputType, fieldId: clientId },
				],
			});
		}, [label, inputType, parentClientId]);

		return (
			<div {...blockProps}>
				{isSelected && (
					<InspectorControls>
						<PanelBody
							title={__('Input Settings', 'blockons')}
							initialOpen={true}
						>
							<SelectControl
								label={__('Input Type', 'blockons')}
								value={inputType}
								options={INPUT_TYPES}
								onChange={(value) =>
									setAttributes({ inputType: value })
								}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
							<div className="blockons-divider" />

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
						<input {...commonProps} />
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
			inputType,
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
				'blockons-form-text-input',
				required,
				width,
			),
		});

		const inputId = generateInputId(label);
		const errorMessageId = `${inputId}-error`;

		const inputStyles = {
			fontSize: `${inputSize}px`,
			padding: `${inputPadVert}px ${inputPadHoriz}px`,
			backgroundColor: inputBgColor,
			color: inputTextColor,
			borderRadius: `${inputBorderRadius}px`,
			...(inputBorder
				? {
						border: `1px solid ${inputBorderColor}`,
					}
				: {
						border: '0',
					}),
		};

		const fieldStyles = {
			color: textColor,
			fontSize: `${textSize}px`,
			gap: `${textSpacing}px`,
		};

		const labelStyles = {
			display: showLabels ? 'flex' : 'none',
		};

		const commonProps = {
			id: inputId,
			name: inputId,
			type: inputType,
			placeholder: placeholder,
			required,
			'aria-required': required,
			'aria-label': label,
			'aria-invalid': false,
			'aria-describedby': errorMessageId,
			className: getFieldClasses('form-input', required, width),
			style: inputStyles,
			pattern: getInputPattern(inputType),
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
						<input {...commonProps} />
					</div>
				</div>
			</div>
		);
	},
});
