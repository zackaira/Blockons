import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import axios from 'axios';
import Loader from '../Loader';
import GiveFeedback from './components/GiveFeedback';
import EditorBlocks from './contents/EditorBlocks';
import BlockExtensions from './contents/BlockExtensions';
import SiteAddons from './contents/SiteAddons';
import WooAddons from './contents/WooAddons';
import InfoTab from './contents/InfoTab';
import { blockonsGroupSettings } from '../helpers';
import PageLoader from '../../frontend/site-addons/pageloader/PageLoader';
import BackToTop from '../../frontend/site-addons/backtotop/BackToTop';
import ScrollIndicator from '../../frontend/site-addons/scrollindicator/ScrollIndicator';
import ProPromo from './components/UI/ProPromo';
import SiteBy from '../../frontend/site-addons/siteby/SiteBy';
import SideCart from '../../../assets/blocks/wc-mini-cart/pro/components/SideCart';
import GlobalSettings from './contents/GlobalSettings';

const SettingsPage = () => {
	const blockonsObject = blockonsObj;
	const url = `${blockonsObject.apiUrl}blcns/v1`;
	const pluginUrl = blockonsObject.pluginUrl;
	const upgradeUrl = blockonsObject.upgradeUrl;
	const [loader, setLoader] = useState(false);
	const [loadSetting, setLoadSetting] = useState(true);
	const getInitialTab = () => {
		const params = new URLSearchParams(window.location.search);
		return params.get('tab') || 'blocks';
	};
	const [activeTab, setActiveTab] = useState(getInitialTab());
	const isPremium = Boolean(blockonsObject.isPremium);
	const isAdmin = Boolean(blockonsObject.isAdmin);
	const wcActive = Boolean(blockonsObject.wcActive);
	const defaults = blockonsObject.blockonsDefaults;

	const [showPageLoaderPreview, setShowPageLoaderPreview] = useState(false);
	const [showBttbPreview, setShowBttbPreview] = useState(false);
	const [showScrollIndPreview, setShowScrollIndPreview] = useState(false);
	const [showSiteByPreview, setShowSiteByPreview] = useState(false);
	const [showSidecartPreview, setShowSidecartPreview] = useState(false);

	const [blockonsOptions, setBlockonsOptions] = useState({});

	const changeTab = (tabId) => {
		setActiveTab(tabId);

		const params = new URLSearchParams(window.location.search);
		params.set('tab', tabId);
		window.history.replaceState(null, '', '?' + params.toString());
	};

	// console.log('blockonsOptions', blockonsOptions);

	// setState dynamically for each setting
	const handleChange = ({
		target: { type, checked, name, value, className },
	}) => {
		if (
			type === 'checkbox' &&
			(className === 'checkbox-single' ||
				className === 'toggle-switch-checkbox')
		)
			value = checked;

		const settingGroup = name.substring(0, name.indexOf('_')); // Splits by the first _ and saves that as the group name
		const settingName = name.substring(name.indexOf('_') + 1); // Setting name within group, anything after the first _

		const groupKey = settingGroup === 'global' ? name.substring(7) : name;

		setBlockonsOptions({
			...blockonsOptions,
			...(!settingGroup || settingGroup === 'global' // sn_ name gets saved as default / in no group
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
		blockonsGroupSettings();
	}, [blockonsOptions]);

	// Submit form
	const handleSubmit = (e) => {
		e.preventDefault();
		setLoader(true);

		axios
			.post(
				url + '/settings',
				{
					blockonsOptions: JSON.stringify(blockonsOptions),
				},
				{
					// Add Nonce to prevent this working elsewhere
					headers: {
						'content-type': 'application/json',
						'X-WP-NONCE': blockonsObject.nonce,
					},
				},
			)
			.then((res) => {
				// console.log(res);
				// const blockonsOptions = JSON.parse(res.data.blockonsOptions);
				setLoader(false);
			});
	};

	const confirmDelete = (e) => {
		const deleteBtn = document.getElementsByClassName('blockons-delete');
		deleteBtn[0].classList.add('show-confirm');
		setTimeout(function () {
			deleteBtn[0].classList.remove('show-confirm');
		}, 2500);
	};

	const handleDeleteOptions = (e) => {
		e.preventDefault();
		if (
			window.confirm(
				__('Are you sure you want to delete all settings?', 'blockons'),
			)
		) {
			setLoader(true);
			setLoadSetting(true);
			axios
				.delete(url + '/delete', {
					headers: {
						'X-WP-NONCE': blockonsObject.nonce,
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
			.get(url + '/settings')
			.then((res) => {
				const blockonsOptions = res.data
					? JSON.parse(res.data)
					: console.log('Blockons Options Empty');

				// setState dynamically for all settings
				if (blockonsOptions) {
					for (const key in blockonsOptions) {
						setBlockonsOptions((prevState) => ({
							...prevState,
							[key]: blockonsOptions[key]
								? blockonsOptions[key]
								: '',
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
		<div className="blockons-settings">
			<div className="blockonsSettingBar">
				<h2>
					{isPremium
						? __('Blockons Pro Settings', 'blockons')
						: __('Blockons Settings', 'blockons')}
				</h2>
				<div className="blockonsSettingBarOptions">
					{isPremium && (
						<a
							href={blockonsObject.accountUrl}
							className="blockons-account"
							title={__('My Account', 'blockons')}
						></a>
					)}
					<a
						href="https://blockons.com/documentation/"
						className="blockons-docs"
						title={__('Documentation', 'blockons')}
						target="_blank"
					></a>
					{!isPremium && (
						<a
							href={upgradeUrl}
							className="blockons-upgrade"
							title={__('Upgrade to Blockons Pro', 'blockons')}
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

			{!isPremium && !blockonsOptions.disablepropromo && (
				<ProPromo
					blockonsOptions={blockonsOptions}
					clickClose={handleChange}
					upgradeUrl={upgradeUrl}
				/>
			)}

			<div className="blockons-settings-content">
				<form
					id="blockons-settings-form"
					onSubmit={(e) => handleSubmit(e)}
				>
					<div className="blockons-tabs">
						<ul>
							<li>
								<a
									id="blockonstab-blocks"
									className={`blockons-tab ${
										activeTab === 'blocks' ? 'active' : ''
									}`}
									onClick={() => changeTab('blocks')}
								>
									{__('Blocks', 'blockons')}
								</a>
							</li>
							<li>
								<a
									id="blockonstab-extensions"
									className={`blockons-tab ${
										activeTab === 'extensions'
											? 'active'
											: ''
									}`}
									onClick={() => changeTab('extensions')}
								>
									{__('Block Extensions', 'blockons')}
								</a>
							</li>
							<li>
								<a
									id="blockonstab-addons"
									className={`blockons-tab ${
										activeTab === 'addons' ? 'active' : ''
									}`}
									onClick={() => changeTab('addons')}
								>
									{__('Site Addons', 'blockons')}
								</a>
							</li>

							{wcActive && (
								<li>
									<a
										id="blockonstab-wc-addons"
										className={`blockons-tab ${
											activeTab === 'wc-addons'
												? 'active'
												: ''
										}`}
										onClick={() => changeTab('wc-addons')}
									>
										{__('WooCommerce Addons', 'blockons')}
									</a>
								</li>
							)}

							<li
								className={`settings ${isPremium ? '' : 'pro'}`}
							>
								<a
									id="blockonstab-settings"
									className={`blockons-tab ${
										activeTab === 'settings' ? 'active' : ''
									}`}
									onClick={() => changeTab('settings')}
								>
									{__('Settings', 'blockons')}
								</a>
							</li>
							<li className="info">
								<a
									id="blockonstab-info"
									className={`blockons-tab ${
										activeTab === 'info' ? 'active' : ''
									}`}
									onClick={() => changeTab('info')}
								>
									{isPremium
										? __('Info', 'blockons')
										: __('Go Pro', 'blockons')}
								</a>
							</li>
						</ul>

						<div className="blockons-content-wrap">
							<div className="blockons-content-wrap-inner">
								{(loadSetting || loader) && <Loader />}
								<div
									id="blockons-content-blocks"
									className={`blockons-content ${
										activeTab === 'blocks' ? 'active' : ''
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
									id="blockons-content-extensions"
									className={`blockons-content ${
										activeTab === 'extensions'
											? 'active'
											: ''
									}`}
								>
									<BlockExtensions
										blockonsOptions={blockonsOptions}
										upgradeUrl={upgradeUrl}
										isPremium={isPremium}
										handleSettingChange={handleChange}
										wcActive={wcActive}
									/>
								</div>

								<div
									id="blockons-content-addons"
									className={`blockons-content ${
										activeTab === 'addons' ? 'active' : ''
									}`}
								>
									<SiteAddons
										blockonsOptions={blockonsOptions}
										handleSettingChange={handleChange}
										isPremium={isPremium}
										upgradeUrl={upgradeUrl}
										showPageLoader={showPageLoaderPreview}
										setShowPageLoader={
											setShowPageLoaderPreview
										}
										showBttb={showBttbPreview}
										setShowBttb={setShowBttbPreview}
										showScrollInd={showScrollIndPreview}
										setShowScrollInd={
											setShowScrollIndPreview
										}
										showSiteBy={showSiteByPreview}
										setShowSiteBy={setShowSiteByPreview}
									/>
								</div>

								{wcActive && (
									<div
										id="blockons-content-wc-addons"
										className={`blockons-content ${
											activeTab === 'wc-addons'
												? 'active'
												: ''
										}`}
									>
										<WooAddons
											blockonsOptions={blockonsOptions}
											handleSettingChange={handleChange}
											isPremium={isPremium}
											upgradeUrl={upgradeUrl}
											showSidecartPreview={
												showSidecartPreview
											}
											setShowSidecartPreview={
												setShowSidecartPreview
											}
										/>
									</div>
								)}

								<div
									id="blockons-content-settings"
									className={`blockons-content ${
										activeTab === 'settings' ? 'active' : ''
									}`}
								>
									<GlobalSettings
										blockonsOptions={blockonsOptions}
										handleSettingChange={handleChange}
										isPremium={isPremium}
										upgradeUrl={upgradeUrl}
									/>
								</div>
								<div
									id="blockons-content-info"
									className={`blockons-content ${
										activeTab === 'info' ? 'active' : ''
									}`}
								>
									<InfoTab
										isPro={isPremium}
										upgrade={upgradeUrl}
										pluginUrl={pluginUrl}
									/>
								</div>
							</div>

							<div className="blockonsSettingBar bottom">
								<div className="blockonsSettingBarMain">
									<button
										type="submit"
										className="button blockonsSaveBtn button-primary"
									>
										{__('Save Settings', 'blockons')}
									</button>
									<div className="blockonsSaveBtnLoader">
										{(loadSetting || loader) && <Loader />}
									</div>
								</div>
								<div className="blockonsSettingBarOptions">
									<div
										className="blockons-delete"
										title={__('Reset Settings', 'blockons')}
										onClick={confirmDelete}
									>
										<div className="blockons-confirm-delete">
											<a onClick={handleDeleteOptions}>
												{__(
													'Confirm... Reset All Settings!',
													'blockons',
												)}
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
				<ScrollIndicator
					scrollInOptions={blockonsOptions.scrollindicator}
				/>
			)}

			{showSiteByPreview && (
				<SiteBy
					sitebyOptions={blockonsOptions.siteby}
					isAdmin={isAdmin}
				/>
			)}

			{showSidecartPreview && (
				<SideCart
					sidecartOptions={blockonsOptions.sidecart}
					isPro={isPremium}
					isAdmin={isAdmin}
				/>
			)}
		</div>
	);
};

export default SettingsPage;
