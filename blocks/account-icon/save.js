/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: attributes.alignment,
	});

	return (
		<div {...blockProps}>
			<div
				className={`blockons-account-icon-block`}
				style={{
					backgroundColor: attributes.iconBgColor,
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
				{attributes.hasDropdown && (
					<div
						className="blockons-account-icon-dropdown"
						style={{
							backgroundColor: attributes.dropBgColor,
							color: attributes.dropColor,
						}}
					>
						{attributes.showDashboard && (
							<div className="blockons-account-icon-item">
								<a href="">
									<RichText.Content value={attributes.textDashboard} />
								</a>
							</div>
						)}
						{attributes.showOrders && (
							<div className="blockons-account-icon-item">
								<a href="">
									<RichText.Content value={attributes.textOrders} />
								</a>
							</div>
						)}
						{attributes.showDownloads && (
							<div className="blockons-account-icon-item">
								<a href="">
									<RichText.Content value={attributes.textDownloads} />
								</a>
							</div>
						)}
						{attributes.showAddresses && (
							<div className="blockons-account-icon-item">
								<a href="">
									<RichText.Content value={attributes.textAddresses} />
								</a>
							</div>
						)}
						{attributes.showAccountDetails && (
							<div className="blockons-account-icon-item">
								<a href="">
									<RichText.Content value={attributes.textAccountDetails} />
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
