import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useState, useCallback, useMemo } from '@wordpress/element';
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
	Button,
} from '@wordpress/components';
import BlockonsColorpicker from '../_components/BlockonsColorpicker';
import BlockonsNote from '../../src/backend/settings/components/UI/BlockonsNote';
import { colorPickerPalette, isValidEmail } from '../block-global';

// Constants moved to top level
const ALLOWED_BLOCKS = [
	'core/spacer',
	'core/heading',
	'core/paragraph',
	'blockons/form-text-input',
	'blockons/form-textarea',
	'blockons/form-select',
	'blockons/form-acceptance',
	'blockons/form-checkbox',
	'blockons/form-radio',
	'blockons/form-file-upload',
	'blockons/form-datepicker',
];

const EMAIL_LIMITS = {
	emailTo: 3,
	ccEmails: 2,
	bccEmails: 2,
};

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
			inputType: 'textarea',
		},
	],
];

const ShortcodesList = ({ availableShortcodes }) => {
	const [copiedCode, setCopiedCode] = useState(null);
	const [copiedText, setCopiedText] = useState(
		__('Click to copy shortcode:', 'blockons'),
	);

	const copyToClipboard = async (code) => {
		try {
			await navigator.clipboard.writeText(`[${code}]`);
			setCopiedCode(code);
			setCopiedText(__('Copied to Clipboard!', 'blockons'));
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
			<label className="components-base-control__label">
				{__('Form Field Shortcodes', 'blockons')}
			</label>
			<div className="blockons-shortcodes-btns">
				{availableShortcodes.map(({ code, label }) => (
					<button
						key={code}
						type="button"
						onClick={() => copyToClipboard(code)}
						className={`blockons-shortcode-btn ${copiedCode === code ? 'is-copied' : ''}`}
					>
						[{code}]
					</button>
				))}
			</div>
			<p className="components-base-control__help">{copiedText}</p>
		</div>
	);
};

// Email validation utilities
const validateEmails = (emails, type = 'emailTo') => {
	if (!emails) return false;
	const emailList = emails
		.split(',')
		.map((email) => email.trim())
		.filter(Boolean);
	return (
		emailList.length <= EMAIL_LIMITS[type] && emailList.every(isValidEmail)
	);
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

	return emailList.some((email) => !isValidEmail(email))
		? __('Invalid email address', 'blockons')
		: '';
};

const Edit = (props) => {
	const {
		attributes: {
			isPremium,
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

	// Custom hooks for block operations
	const { innerBlocksClientIds, getBlock } = useSelect(
		(select) => ({
			innerBlocksClientIds:
				select('core/block-editor').getBlockOrder(clientId),
			getBlock: select('core/block-editor').getBlock,
		}),
		[clientId],
	);

	const { updateBlockAttributes } = useDispatch('core/block-editor');

	// Memoized design settings
	const getCurrentDesignSettings = useMemo(
		() => ({
			isPremium: isPremium,
			columnSpacing: columnSpacing,
			rowSpacing: rowSpacing,
			showLabels: showLabels,
			labelSize: labelSize,
			labelSpacing: labelSpacing,
			labelColor: labelColor,
			inputSize: inputSize,
			inputPadHoriz: inputPadHoriz,
			inputPadVert: inputPadVert,
			inputBgColor: inputBgColor,
			inputTextColor: inputTextColor,
			inputBorder: inputBorder,
			inputBorderColor: inputBorderColor,
			inputBorderRadius: inputBorderRadius,
		}),
		[props.attributes],
	);

	// Update styles for a single block
	const applyStylesToBlock = useCallback(
		(blockClientId) => {
			const block = getBlock(blockClientId);
			if (!block || !ALLOWED_BLOCKS.includes(block.name)) return;
			updateBlockAttributes(blockClientId, getCurrentDesignSettings);
		},
		[getBlock, updateBlockAttributes, getCurrentDesignSettings],
	);

	// Update styles for all inner blocks
	const updateInnerBlocksStyles = useCallback(
		(newStyles) => {
			innerBlocksClientIds.forEach((innerBlockClientId) => {
				const block = getBlock(innerBlockClientId);
				if (!block) return;

				if (ALLOWED_BLOCKS.includes(block.name)) {
					updateBlockAttributes(innerBlockClientId, newStyles);
				}
			});
		},
		[innerBlocksClientIds, getBlock, updateBlockAttributes],
	);

	// Effect for updating styles
	useEffect(() => {
		innerBlocksClientIds.forEach(applyStylesToBlock);
	}, [innerBlocksClientIds, applyStylesToBlock]);

	// Update available shortcodes
	const updateAvailableShortcodes = useCallback(() => {
		const newShortcodes = [
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

		innerBlocksClientIds.forEach((blockId) => {
			const block = getBlock(blockId);
			if (!block) return;

			const { attributes: blockAttributes, name: blockName } = block;

			if (
				!['blockons/form-text-input', 'blockons/form-select'].includes(
					blockName,
				)
			) {
				return;
			}

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
	}, [innerBlocksClientIds, getBlock, setAttributes]);

	useEffect(() => {
		updateAvailableShortcodes();
	}, [innerBlocksClientIds.length, updateAvailableShortcodes]);

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody
					title={__('Form Settings', 'blockons')}
					initialOpen={true}
				>
					<TextControl
						label={__('Email To', 'blockons')}
						help={__(
							`Add up to ${EMAIL_LIMITS.emailTo} emails separated by a comma`,
							'blockons',
						)}
						value={emailTo}
						className={`blockons-cf-emailto ${validateEmails(emailTo, 'emailTo') ? '' : 'has-error'}`}
						onChange={(value) => setAttributes({ emailTo: value })}
					/>
					{emailTo && !validateEmails(emailTo, 'emailTo') && (
						<div className="components-form-field-help-text error-message">
							{getEmailValidationMessage(emailTo, 'emailTo')}
						</div>
					)}

					{emailTo && validateEmails(emailTo, 'emailTo') && (
						<>
							<div className="blockons-divider"></div>
							<ShortcodesList
								availableShortcodes={availableShortcodes}
							/>
							<div className="blockons-divider"></div>

							<TextControl
								label={__('Form Name', 'blockons')}
								value={formName}
								onChange={(value) =>
									setAttributes({ formName: value })
								}
							/>

							<TextControl
								label={__('Email Subject', 'blockons')}
								value={emailSubject}
								onChange={(value) =>
									setAttributes({ emailSubject: value })
								}
							/>
							<div className="blockons-divider"></div>

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
							<div className="blockons-divider"></div>

							{/* {fromName && fromEmail && (
								<>
									<ToggleControl
										label={__(
											'Newsletter Signup',
											'blockons',
										)}
										checked={newsletterSignup}
										onChange={(value) =>
											setAttributes({
												newsletterSignup: value,
											})
										}
										help={__(
											'Add ',
											'blockons',
										)}
									/>
									<div className="blockons-divider"></div>
								</>
							)} */}

							{isPremium ? (
								<>
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
										!validateEmails(
											ccEmails,
											'ccEmails',
										) && (
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
										!validateEmails(
											bccEmails,
											'bccEmails',
										) && (
											<div className="components-form-field-help-text error-message">
												{getEmailValidationMessage(
													bccEmails,
													'bccEmails',
												)}
											</div>
										)}
									<div className="blockons-divider"></div>
								</>
							) : (
								<BlockonsNote
									title={__(
										'Add CC & BCC emails',
										'blockons',
									)}
									text={__(
										'Upgrade to Blockons Pro and gain the power to send CC and BCC emails with your form.',
										'blockons',
									)}
								/>
							)}

							<TextControl
								label={__('Form Success Message', 'blockons')}
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

				{/* {newsletterSignup && (
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
				)} */}

				{emailTo && validateEmails(emailTo, 'emailTo') && (
					<PanelBody
						title={__('Form Design Settings', 'blockons')}
						initialOpen={false}
					>
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
						<div className="blockons-divider"></div>

						<RangeControl
							label={__('Form Column Spacing', 'blockons')}
							value={columnSpacing}
							onChange={(value) => {
								setAttributes({ columnSpacing: value });
								updateInnerBlocksStyles({
									columnSpacing: value,
								});
							}}
							min={0}
							max={40}
							help={__(
								'Adjust the space between form fields IF you edit field widths',
								'blockons',
							)}
						/>
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

			{emailTo && validateEmails(emailTo) ? (
				<div className="blockons-cf-wrap" style={{ width: formWidth }}>
					<div className="blockons-cfh-field">
						<input
							type="text"
							name="asite"
							tabIndex="-1"
							autoComplete="off"
						/>
					</div>

					<div className="blockons-cf-fields">
						<InnerBlocks
							allowedBlocks={ALLOWED_BLOCKS}
							template={DEFAULT_EMAIL_TEMPLATE}
							templateLock={false}
						/>

						<div
							className="blockons-cf--button"
							style={{
								padding: `0 ${columnSpacing}px`,
							}}
						>
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
					</div>

					<div className="blockons-cf--footer">
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
					label={__('Blockons Form', 'blockons')}
					instructions={__(
						'Enter the Send To email to further configure this form.',
						'blockons',
					)}
				>
					{isSelected && (
						<Button
							isPrimary
							onClick={() => {
								// Focus on the email field in settings
								const emailField = document.querySelector(
									'.blockons-cf-emailto input',
								);
								if (emailField) emailField.focus();
							}}
						>
							{__('Configure Email', 'blockons')}
						</Button>
					)}
				</Placeholder>
			)}
		</div>
	);
};

export default Edit;
