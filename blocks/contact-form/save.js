import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const Save = ({ attributes }) => {
	const {
		isPremium,
		formWidth,
		columnSpacing,
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
		showLabels,
		labelSize,
		submitButtonText,
		successMessage,
		errorMessage,
		inputBorderRadius,
		buttonColor,
		buttonFontColor,
		buttonSpacing,
		errorPosition,
		availableShortcodes,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `blockons-contact-form ${align}-align alignment-${alignment}`,
	});

	const shortcodesData = Array.isArray(availableShortcodes)
		? availableShortcodes.map(({ code, fieldId }) => ({
				code,
				fieldId,
			}))
		: [];

	return (
		<div {...blockProps}>
			<div
				className="blockons-cf-wrap"
				style={{ width: formWidth }}
				data-email-to={emailTo || ''}
				data-email-subject={
					emailSubject || 'New Contact Form Submission'
				}
				data-from-email={fromEmail || ''}
				data-from-name={fromName || ''}
				data-cc-emails={ccEmails || ''}
				data-bcc-emails={bccEmails || ''}
				data-include-metadata={includeMetadata ? 'true' : 'false'}
				data-form-id={formName || ''}
				data-shortcodes={JSON.stringify(shortcodesData)}
				data-debug="true"
			>
				<form className="blockons-cf-form">
					<input
						type="hidden"
						name="action"
						value="blockons_submit_contact_form"
					/>
					<input type="hidden" name="form_id" value={formName} />

					<div className="blockons-cfh-field">
						<input
							type="text"
							name="asite"
							tabIndex="-1"
							autoComplete="off"
						/>
					</div>

					<div
						className={`blockons-cf-fields ${!showLabels ? 'nolabels' : ''} ${errorPosition}`}
					>
						<InnerBlocks.Content />

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
									borderRadius: inputBorderRadius,
									marginTop: buttonSpacing,
									fontSize: labelSize,
								}}
							>
								{submitButtonText ||
									__('Send Message', 'blockons')}
							</button>
						</div>
					</div>

					<div className="blockons-cf--footer">
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
					</div>
				</form>
			</div>
		</div>
	);
};

export default Save;
