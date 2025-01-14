import { useState, useEffect, useCallback } from '@wordpress/element';
import axios from 'axios';
import Loader from '../../../../../src/backend/Loader';
import { __ } from '@wordpress/i18n';
import ResultsBlock from './ResultsBlock';

const SearchWrap = ({ searchId, searchSettings }) => {
	const restUrl = searchObj.apiUrl;
	const set = searchSettings || {};
	const [searchInput, setSearchInput] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [searchCats, setSearchCats] = useState([]);
	const [searchTags, setSearchTags] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [postTypeTaxonomies, setPostTypeTaxonomies] = useState([]);
	const [currentQuery, setCurrentQuery] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);

	// Initialize searchInput
	useEffect(() => {
		// Look for input in both normal and popup contexts
		const input = document.querySelector(
			`#${searchId} input.blockons-search-input`,
		);

		if (input) {
			setSearchInput(input);

			// Add focus handler for popup
			const searchBlock = input.closest('.wp-block-blockons-search');
			if (searchBlock && searchBlock.classList.contains('popup')) {
				input.addEventListener('focus', () => {
					const searchPopup = input.closest('.blockons-search-popup');
					if (searchPopup) {
						searchPopup.classList.add('search-on');
					}
				});
			}
		}
	}, [searchId]);

	const clearSearchResults = useCallback(() => {
		setSearchResults([]);
		setSearchCats([]);
		setSearchTags([]);
		setCurrentPage(1);
		setTotalPages(0);
	}, []);

	// Handle input events
	useEffect(() => {
		if (!searchInput) return;

		const handleKeyUp = () => {
			setSearchQuery(searchInput.value);
		};

		searchInput.addEventListener('keyup', handleKeyUp);
		return () => {
			searchInput.removeEventListener('keyup', handleKeyUp);
		};
	}, [searchInput]);

	// Handle click outside
	useEffect(() => {
		if (!searchInput) return;

		const searchParent = searchInput.closest(
			'.blockons-search-default, .blockons-search-dropdown, .blockons-search-popup',
		);
		if (!searchParent) return;

		function handleClick(e) {
			if (searchParent.contains(e.target)) {
				searchParent.classList.add('searchon');
			} else {
				searchParent.classList.remove('searchon');
			}
		}

		document.addEventListener('click', handleClick);
		return () => {
			document.removeEventListener('click', handleClick);
		};
	}, [searchInput]);

	// Fetch taxonomies
	const fetchAndSetTaxonomies = useCallback(
		async (cpt) => {
			if (!cpt) return;

			try {
				const response = await axios.get(`${restUrl}wp/v2/taxonomies`);
				const taxonomies = response.data;

				if (!taxonomies || !Object.values(taxonomies).length) {
					throw new Error('No taxonomies found.');
				}

				const matchingTaxonomies = Object.values(taxonomies)
					.filter((taxonomy) => taxonomy.types.includes(cpt))
					.map((taxonomy) => taxonomy.slug);

				setPostTypeTaxonomies(matchingTaxonomies);
			} catch (error) {
				console.error(
					'Error fetching taxonomies for CPT:',
					error.message,
				);
			}
		},
		[restUrl],
	);

	// Handle search
	const handleSearch = useCallback(
		async (query) => {
			if (query.length < 3) {
				clearSearchResults();
				return;
			}

			setIsLoading(true);

			try {
				const endpoints = [
					`${restUrl}wp/v2/search?search=${query}&subtype=${set.searchProTypes}&per_page=${set.searchProAmnt}&page=1`,
				];

				if (
					set.searchProCats &&
					set.searchProTags &&
					set.searchProTypes !== 'page'
				) {
					postTypeTaxonomies.forEach((taxonomy) => {
						endpoints.push(
							`${restUrl}wp/v2/search?search=${query}&type=term&subtype=${taxonomy}&per_page=${set.searchProCatsAmnt}&page=1`,
						);
					});
				}

				const responses = await axios.all(
					endpoints.map((endpoint) => axios.get(endpoint)),
				);
				const [mainResponse, ...taxonomyResponses] = responses;

				setSearchResults(mainResponse.data);
				setTotalPages(mainResponse.headers['x-wp-totalpages']);
				setCurrentQuery(query);

				if (set.searchProCats && taxonomyResponses[0]?.data?.length) {
					setSearchCats(taxonomyResponses[0].data);
				}
				if (set.searchProTags && taxonomyResponses[1]?.data?.length) {
					setSearchTags(taxonomyResponses[1].data);
				}
			} catch (error) {
				console.error('Search error:', error);
				clearSearchResults();
			} finally {
				setIsLoading(false);
			}
		},
		[restUrl, set, postTypeTaxonomies, clearSearchResults],
	);

	// Debounced search effect
	useEffect(() => {
		if (searchQuery?.length >= 3) {
			setIsLoading(true);
			const timeoutId = setTimeout(() => {
				handleSearch(searchQuery);
			}, 800);

			return () => {
				clearTimeout(timeoutId);
				setIsLoading(false); // Clear loading on cleanup
			};
		}
	}, [searchQuery, handleSearch]);

	// Initial setup
	useEffect(() => {
		fetchAndSetTaxonomies(set.searchProTypes);
	}, [set.searchProTypes, fetchAndSetTaxonomies]);

	return (
		<>
			{searchQuery?.length >= 3 && (
				<div
					className={`blockons-search-results-block ${isLoading ? 'loading' : ''}`}
				>
					{isLoading && <Loader />}

					{!isLoading && searchResults?.length > 0 && (
						<ResultsBlock
							searchCats={searchCats}
							searchTags={searchTags}
							results={searchResults}
							set={set}
							restUrl={restUrl}
							searchQuery={searchQuery}
							currentPage={currentPage}
							totalPages={totalPages}
							onPaginationPageChange={setCurrentPage}
						/>
					)}

					{!isLoading &&
						searchResults?.length === 0 &&
						searchQuery && (
							<div className="no-results">
								{__('No Results', 'blockons')}
							</div>
						)}
				</div>
			)}
		</>
	);
};

export default SearchWrap;
