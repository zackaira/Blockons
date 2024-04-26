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

export default Save;
