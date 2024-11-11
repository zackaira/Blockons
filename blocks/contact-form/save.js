/**
 * WordPress dependencies
 */
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const Save = ({ attributes }) => {
	const {
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
		buttonColor,
		buttonFontColor,
		availableShortcodes,
	} = attributes;

	const blockProps = useBlockProps.save({
		className: `blockons-contact-form ${align}-align alignment-${alignment}`,
	});

	// Store shortcodes data as a hidden input
	const shortcodesData = Array.isArray(availableShortcodes)
		? availableShortcodes.map((shortcode) => ({
				code: shortcode.code,
				fieldId: shortcode.fieldId,
			}))
		: [];

	return (
		<div {...blockProps}>
			<div
				className="blockons-cf-wrap"
				style={{ width: formWidth }}
				data-email-to={emailTo || ''}
				data-email-subject={
					emailSubject || 'Email from website contact form'
				}
				data-from-email={fromEmail || ''}
				data-from-name={fromName || ''}
				data-cc-emails={ccEmails || ''}
				data-bcc-emails={bccEmails || ''}
				data-include-metadata={includeMetadata || false}
				data-shortcodes={JSON.stringify(shortcodesData)}
			>
				<form className="blockons-cf-form" data-form-id={formName}>
					<input
						type="hidden"
						name="action"
						value="blockons_submit_contact_form"
					/>
					<input type="hidden" name="form_id" value={formName} />

					<div className="blockons-cf-fields">
						<InnerBlocks.Content />
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
								type="submit"
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
