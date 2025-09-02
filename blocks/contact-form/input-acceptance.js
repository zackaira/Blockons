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
	RangeControl,
	ToggleControl,
	SelectControl,
	TextareaControl,
} from '@wordpress/components';
import BlockonsColorpicker from '../_components/BlockonsColorpicker';
import { colorPickerPalette, RICHTEXT_MINIMAL_FORMATS } from '../block-global';

// Constants
const WIDTH_OPTIONS = [
	{ label: '100%', value: '100' },
	{ label: '80%', value: '80' },
	{ label: '75%', value: '75' },
	{ label: '50%', value: '50' },
	{ label: '25%', value: '25' },
	{ label: '20%', value: '20' },
];

// Utility functions
const getFieldClasses = (baseClass, required, width) => {
	return [
		baseClass,
		required ? 'required-field' : '',
		'form-control',
		width ? `col-${width}` : '',
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
	apiVersion: 2,
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
		inputTextColor: {
			type: 'string',
			default: '#333',
		},
		useCustomText: {
			type: 'boolean',
			default: false,
		},
		customTextSize: {
			type: 'number',
			default: 15,
		},
		customTextSpacing: {
			type: 'number',
			default: 5,
		},
		customTextColor: {
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
			textSize,
			textSpacing,
			textColor,
			useCustomText,
			customTextSize,
			customTextSpacing,
			customTextColor,
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
				className: getFieldClasses('form-acceptance', required),
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

		const textStyles = useMemo(
			() => ({
				color: useCustomText ? customTextColor : textColor,
				fontSize: `${useCustomText ? customTextSize : textSize}px`,
				gap: `${useCustomText ? customTextSpacing : textSpacing}px`,
			}),
			[
				useCustomText,
				customTextColor,
				customTextSize,
				customTextSpacing,
				textSize,
				textColor,
				textSpacing,
			],
		);

		const fieldStyles = useMemo(
			() => ({
				marginBottom: `${rowSpacing}px`,
				padding: `0 ${columnSpacing}px`,
			}),
			[columnSpacing, rowSpacing],
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
								__nextHasNoMarginBottom={true}
							/>
							<TextareaControl
								label={__('Description', 'blockons')}
								help={__(
									'Additional information displayed below the acceptance text',
									'blockons',
								)}
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
							<ToggleControl
								label={__('Checked by Default', 'blockons')}
								checked={checked}
								onChange={(value) =>
									setAttributes({ checked: value })
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

						<PanelBody
							title={__('Design Settings', 'blockons')}
							initialOpen={false}
						>
							<ToggleControl
								label={__(
									'Use Custom Text Settings',
									'blockons',
								)}
								checked={useCustomText}
								onChange={(value) =>
									setAttributes({ useCustomText: value })
								}
								help={__(
									'Override text settings inherited from form settings',
									'blockons',
								)}
								__nextHasNoMarginBottom={true}
							/>

							{useCustomText && (
								<>
									<RangeControl
										label={__('Text Size', 'blockons')}
										value={customTextSize}
										onChange={(value) =>
											setAttributes({
												customTextSize: value,
											})
										}
										min={10}
										max={54}
										__next40pxDefaultSize={true}
										__nextHasNoMarginBottom={true}
									/>
									<RangeControl
										label={__('Text Spacing', 'blockons')}
										value={customTextSpacing}
										onChange={(value) =>
											setAttributes({
												customTextSpacing: value,
											})
										}
										min={0}
										max={100}
										__next40pxDefaultSize={true}
										__nextHasNoMarginBottom={true}
									/>
									<BlockonsColorpicker
										label={__('Text Color', 'blockons')}
										value={customTextColor}
										onChange={(value) =>
											setAttributes({
												customTextColor: value,
											})
										}
										paletteColors={colorPickerPalette}
									/>
								</>
							)}
						</PanelBody>
					</InspectorControls>
				)}

				<div className="form-field" style={fieldStyles}>
					<div className="acceptance-wrap">
						<div className="acceptance-input">
							<input {...commonProps} />
						</div>
						<div className="acceptance-copy" style={textStyles}>
							<label
								className="form-label acceptance-label"
								htmlFor={inputId}
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
									allowedFormats={RICHTEXT_MINIMAL_FORMATS}
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
									allowedFormats={RICHTEXT_MINIMAL_FORMATS}
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
			textSize,
			textSpacing,
			textColor,
			useCustomText,
			customTextColor,
			customTextSize,
			customTextSpacing,
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
			className: getFieldClasses('form-acceptance', required),
		};

		const textStyles = {
			color: useCustomText ? customTextColor : textColor,
			fontSize: `${useCustomText ? customTextSize : textSize}px`,
			gap: `${useCustomText ? customTextSpacing : textSpacing}px`,
		};

		const fieldStyles = {
			marginBottom: `${rowSpacing}px`,
			padding: `0 ${columnSpacing}px`,
		};

		return (
			<div {...blockProps}>
				<div className="form-field" style={fieldStyles}>
					<div className="acceptance-wrap">
						<div className="acceptance-input">
							<input {...commonProps} />
						</div>
						<div className="acceptance-copy" style={textStyles}>
							<label
								className="form-label acceptance-label"
								htmlFor={inputId}
								style={{
									marginBottom: description ? '4px' : '0',
								}}
							>
								<RichText.Content
									tagName="p"
									value={label}
									className="acceptance-label-txt"
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
