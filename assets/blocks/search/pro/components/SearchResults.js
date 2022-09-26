// Localized JS object - siteObj
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../../../../src/backend/Loader";
import parse from "html-react-parser";
import { __ } from "@wordpress/i18n";

const SearchResults = () => {
	const restUrl = searchObj.apiUrl;
	const searchInput = document.querySelector(".blockons-search-input");
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState("");
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

			if (query != currentQuery) {
				timeout = setTimeout(() => {
					axios
						.get(
							restUrl +
								`/wp/v2/search?search=${searchQuery}&subtype[]=post&subtype[]=product&per_page=20&page=1`
						)
						.then((res) => {
							currentQuery = query;
							setSearchResults(res.data);
							// console.log(res.data);
						})
						.then(() => {
							setIsLoading(false);
						});
				}, 500);
			}
		} else {
			setSearchResults("");

			clearTimeout(timeout);
			timeout = false;
		}
	}

	console.log(searchResults);

	if (searchQuery && isLoading)
		return (
			<div className="blockons-search-results-block">
				<Loader />
			</div>
		);

	return (
		<React.Fragment>
			{searchResults && (
				<div className="blockons-search-results-block">
					<div className="blockons-search-results">
						{searchResults.length > 0 ? (
							searchResults.map((item) => (
								<a
									href={item.url}
									id={`${item.subtype}-${item.id}`}
									className={`blockons-sresult ${item.subtype}`}
									key={item.id}
								>
									<div className="blockons-sresult-left">
										<img src={item.extras.image} />
									</div>
									<div className="blockons-sresult-center">
										<h4 className="blockons-sresult-title">{item.title}</h4>
										{item.extras.excerpt && (
											<p className="blockons-sresult-desc">
												{item.extras.excerpt}
											</p>
										)}
									</div>
									{item.subtype === "product" && (
										<div className="blockons-sresult-right">
											{parse(item.extras.price)}
										</div>
									)}
								</a>
							))
						) : (
							<div className="blockons-search-results">No Results</div>
						)}
					</div>
				</div>
			)}
		</React.Fragment>
	);
};

export default SearchResults;
