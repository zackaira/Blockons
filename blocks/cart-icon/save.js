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
				className={`blockons-cart-icon-block ${
					attributes.noItems ? "noitems" : ""
				} ${attributes.noAmount ? "noamount" : ""} ${
					attributes.layoutSwitch ? "switch" : ""
				}`}
				style={{
					backgroundColor: attributes.iconBgColor,
				}}
			>
				<a
					{...(attributes.cartLink
						? { href: attributes.cartLink }
						: { href: cartIconObj.wcCartUrl })}
					{...(attributes.cartLinkNewTab ? { target: "_blank" } : "")}
					className="blockons-cart-icon-block-icon"
					style={{
						fontSize: attributes.iconSize,
						padding: attributes.iconPadding,
						color: attributes.textColor,
					}}
				>
					<span
						className={`icon ${
							attributes.customIcon && attributes.icon == "custom"
								? attributes.customIcon
								: attributes.icon
						}`}
						style={{
							color: attributes.iconColor,
						}}
					></span>
				</a>
				{attributes.hasDropdown && (
					<div
						className="blockons-cart-icon-dropdown"
						style={{
							backgroundColor: attributes.dropBgColor,
							color: attributes.dropColor,
						}}
					>
						<div className="blockons-cart-icon-inner"></div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Save;
