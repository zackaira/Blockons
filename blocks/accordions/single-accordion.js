import { RichText, InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { useContext } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks
import { Dropdown, TextControl } from "@wordpress/components";
import { subscribe } from "@wordpress/data";
import FontAwesomeIcon from "../_components/FontAwesomeIcon";
import { elementTags, accordionArrowIcons } from "../block-global";

// Registering Child Innerblock for the Accordionbed Content block
registerBlockType("blockons/accordion", {
	title: __("Accordion"),
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
		// accordionContext: {
		// 	type: "object",
		// 	default: {},
		// },
	},
	usesContext: [
		"blockons/accordionSpacing",
		"blockons/itemLabelBgColor",
		"blockons/labelFontSize",
		"blockons/itemLabelFontColor",
		"blockons/labelIconSize",
		"blockons/itemLabelIconColor",
		"blockons/itemContentBgColor",
	],
	/**
	 *
	 * Edit function for Child Accordion Block
	 *
	 */
	edit: (props) => {
		const {
			isSelected,
			className,
			attributes: { accordionLabel, accordionIcon, accordionContext },
			setAttributes,
			context,
		} = props;

		const onChangeAccordionLabel = (newAccordionLabel) => {
			setAttributes({ accordionLabel: newAccordionLabel });
		};
		const onChangeAccordionIcon = (newAccordionIcon) => {
			setAttributes({ accordionIcon: newAccordionIcon });
		};
		const onChangeContext = (newContext) => {
			setAttributes({
				accordionContext: {
					labelBgColor: context["blockons/itemLabelBgColor"],
				},
			});
		};

		const DEFAULT = [["core/paragraph", {}]];

		return (
			<div
				className={`${className} ${isSelected ? "selected" : ""}`}
				style={{ marginBottom: context["blockons/accordionSpacing"] }}
			>
				<div
					className={"accordion-label"}
					style={{ backgroundColor: context["blockons/itemLabelBgColor"] }}
				>
					<RichText
						tagName="p"
						placeholder={__("Accordion Label", "blockons")}
						value={accordionLabel}
						multiline={false}
						className="accordion-label_input"
						onChange={onChangeAccordionLabel}
						style={{
							fontSize: context["blockons/labelFontSize"],
							color: context["blockons/itemLabelFontColor"],
						}}
					/>

					<Dropdown
						className="blockons-icon-selecter"
						contentClassName="blockons-editor-popup"
						position="bottom right"
						renderToggle={({ isOpen, onToggle }) => (
							<FontAwesomeIcon
								icon={accordionIcon}
								iconSize={context["blockons/labelIconSize"]}
								onClick={onToggle}
								style={{
									color: context["blockons/itemLabelIconColor"],
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
					style={{ backgroundColor: context["blockons/itemContentBgColor"] }}
				>
					<TextControl value={accordionContext} onChange={onChangeContext} />

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
