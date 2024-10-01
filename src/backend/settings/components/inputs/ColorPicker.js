import { useState, useEffect } from "@wordpress/element";
import { ChromePicker } from "react-color";
import { blockonsConvertToSlug } from "../../../helpers";
import { __ } from "@wordpress/i18n";

const ColorPicker = (props) => {
	const colorTitleSlug =
		blockonsConvertToSlug(props.slug) || blockonsConvertToSlug(props.title);
	const defaultValue = props.defaultValue || "#BBB";
	const [activeColor, setActiveColor] = useState(defaultValue);
	const [isPickerOpen, setIsPickerOpen] = useState(false);

	useEffect(() => {
		if (props.value) {
			setActiveColor(props.value);
		}
	}, [props.value]);

	// Handle button click to toggle the color picker visibility
	const toggleColorPicker = (e) => {
		e.preventDefault();
		setIsPickerOpen((prev) => !prev);
	};

	// Handle color change in the ChromePicker component
	const handleColorChange = (newColor) => {
		setActiveColor(newColor.hex);
		props.onChange({ name: colorTitleSlug, value: newColor.hex }); // Call parent's onChange handler
	};

	// Close the color picker if clicked outside
	const handleOutsideClick = (e) => {
		if (!e.target.closest(".blockonsColorPicker") && isPickerOpen) {
			setIsPickerOpen(false);
		}
	};

	// Add event listener for clicks outside the component
	useEffect(() => {
		if (isPickerOpen) {
			window.addEventListener("click", handleOutsideClick);
		} else {
			window.removeEventListener("click", handleOutsideClick);
		}

		return () => window.removeEventListener("click", handleOutsideClick); // Clean up
	}, [isPickerOpen]);

	return (
		<div
			className={`blockonsColorPicker ${
				isPickerOpen ? "blockonsButton-active" : ""
			}`}
		>
			<div className="blockonsColorDisplay">
				<button
					className="blockonsColorBtn"
					style={{ backgroundColor: activeColor }}
					onClick={toggleColorPicker}
				>
					<span className="blockonsColorBtnTxt">
						{__("Select Color", "blockons")}
					</span>
				</button>
				<input
					type="text"
					id={colorTitleSlug}
					value={activeColor || ""}
					className="blockonsColorInput"
					disabled
					onChange={props.onChange}
				/>
			</div>

			{isPickerOpen && (
				<div className="blockonsPickColor">
					<ChromePicker
						color={activeColor}
						onChange={handleColorChange}
						disableAlpha={true}
					/>
				</div>
			)}
		</div>
	);
};

export default ColorPicker;
