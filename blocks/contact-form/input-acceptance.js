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
	ToggleControl,
	SelectControl,
	TextareaControl,
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

const DEFAULT_SPACING = 4;
const RICHTEXT_ALLOWED_FORMATS = ['core/bold', 'core/italic', 'core/link'];

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

const generateAcceptanceId = (label) => {
	return label
		? `form-acceptance-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
		: `form-acceptance-${Math.random().toString(36).substring(7)}`;
};

registerBlockType('blockons/form-acceptance', {
	title: __('Form Acceptance', 'blockons'),
	icon: 'saved',
	parent: ['blockons/contact-form'],
	attributes: {
		label: {
			type: 'string',
			default: __('I accept the terms and conditions', 'blockons'),
		},
		description: {
			type: 'string',
			default: '',
		},
		required: {
			type: 'boolean',
			default: true,
		},
		checked: {
			type: 'boolean',
			default: false,
		},
		width: {
			type: 'string',
			default: '100',
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
		inputTextColor: {
			type: 'string',
			default: '#333',
		},
	},

	edit: (props) => {
		const { isSelected, attributes, setAttributes } = props;

		const {
			label,
			description,
			required,
			checked,
			width,
			columnSpacing,
			rowSpacing,
			labelSize,
			labelColor,
		} = attributes;

		const blockProps = useBlockProps({
			className: getFieldClasses(
				'blockons-form-acceptance',
				required,
				width,
			),
		});

		const inputId = useMemo(() => generateAcceptanceId(label), [label]);
		const errorMessageId = `${inputId}-error`;

		const commonProps = useMemo(
			() => ({
				id: inputId,
				name: inputId,
				type: 'checkbox',
				required,
				checked,
				'aria-required': required,
				'aria-label': label,
				'aria-invalid': false,
				'aria-describedby': errorMessageId,
				className: getFieldClasses('form-acceptance', required, width),
				disabled: isSelected,
				onChange: (e) => setAttributes({ checked: e.target.checked }),
			}),
			[
				inputId,
				required,
				checked,
				label,
				errorMessageId,
				width,
				isSelected,
			],
		);

		const labelStyles = useMemo(
			() => ({
				marginBottom: description ? `${DEFAULT_SPACING}px` : '0',
				fontSize: `${labelSize}px`,
				color: labelColor,
			}),
			[description, labelSize, labelColor],
		);

		return (
			<div {...blockProps}>
				{isSelected && (
					<InspectorControls>
						<PanelBody
							title={__('Acceptance Settings', 'blockons')}
							initialOpen={true}
						>
							<TextareaControl
								label={__('Acceptance Text', 'blockons')}
								help={__(
									'The text that appears next to the checkbox',
									'blockons',
								)}
								value={label}
								onChange={(value) =>
									setAttributes({ label: value })
								}
							/>
							<TextControl
								label={__('Description', 'blockons')}
								help={__(
									'Additional information displayed below the acceptance text',
									'blockons',
								)}
								value={description}
								onChange={(value) =>
									setAttributes({ description: value })
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
							<ToggleControl
								label={__('Checked by Default', 'blockons')}
								checked={checked}
								onChange={(value) =>
									setAttributes({ checked: value })
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
					<div className="acceptance-wrap">
						<div className="acceptance-input">
							<input {...commonProps} />
						</div>
						<div className="acceptance-copy">
							<label
								className="form-label acceptance-label"
								htmlFor={inputId}
								style={{
									marginBottom: description ? '4px' : '0',
								}}
							>
								<RichText
									tagName="p"
									placeholder={__(
										'Acceptance Text',
										'blockons',
									)}
									value={label}
									multiline={false}
									className="acceptance-label-txt"
									onChange={(value) =>
										setAttributes({ label: value })
									}
									style={labelStyles}
									allowedFormats={RICHTEXT_ALLOWED_FORMATS}
								/>

								{required && (
									<span
										className="required"
										aria-hidden="true"
									>
										*
									</span>
								)}
							</label>
							{description && (
								<RichText
									tagName="div"
									placeholder={__(
										'Acceptance Description',
										'blockons',
									)}
									value={description}
									multiline={false}
									className="form-description acceptance-description"
									onChange={(value) =>
										setAttributes({ description: value })
									}
									allowedFormats={RICHTEXT_ALLOWED_FORMATS}
								/>
							)}
						</div>
					</div>
					<div
						id={errorMessageId}
						className="field-error"
						role="alert"
						aria-live="polite"
					/>
				</div>
			</div>
		);
	},

	save: ({ attributes }) => {
		const {
			label,
			description,
			required,
			checked,
			width,
			columnSpacing,
			rowSpacing,
			labelSize,
			labelColor,
		} = attributes;

		const blockProps = useBlockProps.save({
			className: getFieldClasses(
				'blockons-form-acceptance',
				required,
				width,
			),
		});

		const inputId = generateAcceptanceId(label);
		const errorMessageId = `${inputId}-error`;

		const commonProps = {
			id: inputId,
			name: inputId,
			type: 'checkbox',
			required,
			checked,
			'aria-required': required,
			'aria-label': label,
			'aria-invalid': false,
			'aria-describedby': errorMessageId,
			className: getFieldClasses('form-acceptance', required, width),
		};

		const labelStyles = {
			marginBottom: description ? `${DEFAULT_SPACING}px` : '0',
			fontSize: `${labelSize}px`,
			color: labelColor,
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
					<div className="acceptance-wrap">
						<div className="acceptance-input">
							<input {...commonProps} />
						</div>
						<div className="acceptance-copy">
							<label
								className="acceptance-label"
								htmlFor={inputId}
								style={{
									marginBottom: description ? '4px' : '0',
								}}
							>
								<RichText.Content
									tagName="p"
									value={label}
									className="acceptance-label-txt"
									style={labelStyles}
								/>
								{required && (
									<span
										className="required"
										aria-hidden="true"
									>
										*
									</span>
								)}
							</label>
							{description && (
								<RichText.Content
									tagName="div"
									value={description}
									className="form-description acceptance-description"
								/>
							)}
						</div>
					</div>
					<div
						id={errorMessageId}
						className="field-error"
						role="alert"
						aria-live="polite"
					/>
				</div>
			</div>
		);
	},
});
