import { __ } from "@wordpress/i18n";
import InputToggleSwitch from "../inputs/InputToggleSwitch";

const ProPromo = ({ blockonsOptions, clickClose, upgradeUrl }) => {
	return (
		<div className="blockons-propromo">
			<div>
				{__(
					"Exciting news! Blockons Pro is here with a special launch deal! Purchase Blockons Pro now and enjoy this price for life! No matter what gets added!",
					"blockons"
				)}
			</div>
			<div>
				<a
					href="https://blockons.com/pro/"
					target="_blank"
					className="propromo-see"
				>
					{__("See What's on Offer", "blockons")}
				</a>
				<a href={upgradeUrl} className="propromo-upgrade">
					{__("Upgrade Now", "blockons")}
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
