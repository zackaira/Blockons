import { useState, useEffect } from "@wordpress/element";
import axios from "axios";
import Loader from "../../../../../src/backend/Loader";
import { __ } from "@wordpress/i18n";
import ResultsBlock from "./ResultsBlock";

const SearchWrap = ({ searchId, searchSettings }) => {
	const restUrl = searchObj.apiUrl;
	const set = searchSettings ? searchSettings : "";
	const searchInput = document.querySelector(
		`#${searchId} .blockons-search-input`
	);
	// const [searchOn, setSearchOn] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searchCats, setSearchCats] = useState([]);
	const [searchTags, setSearchTags] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [postTypeTaxonomies, setPostTypeTaxonomies] = useState([]);
	const [currentQuery, setCurrentQuery] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	let timeout = false;

	useEffect(() => {
		if (!searchInput) return;

		const handleKeyUp = () => {
			setSearchQuery(searchInput.value);
		};

		searchInput.addEventListener("keyup", handleKeyUp);
		return () => {
			searchInput.removeEventListener("keyup", handleKeyUp);
		};
	}, [searchInput]);

	useEffect(() => {
		const searchParent = searchInput?.closest(".blockons-search-default");

		if (!searchParent) return;

		function handleClick(e) {
			if (searchParent.contains(e.target)) {
				searchParent.classList.add("searchon");
			} else {
				searchParent.classList.remove("searchon");
			}
		}

		document.addEventListener("click", handleClick);
		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, []);

	useEffect(() => {
		fetchAndSetTaxonomiesForCPT(set.searchProTypes);
		blockonsPostTypeSearch(searchQuery, currentQuery, timeout);
	}, [searchQuery]);

	const fetchAndSetTaxonomiesForCPT = async (cpt) => {
		if (!cpt) return;

		try {
			const response = await axios.get(`${restUrl}wp/v2/taxonomies`);
			const taxonomies = response.data;

			if (!taxonomies || !Object.values(taxonomies).length) {
				throw new Error("No taxonomies found.");
			}

			const matchingTaxonomies = Object.values(taxonomies)
				.filter((taxonomy) => taxonomy.types.includes(cpt))
				.map((taxonomy) => taxonomy.slug);

			setPostTypeTaxonomies(matchingTaxonomies);
		} catch (error) {
			console.error("Error fetching taxonomies for CPT:", error.message);
		}
	};

	function blockonsPostTypeSearch(query, currentQuery, timeout) {
		setSearchQuery(query.trim());

		if (searchQuery.length >= 3) {
			setIsLoading(true);
			if (timeout) clearTimeout(timeout);

			if (searchQuery !== currentQuery) {
				timeout = setTimeout(() => {
					clearSearchResults();

					let endpoints = [
						restUrl +
							`wp/v2/search?search=${searchQuery}&subtype=${set.searchProTypes}&per_page=${set.searchProAmnt}&page=1`,
					];
					if (
						set.searchProCats &&
						set.searchProTags &&
						set.searchProTypes !== "page"
					) {
						postTypeTaxonomies.forEach((taxonomy) => {
							endpoints.push(
								restUrl +
									`wp/v2/search?search=${searchQuery}&type=term&subtype=${taxonomy}&per_page=${set.searchProCatsAmnt}&page=1`
							);
						});
					}

					axios
						.all(endpoints.map((endpoint) => axios.get(endpoint)))
						.then(
							axios.spread((mainResponse, catsResponse, tagsResponse) => {
								setCurrentQuery(searchQuery);

								if (mainResponse) {
									setSearchResults(mainResponse.data);
									setTotalPages(mainResponse.headers["x-wp-totalpages"]);
								}
								if (
									set.searchProCats &&
									catsResponse?.data &&
									catsResponse?.data.length > 0
								) {
									setSearchCats(catsResponse.data);
								}
								if (
									set.searchProTags &&
									tagsResponse?.data &&
									tagsResponse?.data.length > 0
								) {
									setSearchTags(tagsResponse.data);
								}
							})
						)
						.catch((err) => {
							clearSearchResults();
							console.log("There was a problem or request was cancelled.", err);
						})
						.finally(() => {
							setIsLoading(false);
							clearTimeout(timeout);
							timeout = false;
						});
				}, 800);
			}
		} else {
			clearSearchResults();
			setIsLoading(false);
			clearTimeout(timeout);
			timeout = false;
		}
	}

	function handlePaginationPageChange(newPage) {
		setCurrentPage(newPage);
	}

	function clearSearchResults() {
		setSearchResults([]);
		setSearchCats([]);
		setSearchTags([]);
		setCurrentPage(1);
		setTotalPages(0);
	}

	if (isLoading)
		return (
			<div className="blockons-search-results-block loading">
				<Loader />
			</div>
		);

	// console.log("Results: ", searchResults);

	return (
		<React.Fragment>
			{searchQuery?.length >= 3 && searchResults && (
				<div className="blockons-search-results-block">
					{searchResults?.length > 0 && (
						<ResultsBlock
							searchCats={searchCats}
							searchTags={searchTags}
							results={searchResults}
							set={set}
							restUrl={restUrl}
							searchQuery={searchQuery}
							currentPage={currentPage}
							totalPages={totalPages}
							onPaginationPageChange={handlePaginationPageChange}
						/>
					)}

					{searchResults?.length === 0 &&
						searchCats?.length === 0 &&
						searchTags?.length === 0 && (
							<div className="blockons-search-results-block no-results">
								{__("No Results", "blockons")}
							</div>
						)}
				</div>
			)}
		</React.Fragment>
	);
};

export default SearchWrap;
