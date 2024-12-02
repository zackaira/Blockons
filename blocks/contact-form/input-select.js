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
	Button,
} from '@wordpress/components';
import { slugify } from '../block-global';

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
			options,
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

		const labelStyles = useMemo(
			() => ({
				color: labelColor,
				fontSize: `${labelSize}px`,
				marginBottom: `${labelSpacing}px`,
				display: showLabels ? 'block' : 'none',
			}),
			[labelColor, labelSize, labelSpacing, showLabels],
		);

		const addOption = () => {
			setAttributes({
				options: [...options, { value: '', label: '' }],
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
							htmlFor={selectId}
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

					<select {...commonProps}>
						{placeholder && (
							<option value="" selected={!options.length}>
								{placeholder}
							</option>
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
		);
	},

	save: ({ attributes }) => {
		const {
			label,
			placeholder,
			required,
			options,
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

		const labelStyles = {
			color: labelColor,
			fontSize: `${labelSize}px`,
			marginBottom: `${labelSpacing}px`,
			display: showLabels ? 'block' : 'none',
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
							htmlFor={selectId}
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

					<select {...commonProps}>
						{placeholder && (
							<option value="" selected={!options.length}>
								{placeholder}
							</option>
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
		);
	},
});
