import { useBlockProps } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `align-${attributes.alignment} cart-${attributes.cartType}`,
	});
	const cartPageLink = attributes.cartLink
		? attributes.cartLink
		: wcCartObj.wcCartUrl;

	return (
		<div {...blockProps}>
			<div
				className={`blockons-wc-mini-cart-block ${
					attributes.noItems ? 'noitems' : ''
				} ${attributes.noAmount ? 'noamount' : ''} ${
					attributes.layoutSwitch ? 'switch' : ''
				} ${attributes.dropPosition}`}
				style={{
					backgroundColor: attributes.iconBgColor,
				}}
			>
				<a
					{...(attributes.cartType === 'sidecart'
						? {}
						: { href: cartPageLink })}
					className={`blockons-wc-mini-cart-block-icon blockons-opencart ${
						attributes.cartType === 'sidecart'
							? 'blockons-opencart'
							: ''
					}`}
					aria-label={__('Cart', 'blockons')}
					style={{
						fontSize: attributes.iconSize,
						padding: attributes.iconPadding,
						color: attributes.textColor,
					}}
				>
					<span
						className={`icon fa-solid fa-${
							attributes.customIcon && attributes.icon == 'custom'
								? attributes.customIcon
								: attributes.icon
						}`}
						style={{
							color: attributes.iconColor,
						}}
					></span>
				</a>
				{attributes.cartType === 'dropdown' && (
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
