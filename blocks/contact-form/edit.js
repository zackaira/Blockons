import { useSelect, useDispatch, select } from '@wordpress/data';
import { useEffect, useState, useCallback } from '@wordpress/element';
import { createBlock } from '@wordpress/blocks';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
	InnerBlocks,
	useBlockProps,
	InspectorControls,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	RangeControl,
	Placeholder,
	__experimentalUnitControl as UnitControl,
	SelectControl,
} from '@wordpress/components';
import BlockonsColorpicker from '../_components/BlockonsColorpicker';
import { colorPickerPalette, isValidEmail } from '../block-global';

const ALLOWED_BLOCKS = [
	'blockons/form-text-input',
	'blockons/form-textarea',
	'blockons/form-select',
];

const EMAIL_LIMITS = {
	emailTo: 3, // Maximum 3 primary recipients
	ccEmails: 2, // Maximum 2 CC recipients
	bccEmails: 2, // Maximum 2 BCC recipients
};

// Default template with name, email and message fields
const DEFAULT_EMAIL_TEMPLATE = [
	[
		'blockons/form-text-input',
		{
			label: 'Name',
			placeholder: 'Enter your name',
			required: true,
			inputType: 'text',
		},
	],
	[
		'blockons/form-text-input',
		{
			label: 'Email',
			placeholder: 'Enter your email',
			required: true,
			inputType: 'email',
		},
	],
	[
		'blockons/form-textarea',
		{
			label: 'Message',
			placeholder: 'Enter your message',
			required: true,
		},
	],
];
const DEFAULT_NEWSLETTER_TEMPLATE = [
	[
		'blockons/form-text-input',
		{
			label: 'Name',
			placeholder: 'Enter your name',
			required: true,
			inputType: 'text',
		},
	],
	[
		'blockons/form-text-input',
		{
			label: 'Email',
			placeholder: 'Enter your email',
			required: true,
			inputType: 'email',
		},
	],
];

