import { InnerBlocks, useBlockProps, RichText } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const { alignment, title, options, selectedOption } = attributes;

	const blockProps = useBlockProps.save({
		className: `align-${alignment}`,
	});

	return (
		<div {...blockProps}>
			<RichText.Content
				tagName="h4"
				value={title}
				className="blockons-content-selector-title"
			/>
			{options.map((option, index) => (
				<div
					key={option.id}
					className={`content-option ${
						selectedOption === index ? "active" : ""
					}`}
				>
					{selectedOption === index && <InnerBlocks.Content />}
				</div>
			))}
		</div>
	);
};

export default Save;
