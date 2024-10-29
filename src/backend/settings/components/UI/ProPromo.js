import { __ } from '@wordpress/i18n';
import InputToggleSwitch from '../inputs/InputToggleSwitch';

const ProPromo = ({ blockonsOptions, clickClose, upgradeUrl }) => {
	return (
		<div className="blockons-propromo">
			<div>
				{__(
					'Pricing will go up soon with more advanced features. Purchase Blockons Pro now and enjoy this price forever!',
					'blockons',
				)}
			</div>
			<div>
				<a
					href="https://blockons.com/pro/"
					target="_blank"
					className="propromo-see"
				>
					{__("See What's on Offer", 'blockons')}
				</a>
				<a href={upgradeUrl} className="propromo-upgrade">
					{__('Upgrade Now', 'blockons')}
				</a>
				<div className="blockons-feedback-dismiss">
					<InputToggleSwitch
						title="X"
						slug="global_disablepropromo"
						value={blockonsOptions.disablepropromo}
						onChange={clickClose}
					/>
				</div>
			</div>
		</div>
	);
};

export default ProPromo;
