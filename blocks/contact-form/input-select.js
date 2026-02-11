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
	Button,
} from '@wordpress/components';
import { slugify, RICHTEXT_MINIMAL_FORMATS } from '../block-global';

const WIDTH_OPTIONS = [
	{ label: '100%', value: '100' },
	{ label: '80%', value: '80' },
	{ label: '75%', value: '75' },
	{ label: '50%', value: '50' },
	{ label: '25%', value: '25' },
	{ label: '20%', value: '20' },
];

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

const generateSelectId = (label) => {
	return label
		? `form-select-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
		: `form-select-${Math.random().toString(36).substring(7)}`;
};

registerBlockType('blockons/form-select', {
	apiVersion: 3,
	title: __('Form Select', 'blockons'),
	icon: 'menu',
	parent: ['blockons/contact-form'],
	attributes: {
		label: {
			type: 'string',
			default: __('Select Label', 'blockons'),
		},
		placeholder: {
			type: 'string',
			default: __('Select an option', 'blockons'),
		},
		description: {
			type: 'string',
			default: '',
		},
		required: {
			type: 'boolean',
			default: false,
		},
		options: {
			type: 'array',
			default: [{ value: 'option-1', label: 'Option 1' }],
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
			options,
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

		const blockProps = useBlockProps({
			className: getFieldClasses('blockons-form-select', required, width),
		});

		const selectId = useMemo(() => generateSelectId(label), [label]);
		const errorMessageId = `${selectId}-error`;

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

		const addOption = () => {
			const nextOptionNumber = options.length + 1;
			const newLabel = `Option ${nextOptionNumber}`;
			setAttributes({
				options: [
					...options,
					{ value: slugify(newLabel), label: newLabel },
				],
			});
		};

		const removeOption = (index) => {
			setAttributes({
				options: options.filter((_, i) => i !== index),
			});
		};

		const updateOption = (index, newLabel) => {
			const newOptions = [...options];
			newOptions[index] = {
				label: newLabel,
				value: slugify(newLabel),
			};
			setAttributes({ options: newOptions });
		};

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
			const existingShortcodes =
				parentBlock.attributes.availableShortcodes || [];
			const filteredShortcodes = existingShortcodes.filter(
				(s) => s.fieldId !== clientId,
			);

			dispatch('core/block-editor').updateBlockAttributes(
				parentClientId,
				{
					availableShortcodes: [
						...filteredShortcodes,
						{ code, label, type: 'select', fieldId: clientId },
					],
				},
			);
		}, [label, parentClientId]);

		const commonProps = useMemo(
			() => ({
				id: selectId,
				name: selectId,
				required,
				'aria-required': required,
				'aria-label': label,
				'aria-invalid': false,
				'aria-describedby': errorMessageId,
				className: getFieldClasses('form-select', required, width),
				style: inputStyles,
				disabled: !options.length,
			}),
			[
				selectId,
				required,
				label,
				errorMessageId,
				width,
				inputStyles,
				options.length,
			],
		);

		return (
			<div {...blockProps}>
				{isSelected && (
					<InspectorControls>
						<PanelBody
							title={__('Select Settings', 'blockons')}
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
							<div className="blockons-divider" />

							<div className="blockons-cf-options">
								{options.map((option, index) => (
									<div
										key={index}
										className="blockons-cf-option-row"
									>
										<TextControl
											label={__(
												'Option Label',
												'blockons',
											)}
											value={option.label}
											onChange={(value) =>
												updateOption(index, value)
											}
											__next40pxDefaultSize={true}
											__nextHasNoMarginBottom={true}
										/>
										<Button
											isDestructive
											onClick={() => removeOption(index)}
											className="blockons-cf-remove-option"
											aria-label={__(
												'Remove option',
												'blockons',
											)}
										>
											×
										</Button>
									</div>
								))}

								<Button
									isPrimary
									onClick={addOption}
									className="blockons-cf-add-option"
								>
									{__('Add Option', 'blockons')}
								</Button>
							</div>
						</PanelBody>
					</InspectorControls>
				)}

				<div className="form-field" style={fieldStyles}>
					{label && (
						<label
							className="form-label"
							htmlFor={selectId}
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
						<select
							{...commonProps}
							defaultValue={!options.length ? '' : undefined}
						>
							{placeholder && (
								<option value="">{placeholder}</option>
							)}
							{options.map((option, index) => (
								<option
									key={index}
									value={option.value}
									disabled={!option.value}
								>
									{option.label}
								</option>
							))}
						</select>
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
			options,
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
			className: getFieldClasses('blockons-form-select', required, width),
		});

		const selectId = generateSelectId(label);
		const errorMessageId = `${selectId}-error`;

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
			id: selectId,
			name: selectId,
			required,
			'aria-required': required,
			'aria-label': label,
			'aria-invalid': false,
			'aria-describedby': errorMessageId,
			className: getFieldClasses('form-select', required, width),
			style: inputStyles,
		};

		return (
			<div {...blockProps}>
				<div className="form-field" style={fieldStyles}>
					{label && (
						<label
							className="form-label"
							htmlFor={selectId}
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
						<select
							{...commonProps}
							defaultValue={!options.length ? '' : undefined}
						>
							{placeholder && (
								<option value="">{placeholder}</option>
							)}
							{options.map((option, index) => (
								<option
									key={index}
									value={option.value}
									disabled={!option.value}
								>
									{option.label}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
		);
	},
});
