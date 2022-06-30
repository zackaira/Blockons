import {
	Dropdown,
	Button,
	ColorIndicator,
	ColorPalette,
} from "@wordpress/components";

const BlockonsColorpicker = (props) => {
	const { label, value, onChange, paletteColors } = props;

	return (
		<Dropdown
			className="blockons-colorpicker"
			contentClassName="blockons-editor-popup blockons-colorpicker-popup"
			position="bottom left"
			renderToggle={({ isOpen, onToggle }) => (
				<Button
					variant="link"
					onClick={onToggle}
					className="blockons-colorpicker-btn"
				>
					<ColorIndicator colorValue={value} />
					<span>{label}</span>
				</Button>
			)}
			renderContent={() => (
				<ColorPalette
					colors={paletteColors}
					value={value}
					onChange={onChange}
				/>
			)}
		/>
	);
};

export default BlockonsColorpicker;
