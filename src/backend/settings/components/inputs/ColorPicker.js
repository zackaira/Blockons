import React, { useState, useEffect } from "react";
import ReactTestUtils from "react-dom/test-utils";
import { ChromePicker } from "react-color";
import { blockonsConvertToSlug } from "../../../helpers";
import { __ } from "@wordpress/i18n";

const ColorPicker = (props) => {
	const colorTitleSlug = blockonsConvertToSlug(props.slug)
		? blockonsConvertToSlug(props.slug)
		: blockonsConvertToSlug(props.title);
	const defaultValue = props.defaultValue ? props.defaultValue : "#BBB";
	const [activeColor, setActiveColor] = useState(defaultValue);
	let allBtns = document.getElementsByClassName("blockonsColorPicker");

	useEffect(() => {
		props.value ? setActiveColor(props.value) : defaultValue;
	}, [props.value]);

	const onButtonFocus = (e) => {
		e.preventDefault();
		[...allBtns].forEach(function (item) {
			item.classList.remove("blockonsButton-active");
			item.removeAttribute("id");
		});

		console.log(e.target);

		e.target
			.closest(".blockonsColorPicker")
			.setAttribute("id", "openColorPicker");
		e.target
			.closest(".blockonsColorPicker")
			.classList.add("blockonsButton-active");
	};

	window.addEventListener("click", function (e) {
		const isElement = document.getElementById("openColorPicker");

		if (isElement) {
			if (!e.target == isElement || !isElement.contains(e.target)) {
				isElement.removeAttribute("id");
				isElement
					.closest(".blockonsColorPicker")
					.classList.remove("blockonsButton-active");
			}
		}
	});

	const handleColorChange = (newColor) => {
		if (typeof newColor === "object" && newColor !== null) {
			setActiveColor(newColor.hex);
		} else {
			setActiveColor(newColor);
		}
	};

	const changeColor = (newColor) => {
		const valueHolderColor = document.getElementById(colorTitleSlug);

		// Simulate onChange event for hidden input
		ReactTestUtils.Simulate.change(valueHolderColor, {
			target: {
				name: colorTitleSlug,
				value:
					typeof newColor === "object" && newColor !== null
						? newColor.hex
						: newColor,
			},
		});
	};

	return (
		<React.Fragment>
			<div className="blockonsColorPicker">
				<div className="blockonsColorDisplay">
					<button
						className="blockonsColorBtn"
						style={{ backgroundColor: activeColor }}
						onClick={(e) => onButtonFocus(e)}
						// onFocus={(e) => onButtonFocus(e)}
						// onBlur={(e) => onButtonBlur(e)}
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
				<div className="blockonsPickColor">
					<ChromePicker
						color={activeColor}
						onChange={(newColor) => handleColorChange(newColor)}
						disableAlpha={true}
						onChangeComplete={(newColor) => changeColor(newColor)}
					/>
				</div>
			</div>
		</React.Fragment>
	);
};

export default ColorPicker;
