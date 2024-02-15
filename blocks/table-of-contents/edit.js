/**
 * WordPress dependencies
 */
import { useState, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from "@wordpress/block-editor";
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	RangeControl,
	Button,
} from "@wordpress/components";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import { colorPickerPalette } from "../block-global";

const Edit = (props) => {
	const {
		attributes: {
			headings,
			tocHeading,
			tocBefore,
			tocStyle,
			showNumbers,
			includeH1,
			includeH2,
			includeH3,
			includeH4,
			includeH5,
			includeH6,
			paddingIn,
			spacing,
		},
		setAttributes,
	} = props;

	// Fetching post content and extracting headings
	const postContent = useSelect((select) =>
		select("core/editor").getEditedPostContent()
	);

	const [allHeadings, setAllHeadings] = useState([]);
	const blockProps = useBlockProps({
		className: `style-${tocStyle}`,
	});

	const includeHeadings = {
		h1: includeH1,
		h2: includeH2,
		h3: includeH3,
		h4: includeH4,
		h5: includeH5,
		h6: includeH6,
	};
	let level = 0;
	const includedLevels = Object.keys(includeHeadings).reduce((acc, key) => {
		if (includeHeadings[key]) {
			acc[key] = ++level;
		}
		return acc;
	}, {});

	useEffect(() => {
		// Extract headings from postContent
		const extractHeadings = () => {
			const parser = new DOMParser();
			const htmlDocument = parser.parseFromString(postContent, "text/html");

			let selectors = Object.entries(includeHeadings).reduce(
				(acc, [heading, include]) => {
					if (include) acc.push(heading);
					return acc;
				},
				[]
			);

			const selectorString = selectors.join(", ");
			const headingElements = htmlDocument.querySelectorAll(selectorString);

			return Array.from(headingElements).map((heading, index) => ({
				content: heading.textContent,
				level: heading.tagName.toLowerCase(),
				padding:
					(includedLevels[heading.tagName.toLowerCase()] - 1) * paddingIn,
				// anchor: `toc-heading-${index}`,
			}));
		};

		setAllHeadings(extractHeadings());
	}, [postContent, includeHeadings]);

	useEffect(() => {
		setAttributes({ headings: allHeadings });
	}, [allHeadings]);

	console.log("headings", headings);

	return (
		<div {...blockProps}>
			<InspectorControls>
				<PanelBody title={__("Table of Contents Settings", "blockons")}>
					<ToggleControl
						label={__("Show Title", "blockons")}
						checked={tocHeading}
						onChange={(newValue) => {
							setAttributes({ tocHeading: newValue });
						}}
					/>
					<ToggleControl
						label={__("Show Description", "blockons")}
						checked={tocBefore}
						onChange={(newValue) => {
							setAttributes({ tocBefore: newValue });
						}}
					/>
					<div className="blockons-divider"></div>

					<ToggleControl
						label={__("Show Numbers", "blockons")}
						checked={showNumbers}
						onChange={(newValue) => {
							setAttributes({ showNumbers: newValue });
						}}
					/>
					<div className="blockons-divider"></div>

					<ToggleControl
						label={__("Show H1 Headings", "blockons")}
						checked={includeH1}
						onChange={(newValue) => {
							setAttributes({ includeH1: newValue });
						}}
					/>
					<ToggleControl
						label={__("Show H2 Headings", "blockons")}
						checked={includeH2}
						onChange={(newValue) => {
							setAttributes({ includeH2: newValue });
						}}
					/>
					<ToggleControl
						label={__("Show H3 Headings", "blockons")}
						checked={includeH3}
						onChange={(newValue) => {
							setAttributes({ includeH3: newValue });
						}}
					/>
					<ToggleControl
						label={__("Show H4 Headings", "blockons")}
						checked={includeH4}
						onChange={(newValue) => {
							setAttributes({ includeH4: newValue });
						}}
					/>
					<ToggleControl
						label={__("Show H5 Headings", "blockons")}
						checked={includeH5}
						onChange={(newValue) => {
							setAttributes({ includeH5: newValue });
						}}
					/>
					<ToggleControl
						label={__("Show H6 Headings", "blockons")}
						checked={includeH6}
						onChange={(newValue) => {
							setAttributes({ includeH6: newValue });
						}}
					/>
				</PanelBody>
				<PanelBody title={__("Table of Contents Design", "blockons")}>
					<SelectControl
						label={__("Style", "blockons")}
						value={tocStyle}
						options={[
							{ label: __("Style One", "blockons"), value: "one" },
							{ label: __("Style Two", "blockons"), value: "two" },
							{ label: __("Style Three", "blockons"), value: "three" },
						]}
						onChange={(newValue) => {
							setAttributes({ tocStyle: newValue });
						}}
					/>

					<RangeControl
						label={__("Item Inwards Padding", "blockons")}
						value={paddingIn}
						onChange={(newValue) => {
							setAttributes({
								paddingIn: newValue === undefined ? 0 : newValue,
							});
						}}
						min={0}
						max={50}
						step={1}
					/>
					<RangeControl
						label={__("Spacing", "blockons")}
						value={spacing}
						onChange={(newValue) => {
							setAttributes({
								spacing: newValue === undefined ? 10 : newValue,
							});
						}}
						min={0}
						max={50}
						step={1}
					/>
				</PanelBody>
			</InspectorControls>
			<div className="blockons-toc">
				{tocHeading && (
					<RichText
						tagName="p"
						value={tocHeading}
						className="blockons-toc-title"
						onChange={(newValue) => setAttributes({ tocHeading: newValue })}
						allowedFormats={["core/bold", "core/italic"]}
						placeholder={__("Table of Contents", "blockons")}
						disableLineBreaks
					/>
				)}
				{tocBefore && (
					<RichText
						tagName="p"
						value={tocBefore}
						className="blockons-toc-desc"
						onChange={(newValue) => setAttributes({ tocBefore: newValue })}
						allowedFormats={["core/bold", "core/italic"]}
						placeholder={__(
							"Click the relevant heading to jump to that section.",
							"blockons"
						)}
						disableLineBreaks
					/>
				)}

				<ul className="blockons-toc-ul">
					{headings.map((heading, index) => (
						<li
							key={index}
							className="blockons-toc-li"
							style={{
								paddingLeft: `${heading.padding}px`,
								marginBottom: `${spacing}px`,
							}}
						>
							{showNumbers && (
								<span className="blockons-toc-number">
									{index < 10 ? `0${index + 1}` : index + 1}
								</span>
							)}
							<a href={`#${heading.anchor}`} className="blockons-toc-link">
								{heading.content}
							</a>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Edit;
