import { RichText, useBlockProps } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: `align-${attributes.alignment} ${
			attributes.searchDisplay === 'default'
				? 'default-search'
				: 'icon-search'
		}`,
		id: attributes.searchId,
	});
	const siteUrl = searchObj.siteUrl;

	const searchProOptions = attributes.isPremium
		? {
				searchProId: attributes.searchProId,
				searchPro: attributes.searchPro,
				searchProTypes: attributes.searchProTypes,
				searchProAmnt: attributes.searchProAmnt,
				searchProCats: attributes.searchProCats,
				searchProCatsTitle: attributes.searchProCatsTitle,
				searchProCatsAmnt: attributes.searchProCatsAmnt,
				searchProTags: attributes.searchProTags,
				searchProTagsTitle: attributes.searchProTagsTitle,
				searchProTagsAmnt: attributes.searchProTagsAmnt,
				searchProImage: attributes.searchProImage,
				searchProDesc: attributes.searchProDesc,
				searchProPrice: attributes.searchProPrice,
				searchProHasPreview: attributes.searchProHasPreview,
			}
		: { searchPro: attributes.searchPro };

	const formProps = {
		role: 'search',
		method: 'get',
		className: `blockons-search-inner ${attributes.hasPlaceholder ? 'hasph' : 'noph'}`,
		...(attributes.baseUrl ? { action: attributes.baseUrl } : {}),
		...(siteUrl ? { 'data-siteurl': siteUrl } : {}),
	};

	console.log('BaseUrl', siteUrl, attributes.baseUrl);

	return (
		<div {...blockProps}>
			<div
				className={`blockons-search-block  ${attributes.searchDisplay} ${
					attributes.searchDisplay === 'dropdown' &&
					attributes.searchAlign
						? attributes.searchAlign
						: ''
				} ${attributes.searchDisplay === 'default' ? 'nopad' : ''} ${
					attributes.hasBtn ? 'hasBtn' : 'noBtn'
				}`}
				style={{
					...(attributes.searchDisplay === 'dropdown' ||
					attributes.searchDisplay === 'popup'
						? {
								backgroundColor: attributes.iconBgColor,
								padding: attributes.iconPadding,
								fontSize: attributes.iconSize,
							}
						: ''),
				}}
			>
				{attributes.searchDisplay === 'default' && (
					<div
						className="blockons-search-default"
						style={{
							width: attributes.searchWidthDefault,
						}}
					>
						<form {...formProps}>
							<input
								type="text"
								name="s"
								className="blockons-search-input"
								{...(attributes.hasPlaceholder
									? { placeholder: attributes.searchValue }
									: {})}
								required
								autoComplete="off"
								style={{
									backgroundColor:
										attributes.searchInputBgColor,
									borderColor:
										attributes.searchInputBorderColor,
									color: attributes.searchInputColor,
								}}
							/>
							{attributes.hasBtn && (
								<button
									type="submit"
									className="blockons-search-button"
									style={{
										backgroundColor:
											attributes.searchBtnBgColor,
										color: attributes.searchBtnColor,
									}}
								>
									<RichText.Content
										value={attributes.textButton}
									/>
								</button>
							)}
						</form>
						{attributes.isPremium && attributes.searchPro && (
							<div
								className="blockons-search-results-wrap"
								id={attributes.searchProId}
								data-settings={JSON.stringify(searchProOptions)}
							></div>
						)}
					</div>
				)}

				{(attributes.searchDisplay === 'dropdown' ||
					attributes.searchDisplay === 'popup') && (
					<span
						className="fa-solid fa-magnifying-glass"
						style={{
							color: attributes.iconColor,
						}}
					></span>
				)}

				{attributes.searchDisplay === 'dropdown' && (
					<div
						className="blockons-search-dropdown"
						style={{
							width: attributes.searchWidthDropdown + 'px',
							...(attributes.searchAlign === 'bottomcenter' ||
							attributes.searchAlign === 'topcenter'
								? {
										marginLeft:
											'-' +
											attributes.searchWidthDropdown / 2 +
											'px',
									}
								: ''),
						}}
					>
						<form {...formProps}>
							<input
								type="text"
								name="s"
								className="blockons-search-input"
								{...(attributes.hasPlaceholder
									? { placeholder: attributes.searchValue }
									: {})}
								required
								autoComplete="off"
								style={{
									backgroundColor:
										attributes.searchInputBgColor,
									borderColor:
										attributes.searchInputBorderColor,
									color: attributes.searchInputColor,
								}}
							/>
							{attributes.hasBtn && (
								<button
									type="submit"
									className="blockons-search-button"
									style={{
										backgroundColor:
											attributes.searchBtnBgColor,
										color: attributes.searchBtnColor,
									}}
								>
									<RichText.Content
										value={attributes.textButton}
									/>
								</button>
							)}
						</form>
						{attributes.isPremium && attributes.searchPro && (
							<div
								className="blockons-search-results-wrap"
								id={attributes.searchProId}
								data-settings={JSON.stringify(searchProOptions)}
							></div>
						)}
					</div>
				)}
			</div>

			{attributes.searchDisplay === 'popup' && (
				<>
					<div className="blockons-search-popup-overlay"></div>
					<div className="blockons-search-popup-wrapper">
						<div
							className="blockons-search-popup"
							style={{
								width: attributes.searchWidthPopup + 'px',
								backgroundColor: attributes.searchBgColor,
							}}
						>
							<div className="blockons-close fas fa-x"></div>

							<form {...formProps}>
								<input
									type="text"
									name="s"
									className="blockons-search-input"
									{...(attributes.hasPlaceholder
										? {
												placeholder:
													attributes.searchValue,
											}
										: {})}
									required
									autoComplete="off"
									style={{
										backgroundColor:
											attributes.searchInputBgColor,
										borderColor:
											attributes.searchInputBorderColor,
										color: attributes.searchInputColor,
									}}
								/>
								{attributes.hasBtn && (
									<button
										type="submit"
										className="blockons-search-button"
										style={{
											backgroundColor:
												attributes.searchBtnBgColor,
											color: attributes.searchBtnColor,
										}}
									>
										<RichText.Content
											value={attributes.textButton}
										/>
									</button>
								)}
							</form>
							{attributes.isPremium && attributes.searchPro && (
								<div
									className="blockons-search-results-wrap"
									id={attributes.searchProId}
									data-settings={JSON.stringify(
										searchProOptions,
									)}
								></div>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Save;
