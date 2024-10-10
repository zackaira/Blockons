import { RichText, useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
    const blockProps = useBlockProps.save({
        className: `style-${attributes.tocStyle}`,
    });

    return (
        <div {...blockProps}>
            <div className="blockons-toc">
                {attributes.tocHeading && (
                    <RichText.Content
                        tagName="p"
                        value={attributes.tocHeading}
                        className="blockons-toc-title"
                    />
                )}
                {attributes.tocBefore && (
                    <RichText.Content
                        tagName="p"
                        value={attributes.tocBefore}
                        className="blockons-toc-desc"
                    />
                )}

                <ul className="blockons-toc-ul">
                    {attributes.headings.map((heading, index) => (
                        <li
                            key={index}
                            className="blockons-toc-li"
                            style={{
                                paddingLeft: `${heading.padding}px`,
                                marginBottom: `${attributes.spacing}px`,
                            }}
                        >
                            {attributes.showNumbers && (
                                <span className="blockons-toc-number">
                                    {(index + 1).toString().padStart(2, '0')}
                                </span>
                            )}
                            <a 
                                href="#" 
                                className="blockons-toc-link"
                                data-target={heading.anchor}
                            >
                                {heading.content}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Save;