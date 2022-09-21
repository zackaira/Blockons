/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `align-${attributes.alignment}`,
	});

	return (
		<div {...blockProps}>
			<div className={`blockons-wc-account-icon-block`}>
				<div
					className={`blockons-wc-account-icon`}
					style={{
						backgroundColor: attributes.iconBgColor,
						fontSize: attributes.iconSize,
						padding: attributes.iconPadding,
					}}
				>
					<span
						className={
							attributes.customIcon && attributes.icon == "custom"
								? attributes.customIcon
								: attributes.icon
						}
						style={{
							color: attributes.iconColor,
						}}
					></span>
				</div>
				{attributes.hasDropdown && (
					<div
						className="blockons-wc-account-icon-dropdown"
						style={{
							backgroundColor: attributes.dropBgColor,
							color: attributes.dropColor,
						}}
					>
						{attributes.showDashboard && (
							<div className="blockons-wc-account-icon-item">
								<a href={wcObj.wcAccountUrl}>
									<RichText.Content value={attributes.textDashboard} />
								</a>
							</div>
						)}
						{attributes.showOrders && (
							<div className="blockons-wc-account-icon-item">
								<a href={wcObj.wcAccOrdersUrl}>
									<RichText.Content value={attributes.textOrders} />
								</a>
							</div>
						)}
						{attributes.showDownloads && (
							<div className="blockons-wc-account-icon-item">
								<a href={wcObj.wcAccDownloadsUrl}>
									<RichText.Content value={attributes.textDownloads} />
								</a>
							</div>
						)}
						{attributes.showAddresses && (
							<div className="blockons-wc-account-icon-item">
								<a href={wcObj.wcAccAddressesUrl}>
									<RichText.Content value={attributes.textAddresses} />
								</a>
							</div>
						)}
						{attributes.showAccountDetails && (
							<div className="blockons-wc-account-icon-item">
								<a href={wcObj.wcAccDetailsUrl}>
									<RichText.Content value={attributes.textAccountDetails} />
								</a>
							</div>
						)}
						{attributes.showLogout && (
							<div className="blockons-wc-account-icon-item">
								<a href={wcObj.wcLogoutUrl}>
									<RichText.Content value={attributes.textLogout} />
								</a>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default Save;
