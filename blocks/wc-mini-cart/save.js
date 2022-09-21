/**
 * WordPress dependencies
 */
import { useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: attributes.alignment,
	});

	// const ajaxObj = wcObj ? wcObj : {}

	return (
		<div {...blockProps}>
			<div
				className={`blockons-wc-mini-cart-block ${
					attributes.noItems ? "noitems" : ""
				} ${attributes.noAmount ? "noamount" : ""} ${
					attributes.layoutSwitch ? "switch" : ""
				} ${attributes.dropPosition}`}
				style={{
					backgroundColor: attributes.iconBgColor,
				}}
			>
				<a
					{...(attributes.cartLink
						? { href: attributes.cartLink }
						: { href: wcObj.wcCartUrl })}
					{...(attributes.cartLinkNewTab ? { target: "_blank" } : "")}
					className="blockons-wc-mini-cart-block-icon"
					style={{
						fontSize: attributes.iconSize,
						padding: attributes.iconPadding,
						color: attributes.textColor,
					}}
				>
					<span
						className={`icon fa-solid fa-${
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
						className={`blockons-wc-mini-cart-dropdown btns-${attributes.dropBtns}`}
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
