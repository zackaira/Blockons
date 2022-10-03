import React from "react";

const SettingGroup = ({ label, children }) => {
	return (
		<React.Fragment>
			<tr>
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
		</React.Fragment>
	);
};

export default SettingGroup;