const Edit = (props) => {
	const {
		attributes: {
			isPremium,
			emailForm,
			newsletterSignup,
			formWidth,
			alignment,
			align,
			formName,
			emailTo,
			emailSubject,
			fromEmail,
			fromName,
			ccEmails,
			bccEmails,
			includeMetadata,
			submitButtonText,
			successMessage,
			errorMessage,
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
			buttonColor,
			buttonFontColor,
			availableShortcodes,
		},
		clientId,
		isSelected,
		setAttributes,
	} = props;
	const isPro = Boolean(blockonsEditorObj.isPremium);

	const blockProps = useBlockProps({
		className: `blockons-contact-form ${align}-align alignment-${alignment}`,
	});

	useEffect(() => {
		setAttributes({ isPremium: isPro }); // SETS PREMIUM
	}, []);

	const { replaceInnerBlocks } = useDispatch(blockEditorStore);

	useEffect(() => {
		if (emailForm || newsletterSignup) {
			const template = emailForm
				? DEFAULT_EMAIL_TEMPLATE
				: DEFAULT_NEWSLETTER_TEMPLATE;
			const newBlocks = template.map(([name, attributes]) =>
				wp.blocks.createBlock(name, attributes),
			);
			replaceInnerBlocks(clientId, newBlocks, false);
		}
	}, [emailForm, newsletterSignup]);

	const { innerBlocksClientIds, getBlock } = useSelect(
		(select) => {
			const { getBlockOrder, getBlock } = select('core/block-editor');
			return {
				innerBlocksClientIds: getBlockOrder(clientId),
				getBlock,
			};
		},
		[clientId],
	);

	const { updateBlockAttributes } = useDispatch('core/block-editor');

	// Create a function to get all current design settings
	const getCurrentDesignSettings = useCallback(() => {
		return {
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
		};
	}, [
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
	]);

	// Function to apply styles to a single block
	const applyStylesToBlock = useCallback(
		(blockClientId) => {
			const block = getBlock(blockClientId);
			if (!block) return;

			const isFormField = [
				'blockons/form-text-input',
				'blockons/form-textarea',
				'blockons/form-select',
			].includes(block.name);

			if (isFormField) {
				updateBlockAttributes(
					blockClientId,
					getCurrentDesignSettings(),
				);
			}
		},
		[getBlock, updateBlockAttributes, getCurrentDesignSettings],
	);

	// Listen for changes in innerBlocks
	useEffect(() => {
		innerBlocksClientIds.forEach(applyStylesToBlock);
	}, [innerBlocksClientIds, applyStylesToBlock]);

	// Update all blocks when design settings change
	useEffect(() => {
		const designSettings = getCurrentDesignSettings();
		innerBlocksClientIds.forEach((blockId) => {
			const block = getBlock(blockId);
			if (!block) return;

			if (
				[
					'blockons/form-text-input',
					'blockons/form-textarea',
					'blockons/form-select',
				].includes(block.name)
			) {
				updateBlockAttributes(blockId, designSettings);
			}
		});
	}, [
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
	]);

	// Modify your existing updateInnerBlocksStyles function
	const updateInnerBlocksStyles = useCallback(
		(newStyles) => {
			innerBlocksClientIds.forEach((innerBlockClientId) => {
				const block = getBlock(innerBlockClientId);
				if (!block) return;

				if (
					[
						'blockons/form-text-input',
						'blockons/form-textarea',
						'blockons/form-select',
					].includes(block.name)
				) {
					updateBlockAttributes(innerBlockClientId, newStyles);
				}
			});
		},
		[innerBlocksClientIds, getBlock, updateBlockAttributes],
	);

	const validateEmails = (emails, type = 'emailTo') => {
		if (!emails) return false;
		const emailList = emails
			.split(',')
			.map((email) => email.trim())
			.filter(Boolean);

		// Check number of email addresses
		if (emailList.length > EMAIL_LIMITS[type]) {
			return false;
		}

		// Validate each email address
		return emailList.every((email) => isValidEmail(email));
	};

	const getEmailValidationMessage = (emails, type = 'emailTo') => {
		if (!emails) return '';

		const emailList = emails
			.split(',')
			.map((email) => email.trim())
			.filter(Boolean);

		if (emailList.length > EMAIL_LIMITS[type]) {
			return __(
				`Maximum ${EMAIL_LIMITS[type]} email addresses allowed`,
				'blockons',
			);
		}

		const invalidEmails = emailList.filter((email) => !isValidEmail(email));
		if (invalidEmails.length > 0) {
			return __('Invalid email address format', 'blockons');
		}

		return '';
	};

	/**
	 * Form Block Shortcodes
	 */
	const updateAvailableShortcodes = () => {
		const newShortcodes = [
			// System shortcodes
			{ code: 'form_name', label: 'Form Name', type: 'system' },
			{
				code: 'submission_date',
				label: 'Submission Date',
				type: 'system',
			},
			{
				code: 'submission_time',
				label: 'Submission Time',
				type: 'system',
			},
			{ code: 'page_url', label: 'Page URL', type: 'system' },
		];

		// Get all inner blocks
		innerBlocksClientIds.forEach((blockId) => {
			const block = getBlock(blockId);
			if (!block) return;

			const { attributes: blockAttributes, name: blockName } = block;

			// Only process form input blocks
			if (
				!['blockons/form-text-input', 'blockons/form-select'].includes(
					blockName,
				)
			) {
				return;
			}

			// For text inputs, only include if type is text or email
			if (
				blockName === 'blockons/form-text-input' &&
				!['text', 'email'].includes(blockAttributes.inputType)
			) {
				return;
			}

			const label = blockAttributes.label || '';
			const code = label.toLowerCase().replace(/[^a-z0-9]/g, '_');

			if (code) {
				newShortcodes.push({
					code,
					label,
					type:
						blockName === 'blockons/form-select'
							? 'select'
							: blockAttributes.inputType,
					fieldId: blockId,
				});
			}
		});

		setAttributes({ availableShortcodes: newShortcodes });
	};

	// Add this to the Edit component to watch for inner block changes
	useEffect(() => {
		updateAvailableShortcodes();
	}, [innerBlocksClientIds.length]); // Trigger when blocks are added/removed

	// Add a ShortcodesList component for the UI
	const ShortcodesList = () => {
		const [copiedCode, setCopiedCode] = useState(null);
		const [copiedText, setCopiedText] = useState(
			__('Click to copy shortcode:', 'blockons'),
		);

		const copyToClipboard = async (code) => {
			try {
				await navigator.clipboard.writeText(`[${code}]`);
				setCopiedCode(code);
				setCopiedText(__('Copied to Clipboard!', 'blockons'));

				// Reset the copied state after 1 second
				setTimeout(() => {
					setCopiedCode(null);
					setCopiedText(__('Click to copy shortcode:', 'blockons'));
				}, 1000);
			} catch (err) {
				console.error('Failed to copy text: ', err);
			}
		};

		return (
			<div className="blockons-shortcode-list">
				<p className="components-base-control__label">{copiedText}</p>
				<div className="blockons-shortcodes-btns">
					{availableShortcodes.map(({ code, label, type }) => (
						<button
							key={code}
							type="button"
							onClick={() => copyToClipboard(code)}
							className={`
								blockons-shortcode-btn
								${copiedCode === code ? 'is-copied' : ''}
							`}
						>
							[{code}]
						</button>
					))}
				</div>
			</div>
		);
	};

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody
					title={__('Form Settings', 'blockons')}
					initialOpen={true}
				>
					<ToggleControl
						label={__('Email Form', 'blockons')}
						checked={emailForm}
						onChange={(value) =>
							setAttributes({ emailForm: value })
						}
					/>

					<ToggleControl
						label={__('Newsletter Signup Form', 'blockons')}
						checked={newsletterSignup}
						onChange={(value) =>
							setAttributes({ newsletterSignup: value })
						}
					/>

					{(emailForm || newsletterSignup) && (
						<>
							<div className="blockons-divider"></div>
							<TextControl
								label={__('Form Name', 'blockons')}
								value={formName}
								onChange={(value) =>
									setAttributes({ formName: value })
								}
							/>
							<div className="blockons-divider"></div>

							<UnitControl
								label={__('Form Width', 'blockons')}
								value={formWidth}
								onChange={(newValue) =>
									setAttributes({ formWidth: newValue })
								}
								units={[
									{
										value: '%',
										label: '%',
										default: 100,
									},
									{
										value: 'px',
										label: 'px',
										default: 400,
									},
								]}
								isResetValueOnUnitChange
							/>
						</>
					)}
				</PanelBody>

				{emailForm && (
					<PanelBody
						title={__('Email Settings', 'blockons')}
						initialOpen={false}
					>
						<TextControl
							label={__('Email To', 'blockons')}
							help={__(
								`Add up to ${EMAIL_LIMITS.emailTo} emails separated by a comma`,
								'blockons',
							)}
							value={emailTo}
							className={`blockons-cf-emailto ${validateEmails(emailTo, 'emailTo') ? '' : 'has-error'}`}
							onChange={(value) =>
								setAttributes({ emailTo: value })
							}
						/>
						{emailTo && !validateEmails(emailTo, 'emailTo') && (
							<div className="components-form-field-help-text error-message">
								{getEmailValidationMessage(emailTo, 'emailTo')}
							</div>
						)}

						{emailTo && validateEmails(emailTo, 'emailTo') && (
							<>
								<div className="blockons-divider"></div>
								<ShortcodesList />
								<div className="blockons-divider"></div>

								<TextControl
									label={__('Email Subject', 'blockons')}
									value={emailSubject}
									onChange={(value) =>
										setAttributes({ emailSubject: value })
									}
								/>
								<div className="blockons-divider"></div>

								<TextControl
									label={__('From Email', 'blockons')}
									value={fromEmail}
									onChange={(value) =>
										setAttributes({ fromEmail: value })
									}
									help={__(
										'Add the EMAIL shortcode here',
										'blockons',
									)}
								/>
								<TextControl
									label={__('From Name', 'blockons')}
									value={fromName}
									onChange={(value) =>
										setAttributes({ fromName: value })
									}
									help={__(
										'Add the NAME shortcode here',
										'blockons',
									)}
								/>
								<div className="blockons-divider"></div>

								<TextControl
									label={__('CC Emails', 'blockons')}
									help={__(
										`Add up to ${EMAIL_LIMITS.ccEmails} emails separated by a comma`,
										'blockons',
									)}
									value={ccEmails}
									className={`${validateEmails(ccEmails, 'ccEmails') ? '' : 'has-error'}`}
									onChange={(value) =>
										setAttributes({ ccEmails: value })
									}
								/>
								{ccEmails &&
									!validateEmails(ccEmails, 'ccEmails') && (
										<div className="components-form-field-help-text error-message">
											{getEmailValidationMessage(
												ccEmails,
												'ccEmails',
											)}
										</div>
									)}

								<TextControl
									label={__('BCC Emails', 'blockons')}
									help={__(
										`Add up to ${EMAIL_LIMITS.bccEmails} emails separated by a comma`,
										'blockons',
									)}
									value={bccEmails}
									className={`${validateEmails(bccEmails, 'bccEmails') ? '' : 'has-error'}`}
									onChange={(value) =>
										setAttributes({ bccEmails: value })
									}
								/>
								{bccEmails &&
									!validateEmails(bccEmails, 'bccEmails') && (
										<div className="components-form-field-help-text error-message">
											{getEmailValidationMessage(
												bccEmails,
												'bccEmails',
											)}
										</div>
									)}
								<div className="blockons-divider"></div>

								<TextControl
									label={__('Submit Button Text', 'blockons')}
									value={submitButtonText}
									onChange={(value) =>
										setAttributes({
											submitButtonText: value,
										})
									}
								/>
								<div className="blockons-divider"></div>

								<TextControl
									label={__(
										'Form Success Message',
										'blockons',
									)}
									value={successMessage}
									onChange={(value) =>
										setAttributes({ successMessage: value })
									}
								/>
								<TextControl
									label={__('Form Error Message', 'blockons')}
									value={errorMessage}
									onChange={(value) =>
										setAttributes({ errorMessage: value })
									}
								/>
								<div className="blockons-divider"></div>

								<ToggleControl
									label={__('Include Metadata', 'blockons')}
									help={__(
										'Include date, time and page URL in the email',
										'blockons',
									)}
									checked={includeMetadata}
									onChange={(value) =>
										setAttributes({
											includeMetadata: value,
										})
									}
								/>
							</>
						)}
					</PanelBody>
				)}

				{newsletterSignup && (
					<PanelBody
						title={__('Newsletter Signup', 'blockons')}
						initialOpen={false}
					>
						<SelectControl
							label={__('Signup To', 'blockons')}
							value={emailTo}
							options={[
								{ label: 'MailerLite', value: 'mailerlite' },
								{ label: 'Mailchimp', value: 'mailchimp' },
							]}
							onChange={(value) =>
								setAttributes({ emailTo: value })
							}
						/>
					</PanelBody>
				)}

				{(emailForm || newsletterSignup) && (
					<PanelBody
						title={__('Form Design Settings', 'blockons')}
						initialOpen={false}
					>
						<RangeControl
							label={__('Form Row Spacing', 'blockons')}
							value={rowSpacing}
							onChange={(value) => {
								setAttributes({ rowSpacing: value });
								updateInnerBlocksStyles({
									rowSpacing: value,
								});
							}}
							min={0}
							max={100}
						/>
						<div className="blockons-divider"></div>

						<ToggleControl
							label={__('Show Labels', 'blockons')}
							checked={showLabels}
							onChange={(value) => {
								setAttributes({ showLabels: value });
								updateInnerBlocksStyles({ showLabels: value });
							}}
						/>
						{showLabels && (
							<>
								<RangeControl
									label={__('Label Size', 'blockons')}
									value={labelSize}
									onChange={(value) => {
										setAttributes({ labelSize: value });
										updateInnerBlocksStyles({
											labelSize: value,
										});
									}}
									min={10}
									max={54}
								/>
								<RangeControl
									label={__('Label Spacing', 'blockons')}
									value={labelSpacing}
									onChange={(value) => {
										setAttributes({ labelSpacing: value });
										updateInnerBlocksStyles({
											labelSpacing: value,
										});
									}}
									min={0}
									max={100}
								/>
								<BlockonsColorpicker
									label={__('Label Color', 'blockons')}
									value={labelColor}
									onChange={(newValue) => {
										setAttributes({ labelColor: newValue });
										updateInnerBlocksStyles({
											labelColor: newValue,
										});
									}}
									paletteColors={colorPickerPalette}
								/>
							</>
						)}
						<div className="blockons-divider"></div>

						<RangeControl
							label={__('Input Font Size', 'blockons')}
							value={inputSize}
							onChange={(value) => {
								setAttributes({ inputSize: value });
								updateInnerBlocksStyles({ inputSize: value });
							}}
							min={10}
							max={54}
						/>
						<RangeControl
							label={__('Input Padding Vertical', 'blockons')}
							value={inputPadVert}
							onChange={(value) => {
								setAttributes({ inputPadVert: value });
								updateInnerBlocksStyles({
									inputPadVert: value,
								});
							}}
							min={2}
							max={100}
						/>
						<RangeControl
							label={__('Input Padding Horizontal', 'blockons')}
							value={inputPadHoriz}
							onChange={(value) => {
								setAttributes({ inputPadHoriz: value });
								updateInnerBlocksStyles({
									inputPadHoriz: value,
								});
							}}
							min={2}
							max={100}
						/>
						<div className="blockons-divider"></div>

						<BlockonsColorpicker
							label={__('Input Background Color', 'blockons')}
							value={inputBgColor}
							onChange={(newValue) => {
								setAttributes({ inputBgColor: newValue });
								updateInnerBlocksStyles({
									inputBgColor: newValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						<BlockonsColorpicker
							label={__('Input Font Color', 'blockons')}
							value={inputTextColor}
							onChange={(newValue) => {
								setAttributes({ inputTextColor: newValue });
								updateInnerBlocksStyles({
									inputTextColor: newValue,
								});
							}}
							paletteColors={colorPickerPalette}
						/>
						<div className="blockons-divider"></div>

						<ToggleControl
							label={__('Input Border', 'blockons')}
							checked={inputBorder}
							onChange={(value) => {
								setAttributes({ inputBorder: value });
								updateInnerBlocksStyles({ inputBorder: value });
							}}
						/>
						{inputBorder && (
							<>
								<BlockonsColorpicker
									label={__('Input Border Color', 'blockons')}
									value={inputBorderColor}
									onChange={(newValue) => {
										setAttributes({
											inputBorderColor: newValue,
										});
										updateInnerBlocksStyles({
											inputBorderColor: newValue,
										});
									}}
									paletteColors={colorPickerPalette}
								/>
								<RangeControl
									label={__(
										'Input Border Radius',
										'blockons',
									)}
									value={inputBorderRadius}
									onChange={(value) => {
										setAttributes({
											inputBorderRadius: value,
										});
										updateInnerBlocksStyles({
											inputBorderRadius: value,
										});
									}}
									min={0}
									max={100}
								/>
							</>
						)}

						<div className="blockons-divider"></div>
						<BlockonsColorpicker
							label={__('Submit Button Color', 'blockons')}
							value={buttonColor}
							onChange={(newValue) =>
								setAttributes({ buttonColor: newValue })
							}
							paletteColors={colorPickerPalette}
						/>
						<BlockonsColorpicker
							label={__('Submit Button Font Color', 'blockons')}
							value={buttonFontColor}
							onChange={(newValue) =>
								setAttributes({ buttonFontColor: newValue })
							}
							paletteColors={colorPickerPalette}
						/>
					</PanelBody>
				)}
				{/* <PanelBody
					title={__('Security Settings', 'blockons')}
					initialOpen={false}
				>
					<ToggleControl
						label={__('Enable reCAPTCHA', 'blockons')}
						checked={useRecaptcha}
						onChange={(value) =>
							setAttributes({ useRecaptcha: value })
						}
					/>
				</PanelBody> */}
			</InspectorControls>
			<BlockControls>
				<AlignmentToolbar
					value={alignment}
					onChange={(newValue) =>
						setAttributes({ alignment: newValue })
					}
				/>
				<BlockAlignmentToolbar
					value={align}
					controls={['left', 'center', 'right']}
					onChange={(newValue) => setAttributes({ align: newValue })}
				/>
			</BlockControls>

			{emailForm || newsletterSignup ? (
				<div className="blockons-cf-wrap" style={{ width: formWidth }}>
					<div className="blockons-cf-fields">
						<InnerBlocks
							allowedBlocks={ALLOWED_BLOCKS}
							template={
								emailForm
									? DEFAULT_EMAIL_TEMPLATE
									: DEFAULT_NEWSLETTER_TEMPLATE
							}
							templateLock={false}
						/>
					</div>

					<div className="blockons-cfh-field">
						<input
							type="text"
							name="asite"
							tabIndex="-1"
							autoComplete="off"
						/>
					</div>

					<div className="blockons-cf--footer">
						<div className="blockons-cf--button">
							<button
								type="button"
								className="blockons-cf-submit-btn"
								style={{
									backgroundColor: buttonColor,
									color: buttonFontColor,
								}}
							>
								{submitButtonText ||
									__('Send Message', 'blockons')}
							</button>
						</div>

						{isSelected && (
							<div className="blockons-cf-messages">
								<div className="blockons-cf-msg-success">
									{successMessage ||
										__(
											"Thank you for your message. We'll get back to you soon!",
											'blockons',
										)}
								</div>
								<div className="blockons-cf-msg-error">
									{errorMessage ||
										__(
											'There was an error sending your message. Please try again.',
											'blockons',
										)}
								</div>
							</div>
						)}
					</div>
				</div>
			) : (
				<Placeholder
					icon="email"
					label={__('Select Form Type', 'blockons')}
					instructions={__(
						'Please select if this is an Email form or a Newsletter Signup form.',
						'blockons',
					)}
				>
					{isSelected && (
						<>
							<ToggleControl
								label={__('Email Form', 'blockons')}
								checked={emailForm}
								onChange={(value) =>
									setAttributes({ emailForm: value })
								}
							/>

							<ToggleControl
								label={__('Newsletter Signup Form', 'blockons')}
								checked={newsletterSignup}
								onChange={(value) =>
									setAttributes({ newsletterSignup: value })
								}
							/>
						</>
					)}
				</Placeholder>
			)}
		</div>
	);
};

export default Edit;
