import { __ } from '@wordpress/i18n';

const UpgradeTip = ({ text, upgradeUrl, btnText, newTab = true }) => {
	return (
		<div
			className={`blockons-settings-tip${upgradeUrl ? '' : ' no-upgrade-url'}`}
		>
			<p>{text}</p>
			{upgradeUrl && (
				<a href={upgradeUrl} {...(newTab ? { target: '_blank' } : {})}>
					{btnText ? btnText : __('Upgrade Now', 'blockons')}
				</a>
			)}
		</div>
	);
};

export default UpgradeTip;
