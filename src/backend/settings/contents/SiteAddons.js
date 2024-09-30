import React from "react";
import { __ } from "@wordpress/i18n";
import SettingHeader from "../components/SettingHeader";
import SettingRow from "../components/SettingRow";
import SettingGroup from "../components/SettingGroup";

const SiteAddons = ({
	blockonsOptions,
	handleSettingChange,
	isPremium,
	upgradeUrl,
	showPageLoader,
	setShowPageLoader,
	showBttb,
	setShowBttb,
	showScrollInd,
	setShowScrollInd,
	showSiteBy,
	setShowSiteBy,
}) => {
	const onSettingChange = (e) => {
		handleSettingChange(e);
	};
	const onShowPageLoader = (e) => {
		setShowPageLoader(e);
	};
	const onShowBttb = (e) => {
		setShowBttb(e);
	};
	const onShowScrollInd = (e) => {
		setShowScrollInd(e);
	};
	const onShowSiteBy = (e) => {
		setShowSiteBy(e);
	};

	return (
		<React.Fragment>
			<SettingHeader
				title={__("Blockons Site Addons", "blockons")}
				description={__(
					"Add extra, useful features to your WordPress website",
					"blockons"
				)}
			/>

			<table className="form-table" role="presentation">
				<tbody>
					<SettingRow
						title={__("Website Page Loader", "blockons")}
						description={__(
							"Add a global loader that displays while your page loads.",
							"blockons"
						)}
						inputType="heading"
					/>
					<SettingRow
						title={__("Enable Page Loader", "blockons")}
						slug="pageloader_enabled"
						value={blockonsOptions.pageloader?.enabled}
						inputType="toggle"
						onChange={onSettingChange}
					/>
					{blockonsOptions.pageloader?.enabled && (
						<>
							<SettingRow
								title={__("Show Preview", "blockons")}
								slug="pageloader_preview"
								value={showPageLoader}
								inputType="toggle"
								onChange={() => onShowPageLoader((state) => !state)}
							/>
							<SettingRow
								title={__("Loader Style", "blockons")}
								slug="pageloader_style"
								value={blockonsOptions.pageloader?.style}
								inputType="select"
								options={{
									one: __("Dual Ring Spinner", "blockons"),
									two: __("Loading Bars", "blockons"),
									three: __("Circular Ripple", "blockons"),
									four: __("Loading Ring Spinner", "blockons"),
									five: __("Clock Spinner", "blockons"),
									six: __("Circle Roller", "blockons"),
								}}
								onChange={onSettingChange}
								{...(!isPremium && blockonsOptions.pageloader?.style !== "one"
									? { note: __("This is a Blockons Pro feature.", "blockons") }
									: {})}
							/>
							{!isPremium && blockonsOptions.pageloader?.style !== "one" && (
								<SettingRow
									inputType="upgrade"
									title={__("Premium Page Loaders", "blockons")}
									description={__(
										"Select from more Page Loaders in Blockons Pro. View the Pro loaders in the preview.",
										"blockons"
									)}
									upgradeUrl={upgradeUrl}
								/>
							)}

							<SettingGroup label={__("Edit Page Loader", "blockons")}>
								<SettingRow
									title={__("Add Loading Text", "blockons")}
									slug="pageloader_has_text"
									value={blockonsOptions.pageloader?.has_text}
									inputType="toggle"
									onChange={onSettingChange}
								/>
								{blockonsOptions.pageloader?.has_text && (
									<>
										<SettingRow
											title={__("Text", "blockons")}
											slug="pageloader_text"
											value={blockonsOptions.pageloader?.text}
											placeholder={__("Loading Website...", "blockons")}
											inputType="text"
											onChange={onSettingChange}
										/>
										<SettingRow
											title={__("Position", "blockons")}
											slug="pageloader_text_position"
											value={blockonsOptions.pageloader?.text_position}
											inputType="select"
											options={{
												one: __("Top Center", "blockons"),
												two: __("Bottom Center", "blockons"),
												three: __("Above Loader", "blockons"),
												four: __("Below Loader", "blockons"),
											}}
											onChange={onSettingChange}
										/>
									</>
								)}
								<SettingRow
									title={__("Background Color", "blockons")}
									slug="pageloader_bgcolor"
									value={blockonsOptions.pageloader?.bgcolor}
									inputType="colorpicker"
									defaultValue="#FFF"
									onChange={onSettingChange}
								/>
								<SettingRow
									title={__("Loader Color", "blockons")}
									slug="pageloader_loadcolor"
									value={blockonsOptions.pageloader?.loadcolor}
									inputType="colorpicker"
									defaultValue="#AF2DBF"
									onChange={onSettingChange}
								/>
								{blockonsOptions.pageloader?.has_text && (
									<SettingRow
										title={__("Font Color", "blockons")}
										slug="pageloader_fcolor"
										value={blockonsOptions.pageloader?.fcolor}
										inputType="colorpicker"
										defaultValue="#222"
										onChange={onSettingChange}
									/>
								)}
							</SettingGroup>
						</>
					)}
					<SettingRow
						title={__("Page Scroll Indicator", "blockons")}
						description={__(
							"Add a scroll progress indicator bar to your website.",
							"blockons"
						)}
						inputType="heading"
					/>
					<SettingRow
						title={__("Enable Scroll Indicator", "blockons")}
						slug="scrollindicator_enabled"
						value={blockonsOptions.scrollindicator?.enabled}
						inputType="toggle"
						onChange={onSettingChange}
					/>
					{blockonsOptions.scrollindicator?.enabled && (
						<>
							<SettingRow
								title={__("Show Preview", "blockons")}
								slug="scrollindicator_preview"
								value={showScrollInd}
								inputType="toggle"
								onChange={() => onShowScrollInd((state) => !state)}
							/>

							<SettingRow
								title={__("Position", "blockons")}
								slug="scrollindicator_position"
								value={blockonsOptions.scrollindicator?.position}
								inputType="select"
								options={{
									top: __("Top of Website", "blockons"),
									bottom: __("Bottom of Website", "blockons"),
								}}
								onChange={onSettingChange}
							/>
							<SettingGroup label={__("Edit Scroll Indicator", "blockons")}>
								<SettingRow
									title={__("Height", "blockons")}
									slug="scrollindicator_height"
									value={blockonsOptions.scrollindicator?.height}
									inputType="range"
									defaultValue={6}
									min={1}
									max={20}
									suffix="px"
									onChange={onSettingChange}
								/>
								<SettingRow
									title={__("Has Background", "blockons")}
									slug="scrollindicator_has_bg"
									value={blockonsOptions.scrollindicator?.has_bg}
									inputType="toggle"
									onChange={onSettingChange}
								/>
								{blockonsOptions.scrollindicator?.has_bg && (
									<SettingRow
										title={__("Background Color", "blockons")}
										slug="scrollindicator_bgcolor"
										value={blockonsOptions.scrollindicator?.bgcolor}
										inputType="colorpicker"
										defaultValue="#ebebeb"
										onChange={onSettingChange}
									/>
								)}
								<SettingRow
									title={__("Scroll Indicator Color", "blockons")}
									slug="scrollindicator_color"
									value={blockonsOptions.scrollindicator?.color}
									inputType="colorpicker"
									defaultValue="#AF2DBF"
									onChange={onSettingChange}
								/>
							</SettingGroup>
						</>
					)}
					<SettingRow
						title={__("Back To Top Button", "blockons")}
						description={__(
							"Add a back to top button to your website",
							"blockons"
						)}
						inputType="heading"
					/>
					<SettingRow
						title={__("Enable Back To Top Button", "blockons")}
						slug="bttb_enabled"
						value={blockonsOptions.bttb?.enabled}
						inputType="toggle"
						onChange={onSettingChange}
					/>
					{blockonsOptions.bttb?.enabled && (
						<>
							<SettingRow
								title={__("Show Preview", "blockons")}
								slug="bttb_preview"
								value={showBttb}
								inputType="toggle"
								onChange={() => onShowBttb((state) => !state)}
							/>

							<SettingRow
								title={__("Type", "blockons")}
								slug="bttb_type"
								value={blockonsOptions.bttb?.type}
								inputType="select"
								options={{
									plain: __("Simple Button", "blockons"),
									scroll: __("Scroll Progress", "blockons"),
								}}
								onChange={onSettingChange}
								{...(!isPremium && blockonsOptions.bttb?.type !== "plain"
									? {
											note: __(
												"This is a Blockons Pro feature. Turn the Preview off/on to see this work.",
												"blockons"
											),
									  }
									: {})}
							/>

							{!isPremium && blockonsOptions.bttb?.type === "scroll" && (
								<SettingRow
									inputType="upgrade"
									title={__("Premium 'Back to Top' button", "blockons")}
									description={__(
										"Add a 'Back to Top' button that shows the scroll progress as the users scroll down the page. View the Pro button in the preview.",
										"blockons"
									)}
									upgradeUrl={upgradeUrl}
								/>
							)}

							<SettingRow
								title={__("Position", "blockons")}
								slug="bttb_position"
								value={blockonsOptions.bttb?.position}
								inputType="select"
								options={{
									right: __("Right", "blockons"),
									left: __("Left", "blockons"),
								}}
								onChange={onSettingChange}
							/>

							<SettingGroup label={__("Edit Button", "blockons")}>
								<SettingRow
									title={__("Select Icon", "blockons")}
									slug="bttb_icon"
									value={blockonsOptions.bttb?.icon}
									inputType="select"
									options={{
										"arrow-up": "Arrow Up",
										"circle-up": "Circle Up",
										"caret-up": "Caret Up",
										"chevron-up": "Chevron Up",
										"angles-up": "Angles Up",
										"square-caret-up": "Square Caret Up",
										"up-long": "Up Long",
									}}
									onChange={onSettingChange}
								/>

								<SettingRow
									title={__("Width / Height", "blockons")}
									slug="bttb_size"
									value={blockonsOptions.bttb?.size}
									inputType="range"
									defaultValue={
										blockonsOptions.bttb?.type === "scroll" ? 60 : 45
									}
									min={30}
									max={100}
									suffix="px"
									onChange={onSettingChange}
								/>
								{blockonsOptions.bttb?.type === "plain" && (
									<SettingRow
										title={__("Border Radius", "blockons")}
										slug="bttb_bradius"
										value={blockonsOptions.bttb?.bradius}
										inputType="range"
										defaultValue={4}
										min={0}
										max={blockonsOptions.bttb?.size}
										// step={0.01}
										suffix="px"
										onChange={onSettingChange}
									/>
								)}

								<SettingRow
									title={__("Icon Size", "blockons")}
									slug="bttb_icon_size"
									value={blockonsOptions.bttb?.icon_size}
									inputType="range"
									defaultValue={22}
									min={12}
									max={72}
									// step={0.01}
									suffix="px"
									onChange={onSettingChange}
								/>

								<SettingRow
									title={
										blockonsOptions.bttb?.position === "left"
											? __("Position from Left", "blockons")
											: __("Position from Right", "blockons")
									}
									slug="bttb_side_position"
									value={blockonsOptions.bttb?.side_position}
									inputType="range"
									defaultValue={12}
									min={0}
									max={200}
									suffix="px"
									onChange={onSettingChange}
								/>
								<SettingRow
									title={__("Position from Bottom", "blockons")}
									slug="bttb_bottom_position"
									value={blockonsOptions.bttb?.bottom_position}
									inputType="range"
									defaultValue={12}
									min={0}
									max={200}
									suffix="px"
									onChange={onSettingChange}
								/>
							</SettingGroup>

							<SettingGroup label={__("Edit Button Colors", "blockons")}>
								<SettingRow
									title={__("Has Background", "blockons")}
									slug="bttb_has_bg"
									value={blockonsOptions.bttb?.has_bg}
									inputType="toggle"
									onChange={onSettingChange}
								/>
								{blockonsOptions.bttb?.has_bg && (
									<SettingRow
										title={__("Background Color", "blockons")}
										slug="bttb_bgcolor"
										value={blockonsOptions.bttb?.bgcolor}
										inputType="colorpicker"
										defaultValue="#FFF"
										onChange={onSettingChange}
									/>
								)}
								<SettingRow
									title={__("Icon Color", "blockons")}
									slug="bttb_color"
									value={blockonsOptions.bttb?.color}
									inputType="colorpicker"
									defaultValue="#000"
									onChange={onSettingChange}
								/>
								{blockonsOptions.bttb?.type === "scroll" && (
									<>
										<SettingRow
											title={__("Stroke Color", "blockons")}
											slug="bttb_strcolor"
											value={blockonsOptions.bttb?.strcolor}
											inputType="colorpicker"
											defaultValue="#000"
											onChange={onSettingChange}
										/>
										<SettingRow
											title={__("Stroke Width", "blockons")}
											slug="bttb_strwidth"
											value={blockonsOptions.bttb?.strwidth}
											inputType="range"
											defaultValue={2}
											min={1}
											max={6}
											suffix="px"
											onChange={onSettingChange}
										/>
									</>
								)}
							</SettingGroup>
						</>
					)}
					<SettingRow
						title={__("Site By Credit", "blockons")}
						description={__(
							"Add a 'Site By' linkback to this website.",
							"blockons"
						)}
						inputType="heading"
					/>
					<SettingRow
						title={__("Enable 'Site By'", "blockons")}
						slug="siteby_enabled"
						value={blockonsOptions.siteby?.enabled}
						inputType="toggle"
						onChange={onSettingChange}
					/>

					{blockonsOptions.siteby?.enabled && (
						<>
							<SettingRow
								title={__("Show Preview", "blockons")}
								slug="siteby_preview"
								value={showSiteBy}
								inputType="toggle"
								onChange={() => onShowSiteBy((state) => !state)}
							/>

							<SettingGroup label={__("Edit 'Site By'", "blockons")}>
								<SettingRow
									title={__("Position", "blockons")}
									slug="siteby_position"
									value={blockonsOptions.siteby?.position}
									inputType="select"
									options={{
										right: __("Bottom Right Icon", "blockons"),
										left: __("Bottom Left Icon", "blockons"),
										bottom: __("Bottom of Website", "blockons"),
									}}
									onChange={onSettingChange}
								/>

								{blockonsOptions.siteby?.position !== "bottom" && (
									<>
										<SettingRow
											title={__("Icon", "blockons")}
											slug="siteby_icon"
											value={blockonsOptions.siteby?.icon}
											inputType="select"
											options={{
												"fa-link": __("Link Icon", "blockons"),
												"fa-up-right-from-square": __("Arrow Icon", "blockons"),
												"fa-palette": __("Design", "blockons"),
												"fa-pen-nib": __("Pen Nib", "blockons"),
												"fa-pen-clip": __("Pen Clip", "blockons"),
												"fa-pen-to-square": __("Pen Square", "blockons"),
												"fa-cubes": __("Cubes", "blockons"),
												"fa-heart": __("Heart", "blockons"),
												custom: __("Custom Icon", "blockons"),
											}}
											onChange={onSettingChange}
										/>
										{blockonsOptions.siteby?.icon === "custom" && (
											<SettingRow
												title={__("Custom Icon", "blockons")}
												slug="siteby_cicon"
												value={blockonsOptions.siteby?.cicon}
												placeholder={__("fa-leaf", "blockons")}
												inputType="text"
												onChange={onSettingChange}
											/>
										)}
									</>
								)}
								<SettingRow
									title={__("Text", "blockons")}
									slug="siteby_text"
									value={blockonsOptions.siteby?.text}
									placeholder={__("Site By Blockons", "blockons")}
									inputType="textarea"
									onChange={onSettingChange}
									note={__(
										"to add a link, use: (blockons[*https://blockons.com/])",
										"blockons"
									)}
								/>
								{blockonsOptions.siteby?.position !== "bottom" && (
									<>
										<SettingRow
											title={__("Size", "blockons")}
											slug="siteby_size"
											value={blockonsOptions.siteby?.size}
											inputType="range"
											defaultValue={30}
											min={15}
											max={80}
											suffix="px"
											onChange={onSettingChange}
										/>
										<SettingRow
											title={__("Icon Size", "blockons")}
											slug="siteby_iconsize"
											value={blockonsOptions.siteby?.iconsize}
											inputType="range"
											defaultValue={16}
											min={10}
											max={60}
											suffix="px"
											onChange={onSettingChange}
										/>

										<SettingRow
											title={__("Icon Background Color", "blockons")}
											slug="siteby_iconbgcolor"
											value={blockonsOptions.siteby?.iconbgcolor}
											inputType="colorpicker"
											defaultValue="#ffffff"
											onChange={onSettingChange}
										/>
										<SettingRow
											title={__("Icon Color", "blockons")}
											slug="siteby_iconcolor"
											value={blockonsOptions.siteby?.iconcolor}
											inputType="colorpicker"
											defaultValue="#444444"
											onChange={onSettingChange}
										/>

										<SettingRow
											title={__("Background Color", "blockons")}
											slug="siteby_bgcolor"
											value={blockonsOptions.siteby?.bgcolor}
											inputType="colorpicker"
											defaultValue="#ffffff"
											onChange={onSettingChange}
										/>
										<SettingRow
											title={__("Color", "blockons")}
											slug="siteby_color"
											value={blockonsOptions.siteby?.color}
											inputType="colorpicker"
											defaultValue="#444444"
											onChange={onSettingChange}
										/>
									</>
								)}
							</SettingGroup>
						</>
					)}
				</tbody>
			</table>

			<div className="blockons-more">
				{__("More Add-Ons Coming Soon...", "blockons")}
			</div>
			<p className="center">
				{__(
					"Get in touch and let us know which add-ons you need for your site.",
					"blockons"
				)}
			</p>
		</React.Fragment>
	);
};

export default SiteAddons;
