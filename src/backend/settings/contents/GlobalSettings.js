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
					<>
						<SettingRow
							title={__('Blockons Contact Forms', 'blockons')}
							description={__(
								'Global Settings for Blockons Contact Forms',
								'blockons',
							)}
							inputType="heading"
							// nomargin
						/>
						<SettingRow
							title={__('Save Form Submissions', 'blockons')}
							slug="contactforms_save_to_dashboard"
							value={
								blockonsOptions.contactforms?.save_to_dashboard
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
				</tbody>
			</table>
		</>
	);
};

export default GlobalSettings;
