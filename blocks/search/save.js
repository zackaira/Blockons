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
				className={`blockons-search-block  ${attributes.searchDisplay} ${
					attributes.searchDisplay === "dropdown" && attributes.searchAlign
						? attributes.searchAlign
						: ""
				} ${attributes.searchDisplay === "default" ? "nopad" : ""}`}
				style={{
					backgroundColor: attributes.iconBgColor,
					fontSize: attributes.iconSize,
					...(attributes.searchDisplay === "dropdown" ||
					attributes.searchDisplay === "popup"
						? { padding: attributes.iconPadding }
						: ""),
				}}
			>
				{attributes.searchDisplay === "default" && (
					<div className="blockons-search-default">
						<form
							role="search"
							method="get"
							className="blockons-search-inner"
							style={{
								width: attributes.searchWidth,
							}}
						>
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
				)}

				{(attributes.searchDisplay === "dropdown" ||
					attributes.searchDisplay === "popup") && (
					<span
						className="fa-solid fa-magnifying-glass"
						style={{
							color: attributes.iconColor,
						}}
					></span>
				)}

				{attributes.searchDisplay === "dropdown" && (
					<div
						className="blockons-search-dropdown"
						style={{
							...(attributes.searchAlign === "bottomcenter" ||
							attributes.searchAlign === "topcenter"
								? { marginLeft: -attributes.searchWidth / 2 }
								: ""),
						}}
					>
						<form
							role="search"
							method="get"
							className="blockons-search-inner"
							style={{
								width: attributes.searchWidth,
							}}
						>
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
							<form
								role="search"
								method="get"
								className="blockons-search-inner"
							>
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
				</>
			)}
		</div>
	);
};

export default Save;
