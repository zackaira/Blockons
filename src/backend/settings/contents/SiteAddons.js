import React from "react";
import { __ } from "@wordpress/i18n";
import SettingHeader from "../components/SettingHeader";
import SettingRow from "../components/SettingRow";
import SettingGroup from "../components/SettingGroup";

const SiteAddons = ({
	blockonsOptions,
	handleSettingChange,
	isPremium,
	showPageLoader,
	setShowPageLoader,
	showBttb,
	setShowBttb,
	showScrollInd,
	setShowScrollInd,
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
									one: "Dual Ring Spinner",
									// two: "Loading Bars",
									// three: "Circular Ripple",
									// four: "Loading Ring Spinner",
									// five: "Clock Spinner",
									// six: "Circle Roller",
								}}
								onChange={onSettingChange}
								note={__("More Coming Soon", "blockons")}
							/>
							{!isPremium && blockonsOptions.pageloader?.style !== "one" && (
								<SettingRow
									title={__("Premium Feature", "blockons")}
									desc={__(
										"Change the loader style. The Dual Ring Spinner is the default and the other spinners are only available in Blockons Pro.",
										"blockons"
									)}
									inputType="pronote"
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
											title={__("Text")}
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
									// scroll: __("Scroll Progress", "blockons"),
								}}
								onChange={onSettingChange}
								note={__("More Coming Soon", "blockons")}
							/>

							{!isPremium && blockonsOptions.bttb?.type === "scroll" && (
								<SettingRow
									title={__("Premium Feature", "blockons")}
									desc={__(
										"This will add a Back To Top button with a Scroll Progress Indicator, visually showing the user how far they have scrolled on the page. This feature is only available in Blockons Pro.",
										"blockons"
									)}
									inputType="pronote"
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