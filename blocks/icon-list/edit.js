/**
 * WordPress dependencies
 */
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
	RichText,
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from "@wordpress/block-editor";
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	CheckboxControl,
	TextControl,
	RangeControl,
	ColorPalette,
	Button,
} from "@wordpress/components";

import { colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const {
		isSelected,
		attributes: { alignment, listItems },
	} = props;

	const [showDropDown, setShowDropDown] = useState(false);

	const blockProps = useBlockProps({
		className: alignment,
	});

	const onChangeAlignment = (newAlignment) => {
		props.setAttributes({
			alignment: newAlignment === undefined ? "none" : "align-" + newAlignment,
		});
	};
	const onChangeCustomIcon = (value) => {
		props.setAttributes({ customIcon: value });
	};

	// Item Control Functions
	const handleItemChange = (itemText, index) => {
		const newListItems = [...listItems];
		newListItems[index].itemText = itemText;
		props.setAttributes({ listItems: newListItems });
	};
	const handleAddItem = () => {
		const newListItems = [...listItems];
		newListItems.push({
			itemId: newListItems.length + 1,
			itemText: "",
			itemIcon: "yes",
		});
		props.setAttributes({ listItems: newListItems });
	};

	const handleRemoveItem = (index) => {
		const newListItems = [...listItems];
		newListItems.splice(index, 1);
		props.setAttributes({ listItems: newListItems });
	};

	const handleDuplicateItem = (index, icon, text) => {
		const newListItems = [...listItems];
		newListItems.splice(index + 1, 0, {
			itemId: newListItems.length + 1,
			itemText: text,
			itemIcon: icon,
		});
		props.setAttributes({ listItems: newListItems });
	};

	// Icon List Items
	let listItemDisplay;

	if (listItems.length) {
		listItemDisplay = listItems.map((listItem, index) => {
			return (
				<li className="blockons-list-item">
					<div className="blockons-list-item-icon">
						<span className="fa-solid fa-check"></span>
					</div>
					<RichText
						tagName="div"
						placeholder={__("List Item", "blockons")}
						// keepPlaceholderOnFocus
						value={listItem.itemText}
						// multiline={false}
						className="blockons-list-item-text"
						onChange={(itemText) => handleItemChange(itemText, index)}
					/>
					<div className="blockons-item-btns">
						<Button
							className="blockons-duplicate-item"
							icon="admin-page"
							label="Duplicate Item"
							onClick={() =>
								handleDuplicateItem(index, listItem.itemIcon, listItem.itemText)
							}
						/>
						<Button
							className="blockons-remove-item"
							icon="no-alt"
							label="Delete Item"
							onClick={() => handleRemoveItem(index)}
						/>
					</div>
				</li>
			);
		});
	}

	return (
		<div {...blockProps}>
			{isSelected && (
				<InspectorControls>
					<PanelBody
						title={__("Icon List Settings", "blockons")}
						initialOpen={true}
					>
						{/* <ToggleControl
							label={__("Add Drop Down Menu", "blockons")}
							help={__(
								"Add a drop down menu on hover to display account page links.",
								"blockons"
							)}
							checked={hasDropdown}
							onChange={(newValue) => {
								props.setAttributes({
									hasDropdown: newValue,
								});
							}}
						/> */}
						empty
					</PanelBody>
					<PanelBody
						title={__("Icon List Design", "blockons")}
						initialOpen={false}
					>
						nothing here yet
						{/* <SelectControl
							label={__("Select a default Icon", "blockons")}
							value={icon}
							options={[
								{
									label: __("User Outline", "blockons"),
									value: "fa-regular fa-user",
								},
								{ label: __("User", "blockons"), value: "fa-solid fa-user" },
								{
									label: __("Circle User", "blockons"),
									value: "fa-solid fa-circle-user",
								},
								{
									label: __("Person", "blockons"),
									value: "fa-solid fa-person",
								},
								{ label: __("Custom Icon", "blockons"), value: "custom" },
							]}
							onChange={(newIcon) =>
								props.setAttributes({
									icon: newIcon === undefined ? "fa-regular fa-user" : newIcon,
								})
							}
							__nextHasNoMarginBottom
						/>
						{icon === "custom" && (
							<>
								<TextControl
									label={__("Icon Name", "blockons")}
									value={customIcon}
									onChange={onChangeCustomIcon}
									help={__(
										"Add your own custom icon by adding the Font Awesome icon full name",
										"blockons"
									)}
								/>
								<div className="helplink fixmargin">
									<a href="#" target="_blank">
										{__("Read More")}
									</a>
								</div>
							</>
						)} */}
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<AlignmentToolbar value={alignment} onChange={onChangeAlignment} />
				</BlockControls>
			}
			<div className={`blockons-list-align`}>
				<ul className="blockons-list-wrap">{listItemDisplay}</ul>
				<div
					className={`blockons-add-new ${
						listItemDisplay === undefined ? "no-items" : "has-items"
					}`}
				>
					<Button variant="secondary" onClick={handleAddItem}>
						{__("Add List Item", "blockons")}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Edit;
