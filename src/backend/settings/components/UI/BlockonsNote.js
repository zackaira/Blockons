import { __ } from "@wordpress/i18n";

const BlockonsNote = ({
	imageUrl,
	title,
	text,
	docLink,
	upgradeLink,
	upgradeText,
	proFeatures,
	noline,
}) => {
	return (
		<div className={`blockons-editor-note ${noline ? "noline" : ""}`}>
			{imageUrl && (
				<div className="bl-note-img">
					<img src={imageUrl} alt={title} />
				</div>
			)}
			{title && <h4 className="bl-note-title">{title}</h4>}
			{text && <div className="bl-note-txt">{text}</div>}
			{proFeatures && (
				<div className="bl-note-features">
					{proFeatures.map((feature, i) => (
						<div key={i} className="bl-note-feature">
							{feature}
						</div>
					))}
				</div>
			)}

			{(docLink || upgradeLink) && (
				<div className="bl-note-links">
					{docLink && (
						<a href={docLink} className="bl-note-link" target="_blank">
							{__("Read Documentation", "blockons")}
						</a>
					)}
					{upgradeLink && (
						<a
							href={upgradeLink}
							className="bl-note-link upgrade"
							target="_blank"
						>
							{upgradeText ? upgradeText : __("Upgrade to Pro", "blockons")}
						</a>
					)}
				</div>
			)}
		</div>
	);
};

export default BlockonsNote;
