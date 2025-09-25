import { __ } from '@wordpress/i18n';

const InfoTab = (props) => {
	const isPremium = props.isPro ? props.isPro : '';
	const upgradeUrl = props.upgrade ? props.upgrade : '';
	const pluginUrl = props.pluginUrl ? props.pluginUrl : '';

	return (
		<div className="blockonsInfoTab">
			{isPremium ? (
				<>
					<div className="blockons-header addspace">
						<h3 className="blockons-title">
							{__('Welcome to Blockons Pro!', 'blockons')}
						</h3>
						<p>
							{__(
								"We're building WordPress editor blocks to make it easier for you to build visually appealing and very professional looking pages for your website.",
								'blockons',
							)}
						</p>
						<a
							href="https://blockons.com/go/home/"
							target="_blank"
							className="blockons-button"
						>
							{__('Visit Our Website', 'blockons')}
						</a>
						{!isPremium && (
							<a
								href="https://www.blockons.com/pro/"
								target="_blank"
								className="blockons-button primary"
							>
								{__('View Blockons Pro', 'blockons')}
							</a>
						)}
					</div>

					<div className="blockons-video addspace blockons-hide">
						<h3 className="blockons-title">
							{__(
								'Watch our video on using the Blockons plugin',
								'blockons',
							)}
						</h3>
						<p>
							{__(
								'Blockons is designed to be very intuitive or the settings do also have help hints, but you can also watch our video to get a better understanding of how the Blockons plugins works. Enjoy!',
								'blockons',
							)}
						</p>
						<a
							href="https://www.youtube.com/watch?v=4fCIDCcDgaU"
							target="_blank"
							className="blockons-button primary"
						>
							{__('Watch Blockons Video', 'blockons')}
						</a>
					</div>

					<div className="blockons-help">
						<h4 className="blockons-title">
							{__('Support & Documentation', 'blockons')}
						</h4>

						<p>
							{__(
								'Read through our ever-growing documentation on our website. Read the Frequently Asked Questions for any answers you may be looking for... Or get in contact with our support if you need help with anything regarding the Blockons plugin.',
								'blockons',
							)}
						</p>

						<a
							href="https://blockons.com/go/documentation//"
							target="_blank"
							className="blockons-button primary"
						>
							{__('Documentation', 'blockons')}
						</a>
						<a
							href="https://blockons.com/go/faqs/"
							target="_blank"
							className="blockons-button"
						>
							{__("FAQ's", 'blockons')}
						</a>
						<a
							href="https://blockons.com/go/support/"
							target="_blank"
							className="blockons-button"
						>
							{__('Get Support', 'blockons')}
						</a>
					</div>
				</>
			) : (
				<>
					<div className="blockons-upgrade-header">
						<h3 className="blockons-title">
							{__('Welcome to Blockons!', 'blockons')}
						</h3>
						<h4>
							{__(
								'Powerful Blocks & Addons for WordPress Websites!',
								'blockons',
							)}
						</h4>
						<p>
							{__(
								"Unlock the full potential of your WordPress site with Blockons Pro. Our premium WordPress blocks and add-ons are designed to enhance your website's performance and design. With features like instant search, popup modals, block visibility and animations, as well as advanced WooCommerce Addons, Blockons Pro offers everything you need to create a beautiful, functional site.",
								'blockons',
							)}
						</p>
						<a
							href={upgradeUrl}
							target="_blank"
							className="blockons-button"
						>
							{__('Upgrade for only $29', 'blockons')}
						</a>
					</div>

					<div className="blockons-upgrade-section">
						<div className="blockons-upgrade-section-left">
							<span>Advanced Search</span>
							<h3>Instant Search</h3>
							<p>
								{__(
									"Supercharge your website with Blockons Instant Search, the premium tool designed to delight your visitors and boost your services & sales. With fast, intelligent search results, customers find exactly what they're looking for in seconds.",
									'blockons',
								)}
							</p>
							<p>
								{__(
									'Faster searches mean smoother checkouts, higher engagement, and more conversions for your business. Upgrade today and turn browsing into buying with a search experience your visitors will love.',
									'blockons',
								)}
							</p>
						</div>
						<div className="blockons-upgrade-section-right">
							<img
								src={`${pluginUrl}assets/images/upgrade/pro-search.png`}
								alt="Search Pro"
							/>
						</div>
					</div>

					<div className="blockons-upgrade-section">
						<div className="blockons-upgrade-section-left">
							<span>Contact Forms</span>
							<h3>Advanced Forms Block</h3>
							<p>
								{__(
									"Take your forms to the next level with Blockons Advanced Contact Forms, the premium upgrade that ensures you never miss a lead. Save every form submission directly to your dashboard, so you'll never lose important emails again.",
									'blockons',
								)}
							</p>
							<p>
								{__(
									'Add extra protection with built-in reCAPTCHA, and build powerful forms with advanced fields like checkboxes, radio buttons, file uploads, date pickers, and more. Upgrade today and give your visitors a reliable, professional way to connect.',
									'blockons',
								)}
							</p>
						</div>
						<div className="blockons-upgrade-section-right">
							<img
								src={`${pluginUrl}assets/images/upgrade/pro-forms.png`}
								alt="Search Pro"
							/>
						</div>
					</div>

					<div className="blockons-upgrade-section">
						<div className="blockons-upgrade-section-left">
							<span>Content Popups</span>
							<h3>Modal Popups</h3>
							<p>
								{__(
									'With Blockons Modal Popups, you’re in full control. Build your own custom popups and add anything from contact or enquiry forms to special offers, videos, or any content you need. Place them anywhere on your site and grab attention at the perfect moment.',
									'blockons',
								)}
							</p>
							<p>
								{__(
									'Every popup is fully responsive and designed to look great on any device, helping you engage visitors, capture leads, and drive more conversions. Upgrade today and create popups that work exactly the way you want.',
									'blockons',
								)}
							</p>
						</div>
						<div className="blockons-upgrade-section-right">
							<img
								src={`${pluginUrl}assets/images/upgrade/pro-modals.png`}
								alt="Search Pro"
							/>
						</div>
					</div>

					<div className="blockons-upgrade-section">
						<div className="blockons-upgrade-section-left">
							<span>MapBox Maps</span>
							<h3>Advanced Maps</h3>
							<p>
								{__(
									'Elevate your website with Blockons Advanced Maps, the premium block built to impress and engage. Add beautifully designed, fully customizable maps that let your visitors explore locations, find directions, and connect with your business effortlessly.',
									'blockons',
								)}
							</p>
							<p>
								{__(
									"More than just a map, it's an interactive experience that builds trust, improves usability, and keeps visitors engaged longer. Upgrade today and give your site the professional edge it deserves.",
									'blockons',
								)}
							</p>
						</div>
						<div className="blockons-upgrade-section-right">
							<img
								src={`${pluginUrl}assets/images/upgrade/pro-maps.png`}
								alt="Search Pro"
							/>
						</div>
					</div>

					<div className="blockons-upgrade-section">
						<div className="blockons-upgrade-section-left">
							<span>ToolTips Pro</span>
							<h3>Better Content Tooltips</h3>
							<p>
								{__(
									'A premium feature that adds context, clarity, and style to your pages. Give visitors instant access to helpful explanations, product details, or extra information right where they need it.',
									'blockons',
								)}
							</p>
							<p>
								{__(
									'Tooltips keep your content clean, engaging, and easy to understand, helping reduce confusion and boosting user confidence. Upgrade today and deliver a smoother, more professional browsing experience.',
									'blockons',
								)}
							</p>
						</div>
						<div className="blockons-upgrade-section-right">
							<img
								src={`${pluginUrl}assets/images/upgrade/pro-tooltips.png`}
								alt="Search Pro"
							/>
						</div>
					</div>

					<div className="blockons-upgrade-section">
						<div className="blockons-upgrade-section-left">
							<span>WooCommerce Store</span>
							<h3>Product Quick View</h3>
							<p>
								{__(
									'Give your customers the convenience they expect with Blockons WooCommerce Product Quick View. Shoppers can browse product details in a sleek popup without ever leaving the page, keeping them focused and ready to buy.',
									'blockons',
								)}
							</p>
							<p>
								{__(
									"By reducing friction and making the buying journey effortless, Quick View helps increase engagement, shorten the path to checkout, and maximize your store's conversions. Upgrade today to deliver a faster, smarter shopping experience.",
									'blockons',
								)}
							</p>
						</div>
						<div className="blockons-upgrade-section-right">
							<img
								src={`${pluginUrl}assets/images/upgrade/pro-quickview.png`}
								alt="Search Pro"
							/>
						</div>
					</div>

					<div className="blockons-upgrade-section">
						<div className="blockons-upgrade-section-left">
							<span>WooCommerce Store</span>
							<h3>WooCommerce Side Cart</h3>
							<p>
								{__(
									'Enhance your WooCommerce store with Blockons Side Cart, the premium feature that slides in a modern, interactive cart from the side of the page. Customers can view, update, and manage their order instantly without interrupting their shopping flow.',
									'blockons',
								)}
							</p>
							<p>
								{__(
									'With a cleaner, faster checkout process, Side Cart keeps shoppers engaged, all while giving your store a polished, professional feel.',
									'blockons',
								)}
							</p>
						</div>
						<div className="blockons-upgrade-section-right">
							<img
								src={`${pluginUrl}assets/images/upgrade/pro-sidecart.png`}
								alt="Search Pro"
							/>
						</div>
					</div>

					<div className="blockons-upgrade-section">
						<div className="blockons-upgrade-section-left">
							<span>Display Blocks per Device</span>
							<h3>Layout Block Visibility</h3>
							<p>
								{__(
									"Take full control of your site's design with Blockons Layout Block Visibility, the premium feature that lets you show or hide blocks on the frontend by device. Tailor your layouts perfectly for desktop, tablet, and mobile users without extra coding.",
									'blockons',
								)}
							</p>
							<p>
								{__(
									'Deliver cleaner designs, faster load times, and a truly responsive experience that adapts to every visitor. Upgrade today and make your website smarter, sleeker, and more user-friendly.',
									'blockons',
								)}
							</p>
						</div>
						<div className="blockons-upgrade-section-right">
							<img
								src={`${pluginUrl}assets/images/upgrade/pro-visibility.png`}
								alt="Search Pro"
							/>
						</div>
					</div>

					<div className="blockons-upgrade-section">
						<div className="blockons-upgrade-section-left">
							<span>Scroll Animations for Blocks</span>
							<h3>Layout Block Animations</h3>
							<p>
								{__(
									"Enhance your site's design with Blockons Layout Block Animations, the premium feature that adds smooth intro animations to your layout blocks. Grab attention instantly as sections fade, slide, or zoom into view with professional polish.",
									'blockons',
								)}
							</p>
							<p>
								{__(
									'Animations make your pages more dynamic, engaging, and memorable, helping you highlight key content and improve user experience. Upgrade today and transform static layouts into beautifully simple eye-catching designs.',
									'blockons',
								)}
							</p>
						</div>
						<div className="blockons-upgrade-section-right">
							<img
								src={`${pluginUrl}assets/images/upgrade/pro-animation.png`}
								alt="Search Pro"
							/>
						</div>
					</div>

					<div className="blockons-upgrade-header">
						<h4>{__('And Still More...', 'blockons')}</h4>
						<p>
							{__(
								"Those are just some of the core features of Blockons Pro. You'll also unlock even more enhancements like advanced back-to-top buttons, stylish site loader icons, the option to add your own site credit, and lots more coming...",
								'blockons',
							)}
						</p>
						<a
							href={upgradeUrl}
							target="_blank"
							className="blockons-button"
						>
							{__('Upgrade for only $29', 'blockons')}
						</a>
					</div>
				</>
			)}
		</div>
	);
};

export default InfoTab;
