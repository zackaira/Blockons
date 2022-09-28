import {
	RichText,
	InnerBlocks,
	useBlockProps,
	InspectorControls,
} from "@wordpress/block-editor";
import { useState } from "@wordpress/element";
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
import {
	Dropdown,
	TextControl,
	ToggleControl,
	PanelBody,
	SelectControl,
	RangeControl,
} from "@wordpress/components";
import { subscribe } from "@wordpress/data";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import {
	elementTags,
	accordionArrowIcons,
	colorPickerPalette,
} from "../block-global";

// Registering Child Innerblock for the Accordionbed Content block
registerBlockType("blockons/accordion", {
	title: __("Accordion", "blockons"),
	icon: "welcome-add-page",
	parent: ["blockons/accordions"],
	attributes: {
		labelTag: {
			type: "string",
			default: "h4",
		},
		stayOpen: {
			type: "boolean",
			default: false,
		},
		accordionLabel: {
			type: "string",
			default: "",
		},
		accordionIcon: {
			type: "string",
			default: "arrow-right",
		},
		labelSpacing: {
			type: "number",
			default: 10,
		},
		itemSpacing: {
			type: "number",
			default: 12,
		},
		itemLabelBgColor: {
			type: "string",
			default: "#efefef",
		},
		labelFontSize: {
			type: "number",
			default: 16,
		},
		itemLabelFontColor: {
			type: "string",
			default: "#555",
		},
		labelIconSize: {
			type: "number",
			default: 20,
		},
		itemLabelIconColor: {
			type: "string",
			default: "#555",
		},
		itemContentBgColor: {
			type: "string",
			default: "#FFF",
		},
	},
	usesContext: ["blockons/iconFirst"],
	/**
	 *
	 * Edit function for Child Accordion Block
	 *
	 */
	edit: (props) => {
		const {
			isSelected,
			className,
			attributes: {
				labelTag,
				stayOpen,
				accordionLabel,
				accordionIcon,
				labelSpacing,
				itemSpacing,
				itemLabelBgColor,
				labelFontSize,
				itemLabelFontColor,
				labelIconSize,
				itemLabelIconColor,
				itemContentBgColor,
			},
			setAttributes,
			context,
		} = props;

		const onChangeAccordionLabel = (newAccordionLabel) => {
			setAttributes({ accordionLabel: newAccordionLabel });
		};
		const onChangeAccordionIcon = (newAccordionIcon) => {
			setAttributes({ accordionIcon: newAccordionIcon });
		};

		const DEFAULT = [["core/paragraph", {}]];

		return (
			<div
				className={`${className} ${isSelected || stayOpen ? "selected" : ""} ${
					accordionIcon === "plus" ||
					accordionIcon === "eye" ||
					accordionIcon === "circle-plus"
						? "change " + accordionIcon
						: "rotate"
				}`}
				style={{ marginBottom: itemSpacing }}
			>
				{isSelected && (
					<InspectorControls>
						<PanelBody
							title={__("Accordion Settings", "blockons")}
							initialOpen={true}
						>
							<SelectControl
								label={__("Label Element", "blockons")}
								value={labelTag}
								options={elementTags}
								onChange={(newValue) =>
									setAttributes({
										labelTag: newValue === undefined ? "h4" : newValue,
									})
								}
							/>

							<ToggleControl
								label={__("Stay Open", "blockons")}
								checked={stayOpen}
								help={__(
									"Expand this panel on initial page load. Also Use this to keep the panel open while editing.",
									"blockons"
								)}
								onChange={(newValue) => {
									setAttributes({ stayOpen: newValue });
								}}
							/>
						</PanelBody>
						<PanelBody
							title={__("Accordion Design", "blockons")}
							initialOpen={false}
						>
							<p>{__("Accordion Spacing", "blockons")}</p>
							<RangeControl
								value={itemSpacing}
								onChange={(newalue) => setAttributes({ itemSpacing: newalue })}
								min={0}
								max={100}
							/>

							<h4>{__("Accordion Labels", "blockons")}</h4>
							<BlockonsColorpicker
								label={__("Background Color", "blockons")}
								value={itemLabelBgColor}
								onChange={(newValue) =>
									setAttributes({ itemLabelBgColor: newValue })
								}
								paletteColors={colorPickerPalette}
							/>
							<p>{__("Font Size", "blockons")}</p>
							<RangeControl
								value={labelFontSize}
								onChange={(newValue) =>
									setAttributes({ labelFontSize: parseInt(newValue) })
								}
								min={11}
								max={44}
							/>
							<BlockonsColorpicker
								label={__("Font Color", "blockons")}
								value={itemLabelFontColor}
								onChange={(newValue) =>
									setAttributes({ itemLabelFontColor: newValue })
								}
								paletteColors={colorPickerPalette}
							/>
							<p>{__("Icon Size", "blockons")}</p>
							<RangeControl
								value={labelIconSize}
								onChange={(newValue) =>
									setAttributes({ labelIconSize: parseInt(newValue) })
								}
								min={11}
								max={44}
							/>
							<BlockonsColorpicker
								label={__("Icon Color", "blockons")}
								value={itemLabelIconColor}
								onChange={(newValue) =>
									setAttributes({ itemLabelIconColor: newValue })
								}
								paletteColors={colorPickerPalette}
							/>

							{context["blockons/iconFirst"] && (
								<>
									<br />
									<p>{__("Icon & Label Spacing", "blockons")}</p>
									<RangeControl
										value={labelSpacing}
										onChange={(newValue) =>
											setAttributes({ labelSpacing: parseInt(newValue) })
										}
										min={0}
										max={200}
									/>
								</>
							)}

							<h4>{__("Accordion Content", "blockons")}</h4>
							<BlockonsColorpicker
								label={__("Background Color", "blockons")}
								value={itemContentBgColor}
								onChange={(value) =>
									setAttributes({ itemContentBgColor: value })
								}
								paletteColors={colorPickerPalette}
							/>
						</PanelBody>
					</InspectorControls>
				)}
				<div
					className={"accordion-label"}
					style={{ backgroundColor: itemLabelBgColor }}
				>
					<RichText
						tagName="h6"
						placeholder={__("Accordion Label", "blockons")}
						value={accordionLabel}
						multiline={false}
						className="accordion-label-title"
						onChange={onChangeAccordionLabel}
						style={{
							fontSize: labelFontSize,
							color: itemLabelFontColor,
						}}
					/>

					<div className="accordion-icon" style={{ marginRight: labelSpacing }}>
						<Dropdown
							className="blockons-icon-selecter"
							contentClassName="blockons-editor-popup"
							position="bottom right"
							renderToggle={({ isOpen, onToggle }) => (
								<FontAwesomeIcon
									icon={accordionIcon}
									iconSize={labelIconSize}
									onClick={onToggle}
									style={{
										color: itemLabelIconColor,
									}}
								/>
							)}
							renderContent={() =>
								Object.keys(accordionArrowIcons).map((icon) => (
									<FontAwesomeIcon
										icon={icon}
										iconSize={20}
										onClick={() => onChangeAccordionIcon(icon)}
									/>
								))
							}
						/>
					</div>
				</div>
				<div
					className={`accordion-content`}
					style={{ backgroundColor: itemContentBgColor }}
				>
					<div className={`accordion-content-inner`}>
						<InnerBlocks template={DEFAULT} />
					</div>
				</div>
			</div>
		);
	},
	/**
	 *
	 * Save function for Child Accordion Block
	 *
	 */
	save: ({ attributes }) => {
		const blockProps = useBlockProps.save({
			className: `accordion-panel ${attributes.stayOpen ? "active" : ""} ${
				attributes.accordionIcon === "plus" ||
				attributes.accordionIcon === "eye" ||
				attributes.accordionIcon === "circle-plus"
					? "change " + attributes.accordionIcon
					: "rotate"
			}`,
			style: { marginBottom: attributes.itemSpacing },
		});

		return (
			<div {...blockProps}>
				<div
					className={"accordion-label"}
					style={{
						backgroundColor: attributes.itemLabelBgColor,
					}}
				>
					<RichText.Content
						tagName={attributes.labelTag}
						value={attributes.accordionLabel}
						className="accordion-label-title"
						style={{
							fontSize: attributes.labelFontSize,
							color: attributes.itemLabelFontColor,
						}}
					/>

					<div
						className="accordion-icon"
						style={{
							marginRight: attributes.labelSpacing,
						}}
					>
						<FontAwesomeIcon
							icon={attributes.accordionIcon}
							iconSize={attributes.labelIconSize}
							style={{
								color: attributes.itemLabelIconColor,
							}}
						/>
					</div>
				</div>
				<div
					className={`accordion-content`}
					style={{
						backgroundColor: attributes.itemContentBgColor,
						...(attributes.stayOpen
							? { maxHeight: "initial" } // FIX THIS NOT ANIMATING PROPERLY
							: { maxHeight: null }),
					}}
				>
					<div className={`accordion-content-inner`}>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	},
});
