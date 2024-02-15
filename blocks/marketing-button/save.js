/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from "@wordpress/block-editor";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `align-${attributes.alignment} ${attributes.buttonAlign}-align design-${attributes.layout} icon-pos-${attributes.iconPosition}`,
	});

	function MarketingButtonIcon() {
		return (
			<div
				className="blockons-mb-icon"
				style={{
					...(attributes.iconPosition === "one" ||
					attributes.iconPosition === "three"
						? { marginRight: attributes.iconSpacing }
						: { marginLeft: attributes.iconSpacing }),
					color: attributes.iconColor,
				}}
			>
				<FontAwesomeIcon
					icon={
						attributes.customIcon && attributes.customIconName
							? attributes.customIconName
							: attributes.theIcon
					}
					iconSize={attributes.iconSize}
				/>
			</div>
		);
	}

	return (
		<div {...blockProps}>
			<div className="blockons-marketing-button-block">
				<a
					{...(attributes.linkTo ? { href: attributes.linkTo } : "")}
					{...(attributes.linkTarget ? { target: "_blank" } : "")}
					className="blockons-marketing-button"
					style={{
						paddingLeft: attributes.horizPad,
						paddingRight: attributes.hasIcon
							? attributes.horizPad + 4
							: attributes.horizPad,
						paddingTop: attributes.vertPad,
						paddingBottom: attributes.vertPad,
						minWidth: attributes.mbMinWidth,
						minHeight: attributes.mbMinHeight,
						borderRadius: attributes.bRadius,
						backgroundColor: attributes.bgColor,
						borderColor: attributes.borderColor,
					}}
					rel="noopener"
				>
					{attributes.hasIcon && attributes.iconPosition === "three" && (
						<MarketingButtonIcon />
					)}
					<div className="blockons-marketing-button-inner">
						<div className="blockons-marketing-button-title-wrap">
							{attributes.hasIcon && attributes.iconPosition === "one" && (
								<MarketingButtonIcon />
							)}
							<RichText.Content
								tagName="div"
								value={attributes.title}
								className="blockons-marketing-button-title"
								style={{
									color: attributes.titleColor,
									fontSize: attributes.titleSize,
								}}
							/>
							{attributes.hasIcon && attributes.iconPosition === "two" && (
								<MarketingButtonIcon />
							)}
						</div>
						{attributes.showSubText && (
							<div className="blockons-marketing-button-text-wrap">
								<RichText.Content
									tagName="p"
									value={attributes.subText}
									className="blockons-marketing-button-text"
									style={{
										color: attributes.textColor,
										fontSize: attributes.textSize,
									}}
								/>
							</div>
						)}
					</div>
					{attributes.hasIcon && attributes.iconPosition === "four" && (
						<MarketingButtonIcon />
					)}
				</a>
			</div>
		</div>
	);
};

export default Save;
