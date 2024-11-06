import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';

const getFieldClasses = (baseClass, required) => {
	return [baseClass, required ? 'required-field' : '', 'form-control']
		.filter(Boolean)
		.join(' ');
};

registerBlockType('blockons/form-textarea', {
	title: __('Form Textarea', 'blockons'),
	icon: 'editor-paragraph',
	parent: ['blockons/contact-form'],
	attributes: {
		label: {
			type: 'string',
			default: '',
		},
		placeholder: {
			type: 'string',
			default: '',
		},
		required: {
			type: 'boolean',
			default: false,
		},
		rows: {
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
		const {
			isSelected,
			attributes: {
				label,
				placeholder,
				required,
				rows,
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
		} = props;

		const blockProps = useBlockProps({
			className: `blockons-form-textarea`,
		});

		const inputId = label
			? `form-textarea-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
			: `form-textarea-${Math.random().toString(36).substring(7)}`;

		const errorMessageId = `${inputId}-error`;

		const inputStyles = {
			fontSize: `${inputSize}px`,
			padding: `${inputPadVert}px ${inputPadHoriz}px`,
			backgroundColor: inputBgColor,
			color: inputTextColor,
			minHeight: '120px',
			resize: 'vertical',
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
			rows,
			placeholder,
			required,
			'aria-required': required,
			'aria-label': label,
			'aria-invalid': false,
			'aria-describedby': errorMessageId,
			className: getFieldClasses('form-textarea', required),
			style: inputStyles,
			minLength: 3,
			spellCheck: 'true',
			disabled: isSelected,
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
							<div className="blockons-divider"></div>

							<TextControl
								type="number"
								label={__('Rows', 'blockons')}
								value={rows}
								onChange={(value) =>
									setAttributes({ rows: parseInt(value) })
								}
								min={2}
								max={20}
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
					<textarea {...commonProps} />
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
			rows,
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
			className: `blockons-form-textarea`,
		});

		const inputId = label
			? `form-textarea-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
			: `form-textarea-${Math.random().toString(36).substring(7)}`;

		const errorMessageId = `${inputId}-error`;

		const inputStyles = {
			fontSize: `${inputSize}px`,
			padding: `${inputPadVert}px ${inputPadHoriz}px`,
			backgroundColor: inputBgColor,
			color: inputTextColor,
			minHeight: '120px',
			resize: 'vertical',
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
			rows,
			placeholder,
			required,
			'aria-required': required,
			'aria-label': label,
			'aria-invalid': false,
			'aria-describedby': errorMessageId,
			className: getFieldClasses('form-textarea', required),
			style: inputStyles,
			minLength: 3,
			spellCheck: 'true',
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
					<textarea {...commonProps} />
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
