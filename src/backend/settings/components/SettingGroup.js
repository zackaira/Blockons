const SettingGroup = ({ label, children }) => {
	return (
		<tr className="blockons-row blockons-group-row">
			<th>{label}</th>
			<td>
				<div className="blockons-group">
					<a className="blockons-group-btn">
						<span className="dashicons dashicons-edit"></span>
					</a>
					<div className="blockons-group-container">
						<table className="form-table" role="presentation">
							<tbody>{children}</tbody>
						</table>
					</div>
				</div>
			</td>
		</tr>
	);
};

export default SettingGroup;
