// Localized JS object - blockonsObj
import React, { useState, useEffect } from "react";
import { __ } from "@wordpress/i18n";
import axios from "axios";
import Loader from "../Loader";
import GiveFeedback from "./components/GiveFeedback";
import EditorBlocks from "./contents/EditorBlocks";
import BlockExtensions from "./contents/BlockExtensions";
import SiteAddons from "./contents/SiteAddons";
import WooAddons from "./contents/WooAddons";
import InfoTab from "./contents/InfoTab";
import { blockonsGroupSettings } from "../helpers";
import PageLoader from "../../frontend/site-addons/pageloader/PageLoader";
import BackToTop from "../../frontend/site-addons/backtotop/BackToTop";
import ScrollIndicator from "../../frontend/site-addons/scrollindicator/ScrollIndicator";
import ProPromo from "./components/UI/ProPromo";

const SettingsPage = () => {
	const blockonsObject = blockonsObj;
	const url = `${blockonsObject.apiUrl}blcns/v1`;
	const pluginUrl = blockonsObject.pluginUrl;
	const upgradeUrl = blockonsObject.upgradeUrl;
	const [loader, setLoader] = useState(false);
	const [loadSetting, setLoadSetting] = useState(true);
	const [activeTab, setActiveTab] = useState("1");
	const isPremium = Boolean(blockonsObject.isPremium);
	const isAdmin = Boolean(blockonsObject.isAdmin);
	const wcActive = Boolean(blockonsObject.wcActive);
	const defaults = blockonsObject.blockonsDefaults;

	const [showPageLoaderPreview, setShowPageLoaderPreview] = useState(false);
	const [showBttbPreview, setShowBttbPreview] = useState(false);
	const [showScrollIndPreview, setShowScrollIndPreview] = useState(false);

	const [blockonsOptions, setBlockonsOptions] = useState({});

	const changeTab = (tabId) => {
		setActiveTab(tabId);
	};

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

	// console.log(blockonsOptions);

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
					<h2>
						{isPremium
							? __("Blockons Pro Settings", "blockons")
							: __("Blockons Settings", "blockons")}
					</h2>
					<div className="blockonsSettingBarOptions">
						{isPremium && (
							<a
								href={blockonsObject.accountUrl}
								className="blockons-account"
								title={__("My Account", "blockons")}
							></a>
						)}
						<a
							href="https://blockons.com/documentation/"
							className="blockons-docs"
							title={__("Documentation", "blockons")}
							target="_blank"
						></a>
						{!isPremium && (
							<a
								href={upgradeUrl}
								className="blockons-upgrade"
								title={__("Upgrade to Blockons Pro", "blockons")}
							></a>
						)}
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
									<a
										id="blockonstab-1"
										className={`blockons-tab ${
											activeTab === "1" ? "active" : ""
										}`}
										onClick={() => changeTab("1")}
									>
										{__("Blocks", "blockons")}
									</a>
								</li>
								<li>
									<a
										id="blockonstab-2"
										className={`blockons-tab ${
											activeTab === "2" ? "active" : ""
										}`}
										onClick={() => changeTab("2")}
									>
										{__("Block Extensions", "blockons")}
									</a>
								</li>
								<li>
									<a
										id="blockonstab-3"
										className={`blockons-tab ${
											activeTab === "3" ? "active" : ""
										}`}
										onClick={() => changeTab("3")}
									>
										{__("Site Addons", "blockons")}
									</a>
								</li>

								{/* {isPremium && wcActive && (
									<li>
										<a
											id="blockonstab-4"
											className={`blockons-tab ${
												activeTab === "4" ? "active" : ""
											}`}
											onClick={() => changeTab("4")}
										>
											{__("WooCommerce Addons", "blockons")}
										</a>
									</li>
								)} */}

								<li className="help">
									<a
										id="blockonstab-help"
										className={`blockons-tab ${
											activeTab === "9" ? "active" : ""
										}`}
										onClick={() => changeTab("9")}
									>
										{__("Welcome", "blockons")}
									</a>
								</li>
							</ul>

							<div className="blockons-content-wrap">
								<div className="blockons-content-wrap-inner">
									{(loadSetting || loader) && <Loader />}
									<div
										id="blockons-content-1"
										className={`blockons-content ${
											activeTab === "1" ? "active" : ""
										}`}
									>
										<EditorBlocks
											defaults={defaults}
											blockonsOptions={blockonsOptions}
											wcActive={wcActive}
											handleSettingChange={handleChange}
										/>
									</div>

									<div
										id="blockons-content-2"
										className={`blockons-content ${
											activeTab === "2" ? "active" : ""
										}`}
									>
										<BlockExtensions
											blockonsOptions={blockonsOptions}
											upgradeUrl={upgradeUrl}
											isPremium={isPremium}
											handleSettingChange={handleChange}
										/>
									</div>

									<div
										id="blockons-content-3"
										className={`blockons-content ${
											activeTab === "3" ? "active" : ""
										}`}
									>
										<SiteAddons
											blockonsOptions={blockonsOptions}
											handleSettingChange={handleChange}
											isPremium={isPremium}
											upgradeUrl={upgradeUrl}
											showPageLoader={showPageLoaderPreview}
											setShowPageLoader={setShowPageLoaderPreview}
											showBttb={showBttbPreview}
											setShowBttb={setShowBttbPreview}
											showScrollInd={showScrollIndPreview}
											setShowScrollInd={setShowScrollIndPreview}
										/>
									</div>

									{/* {isPremium && wcActive && (
										<div
											id="blockons-content-4"
											className={`blockons-content ${
												activeTab === "4" ? "active" : ""
											}`}
										>
											<WooAddons
												blockonsOptions={blockonsOptions}
												handleSettingChange={handleChange}
											/>
										</div>
									)} */}

									<div
										id="blockons-content-help"
										className={`blockons-content ${
											activeTab === "9" ? "active" : ""
										}`}
									>
										<InfoTab
										// isPro={isPremium}
										// upgrade={upgradeUrl}
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

				{!isPremium && !blockonsOptions.disablepropromo && (
					<ProPromo
						blockonsOptions={blockonsOptions}
						clickClose={handleChange}
						upgradeUrl={upgradeUrl}
					/>
				)}

				{showPageLoaderPreview && (
					<PageLoader
						pageLoaderOptions={blockonsOptions.pageloader}
						isPro={isPremium}
						isAdmin={isAdmin}
					/>
				)}
				{showBttbPreview && (
					<BackToTop
						bttOptions={blockonsOptions.bttb}
						isPro={isPremium}
						isAdmin={isAdmin}
					/>
				)}
				{showScrollIndPreview && (
					<ScrollIndicator scrollInOptions={blockonsOptions.scrollindicator} />
				)}
			</div>
		</React.Fragment>
	);
};

export default SettingsPage;
