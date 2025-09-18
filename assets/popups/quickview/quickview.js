// Main QuickView initialization file
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import QuickViewPopup from './QuickViewPopup';
import 'animate.css';
import './quickview.css';

// Keep track of current request
let currentAbortController = null;
let currentLoadingButton = null;

// Create a single instance with default configuration
const MySwal = withReactContent(
	Swal.mixin({
		showCloseButton: true,
		width: 'auto',
		position: 'center',
		confirmButtonText: '',
		denyButtonText: '',
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

	// Handle dynamically loaded content
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (
				mutation.type === 'childList' &&
				mutation.addedNodes.length > 0
			) {
				// Check if any new nodes contain quickview triggers
				const hasQuickViewTriggers = Array.from(
					mutation.addedNodes,
				).some((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						return (
							node.querySelector &&
							(node.querySelector(
								'.blockons-quickview-trigger',
							) ||
								node.classList?.contains(
									'blockons-quickview-trigger',
								))
						);
					}
					return false;
				});

				if (hasQuickViewTriggers) {
					bindQuickViewButtons();
				}
			}
		});
	});

	// Observe the entire document for dynamic content
	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});
});

const bindQuickViewButtons = () => {
	// Find all quickview trigger buttons
	const quickviewBtns = document.querySelectorAll(
		'.blockons-quickview-trigger',
	);

	if (quickviewBtns.length) {
		quickviewBtns.forEach((btn) => {
			// Remove existing listener if any to prevent duplicates
			btn.removeEventListener('click', handleQuickViewClick);
			// Add new listener
			btn.addEventListener('click', handleQuickViewClick);
		});
	}
};

const handleQuickViewClick = async (e) => {
	e.preventDefault();
	const btn = e.currentTarget;
	const productId = btn.getAttribute('data-product-id');

	if (!productId) {
		console.error('No product ID found on quickview trigger button');
		return;
	}

	// Cancel any existing request and remove loading state
	if (currentAbortController) {
		currentAbortController.abort();
		if (currentLoadingButton) {
			currentLoadingButton.classList.remove('loading');
		}
	}

	// Store reference to current loading button
	currentLoadingButton = btn;
	currentLoadingButton.classList.add('loading');

	// Find all product IDs in the same container for navigation
	const container =
		btn.closest('.wp-block-woocommerce-product-collection') ||
		btn.closest('.wp-block-woocommerce-product-template') ||
		btn.closest('.wc-block-grid') ||
		btn.closest('.wc-block-all-products');

	// If not in a product collection container, only get this single product
	const allProductIds = container
		? getProductIdsInContainer(container)
		: [productId];

	showQuickViewModal(productId, allProductIds);
};

const getProductIdsInContainer = (container) => {
	const triggers = container.querySelectorAll(
		'.blockons-quickview-trigger[data-product-id]',
	);
	return Array.from(triggers)
		.map((trigger) => trigger.getAttribute('data-product-id'))
		.filter((id) => id);
};

const showQuickViewModal = async (productId, allProductIds = []) => {
	const currentIndex = allProductIds.indexOf(productId);
	const hasPrevNext = allProductIds.length > 1;

	const prevId =
		currentIndex > 0
			? allProductIds[currentIndex - 1]
			: allProductIds[allProductIds.length - 1];
	const nextId =
		currentIndex < allProductIds.length - 1
			? allProductIds[currentIndex + 1]
			: allProductIds[0];

	// Don't show loading modal - button will show loading state instead
	const isModalOpen = Swal.isVisible();

	try {
		const productData = await fetchProductData(productId);

		// Check if the request was aborted
		if (!currentAbortController) {
			return;
		}

		if (productData) {
			// Add 1 second delay before showing the popup
			await new Promise((resolve) => setTimeout(resolve, 200));

			// Check again if the request was aborted during the delay
			if (!currentAbortController) {
				return;
			}

			const modalConfig = {
				html: (
					<QuickViewPopup
						productData={productData}
						onClose={() => MySwal.close()}
						blockonsQuickviewObj={
							window.blockonsQuickviewObj || {
								wc_ajax_url:
									'/wp-admin/admin-ajax.php?action=%%endpoint%%',
								ajaxurl: '/wp-admin/admin-ajax.php',
							}
						}
					/>
				),
				showConfirmButton: hasPrevNext,
				showDenyButton: hasPrevNext,
				showCloseButton: true,
			};

			if (!isModalOpen) {
				MySwal.fire(modalConfig);
			} else {
				MySwal.update(modalConfig);
			}

			// Remove loading class from modal after content is updated
			const modal = Swal.getPopup();
			if (modal) {
				modal.classList.remove('loading');
			}

			// Update navigation buttons
			if (hasPrevNext) {
				const confirmButton = Swal.getConfirmButton();
				const denyButton = Swal.getDenyButton();

				if (confirmButton) {
					confirmButton.onclick = () => {
						// Add loading class to modal
						const modal = Swal.getPopup();
						if (modal) {
							modal.classList.add('loading');
						}
						showQuickViewModal(nextId, allProductIds);
						return false;
					};
				}

				if (denyButton) {
					denyButton.onclick = () => {
						// Add loading class to modal
						const modal = Swal.getPopup();
						if (modal) {
							modal.classList.add('loading');
						}
						showQuickViewModal(prevId, allProductIds);
						return false;
					};
				}
			}
		}

		// Remove loading state
		if (currentLoadingButton) {
			currentLoadingButton.classList.remove('loading');
		}
	} catch (error) {
		// Only show error if it's not an abort error
		if (error.name !== 'AbortError') {
			console.error('Error fetching product data:', error);

			if (currentLoadingButton) {
				currentLoadingButton.classList.remove('loading');
			}

			MySwal.fire({
				icon: 'error',
				title: 'Oops...',
				text: 'Something went wrong loading the product!',
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

		// Use the REST API route you specified
		const response = await fetch(
			`${window.location.origin}/wp-json/blcns/v1/product-data/${productId}`,
			{
				method: 'GET',
				credentials: 'same-origin',
				signal: currentAbortController.signal,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const productData = await response.json();

		if (!productData) {
			throw new Error('No product data received');
		}

		return productData;
	} catch (error) {
		throw error;
	}
};

export default showQuickViewModal;
