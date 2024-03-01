import React from "react";
import { __ } from "@wordpress/i18n";
import SettingHeader from "../components/SettingHeader";
import SettingBlock from "../components/SettingBlock";
import { blockListSettings } from "../../../backend/helpers";

const EditorBlocks = ({
	defaults,
	blockonsOptions,
	wcActive,
	handleSettingChange,
}) => {
	const onSettingChange = (e) => {
		handleSettingChange(e);
	};

	return (
		<React.Fragment>
			<SettingHeader
				title={__("Blockons Editor Blocks", "blockons")}
				description={__(
					"Choose the blocks you'd like to use when building with the WordPress block editor. You can turn off blocks to optimize for speed & page loading.",
					"blockons"
				)}
			/>

			<div className="blockons-block-settings">
				{defaults.blocks &&
					blockonsOptions &&
					Object.entries(defaults.blocks).map(([key, value]) => (
						<SettingBlock
							key={key}
							title={key.replaceAll("_", " ").replace("wc", "WC")}
							slug={`blocks_${key}`}
							value={
								// If the setting exists in the saved settings then use it otherwise off by default
								blockonsOptions && blockonsOptions.blocks
									? blockonsOptions.blocks[key]
									: false
							}
							inputType="toggle"
							description={
								blockListSettings[key] ? blockListSettings[key].desc : ""
							}
							onChange={onSettingChange}
							pluginSpecific={
								blockListSettings[key]
									? blockListSettings[key].pluginSpecific
									: false
							}
							{...(blockListSettings[key] &&
							blockListSettings[key].pluginSpecific === "WooCommerce" &&
							!wcActive
								? { disable: true }
								: "")}
							isNew={
								blockListSettings[key] ? blockListSettings[key].isNew : false
							}
						/>
					))}
			</div>
			<div className="blockons-more">
				{__("More Blocks Coming Soon...", "blockons")}
			</div>
			<p className="center">
				{__(
					"Get in touch and let us know which blocks you need for your site.",
					"blockons"
				)}
			</p>
		</React.Fragment>
	);
};

export default EditorBlocks;
