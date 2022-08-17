// Localized JS object - blockonsObj
import { __ } from "@wordpress/i18n";
import React, { useState, useEffect } from "react";
import axios from "axios";

import SettingRow from "./components/SettingRow";
import SettingBlock from "./components/SettingBlock";
import InfoTab from "./InfoTab";
import Loader from "./Loader";

const blockonsDefault = {
	blocks: {
		accordions: true,
		icon_list: true,
		image_carousel: true,
		line_heading: true,
		marketing_button: true,
		progress_bars: true,
		search: true,
		testimonials: true,
		video_slider: true,
		wc_account_icon: true,
		wc_featured_product: true,
		wc_mini_cart: true,
	},
};

const Settings = () => {
	const blockonsObject = blockonsObj;
	const url = `${blockonsObject.apiUrl}/blcns/v1`;
	const [loader, setLoader] = useState(false);
	const [loadSetting, setLoadSetting] = useState(true);
	// const isPremium = blockonsObject.can_use_premium_code === "1" ? true : false;

	const [blockonsOptions, setWascOptions] = useState({});

	// const wcActive = Boolean(blockonsObject.wcActive);

	// setState dynamically for each setting
	// const handleChange = ({
	// 	target: { type, checked, name, value, className },
	// }) => {
	// 	if (
	// 		type === "checkbox" &&
	// 		(className === "checkbox-single" ||
	// 			className === "toggle-switch-checkbox")
	// 	)
	// 		value = checked;

	// 	// console.log("value: " + value);

	// 	setWascOptions({
	// 		...blockonsOptions,
	// 		[name]: value,
	// 	});
	// };
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

		setWascOptions({
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

	useEffect(() => {
		// blockonsAdjustUI();
	}, [blockonsOptions.add_blockons]);

	console.log(blockonsOptions);

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
				const blockonsOptions = res.data.blockonsOptions
					? JSON.parse(res.data.blockonsOptions)
					: console.log("Blockons Options Empty");

				// setState dynamically for all settings
				if (blockonsOptions) {
					for (const key in blockonsOptions) {
						setWascOptions((prevState) => ({
							...prevState,
							[key]: blockonsOptions[key] ? blockonsOptions[key] : "",
						}));
					}
				} else {
					setWascOptions(blockonsDefault); // Set settings to defaults if not found
				}
				// console.log(blockonsOptions);
			})
			.then(() => {
				// blockonsAdjustSettings();
				setLoadSetting(false);

				// blockonsAdjustUI(blockonsOptions.add_blockons);
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
							title={"My Account"}
						></a>
						<a
							href="https://blockons.com/support/"
							className="blockons-docs"
							title={"Documentation"}
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
								<li>
									<a id="blockonstab-2" className="blockons-tab">
										{__("Settings", "blockons")}
									</a>
								</li>
								<li>
									<a id="blockonstab-3" className="blockons-tab">
										{__("Extra", "blockons")}
									</a>
								</li>
								<li className="help">
									<a id="blockonstab-help" className="blockons-tab">
										{__("Help", "blockons")}
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
										<div className="blockons-block-settings">
											<SettingBlock
												title={"Accordions"}
												slug="blocks_accordions"
												value={blockonsOptions.blocks?.accordions}
												inputType="toggle"
												description={"Block One Description"}
												onChange={handleChange}
											/>
											<SettingBlock
												title={"Icon List"}
												slug="blocks_icon_list"
												value={blockonsOptions.blocks?.icon_list}
												inputType="toggle"
												description={"Block Two Description"}
												onChange={handleChange}
											/>
											<SettingBlock
												title={"Image Carousel"}
												slug="blocks_image_carousel"
												value={blockonsOptions.blocks?.image_carousel}
												inputType="toggle"
												description={"Block Three Description"}
												onChange={handleChange}
											/>
											<SettingBlock
												title={"Line Heading"}
												slug="blocks_line_heading"
												value={blockonsOptions.blocks?.line_heading}
												inputType="toggle"
												description={"Block Three Description"}
												onChange={handleChange}
											/>
											<SettingBlock
												title={"Marketing Button"}
												slug="blocks_marketing_button"
												value={blockonsOptions.blocks?.marketing_button}
												inputType="toggle"
												description={"Block Three Description"}
												onChange={handleChange}
											/>
											<SettingBlock
												title={"Progress Bars"}
												slug="blocks_progress_bars"
												value={blockonsOptions.blocks?.progress_bars}
												inputType="toggle"
												description={"Block Three Description"}
												onChange={handleChange}
											/>
											<SettingBlock
												title={"Search"}
												slug="blocks_search"
												value={blockonsOptions.blocks?.search}
												inputType="toggle"
												description={"Block Three Description"}
												onChange={handleChange}
											/>
											<SettingBlock
												title={"Testimonials"}
												slug="blocks_testimonials"
												value={blockonsOptions.blocks?.testimonials}
												inputType="toggle"
												description={"Block Three Description"}
												onChange={handleChange}
											/>
											<SettingBlock
												title={"Video Slider"}
												slug="blocks_video_slider"
												value={blockonsOptions.blocks?.video_slider}
												inputType="toggle"
												description={"Block Three Description"}
												onChange={handleChange}
											/>
											<SettingBlock
												title={"Account Icon"}
												slug="blocks_wc_account_icon"
												value={blockonsOptions.blocks?.wc_account_icon}
												inputType="toggle"
												description={"Block Three Description"}
												onChange={handleChange}
												pluginSpecific="WooCommerce"
											/>
											<SettingBlock
												title={"Featured Product"}
												slug="blocks_wc_featured_product"
												value={blockonsOptions.blocks?.wc_featured_product}
												inputType="toggle"
												description={"Block Three Description"}
												onChange={handleChange}
												pluginSpecific="WooCommerce"
											/>
											<SettingBlock
												title={"Mini Cart"}
												slug="blocks_wc_mini_cart"
												value={blockonsOptions.blocks?.wc_mini_cart}
												inputType="toggle"
												description={"Block Three Description"}
												onChange={handleChange}
												pluginSpecific="WooCommerce"
											/>
										</div>
									</div>

									<div id="blockons-content-2" className="blockons-content">
										<table className="form-table" role="presentation">
											<tbody>
												<SettingRow
													title={"Section Heading"}
													description={__(
														"this is a description for the heading component",
														"blockons"
													)}
													inputType="heading"
												/>
												<SettingRow
													title={"My Ssdfetting"}
													slug="global_setting_one"
													value={blockonsOptions.setting_one}
													inputType="toggle"
													description={"Some Description"}
													onChange={handleChange}
												/>
												<SettingRow
													title={"My Settigbfbbng"}
													slug="global_setting_two"
													value={blockonsOptions.setting_two}
													inputType="toggle"
													description={"Some Description"}
													onChange={handleChange}
												/>
											</tbody>
										</table>
									</div>

									<div id="blockons-content-3" className="blockons-content">
										<table className="form-table" role="presentation">
											<tbody>
												<tr>
													<td>content 3</td>
												</tr>
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
											title={__("Delete Settings", "blockons")}
											onClick={confirmDelete}
										>
											<div className="blockons-confirm-delete">
												<a onClick={handleDeleteOptions}>
													{__("Confirm... Delete Settings!", "blockons")}
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
