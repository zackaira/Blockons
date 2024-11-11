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
	Button,
} from '@wordpress/components';
import { slugify } from '../block-global';

const getFieldClasses = (baseClass, required) => {
	return [baseClass, required ? 'required-field' : '', 'form-control']
		.filter(Boolean)
		.join(' ');
};

registerBlockType('blockons/form-select', {
	title: __('Form Select', 'blockons'),
	icon: 'menu',
	parent: ['blockons/contact-form'],
	attributes: {
		label: {
			type: 'string',
			default: 'Select Label',
		},
		placeholder: {
			type: 'string',
			default: 'Select an option',
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
		const {
			isSelected,
			attributes: {
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
			},
			setAttributes,
			clientId,
		} = props;

		const blockProps = useBlockProps({
			className: `blockons-form-select col-${width}`,
		});

		const selectId = label
			? `form-select-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
			: `form-select-${Math.random().toString(36).substring(7)}`;

		const errorMessageId = `${selectId}-error`;

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

		const addOption = () => {
			const newOptions = [...options, { value: '', label: '' }];
			setAttributes({ options: newOptions });
		};

		const removeOption = (index) => {
			const newOptions = options.filter((_, i) => i !== index);
			setAttributes({ options: newOptions });
		};

		const updateOption = (index, label) => {
			const newOptions = [...options];
			newOptions[index] = {
				label: label,
				value: slugify(label),
			};
			setAttributes({ options: newOptions });
		};

		const commonProps = {
			id: selectId,
			name: selectId,
			required,
			'aria-required': required,
			'aria-label': label,
			'aria-invalid': false,
			'aria-describedby': errorMessageId,
			className: getFieldClasses('form-select', required),
			style: inputStyles,
			disabled: !options.length,
		};

		// Get parent block's clientId
		const parentClientId = useSelect((select) => {
			const { getBlockParents } = select('core/block-editor');
			const parents = getBlockParents(clientId);
			return parents[0];
		}, []);

		// Update parent's shortcodes when this block's label changes
		useEffect(() => {
			if (parentClientId) {
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
								type: 'select',
								fieldId: clientId,
							},
						],
					});
				}
			}
		}, [label]);

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
							<div className="blockons-divider"></div>

							<ToggleControl
								label={__('Required', 'blockons')}
								checked={required}
								onChange={(value) =>
									setAttributes({ required: value })
								}
							/>
							<div className="blockons-divider"></div>

							<SelectControl
								label={__('Width', 'blockons')}
								value={width}
								options={[
									{ label: '100%', value: '100' },
									{ label: '80%', value: '80' },
									{ label: '75%', value: '75' },
									{ label: '50%', value: '50' },
									{ label: '25%', value: '25' },
									{ label: '20%', value: '20' },
								]}
								onChange={(value) =>
									setAttributes({ width: value })
								}
							/>
							<div className="blockons-divider"></div>

							{options.map((option, index) => (
								<div
									key={index}
									className="blockons-cf-option-row"
								>
									<TextControl
										label={__('Option Label', 'blockons')}
										value={option.label}
										onChange={(value) =>
											updateOption(index, value)
										}
									/>
									<Button
										isDestructive
										onClick={() => removeOption(index)}
										className="blockons-cf-remove-option"
									>
										X
									</Button>
								</div>
							))}

							<Button isPrimary onClick={addOption}>
								{__('Add Option', 'blockons')}
							</Button>
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
					<select {...commonProps}>
						{placeholder && (
							<option
								value=""
								selected={
									!options.length || options.length === 0
								}
							>
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
			options,
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
			className: `blockons-form-select`,
		});

		const selectId = label
			? `form-select-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
			: `form-select-${Math.random().toString(36).substring(7)}`;

		const errorMessageId = `${selectId}-error`;

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
			id: selectId,
			name: selectId,
			required,
			'aria-required': required,
			'aria-label': label,
			'aria-invalid': false,
			'aria-describedby': errorMessageId,
			className: getFieldClasses('form-select', required),
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
					<select {...commonProps}>
						{placeholder && (
							<option
								value=""
								selected={
									!options.length || options.length === 0
								}
							>
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
