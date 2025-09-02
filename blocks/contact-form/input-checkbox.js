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
	RangeControl,
	Button,
} from '@wordpress/components';
import { slugify, RICHTEXT_MINIMAL_FORMATS } from '../block-global';

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
const getFieldClasses = (baseClass, width) => {
	return [baseClass, `col-${width}`].filter(Boolean).join(' ');
};

const generateGroupId = (label) => {
	return label
		? `form-checkbox-group-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
		: `form-checkbox-group-${Math.random().toString(36).substring(7)}`;
};

const createDefaultOption = (index) => ({
	value: `option-${index + 1}`,
	label: `Option ${index + 1}`,
	checked: false,
});

registerBlockType('blockons/form-checkbox', {
	apiVersion: 2,
	title: __('Form Checkbox Group', 'blockons'),
	icon: 'button',
	parent: ['blockons/contact-form'],
	attributes: {
		isPremium: {
			type: 'boolean',
			default: false,
		},
		label: {
			type: 'string',
			default: __('Checkbox Group', 'blockons'),
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
			default: [createDefaultOption(0)],
		},
		inline: {
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
		optionSpacing: {
			type: 'number',
			default: 5,
		},
		optionBox: {
			type: 'boolean',
			default: false,
		},
	},

	edit: (props) => {
		const { isSelected, attributes, setAttributes, clientId } = props;

		const {
			isPremium,
			label,
			description,
			required,
			options,
			inline,
			width,
			columnSpacing,
			rowSpacing,
			showLabels,
			textSize,
			textSpacing,
			textColor,
			inputSize,
			inputTextColor,
			optionSpacing,
			optionBox,
		} = attributes;

		const blockProps = useBlockProps({
			className: getFieldClasses('blockons-form-checkbox', width),
		});

		const groupId = useMemo(() => generateGroupId(label), [label]);
		const errorMessageId = `${groupId}-error`;

		// Memoized styles
		const fieldStyles = useMemo(
			() => ({
				color: textColor,
				fontSize: `${textSize}px`,
				gap: `${textSpacing}px`,
				marginBottom: `${rowSpacing}px`,
				padding: `0 ${columnSpacing}px`,
			}),
			[textColor, textSize, textSpacing, columnSpacing, rowSpacing],
		);

		const labelStyles = useMemo(
			() => ({
				display: showLabels ? 'flex' : 'none',
			}),
			[showLabels],
		);

		const checkboxGroupStyles = useMemo(
			() => ({
				flexDirection: inline ? 'row' : 'column',
				gap: `${optionSpacing}px`,
				fontSize: `${inputSize}px`,
				color: inputTextColor,
			}),
			[inline, optionSpacing, inputSize, inputTextColor],
		);

		// Option management functions
		const addOption = () => {
			setAttributes({
				options: [...options, createDefaultOption(options.length)],
			});
		};

		const removeOption = (index) => {
			setAttributes({
				options: options.filter((_, i) => i !== index),
			});
		};

		const updateOption = (index, field, value) => {
			const newOptions = [...options];
			if (field === 'label') {
				newOptions[index] = {
					...newOptions[index],
					label: value,
					value: slugify(value),
				};
			} else if (field === 'checked') {
				newOptions[index] = {
					...newOptions[index],
					checked: value,
				};
			}
			setAttributes({ options: newOptions });
		};

		// Parent block communication
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
						{
							code,
							label,
							type: 'checkbox_group',
							fieldId: clientId,
						},
					],
				},
			);
		}, [label, parentClientId]);

		if (!isPremium) {
			return (
				<div className="blockons-form-upgrade">
					{__('This is a Premium Block feature', 'blockons')}{' '}
					<a href={blockonsEditorObj.upgradeUrl} target="_blank">
						{__('Upgrade', 'blockons')}
					</a>
				</div>
			);
		}

		return (
			<div {...blockProps}>
				{isSelected && (
					<InspectorControls>
						<PanelBody
							title={__('Checkbox Group Settings', 'blockons')}
							initialOpen={true}
						>
							<TextControl
								label={__('Group Label', 'blockons')}
								value={label}
								onChange={(value) =>
									setAttributes({ label: value })
								}
								__next40pxDefaultSize={true}
								__nextHasNoMarginBottom={true}
							/>
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
								help={__(
									'At least one option must be selected',
									'blockons',
								)}
								checked={required}
								onChange={(value) =>
									setAttributes({ required: value })
								}
								__nextHasNoMarginBottom={true}
							/>
							<ToggleControl
								label={__('Display Inline', 'blockons')}
								checked={inline}
								onChange={(value) =>
									setAttributes({ inline: value })
								}
								__nextHasNoMarginBottom={true}
							/>
							{/* <ToggleControl
								label={__('Option Box', 'blockons')}
								checked={optionBox}
								onChange={(value) =>
									setAttributes({ optionBox: value })
								}
								__nextHasNoMarginBottom={true}
							/> */}
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

							<RangeControl
								label={__('Option Spacing', 'blockons')}
								value={optionSpacing}
								onChange={(value) =>
									setAttributes({ optionSpacing: value })
								}
								min={0}
								max={60}
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
												updateOption(
													index,
													'label',
													value,
												)
											}
											__next40pxDefaultSize={true}
											__nextHasNoMarginBottom={true}
										/>
										<ToggleControl
											label={__(
												'Checked by Default',
												'blockons',
											)}
											checked={option.checked}
											onChange={(value) =>
												updateOption(
													index,
													'checked',
													value,
												)
											}
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
					<label
						className="form-label checkbox-label"
						style={labelStyles}
					>
						<RichText
							tagName="p"
							placeholder={__('Checkbox Group Label', 'blockons')}
							value={label}
							multiline={false}
							className="checkbox-group-label-txt"
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

					<div
						id={errorMessageId}
						className="field-error"
						role="alert"
						aria-live="polite"
					/>

					{description && (
						<RichText
							tagName="div"
							placeholder={__(
								'Checkbox Group Description',
								'blockons',
							)}
							value={description}
							className="form-description checkbox-description"
							onChange={(value) =>
								setAttributes({ description: value })
							}
							allowedFormats={RICHTEXT_MINIMAL_FORMATS}
						/>
					)}

					<div
						className="form-control checkbox-group"
						style={checkboxGroupStyles}
						role="group"
						aria-labelledby={groupId}
						data-group-name={groupId}
					>
						{options.map((option, index) => (
							<div
								key={index}
								className={`checkbox-option ${optionBox ? 'box' : ''}`}
							>
								<input
									type="checkbox"
									id={`${groupId}-${option.value}`}
									name={`${groupId}[]`}
									value={option.value}
									checked={option.checked}
									onChange={(e) =>
										updateOption(
											index,
											'checked',
											e.target.checked,
										)
									}
									disabled={isSelected}
								/>
								<label htmlFor={`${groupId}-${option.value}`}>
									{option.label}
								</label>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	},

	save: ({ attributes }) => {
		const {
			isPremium,
			label,
			description,
			required,
			options,
			inline,
			width,
			columnSpacing,
			rowSpacing,
			textSize,
			showLabels,
			textSpacing,
			textColor,
			inputSize,
			inputTextColor,
			optionSpacing,
			optionBox,
		} = attributes;

		if (!isPremium) return;

		const blockProps = useBlockProps.save({
			className: getFieldClasses('blockons-form-checkbox', width),
		});

		const groupId = generateGroupId(label);
		const errorMessageId = `${groupId}-error`;

		const fieldStyles = {
			color: textColor,
			fontSize: `${textSize}px`,
			gap: `${textSpacing}px`,
			marginBottom: `${rowSpacing}px`,
			padding: `0 ${columnSpacing}px`,
		};

		const labelStyles = {
			display: showLabels ? 'flex' : 'none',
		};

		const checkboxGroupStyles = {
			flexDirection: inline ? 'row' : 'column',
			gap: `${optionSpacing}px`,
			fontSize: `${inputSize}px`,
			color: inputTextColor,
		};

		return (
			<div {...blockProps}>
				<div className="form-field" style={fieldStyles}>
					<label
						className="form-label checkbox-label"
						style={labelStyles}
					>
						<RichText.Content value={label} />
						{required && (
							<span className="required" aria-hidden="true">
								*
							</span>
						)}
					</label>

					<div
						id={errorMessageId}
						className="field-error"
						role="alert"
						aria-live="polite"
					></div>

					{description && (
						<div
							className="form-description checkbox-description"
							style={{
								marginBottom: `${textSpacing}px`,
							}}
						>
							<RichText.Content value={description} />
						</div>
					)}

					<div
						className="form-control checkbox-group"
						style={checkboxGroupStyles}
						role="group"
						aria-labelledby={groupId}
						data-group-name={groupId}
					>
						{options.map((option, index) => (
							<div
								key={index}
								className={`checkbox-option ${optionBox ? 'box' : ''}`}
							>
								<input
									type="checkbox"
									id={`${groupId}-${option.value}`}
									name={`${groupId}[]`}
									value={option.value}
									defaultChecked={option.checked}
									required={required && index === 0}
									data-default-checked={option.checked}
								/>
								<label htmlFor={`${groupId}-${option.value}`}>
									{option.label}
								</label>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	},
});
