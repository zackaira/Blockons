import { RichText, InnerBlocks, useBlockProps } from '@wordpress/block-editor';

function save({ attributes }) {
	const blockProps = useBlockProps.save({
		className: `blockons-adv-button ${attributes.buttonAction === 'modal' ? ' blockons-modal-trigger' : ''} ${attributes.buttonAction === 'viewcontent' ? ' blockons-viewcontent-trigger' : ''} ${attributes.buttonAction === 'quickview' ? ' blockons-quickview-trigger' : ''} ${attributes.buttonAnimation !== 'none' ? `animate-${attributes.buttonAnimation}` : ''}`,
		style: {
			...(attributes.textHoverColor && {
				'--blockons-btn-hover-text-color': attributes.textHoverColor,
			}),
			...(attributes.BackgroundHoverColor && {
				'--blockons-btn-hover-bg-color':
					attributes.BackgroundHoverColor,
			}),
			...(attributes.borderRadius && {
				borderRadius: `${attributes.borderRadius}px`,
			}),
			...(attributes.hasborder &&
				attributes.borderRadius && {
					borderRadius: `${attributes.borderRadius}px`,
				}),
			...(attributes.hasborder &&
				attributes.borderWidth && {
					borderWidth: `${attributes.borderWidth}px`,
				}),
			...(attributes.hasborder &&
				attributes.borderColor && {
					borderColor: attributes.borderColor,
				}),
		},
		...(attributes.buttonAction === 'quickview'
			? {
					'data-product-id': attributes.productId || '{{product_id}}',
				}
			: {}),
	});

	return (
		<div className="blockons-adv-button-block-wrapper">
			<div
				className={`blockons-adv-button-block align-${attributes.alignment} type-${attributes.buttonAction}`}
			>
				{attributes.buttonAction === 'link' ? (
					<a
						{...blockProps}
						href={attributes.buttonUrl}
						{...(attributes.linkTarget
							? { target: attributes.linkTarget }
							: {})}
						{...(attributes.rel ? { rel: attributes.rel } : {})}
						style={{
							...(attributes.textHoverColor && {
								'--blockons-btn-hover-text-color':
									attributes.textHoverColor,
							}),
							...(attributes.BackgroundHoverColor && {
								'--blockons-btn-hover-bg-color':
									attributes.BackgroundHoverColor,
							}),
						}}
					>
						<RichText.Content
							tagName="span"
							className="blockons-adv-btn"
							value={attributes.text}
						/>
					</a>
				) : (
					<div {...blockProps}>
						<RichText.Content
							tagName={
								attributes.buttonAction === 'link' ? 'a' : 'div'
							}
							className={`blockons-adv-btn`}
							value={attributes.text}
							{...(attributes.buttonAction === 'modal'
								? {
										'data-modal-id': attributes.modalId,
									}
								: {})}
							{...(attributes.buttonAction === 'viewcontent'
								? {
										'data-viewcontent-id':
											attributes.viewContentId,
									}
								: {})}
							{...(attributes.buttonAction === 'link'
								? {
										href: attributes.buttonUrl,
										target: attributes.linkTarget,
										rel: attributes.rel,
									}
								: {})}
						/>
					</div>
				)}
			</div>

			{attributes.isPremium && attributes.buttonAction === 'modal' && (
				<div
					id={attributes.modalId}
					className="blockons-modal blockons-modal-innerblocks"
				>
					<div
						className="blockons-modal-inner"
						style={{
							maxWidth: attributes.modalWidth,
						}}
					>
						<InnerBlocks.Content />
					</div>
				</div>
			)}

			{attributes.isPremium &&
				attributes.buttonAction === 'viewcontent' && (
					<div
						id={attributes.viewContentId}
						className="blockons-viewcontent blockons-viewcontent-hidden"
					>
						<div
							className="blockons-viewcontent-inner"
							style={{
								maxWidth: attributes.modalWidth,
							}}
						>
							<InnerBlocks.Content />
						</div>
					</div>
				)}
		</div>
	);
}

export default save;
