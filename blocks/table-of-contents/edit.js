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
    TextControl,
} from "@wordpress/components";

const Edit = (props) => {
    const {
        attributes: {
            headings,
            title,
			showDescTop,
            descTop,
			showDescBottom,
			descBottom,
            design,
            showNumbers,
            includeH1,
            includeH2,
            includeH3,
            includeH4,
            includeH5,
            includeH6,
            paddingIn,
            spacing,
            showBlurbs,
        },
        setAttributes,
    } = props;

    const postContent = useSelect((select) =>
        select("core/editor").getEditedPostContent()
    );

    const [allHeadings, setAllHeadings] = useState([]);
    const blockProps = useBlockProps({
        className: `style-${design}`,
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
        const extractHeadings = () => {
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(postContent, "text/html");

            let selectors = Object.entries(includeHeadings)
                .filter(([_, include]) => include)
                .map(([heading]) => heading);

            const selectorString = selectors.join(", ");
            const headingElements = htmlDocument.querySelectorAll(selectorString);

            return Array.from(headingElements).map((heading, index) => ({
                content: heading.textContent.trim(),
                level: heading.tagName.toLowerCase(),
                padding: (includedLevels[heading.tagName.toLowerCase()] - 1) * paddingIn,
                anchor: `toc-${index}`,
                blurb: '', // Initialize with empty blurb
            }));
        };

        setAllHeadings(extractHeadings());
    }, [postContent, includeHeadings, paddingIn]);

    useEffect(() => {
        setAttributes({ headings: allHeadings });
    }, [allHeadings]);

    useEffect(() => {
        // Add data attributes to the actual headings in the editor
        const addDataAttributesToHeadings = () => {
            const headingElements = document.querySelectorAll('.wp-block-heading');
            const headingsMap = new Map();
            
            allHeadings.forEach((heading, index) => {
                headingsMap.set(heading.content, { index, anchor: heading.anchor });
            });

            headingElements.forEach((heading) => {
                const headingText = heading.textContent.trim();
                if (headingsMap.has(headingText)) {
                    const { index, anchor } = headingsMap.get(headingText);
                    heading.setAttribute('data-toc-anchor', anchor);
                    headingsMap.delete(headingText); // Remove to handle duplicates
                }
            });
        };

        addDataAttributesToHeadings();
    }, [allHeadings]);

    useEffect(() => {
        // Add smooth scrolling functionality
        const addSmoothScrolling = () => {
            const links = document.querySelectorAll('.blockons-toc-link');
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetAnchor = e.target.getAttribute('data-target');
                    const targetElement = document.querySelector(`[data-toc-anchor="${targetAnchor}"]`);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
        };

        addSmoothScrolling();
    }, [allHeadings]);

	const updateHeadingBlurb = (index, newBlurb) => {
        const updatedHeadings = allHeadings.map((heading, i) => 
            i === index ? { ...heading, blurb: newBlurb } : heading
        );
        setAllHeadings(updatedHeadings);
    };

    return (
        <div {...blockProps}>
			<InspectorControls>
                <PanelBody title={__("Table of Contents Settings", "blockons")}>
                    <ToggleControl
                        label={__("Show Title", "blockons")}
                        checked={title}
                        onChange={(newValue) => setAttributes({ title: newValue })}
                    />
                    <ToggleControl
                        label={__("Show Top Description", "blockons")}
                        checked={showDescTop}
                        onChange={(newValue) => setAttributes({ showDescTop: newValue })}
                    />
					<ToggleControl
                        label={__("Show Bottom Description", "blockons")}
                        checked={showDescBottom}
                        onChange={(newValue) => setAttributes({ showDescBottom: newValue })}
                    />
					<div className="blockons-divider"></div>

                    {['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].map((heading) => (
                        <ToggleControl
                            key={heading}
                            label={__(`Show ${heading} Headings`, "blockons")}
                            checked={includeHeadings[heading.toLowerCase()]}
                            onChange={(newValue) => setAttributes({ [`include${heading}`]: newValue })}
                        />
                    ))}
					<div className="blockons-divider"></div>

					<ToggleControl
                        label={__("Show Blurbs", "blockons")}
                        checked={showBlurbs}
                        onChange={(newValue) => setAttributes({ showBlurbs: newValue })}
                    />
                </PanelBody>
                <PanelBody title={__("Table of Contents Design", "blockons")}>
                    <SelectControl
                        label={__("Style", "blockons")}
                        value={design}
                        options={[
                            { label: __("Style One", "blockons"), value: "one" },
                            { label: __("Style Two", "blockons"), value: "two" },
                            { label: __("Style Three", "blockons"), value: "three" },
                        ]}
                        onChange={(newValue) => setAttributes({ design: newValue })}
                    />
					<div className="blockons-divider"></div>

					<ToggleControl
                        label={__("Show Numbers", "blockons")}
                        checked={showNumbers}
                        onChange={(newValue) => setAttributes({ showNumbers: newValue })}
                    />
					<div className="blockons-divider"></div>

                    <RangeControl
                        label={__("Item Inwards Padding", "blockons")}
                        value={paddingIn}
                        onChange={(newValue) => setAttributes({ paddingIn: newValue ?? 0 })}
                        min={0}
                        max={50}
                    />
                    <RangeControl
                        label={__("Spacing", "blockons")}
                        value={spacing}
                        onChange={(newValue) => setAttributes({ spacing: newValue ?? 10 })}
                        min={0}
                        max={50}
                    />
                </PanelBody>
            </InspectorControls>
            <div className="blockons-toc">
                {title && (
                    <RichText
                        tagName="p"
                        value={title}
                        className="blockons-toc-title"
                        onChange={(newValue) => setAttributes({ title: newValue })}
                        allowedFormats={["core/bold", "core/italic"]}
                        placeholder={__("Table of Contents", "blockons")}
                    />
                )}
                {showDescTop && (
                    <RichText
                        tagName="p"
                        value={descTop}
                        className="blockons-toc-desc"
                        onChange={(newValue) => setAttributes({ descTop: newValue })}
                        allowedFormats={["core/bold", "core/italic"]}
                        placeholder={__("Click the relevant heading to jump to that section.", "blockons")}
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
							<div className="blockons-toc-number">
								{showNumbers && (
									<span>
										{(index + 1).toString().padStart(2, '0')}
									</span>
								)}
							</div>
							<div className="blockons-toc-item">
								<a 
									href="#" 
									className="blockons-toc-link"
									data-target={heading.anchor}
								>
									{heading.content}
								</a>
								{showBlurbs && (
									<RichText
										tagName="p"
										value={heading.blurb}
										className="blockons-toc-blurb"
										onChange={(newBlurb) => updateHeadingBlurb(index, newBlurb)}
										allowedFormats={["core/bold", "core/italic"]}
										placeholder={__("Enter a short description", "blockons")}
									/>
								)}
							</div>
                        </li>
                    ))}
                </ul>
				{showDescBottom && (
                    <RichText
                        tagName="p"
                        value={descBottom}
                        className="blockons-toc-desc"
                        onChange={(newValue) => setAttributes({ descBottom: newValue })}
                        allowedFormats={["core/bold", "core/italic"]}
                        placeholder={__("Click the relevant heading to jump to that section.", "blockons")}
                    />
                )}
            </div>
        </div>
    );
};

export default Edit;