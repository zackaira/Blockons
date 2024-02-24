// Localized JS object - blockonsObj
import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import axios from "axios";
import SettingRow from "../components/SettingRow";
import SettingGroup from "../components/SettingGroup";
import SettingBlock from "../components/SettingBlock";
import SettingHeader from "../components/SettingHeader";
import GiveFeedback from "../components/GiveFeedback";
import InfoTab from "../InfoTab";
import Loader from "../Loader";
import { blockonsGroupSettings, blockListSettings } from "../helpers";
import PageLoader from "../../frontend/site-addons/pageloader/PageLoader";
import BackToTop from "../../frontend/site-addons/backtotop/BackToTop";
import ScrollIndicator from "../../frontend/site-addons/scrollindicator/ScrollIndicator";

const SettingsPage = () => {
	const blockonsObject = blockonsObj;
	const url = `${blockonsObject.apiUrl}blcns/v1`;
	const [loader, setLoader] = useState(false);
	const [loadSetting, setLoadSetting] = useState(true);
	const isPremium = Boolean(blockonsObject.isPremium);
	const wcActive = Boolean(blockonsObject.wcActive);
	const defaults = blockonsObject.blockonsDefaults;

	const [showPageLoaderPreview, setShowPageLoaderPreview] = useState(false);
	const [showBttbPreview, setShowBttbPreview] = useState(false);
	const [showScrollIndPreview, setShowScrollIndPreview] = useState(false);

	const [blockonsOptions, setBlockonsOptions] = useState({});

	// setState dynamically for each setting
	const handleChange = ({
		target: { type, checked, name, value, className },
	}) => {
		if (
			type === "checkbox" &&
			(className === "checkbox-single" ||
				className === "toggle-switch-checkbox")
		)
			value = checked;

		const settingGroup = name.substring(0, name.indexOf("_")); // Splits by the first _ and saves that as the group name
		const settingName = name.substring(name.indexOf("_") + 1); // Setting name within group, anything after the first _

		const groupKey = settingGroup === "global" ? name.substring(7) : name;

		setBlockonsOptions({
			...blockonsOptions,
			...(!settingGroup || settingGroup === "global" // sn_ name gets saved as default / in no group
				? { [groupKey]: value }
				: {
						[settingGroup]: {
							...blockonsOptions[settingGroup],
							[settingName]: value,
						},
				  }),
		});
	};

	console.log(blockonsOptions);

	useEffect(() => {
		blockonsGroupSettings();
	}, [blockonsOptions]);

	// Submit form
	const handleSubmit = (e) => {
		e.preventDefault();
		setLoader(true);

		axios
			.post(
				url + "/settings",
				{
					blockonsOptions: JSON.stringify(blockonsOptions),
				},
				{
					// Add Nonce to prevent this working elsewhere
					headers: {
						"content-type": "application/json",
						"X-WP-NONCE": blockonsObject.nonce,
					},
				}
			)
			.then((res) => {
				// console.log(res);
				// const blockonsOptions = JSON.parse(res.data.blockonsOptions);
				setLoader(false);
			});
	};

	const confirmDelete = (e) => {
		const deleteBtn = document.getElementsByClassName("blockons-delete");
		deleteBtn[0].classList.add("show-confirm");
		setTimeout(function () {
			deleteBtn[0].classList.remove("show-confirm");
		}, 2500);
	};

	const handleDeleteOptions = (e) => {
		e.preventDefault();
		if (
			window.confirm(
				__("Are you sure you want to delete all settings?", "blockons")
			)
		) {
			setLoader(true);
			setLoadSetting(true);
			axios
				.delete(url + "/delete", {
					headers: {
						"X-WP-NONCE": blockonsObject.nonce,
					},
				})
				.then((res) => {
					setLoader(false);
					location.reload();
				});
		}
	};

	// Get Settings from db
	useEffect(() => {
		axios
			.get(url + "/settings")
			.then((res) => {
				const blockonsOptions = res.data
					? JSON.parse(res.data)
					: console.log("Blockons Options Empty");

				// setState dynamically for all settings
				if (blockonsOptions) {
					for (const key in blockonsOptions) {
						setBlockonsOptions((prevState) => ({
							...prevState,
							[key]: blockonsOptions[key] ? blockonsOptions[key] : "",
						}));
					}
				} else {
					setBlockonsOptions(defaults); // Set settings to defaults if not found
					// document.querySelector(".blockonsSaveBtn").click();
				}
				// console.log(blockonsOptions);
			})
			.then(() => {
				setLoadSetting(false);
			});
	}, []);

	return (
		<React.Fragment>
			<div className="blockons-settings">
				<div className="blockonsSettingBar">
					<h2>{"Blockons Settings"}</h2>
					<div className="blockonsSettingBarOptions">
						<a
							href={blockonsObject.accountUrl}
							className="blockons-account"
							title={__("My Account", "blockons")}
						></a>
						<a
							href="https://blockons.com/support/"
							className="blockons-docs"
							title={__("Documentation", "blockons")}
							target="_blank"
						></a>
					</div>
				</div>

				{Object.keys(blockonsOptions).length > 0 &&
					!blockonsOptions.disablerating && (
						<GiveFeedback
							blockonsOptions={blockonsOptions}
							clickClose={handleChange}
						/>
					)}

				<div className="blockons-settings-content">
					<form id="blockons-settings-form" onSubmit={(e) => handleSubmit(e)}>
						<div className="blockons-tabs">
							<ul>
								<li>
									<a id="blockonstab-1" className="blockons-tab active">
										{__("Blocks", "blockons")}
									</a>
								</li>
								{isPremium && (
									<li>
										<a id="blockonstab-2" className="blockons-tab">
											{__("Block Extensions", "blockons")}
										</a>
									</li>
								)}
								<li>
									<a id="blockonstab-3" className="blockons-tab">
										{__("Site Addons", "blockons")}
									</a>
								</li>

								{isPremium && wcActive && (
									<li>
										<a id="blockonstab-4" className="blockons-tab">
											{__("WooCommerce Addons", "blockons")}
										</a>
									</li>
								)}

								<li className="help">
									<a id="blockonstab-help" className="blockons-tab">
										{__("Welcome", "blockons")}
									</a>
								</li>
							</ul>

							<div className="blockons-content-wrap">
								<div className="blockons-content-wrap-inner">
									{(loadSetting || loader) && <Loader />}
									<div
										id="blockons-content-1"
										className="blockons-content active"
									>
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
															blockListSettings[key]
																? blockListSettings[key].desc
																: ""
														}
														onChange={handleChange}
														pluginSpecific={
															blockListSettings[key]
																? blockListSettings[key].pluginSpecific
																: false
														}
														{...(blockListSettings[key] &&
														blockListSettings[key].pluginSpecific ===
															"WooCommerce" &&
														!wcActive
															? { disable: true }
															: "")}
														isNew={
															blockListSettings[key]
																? blockListSettings[key].isNew
																: false
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
									</div>

									{isPremium && (
										<div id="blockons-content-2" className="blockons-content">
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
														title={__("Block Visibility", "blockons")}
														description={__(
															"Add a Blockons Visibility settings panel to each block and select to show or hide any blocks per device - Desktop, Tablet & Mobile",
															"blockons"
														)}
														inputType="heading"
													/>
													<SettingRow
														title={__("Enable Block Visibility", "blockons")}
														slug="blockvisibility_enabled"
														value={blockonsOptions.blockvisibility?.enabled}
														inputType="toggle"
														onChange={handleChange}
													/>
													{blockonsOptions.blockvisibility?.enabled && (
														<>
															<SettingRow
																title={__("Tablet Breakpoint")}
																slug="blockvisibility_tablet"
																value={blockonsOptions.blockvisibility?.tablet}
																placeholder="980"
																inputType="number"
																onChange={handleChange}
																suffix="px"
															/>
															<SettingRow
																title={__("Mobile Breakpoint")}
																slug="blockvisibility_mobile"
																value={blockonsOptions.blockvisibility?.mobile}
																placeholder="767"
																inputType="number"
																onChange={handleChange}
																suffix="px"
															/>
														</>
													)}

													<SettingRow
														title={__("Block Animations", "blockons")}
														description={__(
															"Animate your blocks as they appear on screen when scrolling down the page",
															"blockons"
														)}
														inputType="heading"
													/>
													<SettingRow
														title={__("Enable Block Animations", "blockons")}
														slug="blockanimation_enabled"
														value={blockonsOptions.blockanimation?.enabled}
														inputType="toggle"
														onChange={handleChange}
													/>
													{blockonsOptions.blockanimation?.enabled && (
														<>
															<SettingRow
																title={__("Style", "blockons")}
																slug="blockanimation_default_style"
																value={
																	blockonsOptions.blockanimation?.default_style
																}
																inputType="select"
																options={{
																	fade: "Fade",
																	slide: "Slide",
																	flip: "Flip",
																	"zoom-in": "Zoom In",
																	"zoom-out": "Zoom Out",
																}}
																onChange={handleChange}
															/>
															<SettingRow
																title={__("Direction", "blockons")}
																slug="blockanimation_default_direction"
																value={
																	blockonsOptions.blockanimation
																		?.default_direction
																}
																inputType="select"
																options={{
																	"-up": "Up",
																	"-down": "Down",
																	"-left": "Left",
																	"-right": "Right",
																}}
																onChange={handleChange}
															/>
															<SettingRow
																title={__("Duration", "blockons")}
																slug="blockanimation_default_duration"
																value={
																	blockonsOptions.blockanimation
																		?.default_duration
																}
																inputType="range"
																defaultValue={850}
																min={50}
																max={4000}
																suffix="px"
																onChange={handleChange}
															/>
															<SettingRow
																title={__("Delay", "blockons")}
																slug="blockanimation_default_delay"
																value={
																	blockonsOptions.blockanimation?.default_delay
																}
																inputType="range"
																defaultValue={50}
																min={50}
																max={4000}
																suffix="px"
																onChange={handleChange}
															/>
															<SettingRow
																title={__("Offset", "blockons")}
																slug="blockanimation_default_offset"
																value={
																	blockonsOptions.blockanimation?.default_offset
																}
																inputType="range"
																defaultValue={80}
																min={50}
																max={1000}
																suffix="px"
																onChange={handleChange}
															/>
															<SettingRow
																title={__("Animate Once", "blockons")}
																slug="blockanimation_default_animate_once"
																value={
																	blockonsOptions.blockanimation
																		?.default_animate_once
																}
																inputType="toggle"
																onChange={handleChange}
															/>
															<SettingRow
																title={__("Mirror Animations", "blockons")}
																slug="blockanimation_default_mirror"
																value={
																	blockonsOptions.blockanimation?.default_mirror
																}
																inputType="toggle"
																onChange={handleChange}
															/>
														</>
													)}
												</tbody>
											</table>
										</div>
									)}

									<div id="blockons-content-3" className="blockons-content">
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
													onChange={handleChange}
												/>

												{blockonsOptions.pageloader?.enabled && (
													<>
														<SettingRow
															title={__("Show Preview", "blockons")}
															slug="pageloader_preview"
															value={showPageLoaderPreview}
															inputType="toggle"
															onChange={() =>
																setShowPageLoaderPreview((state) => !state)
															}
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
															onChange={handleChange}
															note={__("More Coming Soon", "blockons")}
														/>
														{!isPremium &&
															blockonsOptions.pageloader?.style !== "one" && (
																<SettingRow
																	title={__("Premium Feature", "blockons")}
																	desc={__(
																		"Change the loader style. The Dual Ring Spinner is the default and the other spinners are only available in Blockons Pro.",
																		"blockons"
																	)}
																	inputType="pronote"
																/>
															)}

														<SettingGroup
															label={__("Edit Page Loader", "blockons")}
														>
															<SettingRow
																title={__("Add Loading Text", "blockons")}
																slug="pageloader_has_text"
																value={blockonsOptions.pageloader?.has_text}
																inputType="toggle"
																onChange={handleChange}
															/>
															{blockonsOptions.pageloader?.has_text && (
																<>
																	<SettingRow
																		title={__("Text")}
																		slug="pageloader_text"
																		value={blockonsOptions.pageloader?.text}
																		placeholder={__(
																			"Loading Website...",
																			"blockons"
																		)}
																		inputType="text"
																		onChange={handleChange}
																	/>
																	<SettingRow
																		title={__("Position", "blockons")}
																		slug="pageloader_text_position"
																		value={
																			blockonsOptions.pageloader?.text_position
																		}
																		inputType="select"
																		options={{
																			one: __("Top Center", "blockons"),
																			two: __("Bottom Center", "blockons"),
																			three: __("Above Loader", "blockons"),
																			four: __("Below Loader", "blockons"),
																		}}
																		onChange={handleChange}
																	/>
																</>
															)}
															<SettingRow
																title={__("Background Color", "blockons")}
																slug="pageloader_bgcolor"
																value={blockonsOptions.pageloader?.bgcolor}
																inputType="colorpicker"
																defaultValue="#FFF"
																onChange={handleChange}
															/>
															<SettingRow
																title={__("Loader Color", "blockons")}
																slug="pageloader_loadcolor"
																value={blockonsOptions.pageloader?.loadcolor}
																inputType="colorpicker"
																defaultValue="#AF2DBF"
																onChange={handleChange}
															/>
															{blockonsOptions.pageloader?.has_text && (
																<SettingRow
																	title={__("Font Color", "blockons")}
																	slug="pageloader_fcolor"
																	value={blockonsOptions.pageloader?.fcolor}
																	inputType="colorpicker"
																	defaultValue="#222"
																	onChange={handleChange}
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
													onChange={handleChange}
												/>

												{blockonsOptions.scrollindicator?.enabled && (
													<>
														<SettingRow
															title={__("Show Preview", "blockons")}
															slug="scrollindicator_preview"
															value={showScrollIndPreview}
															inputType="toggle"
															onChange={() =>
																setShowScrollIndPreview((state) => !state)
															}
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
															onChange={handleChange}
														/>
														<SettingGroup
															label={__("Edit Scroll Indicator", "blockons")}
														>
															<SettingRow
																title={__("Height", "blockons")}
																slug="scrollindicator_height"
																value={blockonsOptions.scrollindicator?.height}
																inputType="range"
																defaultValue={6}
																min={1}
																max={20}
																suffix="px"
																onChange={handleChange}
															/>
															<SettingRow
																title={__("Has Background", "blockons")}
																slug="scrollindicator_has_bg"
																value={blockonsOptions.scrollindicator?.has_bg}
																inputType="toggle"
																onChange={handleChange}
															/>
															{blockonsOptions.scrollindicator?.has_bg && (
																<SettingRow
																	title={__("Background Color", "blockons")}
																	slug="scrollindicator_bgcolor"
																	value={
																		blockonsOptions.scrollindicator?.bgcolor
																	}
																	inputType="colorpicker"
																	defaultValue="#ebebeb"
																	onChange={handleChange}
																/>
															)}
															<SettingRow
																title={__("Scroll Indicator Color", "blockons")}
																slug="scrollindicator_color"
																value={blockonsOptions.scrollindicator?.color}
																inputType="colorpicker"
																defaultValue="#AF2DBF"
																onChange={handleChange}
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
													onChange={handleChange}
												/>

												{blockonsOptions.bttb?.enabled && (
													<>
														<SettingRow
															title={__("Show Preview", "blockons")}
															slug="bttb_preview"
															value={showBttbPreview}
															inputType="toggle"
															onChange={() =>
																setShowBttbPreview((state) => !state)
															}
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
															onChange={handleChange}
															note={__("More Coming Soon", "blockons")}
														/>

														{!isPremium &&
															blockonsOptions.bttb?.type === "scroll" && (
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
															onChange={handleChange}
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
																onChange={handleChange}
															/>

															<SettingRow
																title={__("Width / Height", "blockons")}
																slug="bttb_size"
																value={blockonsOptions.bttb?.size}
																inputType="range"
																defaultValue={
																	blockonsOptions.bttb?.type === "scroll"
																		? 60
																		: 45
																}
																min={30}
																max={100}
																suffix="px"
																onChange={handleChange}
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
																	onChange={handleChange}
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
																onChange={handleChange}
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
																onChange={handleChange}
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
																onChange={handleChange}
															/>
														</SettingGroup>

														<SettingGroup
															label={__("Edit Button Colors", "blockons")}
														>
															<SettingRow
																title={__("Has Background", "blockons")}
																slug="bttb_has_bg"
																value={blockonsOptions.bttb?.has_bg}
																inputType="toggle"
																onChange={handleChange}
															/>
															{blockonsOptions.bttb?.has_bg && (
																<SettingRow
																	title={__("Background Color", "blockons")}
																	slug="bttb_bgcolor"
																	value={blockonsOptions.bttb?.bgcolor}
																	inputType="colorpicker"
																	defaultValue="#FFF"
																	onChange={handleChange}
																/>
															)}
															<SettingRow
																title={__("Icon Color", "blockons")}
																slug="bttb_color"
																value={blockonsOptions.bttb?.color}
																inputType="colorpicker"
																defaultValue="#000"
																onChange={handleChange}
															/>
															{blockonsOptions.bttb?.type === "scroll" && (
																<>
																	<SettingRow
																		title={__("Stroke Color", "blockons")}
																		slug="bttb_strcolor"
																		value={blockonsOptions.bttb?.strcolor}
																		inputType="colorpicker"
																		defaultValue="#000"
																		onChange={handleChange}
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
																		onChange={handleChange}
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
									</div>

									{isPremium && wcActive && (
										<div id="blockons-content-4" className="blockons-content">
											<SettingHeader
												title={__("WooCommerce Addons", "blockons")}
												description={__(
													"Add extra, useful features to your WooCommerce online store",
													"blockons"
												)}
											/>

											<table className="form-table" role="presentation">
												<tbody>
													<>
														<SettingRow
															title={__("WooCommerce Side Cart", "blockons")}
															description={__(
																"Add a slide-out cart to your WooCommerce Mini Cart blocks",
																"blockons"
															)}
															inputType="heading"
															// nomargin
														/>
														<SettingRow
															title={__("Enable Side Cart", "blockons")}
															slug="sidecart_enabled"
															value={blockonsOptions.sidecart?.enabled}
															inputType="toggle"
															onChange={handleChange}
															note={
																blockonsOptions.sidecart?.enabled
																	? __(
																			'Add the CSS class "blockons-opencart" to any element(s) to trigger the Side Cart open or close, or use the WC Mini Cart block with the Side Cart option.',
																			"blockons"
																	  )
																	: ""
															}
														/>

														{blockonsOptions.sidecart?.enabled && (
															<>
																<SettingRow
																	title={__("Position", "blockons")}
																	slug="sidecart_position"
																	value={blockonsOptions.sidecart?.position}
																	inputType="select"
																	options={{
																		right: __("Right", "blockons"),
																		left: __("Left", "blockons"),
																	}}
																	onChange={handleChange}
																/>

																<SettingGroup
																	label={__("Edit Side Cart Icon", "blockons")}
																>
																	<SettingRow
																		title={__("Enable Icon", "blockons")}
																		slug="sidecart_has_icon"
																		value={blockonsOptions.sidecart?.has_icon}
																		inputType="toggle"
																		onChange={handleChange}
																	/>

																	{blockonsOptions.sidecart?.has_icon && (
																		<>
																			<SettingRow
																				title={__("Select Icon", "blockons")}
																				slug="sidecart_icon"
																				value={blockonsOptions.sidecart?.icon}
																				inputType="select"
																				options={{
																					"cart-shopping": __(
																						"Shopping Cart",
																						"blockons"
																					),
																					"cart-arrow-down": __(
																						"Cart Arrow Down",
																						"blockons"
																					),
																					"basket-shopping": __(
																						"Shopping Basket",
																						"blockons"
																					),
																					suitcase: __(
																						"Shopping Suitcase",
																						"blockons"
																					),
																					bucket: __("Bucket", "blockons"),
																				}}
																				onChange={handleChange}
																			/>

																			<SettingRow
																				title={__(
																					"Background Color",
																					"blockons"
																				)}
																				slug="sidecart_icon_bgcolor"
																				value={
																					blockonsOptions.sidecart?.icon_bgcolor
																				}
																				inputType="colorpicker"
																				defaultValue="#FFF"
																				onChange={handleChange}
																			/>
																			<SettingRow
																				title={__("Icon Color", "blockons")}
																				slug="sidecart_icon_color"
																				value={
																					blockonsOptions.sidecart?.icon_color
																				}
																				inputType="colorpicker"
																				defaultValue="#333"
																				onChange={handleChange}
																			/>

																			<SettingRow
																				title={__("Width / Height", "blockons")}
																				slug="sidecart_icon_padding"
																				value={
																					blockonsOptions.sidecart?.icon_padding
																				}
																				inputType="range"
																				defaultValue={60}
																				min={40}
																				max={100}
																				suffix="px"
																				onChange={handleChange}
																			/>
																			<SettingRow
																				title={__("Size", "blockons")}
																				slug="sidecart_icon_size"
																				value={
																					blockonsOptions.sidecart?.icon_size
																				}
																				inputType="range"
																				defaultValue={24}
																				min={12}
																				max={72}
																				// step={0.01}
																				suffix="px"
																				onChange={handleChange}
																			/>

																			<SettingRow
																				title={__(
																					"Show Cart Amount",
																					"blockons"
																				)}
																				slug="sidecart_has_amount"
																				value={
																					blockonsOptions.sidecart?.has_amount
																				}
																				inputType="toggle"
																				onChange={handleChange}
																			/>
																			{blockonsOptions.sidecart?.has_amount && (
																				<>
																					<SettingRow
																						title={__(
																							"Background Color",
																							"blockons"
																						)}
																						slug="sidecart_amount_bgcolor"
																						value={
																							blockonsOptions.sidecart
																								?.amount_bgcolor
																						}
																						inputType="colorpicker"
																						defaultValue="#000"
																						onChange={handleChange}
																					/>
																					<SettingRow
																						title={__("Font Color", "blockons")}
																						slug="sidecart_amount_fcolor"
																						value={
																							blockonsOptions.sidecart
																								?.amount_fcolor
																						}
																						inputType="colorpicker"
																						defaultValue="#FFF"
																						onChange={handleChange}
																					/>
																				</>
																			)}
																		</>
																	)}
																</SettingGroup>

																<SettingGroup
																	label={__("Edit Side Cart", "blockons")}
																>
																	<SettingRow
																		title={__("Header Title")}
																		slug="sidecart_header_title"
																		value={
																			blockonsOptions.sidecart?.header_title
																		}
																		placeholder="Your Cart"
																		inputType="text"
																		onChange={handleChange}
																	/>
																	<SettingRow
																		title={__("Header text")}
																		slug="sidecart_header_text"
																		value={
																			blockonsOptions.sidecart?.header_text
																		}
																		placeholder="Your Cart"
																		inputType="text"
																		onChange={handleChange}
																	/>

																	<SettingRow
																		title={__("Background Color", "blockons")}
																		slug="sidecart_bgcolor"
																		value={blockonsOptions.sidecart?.bgcolor}
																		inputType="colorpicker"
																		defaultValue="#FFF"
																		onChange={handleChange}
																	/>
																	<SettingRow
																		title={__("Font Color", "blockons")}
																		slug="sidecart_color"
																		value={blockonsOptions.sidecart?.color}
																		inputType="colorpicker"
																		defaultValue="#333"
																		onChange={handleChange}
																	/>

																	<SettingRow
																		title={__("Overlay Color", "blockons")}
																		slug="sidecart_overlay_color"
																		value={
																			blockonsOptions.sidecart?.overlay_color
																		}
																		inputType="colorpicker"
																		defaultValue="#000"
																		onChange={handleChange}
																	/>
																	<SettingRow
																		title={__("Opacity", "blockons")}
																		slug="sidecart_overlay_opacity"
																		value={
																			blockonsOptions.sidecart?.overlay_opacity
																		}
																		inputType="range"
																		defaultValue={0.6}
																		min={0}
																		max={1}
																		step={0.01}
																		onChange={handleChange}
																		suffix=""
																	/>
																</SettingGroup>
															</>
														)}
													</>
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
										</div>
									)}

									<div id="blockons-content-help" className="blockons-content">
										<InfoTab
										// isPro={isPremium}
										// upgrade={blockonsObject.upgradeUrl}
										/>
									</div>
								</div>

								<div className="blockonsSettingBar bottom">
									<div className="blockonsSettingBarMain">
										<button
											type="submit"
											className="button blockonsSaveBtn button-primary"
										>
											{__("Save Settings", "blockons")}
										</button>
										<div className="blockonsSaveBtnLoader">
											{(loadSetting || loader) && <Loader />}
										</div>
									</div>
									<div className="blockonsSettingBarOptions">
										<div
											className="blockons-delete"
											title={__("Reset Settings", "blockons")}
											onClick={confirmDelete}
										>
											<div className="blockons-confirm-delete">
												<a onClick={handleDeleteOptions}>
													{__("Confirm... Reset All Settings!", "blockons")}
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</form>
				</div>

				{showPageLoaderPreview && (
					<PageLoader
						pageLoaderOptions={blockonsOptions.pageloader}
						isPro={isPremium}
						isAdmin={true}
					/>
				)}
				{showBttbPreview && (
					<BackToTop bttOptions={blockonsOptions.bttb} isPro={isPremium} />
				)}
				{showScrollIndPreview && (
					<ScrollIndicator scrollInOptions={blockonsOptions.scrollindicator} />
				)}
			</div>
		</React.Fragment>
	);
};

export default SettingsPage;
