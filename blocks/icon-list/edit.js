import { __ } from '@wordpress/i18n';
import {
	RichText,
	AlignmentToolbar,
	BlockControls,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Dropdown,
	SelectControl,
	RangeControl,
	Button,
} from '@wordpress/components';
import BlockonsColorpicker from '../_components/BlockonsColorpicker';
import FontAwesomeIcon from '../_components/FontAwesomeIcon';
import { colorPickerPalette, slugify, iconListIcons } from '../block-global';

const Edit = (props) => {
	const {
		isSelected,
		attributes: {
			alignment,
			listItems,
			listItemsLayout,
			listItemSpacing,
			listItemIconSpacing,
			listItemIconSize,
			listItemIconColor,
			listItemFontSize,
			listItemFontColor,
		},
		setAttributes,
	} = props;

	const blockProps = useBlockProps({
		className: `${alignment} items-${listItemsLayout}`,
	});

	const onChangeAlignment = (newAlignment) => {
		setAttributes({
			alignment:
				newAlignment === undefined ? 'none' : 'align-' + newAlignment,
		});
	};

	// Item Control Functions
	const handleItemIconChange = (itemIcon, itemId) => {
		const newListItems = [...listItems];
		const editedListItems = newListItems.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemIcon: itemIcon,
				};
			return obj;
		});
		setAttributes({ listItems: editedListItems });
	};
	const handleItemIconSizeChange = (itemIconSize, itemId) => {
		const newListItems = [...listItems];
		const editedListItems = newListItems.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemIconSize: itemIconSize,
				};
			return obj;
		});
		setAttributes({ listItems: editedListItems });
	};
	const handleItemIconColorChange = (itemIconColor, itemId) => {
		const newListItems = [...listItems];
		const editedListItems = newListItems.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemIconColor: itemIconColor,
				};
			return obj;
		});
		setAttributes({ listItems: editedListItems });
	};
	const handleItemTextSizeChange = (itemTextSize, itemId) => {
		const newListItems = [...listItems];
		const editedListItems = newListItems.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemTextSize: itemTextSize,
				};
			return obj;
		});
		setAttributes({ listItems: editedListItems });
	};
	const handleItemTextColorChange = (itemTextColor, itemId) => {
		const newListItems = [...listItems];
		const editedListItems = newListItems.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemTextColor: itemTextColor,
				};
			return obj;
		});
		setAttributes({ listItems: editedListItems });
	};
	const handleItemSpacingChange = (itemSpacing, itemId) => {
		const newListItems = [...listItems];
		const editedListItems = newListItems.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemSpacing: itemSpacing,
				};
			return obj;
		});
		setAttributes({ listItems: editedListItems });
	};
	const handleItemTextChange = (itemText, itemId) => {
		const newListItems = [...listItems];
		const editedListItems = newListItems.map((obj) => {
			if (obj.itemId === itemId)
				return {
					...obj,
					itemId:
						itemId === ''
							? Math.floor(Math.random() * 700)
							: slugify(itemText),
					itemText: itemText,
				};
			return obj;
		});
		setAttributes({ listItems: editedListItems });
	};
	const handleAddItem = () => {
		const newListItems = [...listItems];
		newListItems.push({
			itemId: newListItems.length + 1,
			itemText: '',
			itemTextSize: null,
			itemTextColor: null,
			itemIcon: 'check',
			itemIconSize: null,
			itemIconColor: null,
			itemSpacing: 5,
		});
		setAttributes({ listItems: newListItems });
	};

	const handleRemoveItem = (index) => {
		const newListItems = [...listItems];
		newListItems.splice(index, 1);
		setAttributes({ listItems: newListItems });
	};

	const handleDuplicateItem = (
		index,
		text,
		textSize,
		textColor,
		icon,
		iconSize,
		iconColor,
		spacing,
	) => {
		const newListItems = [...listItems];
		newListItems.splice(index + 1, 0, {
			itemId: Math.floor(Math.random() * 700) + 1,
			itemText: text,
			itemTextSize: textSize,
			itemTextColor: textColor,
			itemIcon: icon,
			itemIconSize: iconSize,
			itemIconColor: iconColor,
			itemSpacing: spacing,
		});
		setAttributes({ listItems: newListItems });
	};

	const handleMoveItemUp = (index) => {
		if (index === 0) return; // Can't move up if first item
		const newListItems = [...listItems];
		const temp = newListItems[index];
		newListItems[index] = newListItems[index - 1];
		newListItems[index - 1] = temp;
		setAttributes({ listItems: newListItems });
	};

	const handleMoveItemDown = (index) => {
		if (index === listItems.length - 1) return; // Can't move down if last item
		const newListItems = [...listItems];
		const temp = newListItems[index];
		newListItems[index] = newListItems[index + 1];
		newListItems[index + 1] = temp;
		setAttributes({ listItems: newListItems });
	};

	// Icon List Items
	let listItemDisplay;

	if (listItems.length) {
		listItemDisplay = listItems.map((listItem, index) => {
			return (
				<li
					className="blockons-list-item"
					style={{
						...(listItemsLayout === 'horizontal'
							? { marginRight: listItemSpacing }
							: { marginBottom: listItemSpacing }),
						fontSize: listItem.itemTextSize
							? listItem.itemTextSize
							: listItemFontSize,
						color: listItem.itemTextColor
							? listItem.itemTextColor
							: listItemFontColor,
					}}
				>
					<div
						className="blockons-list-item-icon"
						style={{
							marginRight: listItem.itemSpacing
								? listItem.itemSpacing
								: listItemIconSpacing,
							color: listItem.itemIconColor
								? listItem.itemIconColor
								: listItemIconColor,
						}}
					>
						<Dropdown
							contentClassName="blockons-editor-popup blockons-icon-selecter icon-list"
							popoverProps={{ placement: 'bottom-start' }}
							renderToggle={({ isOpen, onToggle }) => (
								<FontAwesomeIcon
									icon={listItem.itemIcon}
									iconSize={
										listItem.itemIconSize
											? listItem.itemIconSize
											: listItemIconSize
									}
									onClick={onToggle}
								/>
							)}
							renderContent={() =>
								Object.keys(iconListIcons).map((icon) => (
									<FontAwesomeIcon
										icon={icon}
										iconSize={20}
										onClick={() =>
											handleItemIconChange(
												icon,
												listItem.itemId,
											)
										}
									/>
								))
							}
						/>
					</div>
					<RichText
						tagName="div"
						placeholder={__('#ListItem', 'blockons')}
						value={listItem.itemText}
						multiline={false}
						className="blockons-list-item-text"
						onChange={(itemText) =>
							handleItemTextChange(itemText, listItem.itemId)
						}
					/>
					<div className="blockons-item-btns">
						<Button
							className="blockons-move-item-up"
							icon={
								listItemsLayout === 'horizontal'
									? 'arrow-left-alt2'
									: 'arrow-up-alt2'
							}
							label={
								listItemsLayout === 'horizontal'
									? 'Move Item Left'
									: 'Move Item Up'
							}
							onClick={() => handleMoveItemUp(index)}
							disabled={index === 0}
						/>
						<Button
							className="blockons-move-item-down"
							icon={
								listItemsLayout === 'horizontal'
									? 'arrow-right-alt2'
									: 'arrow-down-alt2'
							}
							label={
								listItemsLayout === 'horizontal'
									? 'Move Item Right'
									: 'Move Item Down'
							}
							onClick={() => handleMoveItemDown(index)}
							disabled={index === listItems.length - 1}
						/>
						<Dropdown
							className="blockons-item-level-settings"
							contentClassName="blockons-editor-popup"
							popoverProps={{ placement: 'bottom-end' }}
							renderToggle={({ isOpen, onToggle }) => (
								<Button
									icon="art"
									label={__('List Item Colors', 'blockons')}
									onClick={onToggle}
									aria-expanded={isOpen}
								/>
							)}
							renderContent={() => (
								<>
									<p>{__('Text Size & Color', 'blockons')}</p>
									<RangeControl
										value={
											listItem.itemTextSize
												? listItem.itemTextSize
												: listItemFontSize
										}
										onChange={(textSize) =>
											handleItemTextSizeChange(
												textSize,
												listItem.itemId,
											)
										}
										min={10}
										max={64}
									/>
									<BlockonsColorpicker
										label={__('Text Color', 'blockons')}
										value={
											listItem.itemTextColor
												? listItem.itemTextColor
												: listItemFontColor
										}
										onChange={(itemSize) =>
											handleItemTextColorChange(
												itemSize,
												listItem.itemId,
											)
										}
										paletteColors={colorPickerPalette}
									/>

									<p>{__('Icon Size & Color', 'blockons')}</p>
									<RangeControl
										value={
											listItem.itemIconSize
												? listItem.itemIconSize
												: listItemIconSize
										}
										onChange={(itemSize) =>
											handleItemIconSizeChange(
												itemSize,
												listItem.itemId,
											)
										}
										min={10}
										max={98}
									/>
									<BlockonsColorpicker
										label={__('Icon Color', 'blockons')}
										value={
											listItem.itemIconColor
												? listItem.itemIconColor
												: listItemIconColor
										}
										onChange={(itemSize) =>
											handleItemIconColorChange(
												itemSize,
												listItem.itemId,
											)
										}
										paletteColors={colorPickerPalette}
									/>

									<RangeControl
										label={__(
											'Icon & Text Spacing',
											'blockons',
										)}
										value={
											listItem.itemSpacing
												? listItem.itemSpacing
												: listItemIconSpacing
										}
										onChange={(itemSpacing) =>
											handleItemSpacingChange(
												itemSpacing,
												listItem.itemId,
											)
										}
										min={0}
										max={80}
									/>
								</>
							)}
						/>
						<Button
							className="blockons-duplicate-item"
							icon="admin-page"
							label="Duplicate Item"
							onClick={() =>
								handleDuplicateItem(
									index,
									listItem.itemText,
									listItem.itemTextSize,
									listItem.itemTextColor,
									listItem.itemIcon,
									listItem.itemIconSize,
									listItem.itemIconColor,
									listItem.itemSpacing,
								)
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
						title={__('Icon List Settings', 'blockons')}
						initialOpen={true}
					>
						<SelectControl
							label={__('List Layout', 'blockons')}
							value={listItemsLayout}
							options={[
								{
									label: __('Vertical', 'blockons'),
									value: 'vertical',
								},
								{
									label: __('Horizontal', 'blockons'),
									value: 'horizontal',
								},
							]}
							onChange={(newValue) =>
								setAttributes({
									listItemsLayout:
										newValue === undefined
											? 'vertical'
											: newValue,
								})
							}
						/>

						<RangeControl
							label={__('Item Spacing', 'blockons')}
							value={listItemSpacing}
							onChange={(newValue) =>
								setAttributes({
									listItemSpacing: parseInt(newValue),
								})
							}
							min={0}
							max={100}
						/>
						<RangeControl
							label={__('Icon & Text Spacing', 'blockons')}
							value={listItemIconSpacing}
							onChange={(newValue) =>
								setAttributes({
									listItemIconSpacing: parseInt(newValue),
								})
							}
							min={0}
							max={80}
						/>
					</PanelBody>
					<PanelBody
						title={__('Icon List Design', 'blockons')}
						initialOpen={false}
					>
						<RangeControl
							label={__('Font Size', 'blockons')}
							value={listItemFontSize}
							onChange={(newValue) =>
								setAttributes({
									listItemFontSize: parseInt(newValue),
								})
							}
							min={10}
							max={64}
						/>
						<BlockonsColorpicker
							label={__('Font Color', 'blockons')}
							value={listItemFontColor}
							onChange={(newColor) => {
								setAttributes({ listItemFontColor: newColor });
							}}
							paletteColors={colorPickerPalette}
						/>
						<RangeControl
							label={__('Icon Size', 'blockons')}
							value={listItemIconSize}
							onChange={(newFontSize) => {
								setAttributes({
									listItemIconSize: newFontSize,
								});
							}}
							min={10}
							max={98}
						/>
						<BlockonsColorpicker
							label={__('Icon Color', 'blockons')}
							value={listItemIconColor}
							onChange={(newColor) => {
								setAttributes({ listItemIconColor: newColor });
							}}
							paletteColors={colorPickerPalette}
						/>
					</PanelBody>
				</InspectorControls>
			)}
			{
				<BlockControls>
					<AlignmentToolbar
						value={alignment}
						onChange={onChangeAlignment}
					/>
				</BlockControls>
			}
			<div className={`blockons-list-align`}>
				<ul className="blockons-list-wrap">{listItemDisplay}</ul>
				{isSelected && (
					<div
						className={`blockons-add-new ${
							listItemDisplay === undefined
								? 'no-items'
								: 'has-items'
						}`}
					>
						<Button variant="secondary" onClick={handleAddItem}>
							{__('Add List Item', 'blockons')}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default Edit;
