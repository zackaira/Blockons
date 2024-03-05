import React from "react";

const SettingNote = ({ title, note }) => {
	return (
		<React.Fragment>
			<tr className="blockons-row blockons-note-row">
				<th>{title && title}</th>
				<td>{note && <p className="blockons-note">{note}</p>}</td>
			</tr>
		</React.Fragment>
	);
};

export default SettingNote;
