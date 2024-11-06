import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
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
	Button,
	Placeholder,
	__experimentalUnitControl as UnitControl,
} from '@wordpress/components';
import BlockonsColorpicker from '../_components/BlockonsColorpicker';
import { colorPickerPalette, isValidEmail } from '../block-global';

const ALLOWED_BLOCKS = [
	'blockons/form-text-input',
	'blockons/form-textarea',
	'blockons/form-select',
];

// Default template with name, email and message fields
const DEFAULT_TEMPLATE = [
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
			replyToEmail,
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
			useRecaptcha,
			recaptchaSiteKey,
			recaptchaSecretKey,
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

	console.log('Edit.js isPremium: ', isPremium);

	const { updateBlockAttributes } = useDispatch(blockEditorStore);

	// Get all inner blocks and select function
	const { innerBlocksClientIds, getBlock } = useSelect(
		(select) => {
			const { getBlockOrder, getBlock } = select(blockEditorStore);
			return {
				innerBlocksClientIds: getBlockOrder(clientId),
				getBlock, // Return the getBlock function
			};
		},
		[clientId],
	);

	// Function to update all inner blocks with new styles
	const updateInnerBlocksStyles = (newStyles) => {
		innerBlocksClientIds.forEach((innerBlockClientId) => {
			// Get the block type using the getBlock function we got from useSelect
			const { name: blockType } = getBlock(innerBlockClientId);

			// Update block attributes if it's one of our form blocks
			if (
				[
					'blockons/form-text-input',
					'blockons/form-textarea',
					'blockons/form-select',
				].includes(blockType)
			) {
				updateBlockAttributes(innerBlockClientId, newStyles);
			}
		});
	};

	const validateEmails = (emails) => {
		if (!emails) return false;
		const emailList = emails.split(',').map((email) => email.trim());
		return emailList.every((email) => isValidEmail(email));
	};

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody
					title={__('Form Settings', 'blockons')}
					initialOpen={true}
				>
					<UnitControl
						label={__('Form Width', 'blockons')}
						value={formWidth}
						onChange={(newValue) =>
							setAttributes({ formWidth: newValue })
						}
						units={[
							{ value: '%', label: '%', default: 100 },
							{ value: 'px', label: 'px', default: 400 },
						]}
						isResetValueOnUnitChange
					/>
					<div className="blockons-divider"></div>

					<TextControl
						label={__('Form Name', 'blockons')}
						value={formName}
						onChange={(value) => setAttributes({ formName: value })}
					/>
					<div className="blockons-divider"></div>

					<TextControl
						label={__('Email To', 'blockons')}
						help={__(
							'Add Multiple emails separated by a comma',
							'blockons',
						)}
						value={emailTo}
						className="blockons-cf-emailto"
						onChange={(value) => setAttributes({ emailTo: value })}
					/>
					{emailTo && validateEmails(emailTo) && (
						<>
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
							/>
							<TextControl
								label={__('From Name', 'blockons')}
								value={fromName}
								onChange={(value) =>
									setAttributes({ fromName: value })
								}
							/>
							<TextControl
								label={__('Reply-To Email', 'blockons')}
								value={replyToEmail}
								onChange={(value) =>
									setAttributes({ replyToEmail: value })
								}
							/>
							<div className="blockons-divider"></div>

							<TextControl
								label={__('CC Emails', 'blockons')}
								help={__(
									'Add Multiple emails separated by a comma',
									'blockons',
								)}
								value={ccEmails}
								onChange={(value) =>
									setAttributes({ ccEmails: value })
								}
							/>
							<TextControl
								label={__('BCC Emails', 'blockons')}
								help={__(
									'Add Multiple emails separated by a comma',
									'blockons',
								)}
								value={bccEmails}
								onChange={(value) =>
									setAttributes({ bccEmails: value })
								}
							/>
							<div className="blockons-divider"></div>

							<TextControl
								label={__('Submit Button Text', 'blockons')}
								value={submitButtonText}
								onChange={(value) =>
									setAttributes({ submitButtonText: value })
								}
							/>
							<div className="blockons-divider"></div>

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
									setAttributes({ includeMetadata: value })
								}
							/>
						</>
					)}
				</PanelBody>
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
							updateInnerBlocksStyles({ inputPadVert: value });
						}}
						min={2}
						max={100}
					/>
					<RangeControl
						label={__('Input Padding Horizontal', 'blockons')}
						value={inputPadHoriz}
						onChange={(value) => {
							setAttributes({ inputPadHoriz: value });
							updateInnerBlocksStyles({ inputPadHoriz: value });
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
							updateInnerBlocksStyles({ inputBgColor: newValue });
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
								label={__('Input Border Radius', 'blockons')}
								value={inputBorderRadius}
								onChange={(value) => {
									setAttributes({ inputBorderRadius: value });
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
				<PanelBody
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

					{useRecaptcha && (
						<>
							<p className="blockons-help-text">
								{__(
									'You need to register your site with Google reCAPTCHA v2 to get these keys:',
									'blockons',
								)}
								<br />
								<a
									href="https://www.google.com/recaptcha/admin"
									target="_blank"
									rel="noopener noreferrer"
								>
									{__('Get reCAPTCHA Keys', 'blockons')}
								</a>
							</p>

							<TextControl
								label={__('Site Key', 'blockons')}
								value={recaptchaSiteKey}
								onChange={(value) =>
									setAttributes({ recaptchaSiteKey: value })
								}
							/>

							<TextControl
								label={__('Secret Key', 'blockons')}
								value={recaptchaSecretKey}
								onChange={(value) =>
									setAttributes({ recaptchaSecretKey: value })
								}
							/>
						</>
					)}
				</PanelBody>
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
					<div className="blockons-cf-fields">
						<InnerBlocks
							allowedBlocks={ALLOWED_BLOCKS}
							template={DEFAULT_TEMPLATE}
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
					label={__('Contact Form', 'blockons')}
					instructions={__(
						'Please set the recipient email address in the block settings.',
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
