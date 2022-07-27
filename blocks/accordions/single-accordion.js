import {
	RichText,
	InnerBlocks,
	useBlockProps,
	InspectorControls,
} from "@wordpress/block-editor";
import { useContext } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
import {
	Dropdown,
	TextControl,
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
	// category: "design",
	attributes: {
		accordionLabel: {
			type: "string",
			default: "",
		},
		accordionIcon: {
			type: "string",
			default: "arrow-right",
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
		// accordionContext: {
		// 	type: "object",
		// 	default: {},
		// },
	},
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
				accordionLabel,
				accordionIcon,
				itemSpacing,
				itemLabelBgColor,
				labelFontSize,
				itemLabelFontColor,
				labelIconSize,
				itemLabelIconColor,
				itemContentBgColor,
			},
			setAttributes,
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
				className={`${className} ${isSelected ? "selected" : ""}`}
				style={{ marginBottom: itemSpacing }}
			>
				{isSelected && (
					<InspectorControls>
						<PanelBody
							title={__("Accordions Design", "blockons")}
							initialOpen={false}
						>
							<p>{__("Accordion Spacing", "blockons")}</p>
							<RangeControl
								value={itemSpacing}
								onChange={(value) => setAttributes({ itemSpacing: value })}
								min={0}
								max={100}
							/>

							<h4>{__("Accordion Labels", "blockons")}</h4>
							<BlockonsColorpicker
								label={__("Background Color", "blockons")}
								value={itemLabelBgColor}
								onChange={(value) => setAttributes({ itemLabelBgColor: value })}
								paletteColors={colorPickerPalette}
							/>
							<p>{__("Font Size", "blockons")}</p>
							<RangeControl
								value={labelFontSize}
								onChange={(value) => setAttributes({ labelFontSize: value })}
								min={11}
								max={44}
							/>
							<BlockonsColorpicker
								label={__("Font Color", "blockons")}
								value={itemLabelFontColor}
								onChange={(value) =>
									setAttributes({ itemLabelFontColor: value })
								}
								paletteColors={colorPickerPalette}
							/>
							<p>{__("Icon Size", "blockons")}</p>
							<RangeControl
								value={labelIconSize}
								onChange={(value) => setAttributes({ labelIconSize: value })}
								min={11}
								max={44}
							/>
							<BlockonsColorpicker
								label={__("Font Color", "blockons")}
								value={itemLabelIconColor}
								onChange={(value) =>
									setAttributes({ itemLabelIconColor: value })
								}
								paletteColors={colorPickerPalette}
							/>

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
						tagName="p"
						placeholder={__("Accordion Label", "blockons")}
						value={accordionLabel}
						multiline={false}
						className="accordion-label_input"
						onChange={onChangeAccordionLabel}
						style={{
							fontSize: labelFontSize,
							color: itemLabelFontColor,
						}}
					/>

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
				<div
					className={`accordion-content`}
					style={{ backgroundColor: itemContentBgColor }}
				>
					<InnerBlocks template={DEFAULT} />
				</div>
			</div>
		);
	},
	/**
	 *
	 * Save function for Child Accordion Block
	 *
	 */
	save: (props) => {
		const blockProps = useBlockProps.save({
			className: `accordion-panel`,
			style: { marginBottom: 12 },
		});

		return (
			<div {...blockProps}>
				<div
					className={"accordion-label"}
					style={{
						backgroundColor: "#999",
					}}
				>
					<RichText.Content
						tagName="p"
						value={props.attributes.accordionLabel}
						className="accordion-label-title"
						style={{
							fontSize: props.attributes.labelFontSize,
							color: props.attributes.itemLabelFontColor,
						}}
					/>

					<FontAwesomeIcon
						icon={props.attributes.accordionIcon}
						iconSize={props.attributes.labelIconSize}
						style={{
							color: props.attributes.itemLabelIconColor,
						}}
					/>
				</div>
				<div
					className={`accordion-content`}
					style={{ backgroundColor: props.attributes.itemContentBgColor }}
				>
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
});
