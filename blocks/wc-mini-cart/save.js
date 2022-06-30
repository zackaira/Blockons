/**
 * WordPress dependencies
 */
import { useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: attributes.alignment,
	});

	// const ajaxObj = cartIconObj ? cartIconObj : {}

	return (
		<div {...blockProps}>
			<div
				className={`blockons-wc-mini-cart-block ${
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
					className="blockons-wc-mini-cart-block-icon"
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
						className="blockons-wc-mini-cart-dropdown"
						style={{
							backgroundColor: attributes.dropBgColor,
							color: attributes.dropColor,
						}}
					>
						<div className="blockons-wc-mini-cart-inner"></div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Save;
