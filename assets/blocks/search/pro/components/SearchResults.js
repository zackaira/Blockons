// Localized JS object - siteObj
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../../../../../src/backend/Loader";
import parse from "html-react-parser";
import { __ } from "@wordpress/i18n";

const SearchResults = ({ searchId, searchSettings }) => {
	const restUrl = searchObj.apiUrl;
	const set = searchSettings ? searchSettings : "";
	const element = document.getElementById(searchId);
	const searchParentId = "#" + element.closest(".blockons-search-block").id;
	const searchInput = document.querySelector(
		searchParentId + " .blockons-search-input"
	);
	const [searchQuery, setSearchQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [searchCats, setSearchCats] = useState([]);
	const [searchTags, setSearchTags] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	let currentQuery = "";
	const timeout = false;
	//const searchSettings = document.getElementById('blockons-search-results-wrap');

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
					let getPosts =
						restUrl +
						`/wp/v2/search?search=${searchQuery}&subtype=${set.searchProTypes}&per_page=5&page=1`;
					let getCats =
						restUrl +
						`/wp/v2/search?search=${searchQuery}&type=term&subtype=${
							set.searchProTypes === "product" ? "product_cat" : "category"
						}&per_page=5&page=1`;
					let getTags =
						restUrl +
						`/wp/v2/search?search=${searchQuery}&type=term&subtype=${
							set.searchProTypes === "product" ? "product_tag" : "post_tag"
						}&per_page=5&page=1`;

					const requestMain = axios.get(getPosts);
					const requestCats = axios.get(getCats);
					const requestTags = axios.get(getTags);

					axios
						.all([requestMain, requestCats, requestTags])
						.then(
							axios.spread((...responses) => {
								currentQuery = searchQuery;

								setSearchResults(responses[0].data);
								setSearchCats(responses[1].data);
								setSearchTags(responses[2].data);
							})
						)
						.then(() => setIsLoading(false))
						.catch((errors) => {
							console.error(errors);
							// react on errors.
						});

					// axios
					// 	.get(
					// 		restUrl +
					// 			`/wp/v2/search?search=${searchQuery}&subtype[]=${set.searchProTypes}&per_page=20&page=1`
					// 	)
					// 	.then((res) => {
					// 		currentQuery = query;
					// 		setSearchResults(res.data);
					// 		// console.log(res.data);
					// 	})
					// 	.then(() => {
					// 		setIsLoading(false);
					// 	});
				}, 500);
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

	console.log("Main:", searchResults);
	console.log("Cats:", searchCats);
	console.log("Tags:", searchTags);
	console.log("Query:", searchQuery);

	if (isLoading)
		return (
			<div className="blockons-search-results-block loading">
				<Loader />
			</div>
		);

	return (
		<React.Fragment>
			{(searchCats.length > 0 ||
				searchTags.length > 0 ||
				searchResults.length > 0) && (
				<div className="blockons-search-results-block">
					{searchCats.length > 0 && set.searchProCats && (
						<div className="blockons-sresult-catags">
							<h6 className="blockons-sresult-head">{`Categories`}</h6>
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
							<h6 className="blockons-sresult-head">{`Tags`}</h6>
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

							{searchResults.length > 0 ? (
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
								))
							) : (
								<div className="blockons-search-results no-results">
									{__("No Results", "blockons")}
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</React.Fragment>
	);
};

export default SearchResults;
