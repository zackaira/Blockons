import { useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const pluginUrl = blockonsEditorObj.pluginUrl || "";
	const blockProps = useBlockProps.save({
		className: ``,
	});

	let nValue = 0;
	const images = attributes.galleryImages.map((imageItem, index) => {
		const imageCount = index;
		if (imageCount % 11 === 0) nValue++;
		const canFlip =
			(attributes.layout === "grid" || attributes.layout === "featured") &&
			(attributes.imageCaption === "flipup" ||
				attributes.imageCaption === "flipside") &&
			imageItem.imageCaption
				? "flip"
				: "";

		return (
			<div
				className={`blockons-gallery-item ${attributes.layout} ${canFlip}`}
				style={{
					...(attributes.layout === "masonry"
						? {
								width: `calc((100% / ${attributes.columns}) - (${Math.floor(
									attributes.gridGap / 2
								)}px * 2))`,
								margin: `0 ${Math.floor(attributes.gridGap / 2)}px ${
									attributes.gridGap
								}px`,
						  }
						: {}),
					...(attributes.layout === "featured"
						? {
								// backgroundImage: `url(${imageItem.imageUrl})`,
								"--n": `${nValue - 1}`,
						  }
						: {}),
					...(attributes.imageBgColor !== "#f0f0f0"
						? {
								backgroundColor: attributes.imageBgColor,
						  }
						: {}),
				}}
			>
				<div className="blockons-gallery-item-inner">
					{attributes.layout === "featured" && imageItem.imageUrl && (
						<div
							className={`blockons-gallery-img ${
								attributes.isPremium && attributes.popupEnable
									? `blockons-popup icon-${attributes.popupIcon} icon-${attributes.popupIconPos} icon-${attributes.popupIconColor}`
									: ""
							}`}
							{...(attributes.isPremium && attributes.popupEnable && imageItem.imageCaption ? {
								"data-imgcaption": imageItem.imageCaption
							} : {})}
						>
							<img src={imageItem.imageUrl} alt={imageItem.alt} />
						</div>
					)}
					{(attributes.layout === "grid" ||
						attributes.layout === "masonry") && (
						<div
							className={`blockons-gallery-img ${
								attributes.isPremium && attributes.popupEnable
									? `blockons-popup icon-${attributes.popupIcon} icon-${attributes.popupIconPos} icon-${attributes.popupIconColor}`
									: ""
							} ${attributes.imageProportion !== "actual" ? `aspect-ratio ratio-${attributes.imageProportion}` : !imageItem.imageUrl ? `aspect-ratio ratio-169panoramic` : ""} ${!imageItem.imageUrl ? `noimg` : ""}`}
							{...(attributes.isPremium && attributes.popupEnable && imageItem.imageCaption ? {
								"data-imgcaption": imageItem.imageCaption
							} : {})}
						>
							{imageItem.imageUrl && <div class="aspect-img"><img src={imageItem.imageUrl} alt={imageItem.alt} /></div>}
						</div>
					)}

					{attributes.imageCaption !== "none" && imageItem.imageCaption && (
						<div
							className="blockons-gallery-caption"
							style={{
								...(attributes.imageCaption === "flipup" ||
								attributes.imageCaption === "flipside" ||
								attributes.imageCaption === "below"
									? {
											backgroundColor: attributes.captionBgColor,
											opacity: attributes.captionOpacity,
									  }
									: {}),
							}}
						>
							<div
								className="blockons-gallery-caption-inner"
								style={{
									color: attributes.captionFontColor,
									fontSize: attributes.captionFontSize,
								}}
							>
								{(attributes.imageCaption === "bottom" ||
									attributes.imageCaption === "over" ||
									attributes.imageCaption === "below") && (
									<div
										className="caption-bg"
										style={{
											backgroundColor: attributes.captionBgColor,
											opacity: attributes.captionOpacity,
										}}
									></div>
								)}
								<span>{imageItem.imageCaption}</span>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	});

	return (
		<div {...blockProps}>
			<div
				className={`blockons-gallery ${attributes.layout} cols-${
					attributes.columns
				} ${attributes.imageProportion !== "actual" ? "imgfull" : ""} caption-${
					attributes.imageCaption
				} effect-${attributes.imageHover} ${
					(attributes.imageCaption === "plain" ||
						attributes.imageCaption === "bottom" ||
						attributes.imageCaption === "over") &&
					attributes.captionOnHover
						? `caption-hover caption-${attributes.captionAnimation}`
						: ""
				} ${attributes.popupIconOnHover ? "icon-hover" : ""}`}
				id={attributes.uniqueId}
				style={
					attributes.layout === "masonry"
						? {
								margin: `0 -${Math.floor(attributes.gridGap / 2)}px`,
						  }
						: {
								"grid-gap": attributes.gridGap,
						  }
				}
				{...(attributes.popupEnable
					? {
							"data-popup": JSON.stringify({
								caption: attributes.popupCaption,
								infinite: attributes.popupInfiniteGal,
							}),
					  }
					: {})}
			>
				{images.map((image, index) => image)}
			</div>
		</div>
	);
};

export default Save;
