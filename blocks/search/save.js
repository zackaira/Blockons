/**
 * WordPress dependencies
 */
import { RichText, useBlockProps } from "@wordpress/block-editor";

const Save = ({ attributes }) => {
	const blockProps = useBlockProps.save({
		className: attributes.alignment,
	});

	return (
		<div {...blockProps}>
			<div
				className={`blockons-search-block  ${attributes.searchDisplay}`}
				style={{
					backgroundColor: attributes.iconBgColor,
				}}
			>
				<span
					className="fa-solid fa-magnifying-glass"
					style={{
						color: attributes.iconColor,
					}}
				></span>

				{attributes.searchDisplay === "dropdown" && (
					<div className="blockons-search-dropdown">
						<div className="blockons-search-inner">
							<form role="search" method="get">
								<input
									type="text"
									name="s"
									className="blockons-search-input"
									placeholder={attributes.textInput}
									required
								/>
								<button
									type="submit"
									className="blockons-search-button"
									style={{
										backgroundColor: attributes.searchBtnBgColor,
										color: attributes.searchBtnColor,
									}}
								>
									<RichText.Content value={attributes.textButton} />
								</button>
							</form>
						</div>
					</div>
				)}
			</div>

			{attributes.searchDisplay === "popup" && (
				<>
					<div className="blockons-search-popup-overlay"></div>
					<div className="blockons-search-popup-wrapper">
						<div
							className="blockons-search-popup"
							style={{
								backgroundColor: attributes.searchBgColor,
							}}
						>
							<div className="blockons-close fas fa-x"></div>
							<div className="blockons-search-inner">
								<form role="search" method="get">
									<input
										type="text"
										name="s"
										className="blockons-search-input"
										placeholder={attributes.textInput}
										required
									/>
									<button
										type="submit"
										className="blockons-search-button"
										style={{
											backgroundColor: attributes.searchBtnBgColor,
											color: attributes.searchBtnColor,
										}}
									>
										<RichText.Content value={attributes.textButton} />
									</button>
								</form>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default Save;
