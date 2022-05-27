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
				className={`blockons-cart-icon-block`}
				style={{
					backgroundColor: attributes.iconBgColor,
				}}
			>
				<div className="blockons-cart-icon-block-icon">
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
