const FontAwesomeIcon = (props) => {
	const { icon, iconSize, onClick, style } = props;

	return (
		<span
			className={`blockons-fontawesome fa-solid fa-${icon}`}
			style={{
				...style,
				fontSize: iconSize ? iconSize : "inherit",
			}}
			onClick={onClick ? onClick : null}
		></span>
	);
};

export default FontAwesomeIcon;
