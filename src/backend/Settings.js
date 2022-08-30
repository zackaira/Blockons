// Localized JS object - blockonsObj
import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import axios from "axios";
import SettingRow from "./components/SettingRow";
import SettingBlock from "./components/SettingBlock";
import InfoTab from "./InfoTab";
import Loader from "./Loader";
import { blockonsBlockBlurbs } from "./helpers";

const Settings = () => {
	const blockonsObject = blockonsObj;
	const url = `${blockonsObject.apiUrl}/blcns/v1`;
	const [loader, setLoader] = useState(false);
	const [loadSetting, setLoadSetting] = useState(true);
	const isPremium = blockonsObject.can_use_premium_code === "1" ? true : false;
	const wcActive = Boolean(blockonsObject.wcActive);
	const defaults = blockonsObject.blockonsDefaults;

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
															blockonsBlockBlurbs[key]
																? blockonsBlockBlurbs[key].desc
																: ""
														}
														onChange={handleChange}
														pluginSpecific={
															blockonsBlockBlurbs[key]
																? blockonsBlockBlurbs[key].pluginSpecific
																: false
														}
														{...(blockonsBlockBlurbs[key] &&
														blockonsBlockBlurbs[key].pluginSpecific ===
															"WooCommerce" &&
														!wcActive
															? { disable: true }
															: "")}
													/>
												))}
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
