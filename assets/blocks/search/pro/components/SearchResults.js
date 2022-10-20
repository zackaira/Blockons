// Localized JS object - blockonsObj
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../../../../src/backend/Loader";
import parse from "html-react-parser";
import { __ } from "@wordpress/i18n";

const SearchResults = ({ searchId, searchSettings }) => {
	const restUrl = searchObj.apiUrl;
	const set = searchSettings ? searchSettings : "";
	const searchInput = document.querySelector(
		`#${searchId} .blockons-search-input`
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searchCats, setSearchCats] = useState([]);
	const [searchTags, setSearchTags] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	let currentQuery = "";
	const timeout = false;

	// Search Input Event Listener
	searchInput.addEventListener("keyup", () => {
		setSearchQuery(searchInput.value);
	});

	// Handle Search function on input typing
	useEffect(() => {
		blockonsProductSearch(searchQuery, currentQuery, timeout);
	}, [searchQuery]);

	function blockonsProductSearch(query, currentQuery, timeout) {
		const searchQuery = query.trim();

		if (searchQuery.length >= 3) {
			setIsLoading(true);

			if (timeout) {
				clearTimeout(timeout);
			}

			if (searchQuery != currentQuery) {
				timeout = setTimeout(() => {
					setSearchResults([]);
					setSearchCats([]);
					setSearchTags([]);

					let endpoints = [
						restUrl +
							`wp/v2/search?search=${searchQuery}&subtype=${set.searchProTypes}&per_page=${set.searchProAmnt}&page=1`,
						restUrl +
							`wp/v2/search?search=${searchQuery}&type=term&subtype=${
								set.searchProTypes === "product" ? "product_cat" : "category"
							}&per_page=${set.searchProCatsAmnt}&page=1`,
						restUrl +
							`wp/v2/search?search=${searchQuery}&type=term&subtype=${
								set.searchProTypes === "product" ? "product_tag" : "post_tag"
							}&per_page=${set.searchProTagsAmnt}&page=1`,
					];

					axios
						.all(endpoints.map((promise) => axios.get(promise)))
						.then(
							axios.spread(({ data: main }, { data: cats }, { data: tags }) => {
								currentQuery = searchQuery;

								setSearchResults(main);
								if (cats && set.searchProCats) {
									setSearchCats(cats);
								}
								if (tags && set.searchProTags) {
									setSearchTags(tags);
								}
							})
						)
						.then(() => setIsLoading(false))
						.catch((err) => {
							setSearchResults([]);
							setSearchCats([]);
							setSearchTags([]);

							setIsLoading(false);

							console.log("There was a problem or request was cancelled.");
						});
				}, 800);
			}
		} else {
			setIsLoading(false);

			setSearchResults([]);
			setSearchCats([]);
			setSearchTags([]);

			clearTimeout(timeout);
			timeout = false;
		}
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
					{searchCats.length > 0 && set.searchProCats && (
						<div className="blockons-sresult-catags">
							<h6 className="blockons-sresult-head">
								{set.searchProCatsTitle}
							</h6>
							{searchCats.map((item) => (
								<a
									href={item.url}
									// id={`${item.subtype}-${item.id}`}
									className={`blockons-tresult ${item.type}`}
									key={item.id}
								>
									{item.title}
								</a>
							))}
						</div>
					)}

					{searchTags.length > 0 && set.searchProTags && (
						<div className="blockons-sresult-catags">
							<h6 className="blockons-sresult-head">
								{set.searchProTagsTitle}
							</h6>
							{searchTags.map((item) => (
								<a
									href={item.url}
									// id={`${item.subtype}-${item.id}`}
									className={`blockons-tresult ${item.type}`}
									key={item.id}
								>
									{item.title}
								</a>
							))}
						</div>
					)}

					{searchResults.length > 0 && (
						<div className="blockons-search-results">
							{(set.searchProCats || set.searchProTags) && (
								<h6 className="blockons-sresult-head">{`${set.searchProTypes}s`}</h6>
							)}

							{searchResults.length > 0 &&
								searchResults.map((item) => (
									<a
										href={item.url}
										id={`${item.subtype}-${item.id}`}
										className={`blockons-sresult ${item.subtype}`}
										key={item.id}
									>
										{item.extras.image && set.searchProImage && (
											<div className="blockons-sresult-left">
												<img src={item.extras.image} />
											</div>
										)}
										<div className="blockons-sresult-center">
											{item.title && (
												<h4 className="blockons-sresult-title">{item.title}</h4>
											)}
											{item.extras.excerpt && set.searchProDesc && (
												<p className="blockons-sresult-desc">
													{item.extras.excerpt}
												</p>
											)}
										</div>
										{item.subtype === "product" && set.searchProPrice && (
											<div className="blockons-sresult-right">
												{parse(item.extras.price)}
											</div>
										)}
									</a>
								))}
						</div>
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

export default SearchResults;
