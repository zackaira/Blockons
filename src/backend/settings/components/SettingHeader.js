const SettingHeader = ({ title, description, topSpace }) => {
	return (
		<div
			className="blockons-header"
			{...(topSpace ? { style: { marginTop: `${topSpace}px` } } : {})}
		>
			{title && <h3 className="blockons-title">{title}</h3>}
			{description && <p>{description}</p>}
		</div>
	);
};

export default SettingHeader;
