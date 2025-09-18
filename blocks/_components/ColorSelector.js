import {
	Dropdown,
	Button,
	ColorIndicator,
	ColorPalette,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { colorPickerPalette } from '../block-global';

const ColorSelector = (props) => {
	const { label, value, onChange, nomargin } = props;

	// Get theme color palette, fallback to paletteColors prop if no theme colors
	const themeColors = useSelect((select) => {
		const settings = select('core/block-editor').getSettings();
		return settings.colors || [];
	}, []);

	// Use theme colors if available, otherwise fall back to provided paletteColors
	const colorsToUse =
		themeColors && themeColors.length > 0
			? themeColors
			: colorPickerPalette || [];

	return (
		<Dropdown
			className="blockons-native-colorpicker blockons-set-full nomargin"
			contentClassName="blockons-editor-popup blockons-colorpicker-popup"
			popoverProps={{ placement: 'left-start' }}
			renderToggle={({ isOpen, onToggle }) => (
				<Button
					variant="link"
					onClick={onToggle}
					className={`blockons-btn-colorpicker ${nomargin ? 'nomargin' : ''}`}
				>
					<ColorIndicator colorValue={value} />
					<span>{label}</span>
				</Button>
			)}
			renderContent={() => (
				<ColorPalette
					colors={colorsToUse}
					value={value}
					onChange={onChange}
				/>
			)}
		/>
	);
};

export default ColorSelector;
