// Main QuickView initialization file
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import QuickViewPopup from './QuickViewPopup';
import 'animate.css';
import './quickview.css';

// Keep track of current request
let currentAbortController = null;
let currentLoadingButton = null;
const quickview = blockonsQuickviewObj.quickviewOptions || {};

// Create a single instance with default configuration
const MySwal = withReactContent(
	Swal.mixin({
		showCloseButton: true,
		width: '800px',
		position: 'center',
		showClass: {
			popup: 'animate__animated animate__zoomIn animate__faster',
		},
		hideClass: {
			popup: 'animate__animated animate__zoomOut animate__faster',
		},
		customClass: {
			container: 'blockons-popup-container',
			popup: 'blockons-popup-swal',
			confirmButton: 'blockons-popup-btn fa-solid fa-chevron-right next',
			denyButton: 'blockons-popup-btn fa-solid fa-chevron-left prev',
		},
		// Add didClose callback to handle modal closing
		didClose: () => {
			// Cancel any in-flight request when modal is closed
			if (currentAbortController) {
				currentAbortController.abort();
				currentAbortController = null;
			}
			// Remove loading state from button
			if (currentLoadingButton) {
				currentLoadingButton.classList.remove('loading');
				currentLoadingButton = null;
			}
		},
	}),
);

document.addEventListener('DOMContentLoaded', () => {
	// Initial binding of quickview buttons
	bindQuickViewButtons();

	// Handle dynamically loaded products (for infinite scroll/load more)
	const productGrid = document.querySelector('.wc-block-grid__products');
	if (productGrid) {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (
					mutation.type === 'childList' &&
					mutation.addedNodes.length > 0
				) {
					bindQuickViewButtons();
				}
			});
		});

		observer.observe(productGrid, {
			childList: true,
			subtree: true,
		});
	}

	const allProductsBlock = document.querySelector('.wc-block-all-products');
	if (allProductsBlock) {
		console.log('All products block found');

		const position = blockonsQuickviewObj?.position || 'one';
		const text = blockonsQuickviewObj?.text || 'Quick View';
		const oneclass =
			position === 'one'
				? 'wp-block-button__link wp-element-button add_to_cart_button'
				: '';

		// Function to safely extract product ID from various sources
		const getProductId = (product) => {
			try {
				// Try getting ID from add to cart button aria-label
				const addToCartButton = product.querySelector(
					'.wc-block-components-product-button button',
				);
				if (addToCartButton) {
					const ariaLabel =
						addToCartButton.getAttribute('aria-label');
					if (ariaLabel) {
						const match = ariaLabel.match(/\"([^\"]+)\"/);
						if (match && match[1]) {
							return match[1];
						}
					}
				}

				// Try getting ID from product link
				const productLink = product.querySelector(
					'.wc-block-components-product-name',
				);
				if (productLink) {
					const href = productLink.getAttribute('href');
					if (href) {
						// Extract the slug from the URL
						const slug = href.split('/').filter(Boolean).pop();
						// You might need to maintain a mapping of slugs to IDs
						// or use another method to get the ID from the slug
						return slug;
					}
				}

				// Try other methods if available
				const dataId = product.getAttribute('data-product-id');
				if (dataId) return dataId;

				// If we get here, we couldn't find an ID

				return null;
			} catch (error) {
				return null;
			}
		};

		// Function to process each product
		const addQuickViewToProduct = (product) => {
			// Skip if quickview already exists
			if (product.querySelector('.blockons-quickview')) return;

			const productId = getProductId(product);
			if (!productId) return; // Skip if no ID found

			// Create quickview button HTML
			const quickviewBtn = document.createElement('div');
			quickviewBtn.className = `blockons-quickview ${position}`;
			quickviewBtn.innerHTML = `
            <div class="blockons-quickview-btn ${oneclass}" data-id="${productId}">
                ${text}
            </div>
        `;

			// Add button based on position
			if (position === 'three' || position === 'four') {
				const img = product.querySelector(
					'[data-testid="product-image"]',
				);
				if (img) {
					img.parentNode.insertBefore(quickviewBtn, img);
				}
			} else {
				product.appendChild(quickviewBtn);
			}
		};

		// Initial processing of products
		const processProducts = () => {
			const products = allProductsBlock.querySelectorAll(
				'.wc-block-grid__product.wc-block-layout',
			);
			products.forEach(addQuickViewToProduct);
		};

		// Set up observer for dynamic updates
		const observer = new MutationObserver((mutations) => {
			let shouldProcess = false;
			mutations.forEach((mutation) => {
				if (
					mutation.type === 'childList' &&
					mutation.addedNodes.length
				) {
					shouldProcess = true;
				}
			});

			if (shouldProcess) {
				// Small delay to ensure React has finished rendering
				setTimeout(() => {
					processProducts();
					bindQuickViewButtons();
				}, 120);
			}
		});

		// Observe the products container
		const productsContainer = allProductsBlock.querySelector(
			'.wc-block-grid__products',
		);
		if (productsContainer) {
			observer.observe(productsContainer, {
				childList: true,
				subtree: true,
			});
		}

		// Process initial products
		processProducts();

		// Handle pagination changes
		const paginationContainer = allProductsBlock.querySelector(
			'.wc-block-pagination',
		);
		if (paginationContainer) {
			paginationContainer.addEventListener('click', () => {
				// Wait for products to update
				setTimeout(processProducts, 500);
			});
		}
	}
});

const bindQuickViewButtons = () => {
	const quickviewBtns = document.querySelectorAll('.blockons-quickview-btn');

	if (quickviewBtns.length) {
		quickviewBtns.forEach((btn) => {
			// Remove existing listener if any
			btn.removeEventListener('click', handleQuickViewClick);
			// Add new listener
			btn.addEventListener('click', handleQuickViewClick);
		});
	}
};

