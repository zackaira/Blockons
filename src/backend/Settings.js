// Localized JS object - blockonsObj
import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import axios from "axios";
import SettingRow from "./components/SettingRow";
import SettingBlock from "./components/SettingBlock";
import InfoTab from "./InfoTab";
import Loader from "./Loader";

// const blockonsDefaults = {
// 	blocks: {
// 		accordions: true,
// 		icon_list: true,
// 		image_carousel: true,
// 		line_heading: true,
// 		marketing_button: true,
// 		progress_bars: true,
// 		search: true,
// 		testimonials: true,
// 		video_slider: true,
// 		wc_account_icon: true,
// 		wc_featured_product: true,
// 		wc_mini_cart: true,
// 	},
// 	delete_all_settings: false,
// };

const Settings = () => {
	const blockonsObject = blockonsObj;
	const url = `${blockonsObject.apiUrl}/blcns/v1`;
	const [loader, setLoader] = useState(false);
	const [loadSetting, setLoadSetting] = useState(true);
	const isPremium = blockonsObject.can_use_premium_code === "1" ? true : false;
	const wcActive = Boolean(blockonsObject.wcActive);
	const defaults = blockonsObject?.blockonsDefaults;

	const [blockonsOptions, setBlockonsOptions] = useState({});

	console.log("---------------- Defaults -----");
	console.log(defaults);
	console.log("---------------- Defaults -----");
	console.log("---------------- Options > -----");
	console.log(blockonsOptions);
	console.log("---------------- Options < -----");

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
				console.log(res);
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
					{isPremium && <h4>PREMIUM VERSION !!</h4>}
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
				<div className="blockons-settings-content">
					<form id="blockons-settings-form" onSubmit={(e) => handleSubmit(e)}>
						<div className="blockons-tabs">
							<ul>
								<li>
									<a id="blockonstab-1" className="blockons-tab active">
										{__("Blocks", "blockons")}
									</a>
								</li>
								<li className="blockons-hide">
									<a id="blockonstab-2" className="blockons-tab">
										{__("Settings", "blockons")}
									</a>
								</li>

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
										<div className="blockons-header">
											<h3 className="blockons-title">
												{__("Editor Blocks", "blockons")}
											</h3>
											<p>
												{__(
													"Choose the blocks you'd like to use when building with the WordPress block editor. You can turn off blocks to optimize for speed & page loading.",
													"blockons"
												)}
											</p>
										</div>

										{!isPremium && <h4>PLEASE UPGRADE NOW !!</h4>}

										<div className="blockons-block-settings">
											{console.log(blockonsOptions.blocks)}
											{/* {blockonsOptions.blocks.map((block) => {
												<SettingBlock
													title={__("Accordions", "blockons")}
													slug={`blocks_accordions`}
													value={blockonsOptions.blocks?.accordions}
													inputType="toggle"
													description={__(
														"Display content in smaller areas with collapsible lists",
														"blockons"
													)}
													onClick={console.log(block)}
													onChange={handleChange}
												/>;
											})} */}

											<SettingBlock
												title={__("Accordions", "blockons")}
												slug="blocks_accordions"
												value={blockonsOptions.blocks?.accordions}
												inputType="toggle"
												description={__(
													"Display content in smaller areas with collapsible lists",
													"blockons"
												)}
												onChange={handleChange}
											/>
											<SettingBlock
												title={__("Layout Container", "blockons")}
												slug="blocks_layout_container"
												value={blockonsOptions.blocks?.layout_container}
												inputType="toggle"
												description={__(
													"A more advaced layout block for your pages",
													"blockons"
												)}
												onChange={handleChange}
											/>
											<SettingBlock
												title={__("Icon List", "blockons")}
												slug="blocks_icon_list"
												value={blockonsOptions.blocks?.icon_list}
												inputType="toggle"
												description={__(
													"Visually, more attractive list items with icons",
													"blockons"
												)}
												onChange={handleChange}
											/>
											<SettingBlock
												title={__("Image Carousel", "blockons")}
												slug="blocks_image_carousel"
												value={blockonsOptions.blocks?.image_carousel}
												inputType="toggle"
												description={__(
													"Display multiple images in a neat carousel",
													"blockons"
												)}
												onChange={handleChange}
											/>
											<SettingBlock
												title={__("Line Heading", "blockons")}
												slug="blocks_line_heading"
												value={blockonsOptions.blocks?.line_heading}
												inputType="toggle"
												description={__(
													"More advanced and customizable line headings",
													"blockons"
												)}
												onChange={handleChange}
											/>
											<SettingBlock
												title={__("Marketing Button", "blockons")}
												slug="blocks_marketing_button"
												value={blockonsOptions.blocks?.marketing_button}
												inputType="toggle"
												description={__(
													"An attractive, more trendy customizable call-to-action",
													"blockons"
												)}
												onChange={handleChange}
											/>
											<SettingBlock
												title={__("Progress Bars", "blockons")}
												slug="blocks_progress_bars"
												value={blockonsOptions.blocks?.progress_bars}
												inputType="toggle"
												description={__(
													"Show progress with beautiful, animated bars",
													"blockons"
												)}
												onChange={handleChange}
											/>
											<SettingBlock
												title={__("Search", "blockons")}
												slug="blocks_search"
												value={blockonsOptions.blocks?.search}
												inputType="toggle"
												description={__(
													"A search bar/icon with drop down or popup search",
													"blockons"
												)}
												onChange={handleChange}
											/>
											<SettingBlock
												title={__("Testimonials", "blockons")}
												slug="blocks_testimonials"
												value={blockonsOptions.blocks?.testimonials}
												inputType="toggle"
												description={__(
													"Display client testimonials in a slider or carousel",
													"blockons"
												)}
												onChange={handleChange}
											/>
											<SettingBlock
												title={__("Video Slider", "blockons")}
												slug="blocks_video_slider"
												value={blockonsOptions.blocks?.video_slider}
												inputType="toggle"
												description={__(
													"Display multiple videos in a neat video slider",
													"blockons"
												)}
												onChange={handleChange}
											/>
											<SettingBlock
												title={__("Account Icon", "blockons")}
												slug="blocks_wc_account_icon"
												value={blockonsOptions.blocks?.wc_account_icon}
												inputType="toggle"
												description={__(
													"A simple icon linking to a users WC Account",
													"blockons"
												)}
												onChange={handleChange}
												pluginSpecific="WooCommerce"
												{...(wcActive ? "" : { disable: true })}
											/>
											<SettingBlock
												title={__("Featured Product", "blockons")}
												slug="blocks_wc_featured_product"
												value={blockonsOptions.blocks?.wc_featured_product}
												inputType="toggle"
												description={__(
													"Display a WC featured product with multple layouts",
													"blockons"
												)}
												onChange={handleChange}
												pluginSpecific="WooCommerce"
												{...(wcActive ? "" : { disable: true })}
											/>
											<SettingBlock
												title={__("Mini Cart", "blockons")}
												slug="blocks_wc_mini_cart"
												value={blockonsOptions.blocks?.wc_mini_cart}
												inputType="toggle"
												description={__(
													"A simple WC cart icon with a full cart drop down",
													"blockons"
												)}
												onChange={handleChange}
												pluginSpecific="WooCommerce"
												{...(wcActive ? "" : { disable: true })}
											/>
										</div>
										<div className="blockons-more">
											{__("More Blocks Coming Soon...", "blockons")}
										</div>
										<p>
											{__(
												"Get in touch and let us know which blocks you need for your site.",
												"blockons"
											)}
										</p>
									</div>

									<div id="blockons-content-2" className="blockons-content">
										<table className="form-table" role="presentation">
											<tbody>
												<SettingRow
													title={__("Section Heading", "blockons")}
													description={__(
														"this is a description for the heading component",
														"blockons"
													)}
													inputType="heading"
												/>
												<SettingRow
													title={__("My Ssdfetting", "blockons")}
													slug="global_setting_one"
													value={blockonsOptions.setting_one}
													inputType="toggle"
													tooltip={__(
														"This is the tool tip / hint for this setting",
														"blockons"
													)}
													onChange={handleChange}
												/>
												<SettingRow
													title={__("My Settigbfbbng", "blockons")}
													slug="global_setting_two"
													value={blockonsOptions.setting_two}
													inputType="toggle"
													tooltip={__(
														"This is the tool tip / hint for this setting",
														"blockons"
													)}
													onChange={handleChange}
												/>
											</tbody>
										</table>
									</div>

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
			</div>
		</React.Fragment>
	);
};

export default Settings;
