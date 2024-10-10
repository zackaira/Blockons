import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import ResultsItem from "./ResultsItem";
import Loader from "../../../../../src/backend/Loader";
import TaxResults from "./TaxResults";
import Pagination from "./Pagination";
import axios from "axios";
import Preview from "./Preview";

const ResultsBlock = ({
	searchCats,
	searchTags,
	results,
	set,
	restUrl,
	searchQuery,
	currentPage,
	totalPages,
	onPaginationPageChange,
}) => {
	const [isLoading, setIsLoading] = useState(false);
	const [searchResults, setSearchResults] = useState(results);
	// const [currentPage, setCurrentPage] = useState(1);
	const [previewId, setPreviewId] = useState(null);

	function handlePostPageChange(newPage) {
		setIsLoading(true);
		axios
			.get(
				`${restUrl}wp/v2/search?search=${searchQuery}&subtype=${set.searchProTypes}&per_page=${set.searchProAmnt}&page=${newPage}`
			)
			.then((response) => {
				if (response && response.data && Array.isArray(response.data)) {
					onPaginationPageChange(newPage);
					setSearchResults(response.data);
				} else {
					throw new Error("Invalid response data format");
				}
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}

	const handlePreviewChange = (id) => {
		setPreviewId(id);
	};

	return (
		<div
			className={`blockons-search-results ${
				set.searchProHasPreview ? "has-preview" : ""
			}`}
		>
			{/* {set.searchProHasPreview && previewId && (
				<div
					className="blockons-spreview-close fa-solid fa-xmark"
					onClick={() => setPreviewId(null)}
				></div>
			)} */}

			<div className="blockons-results">
				{set.searchProCats && searchCats?.length > 0 && (
					<TaxResults taxItems={searchCats} title={set.searchProCatsTitle} />
				)}

				{set.searchProTags && searchTags?.length > 0 && (
					<TaxResults taxItems={searchTags} title={set.searchProTagsTitle} />
				)}

				{(set.searchProCats || set.searchProTags) && (
					<h6 className="blockons-sresult-head">{`${set.searchProTypes}s`}</h6>
				)}

				<div className={`blockons-search-items ${isLoading ? "loading" : ""}`}>
					{isLoading ? (
						<Loader />
					) : searchResults && Array.isArray(searchResults) ? (
						searchResults.map((item) => (
							<ResultsItem
								key={item.id}
								searchItem={item}
								set={set}
								previewChange={handlePreviewChange}
							/>
						))
					) : (
						<p>{__("No Results", "blockons")}</p>
					)}
				</div>

				{totalPages > 1 && (
					<Pagination
						totalPages={totalPages}
						currentPage={currentPage}
						onPageChange={handlePostPageChange}
					/>
				)}
			</div>
			{set.searchProHasPreview && previewId && (
				<Preview
					restUrl={restUrl}
					cpt={set.searchProTypes}
					postId={previewId}
					set={set}
				/>
			)}
		</div>
	);
};

export default ResultsBlock;
