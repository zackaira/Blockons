import { RichText, useBlockProps } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";

const Save = ({ attributes }) => {
	const pluginUrl = blockonsEditorObj.pluginUrl || "";
	const blockProps = useBlockProps.save({
		className: `align-${attributes.alignment}`,
	});

	return (
		<div {...blockProps}>
			<div
				className={`blockons-image-comparison-wrap handle-${attributes.handle}`}
				style={{
					width: attributes.maxWidth,
				}}
			>
				{attributes.imageBefore.url && attributes.imageAfter.url ? (
					<img-comparison-slider
						tabindex="0"
						className="rendered"
						{...(attributes.automatic ? { hover: "hover" } : { hover: false })}
						direction={attributes.slideDirection}
						style={{
							"--divider-color": attributes.handleColor,
							"--default-handle-color": attributes.handleColor,
							...(attributes.handle === "four"
								? {
										"--divider-width": 4,
										"--default-handle-opacity": 0,
								}
								: {}),
						}}
					>
						<div slot="first" className="before">
							<img width="100%" src={attributes.imageBefore?.url} />

							{attributes.imageLabels && (
								<RichText.Content
									tagName="div"
									value={attributes.before}
									className="blockons-ic-title before"
									style={{
										color: attributes.labelColor,
									}}
								/>
							)}
						</div>
						<div slot="second" className="after">
							<img width="100%" src={attributes.imageAfter?.url} />

							{attributes.imageLabels && (
								<RichText.Content
									tagName="div"
									value={attributes.after}
									className="blockons-ic-title after"
									style={{
										color: attributes.labelColor,
									}}
								/>
							)}
						</div>

						{attributes.handle === "one" && (
							<div
								className="handle-bar"
								slot="handle"
								style={{
									backgroundColor: attributes.handleColor,
									borderColor: attributes.handleColor,
								}}
							></div>
						)}
						{attributes.handle === "three" && (
							<svg
								slot="handle"
								class="large-arrow-handle"
								xmlns="http://www.w3.org/2000/svg"
								width="100"
								viewBox="-8 -3 16 6"
							>
								<path
									stroke={attributes.handleColor}
									d="M -5 -2 L -7 0 L -5 2 M -5 -2 L -5 2 M 5 -2 L 7 0 L 5 2 M 5 -2 L 5 2"
									stroke-width="1"
									fill={attributes.handleColor}
									vector-effect="non-scaling-stroke"
								></path>
							</svg>
						)}
					</img-comparison-slider>
				) : (
					<div className="aspect-ratio ratio-32rectangle noimg">
						<div className="aspect-img">
							{attributes.imageAfter.url && `<-- ${__("Add A Second Image", "blockons")}`}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default Save;
