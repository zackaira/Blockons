// Main QuickView initialization file
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import QuickViewPopup from './QuickViewPopup';
import 'animate.css';
import './quickview.css';

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
	}),
);

document.addEventListener('DOMContentLoaded', () => {
	const quickviewBtns = document.querySelectorAll('.blockons-quickview-btn');

	if (quickviewBtns.length) {
		quickviewBtns.forEach((btn) => {
			btn.addEventListener('click', async (e) => {
				e.preventDefault();
				const clickedProductId = btn.getAttribute('data-id');
				const parentBlock = btn.closest('.wc-block-grid');
				const blockProductIds = getProductIdsInBlock(parentBlock);

				// Show loading state immediately
				btn.parentElement.classList.add('loading');

				showQuickViewLoading(
					clickedProductId,
					blockProductIds,
					btn.parentElement,
				);
			});
		});
	}
});

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

		if (btnParent) btnParent.classList.remove('loading');

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
		console.error('Error fetching product data: ', error);

		if (btnParent) btnParent.classList.remove('loading');

		MySwal.fire({
			icon: 'error',
			title: 'Oops...',
			text: 'Something went wrong!',
		});
	}
};

// Updated to use admin-ajax.php instead of REST API
const fetchProductData = async (productId) => {
	try {
		const formData = new FormData();
		formData.append('action', 'blockons_get_product_data');
		formData.append('product_id', productId);

		const response = await fetch(blockonsQuickviewObj.ajaxurl, {
			method: 'POST',
			body: formData,
			credentials: 'same-origin',
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
