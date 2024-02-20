import React, { useState, useEffect } from "react";
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
	const [currentQuery, setcurrentQuery] = useState("");
	const [totalPages, setTotalPages] = useState(0);
	let timeout = false;

	// Search Input Event Listener
	searchInput.addEventListener("keyup", () => {
		setSearchQuery(searchInput.value);
	});

	useEffect(() => {
		const searchParent = searchInput.closest(".blockons-search-default");

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

			if (searchQuery != currentQuery) {
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
							axios.spread((mainResponse, { data: cats }, { data: tags }) => {
								setcurrentQuery(searchQuery);

								if (mainResponse) {
									setSearchResults(mainResponse.data);
									setTotalPages(mainResponse.headers["x-wp-totalpages"]);
								}
								if (set.searchProCats && cats && cats.length > 0) {
									setSearchCats(cats);
								}
								if (set.searchProTags && tags && tags.length > 0) {
									setSearchTags(tags);
								}
							})
						)
						.then(() => setIsLoading(false))
						.catch((err) => {
							clearSearchResults();
							setIsLoading(false);
							console.log("There was a problem or request was cancelled.", err);
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

	function clearSearchResults() {
		setSearchResults([]);
		setSearchCats([]);
		setSearchTags([]);
	}

	if (isLoading)
		return (
			<div className="blockons-search-results-block loading">
				<Loader />
			</div>
		);

	return (
		<React.Fragment>
			{searchQuery.length >= 3 && searchResults && (
				<div className="blockons-search-results-block">
					{searchResults.length > 0 && (
						<ResultsBlock
							searchCats={searchCats}
							searchTags={searchTags}
							results={searchResults}
							set={set}
							restUrl={restUrl}
							searchQuery={searchQuery}
							totalPages={totalPages}
						/>
					)}

					{searchResults.length === 0 &&
						searchCats.length === 0 &&
						searchTags.length === 0 && (
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