const handleQuickViewClick = async (e) => {
	e.preventDefault();
	const btn = e.currentTarget;
	const clickedProductId = btn.getAttribute('data-id');
	const parentBlock =
		btn.closest('.wc-block-grid') || btn.closest('.wc-block-all-products');
	const blockProductIds = getProductIdsInBlock(parentBlock);

	// Cancel any existing request and remove loading state
	if (currentAbortController) {
		currentAbortController.abort();
		if (currentLoadingButton) {
			currentLoadingButton.classList.remove('loading');
		}
	}

	// Store reference to current loading button
	currentLoadingButton = btn.parentElement;
	currentLoadingButton.classList.add('loading');

	showQuickViewLoading(
		clickedProductId,
		blockProductIds,
		currentLoadingButton,
	);
};

const LoadingContent = () => (
	<div className="blockons-quickview-loading">
		<div className="blockons-quickview-loader"></div>
	</div>
);

const getProductIdsInBlock = (block) => {
	if (!block) return [];
	const buttonsInBlock = block.querySelectorAll('.blockons-quickview-btn');
	return Array.from(buttonsInBlock).map((btn) => btn.getAttribute('data-id'));
};

const showQuickViewLoading = (productId, blockProductIds, btnParent) => {
	// Cancel any existing request
	if (currentAbortController) {
		currentAbortController.abort();
		currentAbortController = null;
	}

	const currentIndex = blockProductIds.indexOf(productId);
	const prevId =
		currentIndex > 0
			? blockProductIds[currentIndex - 1]
			: blockProductIds[blockProductIds.length - 1];
	const nextId =
		currentIndex < blockProductIds.length - 1
			? blockProductIds[currentIndex + 1]
			: blockProductIds[0];

	const isPopupOpen = Swal.isVisible();

	const baseConfig = {
		html: <LoadingContent />,
		showConfirmButton: blockProductIds.length > 1,
		showDenyButton: blockProductIds.length > 1,
		confirmButtonText: '',
		denyButtonText: '',
	};

	if (!isPopupOpen) {
		MySwal.fire({
			...baseConfig,
			preConfirm: () => {
				showQuickView(nextId, blockProductIds);
				return false;
			},
			preDeny: () => {
				showQuickView(prevId, blockProductIds);
				return false;
			},
		});
	} else {
		MySwal.update({
			html: baseConfig.html,
		});
	}

	showQuickView(productId, blockProductIds, btnParent);
};

const showQuickView = async (productId, blockProductIds, btnParent) => {
	// Cancel any existing request
	if (currentAbortController) {
		currentAbortController.abort();
		if (currentLoadingButton) {
			currentLoadingButton.classList.remove('loading');
		}
	}
	// Update current loading button reference
	currentLoadingButton = btnParent;

	const currentIndex = blockProductIds.indexOf(productId);
	const prevId =
		currentIndex > 0
			? blockProductIds[currentIndex - 1]
			: blockProductIds[blockProductIds.length - 1];
	const nextId =
		currentIndex < blockProductIds.length - 1
			? blockProductIds[currentIndex + 1]
			: blockProductIds[0];

	try {
		const productData = await fetchProductData(productId);

		// Check if the request was aborted
		if (!currentAbortController) {
			return;
		}

		if (productData) {
			MySwal.update({
				html: (
					<QuickViewPopup
						productData={productData}
						onClose={() => MySwal.close()}
						blockonsQuickviewObj={blockonsQuickviewObj}
					/>
				),
			});
		}

		if (currentLoadingButton) {
			currentLoadingButton.classList.remove('loading');
		}

		// Update button handlers
		const confirmButton = Swal.getConfirmButton();
		const denyButton = Swal.getDenyButton();

		if (confirmButton) {
			confirmButton.onclick = async () => {
				showQuickViewLoading(nextId, blockProductIds);
				return false;
			};
		}

		if (denyButton) {
			denyButton.onclick = async () => {
				showQuickViewLoading(prevId, blockProductIds);
				return false;
			};
		}
	} catch (error) {
		// Only show error if it's not an abort error
		if (error.name !== 'AbortError') {
			console.error('Error fetching product data: ', error);

			if (currentLoadingButton) {
				currentLoadingButton.classList.remove('loading');
			}

			MySwal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong!',
			});
		} else {
			// Remove loading state for aborted requests
			if (currentLoadingButton) {
				currentLoadingButton.classList.remove('loading');
			}
		}
	} finally {
		// Clear the abort controller if it matches the current one
		if (currentAbortController && currentAbortController.signal.aborted) {
			currentAbortController = null;
			currentLoadingButton = null;
		}
	}
};

const fetchProductData = async (productId) => {
	try {
		// Create new AbortController for this request
		currentAbortController = new AbortController();

		const formData = new FormData();
		formData.append('action', 'blockons_get_product_data');

		// If productId looks like a slug (contains letters), send it as slug
		if (isNaN(productId)) {
			formData.append('product_slug', productId);
		} else {
			formData.append('product_id', productId);
		}

		const response = await fetch(blockonsQuickviewObj.ajaxurl, {
			method: 'POST',
			body: formData,
			credentials: 'same-origin',
			signal: currentAbortController.signal,
		});

		const text = await response.text();

		let data;
		try {
			data = JSON.parse(text);
		} catch (e) {
			throw new Error('Invalid server response');
		}

		if (!data.success) {
			throw new Error(
				data.data?.message || 'Failed to fetch product data',
			);
		}

		return data.data;
	} catch (error) {
		throw error;
	}
};

export default showQuickView;
