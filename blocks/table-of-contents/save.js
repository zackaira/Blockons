import { useBlockProps, RichText } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
    const {
        maxWidth,
        alignment,
        align,
        headings,
        canCollapse,
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
    } = attributes;

    const blockProps = useBlockProps.save({
        className: `alignment-${alignment} ${align}-align style-${border}`,
    });

    return (
        <div {...blockProps}>
            <div
                className={`blockons-toc ${canCollapse ? "collapsible" : ""}`}
                style={{
                    maxWidth,
                    padding: `${paddingVert}px ${paddingHoriz}px`,
                    ...(bgColor !== "#ffffff" ? { backgroundColor: bgColor } : {}),
                    borderWidth: `${borderWidth}px`,
                    borderRadius: `${borderRadius}px`,
                    ...(border !== "three" && borderColor ? { borderColor } : {}),
                }}
                {...(isPremium && addAnchors ? { "data-anchor": "link" } : {})}
            >
                <div className={`header ${canCollapse ? "toggle" : ""}`}>
                    <div className="header-txt">
                        {showTitle && (
                            <RichText.Content
                                tagName="p"
                                value={title}
                                className="blockons-toc-title"
                                style={{
                                    ...(titleSize !== 24 ? { fontSize: `${titleSize}px` } : {}),
                                    color: titleColor
                                }}
                            />
                        )}
                        {showDescTop && (
                            <RichText.Content
                                tagName="p"
                                value={descTop}
                                className="blockons-toc-desc"
                                style={{
                                    ...(descSize !== 15 ? { fontSize: `${descSize}px` } : {}),
                                    color: descColor
                                }}
                            />
                        )}
                    </div>
                    {canCollapse && (
                        <div className="blockons-toggle-btn">
                            <span className="toggle-btn fa-solid fa-chevron-right"></span>
                        </div>
                    )}
                </div>
                <div className="blockons-toc-content">
                    <ul className="blockons-toc-ul">
                        {headings.filter(heading => heading.visible !== false).map((heading, visibleIndex) => (
                            <li
                                key={`heading-${visibleIndex}`}
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
                                            {(visibleIndex + 1).toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                )}
                                <div className="blockons-toc-item">
                                    <a 
                                        href={`#${heading.anchor}`}
                                        className="blockons-toc-link" 
                                        style={{
                                            ...(headSize !== 16 ? { fontSize: `${headSize}px` } : {}),
                                            color: headColor
                                        }}
                                    >
                                        {heading.content}
                                    </a>
                                    {showBlurbs && heading.blurb && (
                                        <RichText.Content
                                            tagName="p"
                                            value={heading.blurb}
                                            className="blockons-toc-blurb"
                                            style={{
                                                ...(blurbSize !== 14 ? { fontSize: `${blurbSize}px` } : {}),
                                                color: blurbColor
                                            }}
                                        />
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    {showDescBottom && (
                        <div className={`footer ${canCollapse ? "toggle" : ""}`}>
                            <RichText.Content
                                tagName="p"
                                value={descBottom}
                                className="blockons-toc-botdesc"
                                style={{
                                    ...(descSize !== 15 ? { fontSize: `${descSize}px` } : {}),
                                    color: descColor
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Save;