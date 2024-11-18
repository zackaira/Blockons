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
	ToggleControl,
	SelectControl,
	RangeControl,
	Button,
} from '@wordpress/components';
import { slugify } from '../block-global';

// Constants
const WIDTH_OPTIONS = [
	{ label: '100%', value: '100' },
	{ label: '80%', value: '80' },
	{ label: '75%', value: '75' },
	{ label: '50%', value: '50' },
	{ label: '25%', value: '25' },
	{ label: '20%', value: '20' },
];

const RICHTEXT_ALLOWED_FORMATS = ['core/bold', 'core/italic', 'core/link'];

// Utility functions
const getFieldClasses = (baseClass, width) => {
	return [baseClass, `col-${width}`].filter(Boolean).join(' ');
};

const generateGroupId = (label) => {
	return label
		? `form-radio-group-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
		: `form-radio-group-${Math.random().toString(36).substring(7)}`;
};

const createDefaultOption = (index) => ({
	value: `option-${index + 1}`,
	label: `Option ${index + 1}`,
	selected: index === 0, // First option selected by default
});

registerBlockType('blockons/form-radio', {
	title: __('Form Radio Group', 'blockons'),
	icon: 'marker',
	parent: ['blockons/contact-form'],
	attributes: {
		isPremium: {
			type: 'boolean',
			default: false,
		},
		label: {
			type: 'string',
			default: __('Radio Group', 'blockons'),
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
		optionSpacing: {
			type: 'number',
			default: 8,
		},
		optionBox: {
			type: 'boolean',
			default: true,
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
			labelSize,
			labelSpacing,
			labelColor,
			inputSize,
			inputTextColor,
			optionSpacing,
			optionBox,
		} = attributes;

		const blockProps = useBlockProps({
			className: getFieldClasses('blockons-form-radio', width),
		});

		const groupId = useMemo(() => generateGroupId(label), [label]);
		const errorMessageId = `${groupId}-error`;

		// Memoized styles
		const labelStyles = useMemo(
			() => ({
				color: labelColor,
				fontSize: `${labelSize}px`,
				marginBottom: `${labelSpacing}px`,
				display: showLabels ? 'flex' : 'none',
			}),
			[labelColor, labelSize, labelSpacing, showLabels],
		);

		const radioGroupStyles = useMemo(
			() => ({
				display: inline ? 'flex' : 'block',
				flexWrap: inline ? 'wrap' : undefined,
				gap: inline
					? `${optionSpacing}px ${optionSpacing * 2}px`
					: undefined,
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
			const newOptions = options.filter((_, i) => i !== index);
			// Ensure at least one option is selected after removal
			if (options[index].selected && newOptions.length > 0) {
				newOptions[0] = { ...newOptions[0], selected: true };
			}
			setAttributes({ options: newOptions });
		};

		const updateOption = (index, field, value) => {
			const newOptions = [...options];
			if (field === 'label') {
				newOptions[index] = {
					...newOptions[index],
					label: value,
					value: slugify(value),
				};
			} else if (field === 'selected') {
				// Unselect all other options when one is selected
				newOptions.forEach((option, i) => {
					newOptions[i] = {
						...option,
						selected: i === index,
					};
				});
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
							type: 'radio_group',
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
							title={__('Radio Group Settings', 'blockons')}
							initialOpen={true}
						>
							<TextControl
								label={__('Group Label', 'blockons')}
								value={label}
								onChange={(value) =>
									setAttributes({ label: value })
								}
							/>
							<TextControl
								label={__('Description', 'blockons')}
								value={description}
								onChange={(value) =>
									setAttributes({ description: value })
								}
							/>
							<div className="blockons-divider" />

							<ToggleControl
								label={__('Required', 'blockons')}
								help={__(
									'One option must be selected',
									'blockons',
								)}
								checked={required}
								onChange={(value) =>
									setAttributes({ required: value })
								}
							/>
							<ToggleControl
								label={__('Display Inline', 'blockons')}
								checked={inline}
								onChange={(value) =>
									setAttributes({ inline: value })
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

							<RangeControl
								label={__('Option Spacing', 'blockons')}
								value={optionSpacing}
								onChange={(value) =>
									setAttributes({ optionSpacing: value })
								}
								min={0}
								max={60}
							/>
							<ToggleControl
								label={__('Option Box', 'blockons')}
								checked={optionBox}
								onChange={(value) =>
									setAttributes({ optionBox: value })
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
												updateOption(
													index,
													'label',
													value,
												)
											}
										/>
										<ToggleControl
											label={__(
												'Selected by Default',
												'blockons',
											)}
											checked={option.selected}
											onChange={(value) =>
												updateOption(
													index,
													'selected',
													value,
												)
											}
										/>
										{options.length > 1 && (
											<Button
												isDestructive
												onClick={() =>
													removeOption(index)
												}
												className="blockons-cf-remove-option"
												aria-label={__(
													'Remove option',
													'blockons',
												)}
											>
												×
											</Button>
										)}
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
					<label
						className="form-label radio-label"
						style={labelStyles}
					>
						<RichText
							tagName="p"
							placeholder={__('Radio Group Label', 'blockons')}
							value={label}
							multiline={false}
							className="radio-group-label-txt"
							onChange={(value) =>
								setAttributes({ label: value })
							}
							allowedFormats={RICHTEXT_ALLOWED_FORMATS}
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
								'Radio Group Description',
								'blockons',
							)}
							value={description}
							className="form-description radio-description"
							onChange={(value) =>
								setAttributes({ description: value })
							}
							allowedFormats={RICHTEXT_ALLOWED_FORMATS}
						/>
					)}

					<div
						className="radio-group"
						style={radioGroupStyles}
						role="radiogroup"
						aria-labelledby={groupId}
						data-group-name={groupId}
					>
						{options.map((option, index) => (
							<div
								key={index}
								className={`radio-option ${optionBox ? 'box' : ''}`}
								style={
									inline
										? { marginLeft: `${optionSpacing}px` }
										: { marginBottom: `${optionSpacing}px` }
								}
							>
								<input
									type="radio"
									id={`${groupId}-${option.value}`}
									name={groupId}
									value={option.value}
									checked={option.selected}
									onChange={(e) =>
										updateOption(
											index,
											'selected',
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
			showLabels,
			labelSize,
			labelSpacing,
			labelColor,
			inputSize,
			inputTextColor,
			optionSpacing,
			optionBox,
		} = attributes;

		if (!isPremium) return;

		const blockProps = useBlockProps.save({
			className: getFieldClasses('blockons-form-radio', width),
		});

		const groupId = generateGroupId(label);
		const errorMessageId = `${groupId}-error`;

		const labelStyles = {
			color: labelColor,
			fontSize: `${labelSize}px`,
			marginBottom: `${labelSpacing}px`,
			display: showLabels ? 'flex' : 'none',
		};

		const radioGroupStyles = {
			display: inline ? 'flex' : 'block',
			flexWrap: inline ? 'wrap' : undefined,
			gap: inline
				? `${optionSpacing}px ${optionSpacing * 2}px`
				: undefined,
			fontSize: `${inputSize}px`,
			color: inputTextColor,
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
					<label
						className="form-label radio-label"
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
							className="form-description radio-description"
							style={{
								marginBottom: `${labelSpacing}px`,
							}}
						>
							<RichText.Content value={description} />
						</div>
					)}

					<div
						className="radio-group"
						style={radioGroupStyles}
						role="radiogroup"
						aria-labelledby={groupId}
						data-group-name={groupId}
					>
						{options.map((option, index) => (
							<div
								key={index}
								className={`radio-option ${optionBox ? 'box' : ''}`}
								style={
									inline
										? { marginLeft: `${optionSpacing}px` }
										: { marginBottom: `${optionSpacing}px` }
								}
							>
								<input
									type="radio"
									id={`${groupId}-${option.value}`}
									name={groupId}
									value={option.value}
									defaultChecked={option.selected}
									required={required}
									data-default-checked={option.selected}
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
