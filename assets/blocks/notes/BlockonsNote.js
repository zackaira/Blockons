import React from "react";

const BlockonsNote = ({ imageUrl, title, text, link }) => {
	return (
		<div className="blockons-editor-note">
			{imageUrl && (
				<div className="bl-note-img">
					<img src={imageUrl} alt={title} />
				</div>
			)}
			{title && <h4 className="bl-note-title">{title}</h4>}
			{text && <div className="bl-note-txt">{text}</div>}
			{link && (
				<a href={link} className="bl-note-link">
					{__("Read More", "blockons")}
				</a>
			)}
		</div>
	);
};

export default BlockonsNote;
