// WordPress Dependencies
const { Component } = wp.element;

// Custom Component
class FontAwesomeIcon extends Component {
	render() {
		const { icon, iconSize, onClick, style } = this.props;

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
	}
}

export default FontAwesomeIcon;
