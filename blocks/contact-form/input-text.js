import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useEffect, useMemo } from '@wordpress/element';
import { useSelect, dispatch, select } from '@wordpress/data';
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';

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
		const { isSelected, attributes, setAttributes, clientId } = props;

		const {
			label,
			placeholder,
			required,
			inputType,
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
							/>
							<div className="blockons-divider" />

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

				<div
					className="form-field"
					style={{
						marginBottom: `${rowSpacing}px`,
						padding: `0 ${columnSpacing}px`,
						position: 'relative',
					}}
				>
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
					<input {...commonProps} />
				</div>
			</div>
		);
	},

	save: ({ attributes }) => {
		const {
			label,
			placeholder,
			required,
			inputType,
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

		const labelStyles = {
			color: labelColor,
			fontSize: `${labelSize}px`,
			marginBottom: `${labelSpacing}px`,
			display: showLabels ? 'block' : 'none',
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
				<div
					className="form-field"
					style={{
						marginBottom: `${rowSpacing}px`,
						padding: `0 ${columnSpacing}px`,
						position: 'relative',
					}}
				>
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
					<input {...commonProps} />
				</div>
			</div>
		);
	},
});
