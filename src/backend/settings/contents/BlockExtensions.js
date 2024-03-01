import React from "react";
import { __ } from "@wordpress/i18n";
import SettingHeader from "../components/SettingHeader";
import SettingRow from "../components/SettingRow";

const BlockExtensions = ({ blockonsOptions, handleSettingChange }) => {
	const onSettingChange = (e) => {
		handleSettingChange(e);
	};

	return (
		<React.Fragment>
			<SettingHeader
				title={__("Blockons Block Extensions", "blockons")}
				description={__(
					"Adding or extending the functionality of your website editor blocks",
					"blockons"
				)}
			/>

			<table className="form-table" role="presentation">
				<tbody>
					<SettingRow
						title={__("Tooltips", "blockons")}
						description={__(
							"Add a tooltip to core paragraph and heading blocks anywhere within in the editor.",
							"blockons"
						)}
						inputType="heading"
					/>
					<SettingRow
						title={__("Enable Tooltips", "blockons")}
						slug="tooltips_enabled"
						value={blockonsOptions.tooltips?.enabled}
						inputType="toggle"
						onChange={onSettingChange}
					/>
					{blockonsOptions.tooltips?.enabled && (
						<>
							<SettingRow
								title={__("Tooltip Theme", "blockons")}
								slug="tooltips_theme"
								value={blockonsOptions.tooltips?.theme}
								inputType="select"
								options={{
									one: "Dark",
									two: "Light",
								}}
								onChange={onSettingChange}
							/>
						</>
					)}

					<SettingRow
						title={__("Block Visibility", "blockons")}
						description={__(
							"Add Blockons Visibility settings to certain blocks and select to show or hide the editor blocks per device - Desktop, Tablet & Mobile. Blocks Visibility is available on layout blocks such as Group, Columns, and Cover blocks.",
							"blockons"
						)}
						inputType="heading"
					/>
					<SettingRow
						title={__("Enable Block Visibility", "blockons")}
						slug="blockvisibility_enabled"
						value={blockonsOptions.blockvisibility?.enabled}
						inputType="toggle"
						onChange={onSettingChange}
					/>
					{blockonsOptions.blockvisibility?.enabled && (
						<>
							<SettingRow
								title={__("Tablet Breakpoint")}
								slug="blockvisibility_tablet"
								value={blockonsOptions.blockvisibility?.tablet}
								placeholder="980"
								inputType="number"
								onChange={onSettingChange}
								suffix="px"
							/>
							<SettingRow
								title={__("Mobile Breakpoint")}
								slug="blockvisibility_mobile"
								value={blockonsOptions.blockvisibility?.mobile}
								placeholder="767"
								inputType="number"
								onChange={onSettingChange}
								suffix="px"
							/>
						</>
					)}

					<SettingRow
						title={__("Block Animations", "blockons")}
						description={__(
							"Add Scroll Animations to certain blocks so they animate into screen when scrolling on the page. Block Animations are available on layout blocks and certain elements such as Group blocks, Columns, and Heading blocks.",
							"blockons"
						)}
						inputType="heading"
					/>
					<SettingRow
						title={__("Enable Block Animations", "blockons")}
						slug="blockanimation_enabled"
						value={blockonsOptions.blockanimation?.enabled}
						inputType="toggle"
						onChange={onSettingChange}
					/>
					{blockonsOptions.blockanimation?.enabled && (
						<>
							<SettingRow
								title={__("Style", "blockons")}
								slug="blockanimation_default_style"
								value={blockonsOptions.blockanimation?.default_style}
								inputType="select"
								options={{
									fade: "Fade",
									slide: "Slide",
									flip: "Flip",
									"zoom-in": "Zoom In",
									"zoom-out": "Zoom Out",
								}}
								onChange={onSettingChange}
							/>
							<SettingRow
								title={__("Direction", "blockons")}
								slug="blockanimation_default_direction"
								value={blockonsOptions.blockanimation?.default_direction}
								inputType="select"
								options={{
									"-up": "Up",
									"-down": "Down",
									"-left": "Left",
									"-right": "Right",
								}}
								onChange={onSettingChange}
							/>
							<SettingRow
								title={__("Duration", "blockons")}
								slug="blockanimation_default_duration"
								value={blockonsOptions.blockanimation?.default_duration}
								inputType="range"
								defaultValue={850}
								min={50}
								max={4000}
								suffix="px"
								onChange={onSettingChange}
							/>
							<SettingRow
								title={__("Delay", "blockons")}
								slug="blockanimation_default_delay"
								value={blockonsOptions.blockanimation?.default_delay}
								inputType="range"
								defaultValue={50}
								min={50}
								max={4000}
								suffix="px"
								onChange={onSettingChange}
							/>
							<SettingRow
								title={__("Offset", "blockons")}
								slug="blockanimation_default_offset"
								value={blockonsOptions.blockanimation?.default_offset}
								inputType="range"
								defaultValue={80}
								min={50}
								max={1000}
								suffix="px"
								onChange={onSettingChange}
							/>
							<SettingRow
								title={__("Animate Once", "blockons")}
								slug="blockanimation_default_animate_once"
								value={blockonsOptions.blockanimation?.default_animate_once}
								inputType="toggle"
								onChange={onSettingChange}
							/>
							<SettingRow
								title={__("Mirror Animations", "blockons")}
								slug="blockanimation_default_mirror"
								value={blockonsOptions.blockanimation?.default_mirror}
								inputType="toggle"
								onChange={onSettingChange}
							/>
						</>
					)}
				</tbody>
			</table>
		</React.Fragment>
	);
};

export default BlockExtensions;
