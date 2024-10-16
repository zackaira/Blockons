import { useState, useEffect, useCallback, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import {
    useBlockProps,
    BlockControls,
    InspectorControls,
    AlignmentToolbar,
    BlockAlignmentToolbar,
    RichText,
} from "@wordpress/block-editor";
import {
    PanelBody,
    ToggleControl,
    SelectControl,
    RangeControl,
    __experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import debounce from "lodash/debounce";
import BlockonsColorpicker from "../_components/BlockonsColorpicker";
import { colorPickerPalette } from "../block-global";

const Edit = (props) => {
    const {
        attributes: {
            maxWidth,
            alignment,
            align,
            headings,
            showTitle,
            title,
            showDescTop,
            descTop,
            showDescBottom,
            descBottom,
            border,
            borderWidth,
            borderRadius,
            titleColor,
            titleSize,
            showNumbers,
            numberSize,
            numberSpacing,
            includeH1,
            includeH2,
            includeH3,
            includeH4,
            includeH5,
            includeH6,
            paddingHoriz,
            paddingVert,
            paddingIn,
            spacing,
            showBlurbs,
            bgColor,
            borderColor,
            headColor,
            descColor,
            blurbColor,
            numberColor,
            headSize,
            descSize,
            blurbSize,
            isPremium,
            addAnchors,
        },
        setAttributes,
    } = props;
    const isPro = Boolean(blockonsEditorObj.isPremium);

    const [extractedHeadings, setExtractedHeadings] = useState([]);
    const [blurbs, setBlurbs] = useState({});
    const [lastParsedContent, setLastParsedContent] = useState("");

    const postContent = useSelect((select) =>
        select("core/editor").getEditedPostContent()
    );

    const blockProps = useBlockProps({
        className: `alignment-${alignment} ${align}-align style-${border}`,
    });

    const includeHeadings = useMemo(() => ({
        h1: includeH1,
        h2: includeH2,
        h3: includeH3,
        h4: includeH4,
        h5: includeH5,
        h6: includeH6,
    }), [includeH1, includeH2, includeH3, includeH4, includeH5, includeH6]);

    useEffect(() => {
        setAttributes({ isPremium: isPro }); // SETS PREMIUM
    }, []);

    const includedLevels = useMemo(() => {
        let level = 0;
        return Object.keys(includeHeadings).reduce((acc, key) => {
            if (includeHeadings[key]) {
                acc[key] = ++level;
            }
            return acc;
        }, {});
    }, [includeHeadings]);

    const extractHeadings = useCallback((content) => {
        const parser = new DOMParser();
        const htmlDocument = parser.parseFromString(content, "text/html");

        let selectors = Object.entries(includeHeadings)
            .filter(([_, include]) => include)
            .map(([heading]) => heading);

        const selectorString = selectors.join(", ");
        const headingElements = htmlDocument.querySelectorAll(selectorString);

        return Array.from(headingElements).map((heading) => {
            const headingText = heading.textContent.trim();
            return {
                content: headingText,
                level: heading.tagName.toLowerCase(),
                padding: (includedLevels[heading.tagName.toLowerCase()] - 1) * paddingIn,
                anchor: encodeURIComponent(headingText.toLowerCase().replace(/\s+/g, '-')),
            };
        });
    }, [includeHeadings, includedLevels, paddingIn]);

    const debouncedExtractHeadings = useMemo(
        () =>
            debounce((content) => {
                if (content !== lastParsedContent) {
                    const newHeadings = extractHeadings(content);
                    setExtractedHeadings(newHeadings);
                    setLastParsedContent(content);
                }
            }, 300),
        [lastParsedContent, extractHeadings]
    );

    useEffect(() => {
        debouncedExtractHeadings(postContent);
    }, [postContent, debouncedExtractHeadings]);

    const headingsWithBlurbs = useMemo(() => {
        return extractedHeadings.map((heading, index) => ({
            ...heading,
            blurb: blurbs[index] || '',
        }));
    }, [extractedHeadings, blurbs]);

    useEffect(() => {
        if (JSON.stringify(headingsWithBlurbs) !== JSON.stringify(headings)) {
            setAttributes({ headings: headingsWithBlurbs });
        }
    }, [headingsWithBlurbs, setAttributes]);

    useEffect(() => {
        // Initialize blurbs state from headings attribute
        const initialBlurbs = {};
        headings.forEach((heading, index) => {
            initialBlurbs[index] = heading.blurb || '';
        });
        setBlurbs(initialBlurbs);
    }, [headings]);

    useEffect(() => {
        // Add data attributes to the actual headings in the editor
        const addDataAttributesToHeadings = () => {
            const headingElements = document.querySelectorAll('.wp-block-heading');
            
            extractedHeadings.forEach((heading) => {
                const matchingHeading = Array.from(headingElements).find(
                    (el) => el.textContent.trim() === heading.content
                );
                if (matchingHeading) {
                    matchingHeading.id = heading.anchor;
                }
            });
        };

        addDataAttributesToHeadings();
    }, [extractedHeadings]);

    useEffect(() => {
        // Add smooth scrolling functionality
        const addSmoothScrolling = () => {
            const links = document.querySelectorAll('.blockons-toc-link');
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                        // Update URL without triggering a page reload
                        history.pushState(null, null, `#${targetId}`);
                    }
                });
            });
        };

        addSmoothScrolling();
    }, [extractedHeadings]);

    const updateHeadingBlurb = useCallback((index, newBlurb) => {
        setBlurbs(prevBlurbs => ({
            ...prevBlurbs,
            [index]: newBlurb,
        }));
    }, []);

    useEffect(() => {
        const scrollToHashOnLoad = () => {
            if (window.location.hash) {
                const targetId = window.location.hash.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        scrollToHashOnLoad();
    }, []);

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__("Table of Contents Settings", "blockons")}>
                    <UnitControl
                        label={__("Table Of Contents Max-Width", "blockons")}
                        value={maxWidth}
                        onChange={(newValue) =>
                            setAttributes({ maxWidth: newValue })
                        }
                        units={[
                            { value: "%", label: "%", default: 100 },
                            { value: "px", label: "px", default: 300 },
                        ]}
                        isResetValueOnUnitChange
                    />

                    <ToggleControl
                        label={__("Show Title", "blockons")}
                        checked={showTitle}
                        onChange={(newValue) => setAttributes({ showTitle: newValue })}
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
                <PanelBody title={__("Table of Contents Design", "blockons")} initialOpen={false}>
                    <SelectControl
                        label={__("Border", "blockons")}
                        value={border}
                        options={[
                            { label: __("Plain Border", "blockons"), value: "one" },
                            { label: __("Dashed Border", "blockons"), value: "two" },
                            { label: __("No Border", "blockons"), value: "three" },
                        ]}
                        onChange={(newValue) => setAttributes({ border: newValue })}
                    />
                    {border !== "three" && (
                        <>
                            <RangeControl
                                label={__("Border Width", "blockons")}
                                value={borderWidth}
                                onChange={(newValue) => setAttributes({ borderWidth: newValue })}
                                min={0}
                                max={10}
                            />
                            <RangeControl
                                label={__("Border Radius", "blockons")}
                                value={borderRadius}
                                onChange={(newValue) => setAttributes({ borderRadius: newValue })}
                                min={0}
                                max={50}
                            />
                            <BlockonsColorpicker
                                label={__("Border Color", "blockons")}
                                value={borderColor}
                                onChange={(newValue) => setAttributes({ borderColor: newValue })}
                                paletteColors={colorPickerPalette}
                            />
                            <div className="blockons-divider"></div>
                        </>
                    )}

                    <RangeControl
                        label={__("Horizontal Padding", "blockons")}
                        value={paddingHoriz}
                        onChange={(newValue) => setAttributes({ paddingHoriz: newValue })}
                        min={0}
                        max={80}
                    />
                    <RangeControl
                        label={__("Vertical Padding", "blockons")}
                        value={paddingVert}
                        onChange={(newValue) => setAttributes({ paddingVert: newValue })}
                        min={0}
                        max={80}
                    />
                    <div className="blockons-divider"></div>

                    {showTitle && (
                        <>
                            <BlockonsColorpicker
                                label={__("Title Color", "blockons")}
                                value={titleColor}
                                onChange={(newValue) => setAttributes({ titleColor: newValue })}
                                paletteColors={colorPickerPalette}
                            />
                            <RangeControl
                                label={__("Title Size", "blockons")}
                                value={titleSize}
                                onChange={(newValue) => setAttributes({ titleSize: newValue })}
                                min={10}
                                max={48}
                            />
                            <div className="blockons-divider"></div>
                        </>
                    )}

                    <ToggleControl
                        label={__("Show Numbers", "blockons")}
                        checked={showNumbers}
                        onChange={(newValue) => setAttributes({ showNumbers: newValue })}
                    />
                    {showNumbers && (
                        <>
                            <RangeControl
                                label={__("Number Size", "blockons")}
                                value={numberSize}
                                onChange={(newValue) => setAttributes({ numberSize: newValue })}
                                min={10}
                                max={84}
                            />
                            <RangeControl
                                label={__("Number Spacing", "blockons")}
                                value={numberSpacing}
                                onChange={(newValue) => setAttributes({ numberSpacing: newValue })}
                                min={0}
                                max={100}
                            />
                        </>
                    )}
                    <div className="blockons-divider"></div>

                    <RangeControl
                        label={__("Item Inwards Padding", "blockons")}
                        value={paddingIn}
                        onChange={(newValue) => setAttributes({ paddingIn: newValue })}
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
                    <div className="blockons-divider"></div>

                    <BlockonsColorpicker
                        label={__("Background Color", "blockons")}
                        value={bgColor}
                        onChange={(newValue) => setAttributes({ bgColor: newValue })}
                        paletteColors={colorPickerPalette}
                    />
                    {showNumbers && (
                        <BlockonsColorpicker
                            label={__("Numbers Color", "blockons")}
                            value={numberColor}
                            onChange={(newValue) => setAttributes({ numberColor: newValue })}
                            paletteColors={colorPickerPalette}
                        />
                    )}
                    <BlockonsColorpicker
                        label={__("Heading Color", "blockons")}
                        value={headColor}
                        onChange={(newValue) => setAttributes({ headColor: newValue })}
                        paletteColors={colorPickerPalette}
                    />
                    <RangeControl
                        label={__("Heading Size", "blockons")}
                        value={headSize}
                        onChange={(newValue) => setAttributes({ headSize: newValue })}
                        min={10}
                        max={48}
                    />

                    {(showDescTop || showDescBottom) && (
                        <>
                            <BlockonsColorpicker
                                label={__("Description Color", "blockons")}
                                value={descColor}
                                onChange={(newValue) => setAttributes({ descColor: newValue })}
                                paletteColors={colorPickerPalette}
                            />
                            <RangeControl
                                label={__("Description Size", "blockons")}
                                value={descSize}
                                onChange={(newValue) => setAttributes({ descSize: newValue })}
                                min={10}
                                max={48}
                            />
                        </>
                    )}

                    {showBlurbs && (
                        <>
                            <BlockonsColorpicker
                                label={__("Blurb Color", "blockons")}
                                value={blurbColor}
                                onChange={(newValue) => setAttributes({ blurbColor: newValue })}
                                paletteColors={colorPickerPalette}
                            />
                            <RangeControl
                                label={__("Blurb Size", "blockons")}
                                value={blurbSize}
                                onChange={(newValue) => setAttributes({ blurbSize: newValue })}
                                min={10}
                                max={48}
                            />
                        </>
                    )}
                </PanelBody>
                {isPremium && (
                    <PanelBody title={__("Table of Contents Links", "blockons")} initialOpen={false}>
                        <ToggleControl
                            label={__("Add Link Anchor Buttons", "blockons")}
                            checked={addAnchors}
                            onChange={(newValue) => setAttributes({ addAnchors: newValue })}
                        />

                        <p>{__("This link functionality works only on the website's frontend, so please make sure to enable it and test it directly on the live page.", "blockons")}</p>
                        
                        <p className="blockons-set-title">
                            {__("EXAMPLE: ", "blockons")}
                        </p>
                        <h4 className="blockons-anchor-example">
                            Example Heading 
                            {addAnchors && (
                                <span className="fa-solid fa-link"></span>
                            )}
                        </h4>
                    </PanelBody>
                )}
            </InspectorControls>
            <BlockControls>
                <AlignmentToolbar
                    value={alignment}
                    onChange={(newValue) => setAttributes({ alignment: newValue })}
                />
                <BlockAlignmentToolbar
                    value={align}
                    controls={["left", "center", "right"]}
                    onChange={(newValue) => setAttributes({ align: newValue })}
                />
            </BlockControls>
            <div
                className="blockons-toc"
                style={{
                    maxWidth,
                    padding: `${paddingVert}px ${paddingHoriz}px`,
                    ...(bgColor !== "#ffffff" ? { backgroundColor: bgColor } : {}),
                    borderWidth: `${borderWidth}px`,
                    borderRadius: `${borderRadius}px`,
                    ...(border !== "three" && borderColor ? { borderColor } : {}),
                }}
                {...(isPremium && addAnchors ? { "data-anchor": "link" } : {})}>
                {showTitle && (
                    <RichText
                        tagName="p"
                        value={title}
                        className="blockons-toc-title"
                        onChange={(newValue) => setAttributes({ title: newValue })}
                        allowedFormats={["core/bold", "core/italic"]}
                        placeholder={__("Table of Contents", "blockons")}
                        style={{
                            ...(titleSize !== 24 ? { fontSize: `${titleSize}px` } : {}),
                            color: titleColor
                        }}
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
                        style={{
                            ...(descSize !== 15 ? { fontSize: `${descSize}px` } : {}),
                            color: descColor
                        }}
                    />
                )}
                <ul className="blockons-toc-ul">
                    {headings.map((heading, index) => (
                        <li
                            key={`heading-${index}`}
                            className="blockons-toc-li"
                            style={{
                                paddingLeft: `${heading.padding}px`,
                                marginBottom: `${spacing}px`,
                            }}
                        >
                            {showNumbers && (
                                <div className="blockons-toc-number" style={{
                                    ...(numberSpacing !== 8 ? { marginRight: `${numberSpacing}px` } : {}),
                                    ...(numberSize !== 18 ? { fontSize: `${numberSize}px` } : {}),
                                    color: numberColor
                                }}>
                                        <span>
                                            {(index + 1).toString().padStart(2, '0')}
                                        </span>
                                </div>
                            )}
                            <div className="blockons-toc-item">
                                <a 
                                    href={`#${heading.anchor}`}
                                    className="blockons-toc-link"
                                    data-target={heading.anchor}
                                    style={{
                                        ...(headSize !== 16 ? { fontSize: `${headSize}px` } : {}),
                                        color: headColor
                                    }}
                                >
                                    {heading.content}
                                </a>
                                {showBlurbs && (
                                    <RichText
                                        tagName="p"
                                        value={blurbs[index] || ''}
                                        className="blockons-toc-blurb"
                                        onChange={(newBlurb) => updateHeadingBlurb(index, newBlurb)}
                                        allowedFormats={["core/bold", "core/italic"]}
                                        placeholder={__("Enter a short description", "blockons")}
                                        style={{
                                            ...(blurbSize !== 13 ? { fontSize: `${blurbSize}px` } : {}),
                                            color: blurbColor
                                        }}
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
                        className="blockons-toc-botdesc"
                        onChange={(newValue) => setAttributes({ descBottom: newValue })}
                        allowedFormats={["core/bold", "core/italic"]}
                        placeholder={__("Click the relevant heading to jump to that section.", "blockons")}
                        style={{
                            ...(descSize !== 15 ? { fontSize: `${descSize}px` } : {}),
                            color: descColor
                        }}
                    />
                )}
            </div>
        </div>
    );
};

export default Edit;