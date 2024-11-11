import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { useSelect, dispatch, select } from '@wordpress/data';
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
} from '@wordpress/components';

const INPUT_TYPES = [
	{ label: 'Text', value: 'text' },
	{ label: 'Email', value: 'email' },
	{ label: 'Number', value: 'number' },
	{ label: 'URL', value: 'url' },
];

const getInputPattern = (type) => {
	switch (type) {
		case 'email':
			// Simpler, valid pattern for HTML5 email validation
			return '[^@]+@[^@]+\\.[^@]+';
		case 'url':
			// Simpler, valid pattern for HTML5 URL validation
			return 'https?:\\/\\/.+';
		default:
			return undefined;
	}
};

const getFieldClasses = (baseClass, required) => {
	return [baseClass, required ? 'required-field' : '', 'form-control']
		.filter(Boolean)
		.join(' ');
};

registerBlockType('blockons/form-text-input', {
	title: __('Form Text Input', 'blockons'),
	icon: 'text',
	parent: ['blockons/contact-form'],
	attributes: {
		label: {
			type: 'string',
			default: 'Input Label',
		},
		placeholder: {
			type: 'string',
			default: 'Placeholder text',
		},
		required: {
			type: 'boolean',
			default: false,
		},
		inputType: {
			type: 'string',
			default: 'text',
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
		const {
			isSelected,
			attributes: {
				label,
				placeholder,
				required,
				inputType,
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
			},
			setAttributes,
			clientId,
		} = props;

		const blockProps = useBlockProps({
			className: `blockons-form-text-input`,
		});

		const inputId = label
			? `form-input-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
			: `form-input-${Math.random().toString(36).substring(7)}`;

		const errorMessageId = `${inputId}-error`;

		const inputStyles = {
			fontSize: `${inputSize}px`,
			padding: `${inputPadVert}px ${inputPadHoriz}px`,
			backgroundColor: inputBgColor,
			color: inputTextColor,
			...(inputBorder
				? {
						border: `1px solid ${inputBorderColor}`,
						borderRadius: `${inputBorderRadius}px`,
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
			placeholder,
			required,
			'aria-required': required,
			'aria-label': label,
			'aria-invalid': false,
			'aria-describedby': errorMessageId,
			className: getFieldClasses('form-input', required),
			style: inputStyles,
			pattern: getInputPattern(inputType),
			disabled: isSelected,
		};

		// Get parent block's clientId
		const parentClientId = useSelect((select) => {
			const { getBlockParents } = select('core/block-editor');
			const parents = getBlockParents(clientId);
			return parents[0];
		}, []);

		// Update parent's shortcodes when this block's label or type changes
		useEffect(() => {
			if (parentClientId && ['text', 'email'].includes(inputType)) {
				const parentBlock =
					select('core/block-editor').getBlock(parentClientId);
				if (parentBlock) {
					const { updateBlockAttributes } =
						dispatch('core/block-editor');
					updateBlockAttributes(parentClientId, {
						availableShortcodes: [
							...parentBlock.attributes.availableShortcodes.filter(
								(s) => s.fieldId !== clientId,
							),
							{
								code: label
									.toLowerCase()
									.replace(/[^a-z0-9]/g, '_'),
								label,
								type: inputType,
								fieldId: clientId,
							},
						],
					});
				}
			}
		}, [label, inputType]);

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
							<div className="blockons-divider"></div>

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
							<div className="blockons-divider"></div>

							<ToggleControl
								label={__('Required', 'blockons')}
								checked={required}
								onChange={(value) =>
									setAttributes({ required: value })
								}
							/>
						</PanelBody>
					</InspectorControls>
				)}

				<div
					className="form-field"
					style={{
						marginBottom: `${rowSpacing}px`,
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
					<input {...commonProps} />
					<div
						id={errorMessageId}
						className="field-error"
						role="alert"
						aria-live="polite"
					></div>
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
			className: `blockons-form-text-input`,
		});

		const inputId = label
			? `form-input-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
			: `form-input-${Math.random().toString(36).substring(7)}`;

		const errorMessageId = `${inputId}-error`;

		const inputStyles = {
			fontSize: `${inputSize}px`,
			padding: `${inputPadVert}px ${inputPadHoriz}px`,
			backgroundColor: inputBgColor,
			color: inputTextColor,
			...(inputBorder
				? {
						border: `1px solid ${inputBorderColor}`,
						borderRadius: `${inputBorderRadius}px`,
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
			placeholder,
			required,
			'aria-required': required,
			'aria-label': label,
			'aria-invalid': false,
			'aria-describedby': errorMessageId,
			className: getFieldClasses('form-input', required),
			style: inputStyles,
			pattern: getInputPattern(inputType),
		};

		return (
			<div {...blockProps}>
				<div
					className="form-field"
					style={{
						marginBottom: `${rowSpacing}px`,
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
					<input {...commonProps} />
					<div
						id={errorMessageId}
						className="field-error"
						role="alert"
						aria-live="polite"
					></div>
				</div>
			</div>
		);
	},
});
