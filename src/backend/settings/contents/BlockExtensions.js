import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import SettingHeader from "../components/SettingHeader";
import SettingRow from "../components/SettingRow";
import SettingNote from "../components/UI/SettingNote";
import TestProduct from "./_components/TestProduct";

const BlockExtensions = ({
	blockonsOptions,
	upgradeUrl,
	isPremium,
	handleSettingChange,
	wcActive,
}) => {
	const [tooltipsPro, setTooltipsPro] = useState(false);
	const [imgPopupsPro, setImgPopupsPro] = useState(false);
	const [visibilityPro, setVisibilityPro] = useState(false);
	const [animationsPro, setAnimationsPro] = useState(false);

	const [quickviewPreview, setQuickviewPreview] = useState(false);

	const onSettingChange = (e) => {
		handleSettingChange(e);
	};

	return (
		<>
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
						title={__("Content Tooltips", "blockons")}
						description={__(
							"Add content tooltips to core paragraph and heading blocks anywhere within in the editor.",
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
						tooltip={__(
							"Enhance your website with informative tooltips! Tooltips act like regular links, but when users hover over the link text, a simple popup appears with more information or help.",
							"blockons"
						)}
						documentation="https://blockons.com/documentation/content-tooltips/"
					/>

					{blockonsOptions.tooltips?.enabled && (
						<>
							{isPremium ? (
								<>
									<SettingRow
										title={__("Tooltips Link Style", "blockons")}
										slug="tooltips_style"
										value={blockonsOptions.tooltips?.style}
										inputType="select"
										options={{
											underlined: "Underlined",
											dashed: "Underline Dashed",
											highlight: "Highlighted",
										}}
										onChange={onSettingChange}
									/>

									<SettingRow
										title={__("Tooltips Popup Theme", "blockons")}
										slug="tooltips_theme"
										value={blockonsOptions.tooltips?.theme}
										inputType="select"
										options={{
											one: "Dark",
											two: "Light",
										}}
										onChange={onSettingChange}
									/>

									<SettingRow
										title={__("Tooltip Color", "blockons")}
										slug="tooltips_color"
										value={blockonsOptions.tooltips?.color}
										inputType="colorpicker"
										defaultValue="#424242"
										onChange={onSettingChange}
									/>
									<SettingRow
										title={__("Tooltip Font Color", "blockons")}
										slug="tooltips_fcolor"
										value={blockonsOptions.tooltips?.fcolor}
										inputType="colorpicker"
										defaultValue="#000"
										onChange={onSettingChange}
									/>

									<SettingRow
										title={__("Popup Color", "blockons")}
										slug="tooltips_pcolor"
										value={blockonsOptions.tooltips?.pcolor}
										inputType="colorpicker"
										defaultValue="#424242"
										onChange={onSettingChange}
									/>
									<SettingRow
										title={__("Popup Font Color", "blockons")}
										slug="tooltips_pfcolor"
										value={blockonsOptions.tooltips?.pfcolor}
										inputType="colorpicker"
										defaultValue="#FFF"
										onChange={onSettingChange}
									/>
								</>
							) : (
								<>
									<SettingNote
										note={__(
											"Tooltips are now enabled. Create content tooltips within core Heading and Paragraph blocks.",
											"blockons"
										)}
									/>
									<SettingRow
										title={__("Premium Tooltips", "blockons")}
										inputType="toggle"
										slug="tooltips_pro"
										value={tooltipsPro}
										onChange={() => setTooltipsPro(!tooltipsPro)}
										// documentation="https://blockons/documentation/tooltips"
									/>
									{tooltipsPro && (
										<SettingRow
											inputType="upgrade"
											title={__("Premium Tooltips", "blockons")}
											description={__(
												"Upgrade to Blockons Pro to add premium tooltips.",
												"blockons"
											)}
											upgradeUrl={upgradeUrl}
											proFeatures={[
												__(
													"Select between Light & Dark tooltip themes",
													"blockons"
												),
												__(
													"Add custom links into your Tooltip text",
													"blockons"
												),
												__("Select from different tooltip styles", "blockons"),
												__("More features coming soon", "blockons"),
											]}
										/>
									)}
								</>
							)}
						</>
					)}

					<SettingRow
						title={__("Image Lightbox", "blockons")}
						description={__(
							"Add image popups to your website images and galleries.",
							"blockons"
						)}
						inputType="heading"
					/>
					<SettingRow
						title={__("Enable Image Lightbox", "blockons")}
						slug="imagepopups_enabled"
						value={blockonsOptions.imagepopups?.enabled}
						inputType="toggle"
						onChange={onSettingChange}
						tooltip={__(
							"Add image lightboxes to your website images for an engaging user experience. Image lightbox popups allow users to view enlarged versions of images with a simple click.",
							"blockons"
						)}
						documentation="https://blockons.com/documentation/image-lightbox-popups/"
					/>
					{!isPremium && blockonsOptions.imagepopups?.enabled && (
						<SettingNote
							note={__(
								"Image Lightbox is now enabled. Create image popups within core Image and Gallery blocks.",
								"blockons"
							)}
						/>
					)}

					{blockonsOptions.imagepopups?.enabled && (
						<>
							<SettingRow
								title={__("Enable on ALL images", "blockons")}
								slug="imagepopups_enable_all"
								value={blockonsOptions.imagepopups?.enable_all}
								inputType="toggle"
								onChange={onSettingChange}
								tooltip={__(
									"This will add a lightbox to ALL images within the content area. Excluding header & footer images.",
									"blockons"
								)}
							/>
							
							{isPremium ? (
								<>
									{blockonsOptions.imagepopups?.enable_all && (
										<>
											<SettingRow
												title={__("Icon", "blockons")}
												slug="imagepopups_icon"
												value={blockonsOptions.imagepopups?.icon}
												inputType="select"
												options={{
													one: "Magnifying Glass",
													two: "Expand",
													three: "Diagonal Arrows",
													four: "Maximize",
													five: "Plus",
													six: "Cross Arrows",
												}}
												onChange={onSettingChange}
											/>
											<SettingRow
												title={__("Icon Position", "blockons")}
												slug="imagepopups_iconpos"
												value={blockonsOptions.imagepopups?.iconpos}
												inputType="select"
												options={{
													topleft: "Top Left",
													topright: "Top Right",
													bottomleft: "Bottom Left",
													bottomright: "Bottom Right",
													center: "Center Center",
												}}
												onChange={onSettingChange}
											/>
											<SettingRow
												title={__("Icon Color", "blockons")}
												slug="imagepopups_iconcolor"
												value={blockonsOptions.imagepopups?.iconcolor}
												inputType="select"
												options={{
													dark: "Dark",
													light: "Light",
												}}
												onChange={onSettingChange}
											/>

											<SettingRow
												title={__("Lightbox Color Theme", "blockons")}
												slug="imagepopups_popuptheme"
												value={blockonsOptions.imagepopups?.popuptheme}
												inputType="select"
												options={{
													dark: "Dark",
													light: "Light",
												}}
												onChange={onSettingChange}
											/>
										</>
									)}
								</>
							) : (
								<>
									<SettingRow
										title={__("Premium Image Lightbox", "blockons")}
										inputType="toggle"
										slug="imagepopups_pro"
										value={imgPopupsPro}
										onChange={() => setImgPopupsPro(!imgPopupsPro)}
										// documentation="https://blockons/documentation/image-popups"
									/>
									{imgPopupsPro && (
										<SettingRow
											inputType="upgrade"
											title={__("Premium Image Lightbox", "blockons")}
											description={__(
												"Upgrade to Blockons Pro to add premium Image Lightboxes.",
												"blockons"
											)}
											upgradeUrl={upgradeUrl}
											proFeatures={[
												__(
													"Customize lightbox styles to suit your website.",
													"blockons"
												),
												__(
													"Select between light & dark lightbox & icon themes.",
													"blockons"
												),
												__("Edit icon design, colors & position", "blockons"),
												__(
													"Enable Lightbox popups for Advanced Image Gallery block",
													"blockons"
												),
											]}
										/>
									)}
								</>
							)}
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

					{isPremium ? (
						<>
							<SettingRow
								title={__("Enable Block Visibility", "blockons")}
								slug="blockvisibility_enabled"
								value={blockonsOptions.blockvisibility?.enabled}
								inputType="toggle"
								onChange={onSettingChange}
								tooltip={__(
									"Add image visibility settings to your core layout blocks. This add on the features to show or hide certain elements depending on the user device screen size.",
									"blockons"
								)}
								documentation="https://blockons.com/documentation/block-visibility-per-device/"
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
						</>
					) : (
						<>
							<SettingRow
								title={__("Enable Block Visibility", "blockons")}
								inputType="toggle"
								slug="visibility_pro"
								value={visibilityPro}
								onChange={() => setVisibilityPro(!visibilityPro)}
								documentation="https://blockons.com/documentation/block-visibility-per-device/"
							/>
							{visibilityPro && (
								<SettingRow
									inputType="upgrade"
									title={__("Add Block Visibility", "blockons")}
									description={__(
										"Upgrade to Blockons Pro to add premium block visibility to editor layout blocks.",
										"blockons"
									)}
									upgradeUrl={upgradeUrl}
									proFeatures={[
										__("Show / Hide Blocks per screen size", "blockons"),
										__("Set Tablet Breakpoint", "blockons"),
										__("Set Mobile Breakpoint", "blockons"),
									]}
								/>
							)}
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

					{isPremium ? (
						<>
							<SettingRow
								title={__("Enable Block Animations", "blockons")}
								slug="blockanimation_enabled"
								value={blockonsOptions.blockanimation?.enabled}
								inputType="toggle"
								onChange={onSettingChange}
								tooltip={__(
									"Add neat scroll in and/or out animations to core layout blocks. This boosts the visual appeal of your website and makes it more engaging for users.",
									"blockons"
								)}
								documentation="https://blockons.com/documentation/block-animations-on-scroll/"
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
						</>
					) : (
						<>
							<SettingRow
								title={__("Enable Block Animations", "blockons")}
								inputType="toggle"
								slug="animations_pro"
								value={animationsPro}
								onChange={() => setAnimationsPro(!animationsPro)}
								tooltip={__(
									"Add neat scroll in and/or out animations to core layout blocks. This boosts the visual appeal of your website and makes it more engaging for users.",
									"blockons"
								)}
								documentation="https://blockons.com/documentation/block-animations-on-scroll/"
							/>
							{animationsPro && (
								<SettingRow
									inputType="upgrade"
									title={__("Add Block Animations", "blockons")}
									description={__(
										"Upgrade to Blockons Pro to add premium block animations to editor layout blocks.",
										"blockons"
									)}
									upgradeUrl={upgradeUrl}
									proFeatures={[
										__("Add Scroll Animations to Layout Blocks", "blockons"),
										__("Edit block animation style", "blockons"),
										__(
											"Set animation Direction, Duration & Delay & Offset",
											"blockons"
										),
										__(
											"Select if animations play once off or mirror animations in and out of screen",
											"blockons"
										),
									]}
								/>
							)}
						</>
					)}
				</tbody>
			</table>

			{wcActive && (
				<>
					<SettingHeader
						title={__("Blockons WooCommerce Block Extensions", "blockons")}
						description={__(
							"Adding or extending the functionality of your WooCommerce editor blocks",
							"blockons"
						)}
						topSpace={60}
					/>

					<table className="form-table" role="presentation">
						<tbody>
							<SettingRow
								title={__("Product Quick View", "blockons")}
								description={__(
									"Add Product Quick View popups to the WooCommerce core product blocks, letting users view all product details without leaving the page.",
									"blockons"
								)}
								inputType="heading"
							/>
							<SettingRow
								title={__("Enable Product Quick View", "blockons")}
								slug="quickview_enabled"
								value={blockonsOptions.quickview?.enabled}
								inputType="toggle"
								onChange={onSettingChange}
								tooltip={__(
									"This will add Product Quick View settings to the WooCommerce core product blocks in the Editor.",
									"blockons"
								)}
								documentation="#"
							/>

							{blockonsOptions.quickview?.enabled && (
								<>
									<SettingRow
										title={__("Quick View Preview", "blockons")}
										slug="quickview_preview"
										value={quickviewPreview}
										inputType="toggle"
										onChange={() => setQuickviewPreview(!quickviewPreview)}
									/>

									{isPremium ? (
										<>
											<SettingRow
												title={__("Quick View Position", "blockons")}
												slug="quickview_position"
												value={blockonsOptions.quickview?.position}
												inputType="select"
												options={{
													one: __("Default Button", "blockons"),
													two: __("Plain Text", "blockons"),
													three: __("Over Image", "blockons"),
													// four: __("Over Image Icon", "blockons"),
												}}
												onChange={onSettingChange}
											/>
											<SettingRow
												title={__("Button Text", "blockons")}
												slug="quickview_text"
												value={blockonsOptions.quickview?.text}
												placeholder={__("Quick View", "blockons")}
												inputType="text"
												onChange={onSettingChange}
											/>
										</>
									) : (
										<SettingRow
											inputType="upgrade"
											title={__("Quick View for WooCommerce", "blockons")}
											description={__(
												"Upgrade to Blockons Pro to add quick view you your WooCommerce products.",
												"blockons"
											)}
											upgradeUrl={upgradeUrl}
											proFeatures={[
												__(
													"Boost Conversions & keep your shoppers engaged",
													"blockons"
												),
												__(
													"View products in a popup without leaving the shop page",
													"blockons"
												),
												__("Fully Customizable Popup Design", "blockons"),
											]}
										/>
									)}
								</>
							)}
						</tbody>
					</table>
				</>
			)}

			{blockonsOptions.quickview?.enabled && quickviewPreview && (
				<TestProduct settings={blockonsOptions?.quickview} />
			)}
		</>
	);
};

export default BlockExtensions;
