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
	TextareaControl,
	ToggleControl,
	SelectControl,
	RangeControl,
} from '@wordpress/components';
import { RICHTEXT_MINIMAL_FORMATS } from '../block-global';

// Constants
const WIDTH_OPTIONS = [
	{ label: '100%', value: '100' },
	{ label: '80%', value: '80' },
	{ label: '75%', value: '75' },
	{ label: '50%', value: '50' },
	{ label: '25%', value: '25' },
	{ label: '20%', value: '20' },
];

const FILE_TYPES = {
	documents: {
		label: __('Documents', 'blockons'),
		types: '.pdf,.doc,.docx,.txt',
		description: __('Accepted formats: PDF, DOC, TXT', 'blockons'),
	},
	images: {
		label: __('Images', 'blockons'),
		types: '.jpg,.jpeg,.png,.gif',
		description: __('Accepted formats: JPG, PNG, GIF', 'blockons'),
	},
	media: {
		label: __('Media', 'blockons'),
		types: '.jpg,.jpeg,.png,.gif,.webp,.mp4,.mp3,.wav',
		description: __('Accepted formats: Images, MP4, MP3, WAV', 'blockons'),
	},
};

const MIN_FILE_SIZE = 1; // MB
const MAX_FILE_SIZE = 10; // MB
const DEFAULT_FILE_SIZE = 2; // MB

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

const generateFileId = (label) => {
	return label
		? `form-file-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
		: `form-file-${Math.random().toString(36).substring(7)}`;
};

const bytesToMB = (bytes) => bytes / (1024 * 1024);
const mbToBytes = (mb) => mb * 1024 * 1024;

registerBlockType('blockons/form-file-upload', {
	title: __('Form File Upload', 'blockons'),
	icon: 'upload',
	parent: ['blockons/contact-form'],
	attributes: {
		isPremium: {
			type: 'boolean',
			default: false,
		},
		label: {
			type: 'string',
			default: __('Upload File', 'blockons'),
		},
		description: {
			type: 'string',
			default: '',
		},
		required: {
			type: 'boolean',
			default: false,
		},
		maxFileSize: {
			type: 'number',
			default: DEFAULT_FILE_SIZE,
		},
		fileTypeOption: {
			type: 'string',
			default: 'documents',
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
	},

	edit: (props) => {
		const { isSelected, attributes, setAttributes } = props;

		const {
			isPremium,
			label,
			description,
			required,
			maxFileSize,
			fileTypeOption,
			width,
			columnSpacing,
			rowSpacing,
			showLabels,
			textSize,
			textSpacing,
			textColor,
			inputSize,
			inputTextColor,
		} = attributes;

		const blockProps = useBlockProps({
			className: getFieldClasses(
				'blockons-form-file-upload',
				required,
				width,
			),
		});

		const inputId = useMemo(() => generateFileId(label), [label]);
		const errorMessageId = `${inputId}-error`;

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

		const selectedFileType = useMemo(
			() => FILE_TYPES[fileTypeOption] || FILE_TYPES.documents,
			[fileTypeOption],
		);

		const commonProps = useMemo(
			() => ({
				id: inputId,
				name: inputId,
				type: 'file',
				required,
				multiple: false,
				accept: selectedFileType.types,
				'aria-required': required,
				'aria-label': label,
				'aria-invalid': false,
				'aria-describedby': errorMessageId,
				className: getFieldClasses('form-file-upload', required, width),
				disabled: isSelected,
				style: {
					fontSize: `${inputSize}px`,
					color: inputTextColor,
				},
			}),
			[
				inputId,
				required,
				selectedFileType.types,
				label,
				errorMessageId,
				width,
				isSelected,
				inputSize,
				inputTextColor,
			],
		);

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
							title={__('File Upload Settings', 'blockons')}
							initialOpen={true}
						>
							<TextControl
								label={__('Label', 'blockons')}
								value={label}
								onChange={(value) =>
									setAttributes({ label: value })
								}
							/>
							<div className="blockons-divider" />

							<TextareaControl
								label={__('Description', 'blockons')}
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
							<div className="blockons-divider" />

							<SelectControl
								label={__('Accepted File Types', 'blockons')}
								value={fileTypeOption}
								options={Object.entries(FILE_TYPES).map(
									([value, type]) => ({
										value,
										label: type.label,
									}),
								)}
								onChange={(value) =>
									setAttributes({ fileTypeOption: value })
								}
							/>
							<div className="blockons-divider" />

							<RangeControl
								label={__('Maximum File Size (MB)', 'blockons')}
								value={maxFileSize}
								onChange={(value) =>
									setAttributes({ maxFileSize: value })
								}
								min={MIN_FILE_SIZE}
								max={MAX_FILE_SIZE}
								help={__(
									'Please ensure server configurations allow uploads to this limit. Recommended maximum size is 2MB.',
									'blockons',
								)}
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

				<div className="form-field" style={fieldStyles}>
					<label
						className="form-label"
						htmlFor={inputId}
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

					<div className="form-control file-upload-wrapper">
						<input {...commonProps} />
						<div className="file-description">
							{selectedFileType.description}
							{` - ${maxFileSize}MB limit`}
						</div>
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
			maxFileSize,
			fileTypeOption,
			width,
			columnSpacing,
			rowSpacing,
			showLabels,
			textSize,
			textSpacing,
			textColor,
			inputSize,
			inputTextColor,
		} = attributes;

		if (!isPremium) return;

		const blockProps = useBlockProps.save({
			className: getFieldClasses(
				'blockons-form-file-upload',
				required,
				width,
			),
		});

		const inputId = generateFileId(label);
		const errorMessageId = `${inputId}-error`;
		const selectedFileType =
			FILE_TYPES[fileTypeOption] || FILE_TYPES.documents;

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

		const commonProps = {
			id: inputId,
			name: inputId,
			type: 'file',
			required,
			multiple: false,
			accept: selectedFileType.types,
			'aria-required': required,
			'aria-label': label,
			'aria-invalid': false,
			'aria-describedby': errorMessageId,
			className: getFieldClasses('form-file-upload', required, width),
			'data-max-size': mbToBytes(maxFileSize),
			'data-max-files': 1,
			style: {
				fontSize: `${inputSize}px`,
				color: inputTextColor,
			},
		};

		return (
			<div {...blockProps}>
				<div className="form-field" style={fieldStyles}>
					<label
						className="form-label"
						htmlFor={inputId}
						style={labelStyles}
					>
						<RichText.Content value={label} />
						{required && (
							<span className="required" aria-hidden="true">
								*
							</span>
						)}
					</label>

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

					<div className="form-control file-upload-wrapper">
						<input {...commonProps} />
						<div className="file-description">
							{selectedFileType.description}
							{` - Max ${maxFileSize}MB per file`}
						</div>
					</div>
				</div>
			</div>
		);
	},
});
