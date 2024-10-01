const SettingNote = ({ title, note }) => {
	return (
		<tr className="blockons-row blockons-note-row">
			<th>{title && title}</th>
			<td>{note && <p className="blockons-note">{note}</p>}</td>
		</tr>
	);
};

export default SettingNote;
