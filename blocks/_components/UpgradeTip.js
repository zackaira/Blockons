import { __ } from '@wordpress/i18n';

const UpgradeTip = ({ text, upgradeUrl, newTab = true }) => {
	return (
		<div
			className={`blockons-settings-tip${upgradeUrl ? '' : ' no-upgrade-url'}`}
		>
			<p>{text}</p>
			{upgradeUrl && (
				<a href={upgradeUrl} {...(newTab ? { target: '_blank' } : {})}>
					{__('Upgrade Now', 'blockons')}
				</a>
			)}
		</div>
	);
};

export default UpgradeTip;
