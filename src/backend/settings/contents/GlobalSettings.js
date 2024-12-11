import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import SettingHeader from '../components/SettingHeader';
import SettingRow from '../components/SettingRow';
import SettingGroup from '../components/SettingGroup';

const GlobalSettings = ({
	blockonsOptions,
	handleSettingChange,
	isPremium,
	upgradeUrl,
}) => {
	const [formRecaptcha, setFormRecaptcha] = useState(false);
	const [formSaveSubmissions, setFormSaveSubmissions] = useState(false);

	const onSettingChange = (e) => {
		handleSettingChange(e);
	};

	return (
		<>
			<SettingHeader
				title={__('Settings', 'blockons')}
				description={__(
					'This section is for Global Settings used in the Blockons Plugin',
					'blockons',
				)}
			/>

			<table className="form-table" role="presentation">
				<tbody>
					<SettingRow
						title={__('Blockons Contact Forms', 'blockons')}
						description={__(
							'Global Settings for Blockons Contact Forms',
							'blockons',
						)}
						inputType="heading"
						// nomargin
					/>
					{isPremium ? (
						<>
							<SettingRow
								title={__('Save Form Submissions', 'blockons')}
								slug="contactforms_save_to_dashboard"
								value={
									blockonsOptions.contactforms
										?.save_to_dashboard
								}
								inputType="toggle"
								onChange={onSettingChange}
								note={__(
									'This will save all form submissions to the WordPress Dashboard -> Form Submissions',
									'blockons',
								)}
							/>

							<SettingRow
								title={__('Enable reCaptcha', 'blockons')}
								slug="contactforms_recaptcha"
								value={blockonsOptions.contactforms?.recaptcha}
								inputType="toggle"
								onChange={onSettingChange}
								note={
									<>
										<a
											href="https://www.google.com/recaptcha"
											target="_blank"
											rel="noopener noreferrer"
										>
											{__('reCAPTCHA V3', 'blockons')}
										</a>{' '}
										{__(
											'is a free service by Google that protects your website forms from spam and abuse.',
											'blockons',
										)}
									</>
								}
							/>
							{blockonsOptions.contactforms?.recaptcha && (
								<>
									<SettingRow
										title={__('Site Key')}
										slug="contactforms_recaptcha_key"
										value={
											blockonsOptions.contactforms
												?.recaptcha_key
										}
										inputType="text"
										onChange={onSettingChange}
									/>
									<SettingRow
										title={__('Secret Key')}
										slug="contactforms_recaptcha_secret"
										value={
											blockonsOptions.contactforms
												?.recaptcha_secret
										}
										inputType="text"
										onChange={onSettingChange}
									/>
								</>
							)}
						</>
					) : (
						<>
							<SettingRow
								title={__('Save Form Submissions', 'blockons')}
								inputType="toggle"
								slug="form_save_pro"
								value={formSaveSubmissions}
								onChange={() =>
									setFormSaveSubmissions(!formSaveSubmissions)
								}
								// documentation="https://blockons/documentation/tooltips"
							/>
							{formSaveSubmissions && (
								<SettingRow
									inputType="upgrade"
									title={__('Premium Settings', 'blockons')}
									description={__(
										'Upgrade to Blockons Pro to save form submissions to your Dashboard.',
										'blockons',
									)}
									upgradeUrl={upgradeUrl}
									proFeatures={[
										__(
											'Never lose email submissions!',
											'blockons',
										),
										__(
											'Save all submissions to the database',
											'blockons',
										),
										__(
											'Mark submissions as read/unread',
											'blockons',
										),
									]}
								/>
							)}

							<SettingRow
								title={__('Recaptcha', 'blockons')}
								inputType="toggle"
								slug="form_pro"
								value={formRecaptcha}
								onChange={() =>
									setFormRecaptcha(!formRecaptcha)
								}
								// documentation="https://blockons/documentation/tooltips"
							/>
							{formRecaptcha && (
								<SettingRow
									inputType="upgrade"
									title={__('Premium Settings', 'blockons')}
									description={__(
										'Upgrade to Blockons Pro to add reCAPTCHA V3 to your forms.',
										'blockons',
									)}
									upgradeUrl={upgradeUrl}
									proFeatures={[
										__(
											'Protect your forms from spam',
											'blockons',
										),
										__(
											'Add reCAPTCHA to all forms',
											'blockons',
										),
									]}
									note={
										<>
											<a
												href="https://www.google.com/recaptcha"
												target="_blank"
												rel="noopener noreferrer"
											>
												{__('reCAPTCHA V3', 'blockons')}
											</a>{' '}
											{__(
												'is a free service by Google that protects your website forms from spam and abuse.',
												'blockons',
											)}
										</>
									}
								/>
							)}
						</>
					)}
				</tbody>
			</table>
		</>
	);
};

export default GlobalSettings;
