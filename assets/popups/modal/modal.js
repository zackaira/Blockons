import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import 'animate.css';
import './modal.css';

// Initialize SweetAlert2 with React content support
const MySwal = withReactContent(Swal);

/**
 * Initialize Advanced Button Modal functionality
 */
export const initAdvancedButtonModal = () => {
	// Find all advanced button modal triggers (now on the wrapper element)
	const modalTriggers = document.querySelectorAll('.blockons-modal-trigger');

	modalTriggers.forEach((trigger) => {
		// Remove any existing event listeners to prevent duplicates
		const newTrigger = trigger.cloneNode(true);
		trigger.parentNode.replaceChild(newTrigger, trigger);

		newTrigger.addEventListener('click', function (e) {
			e.preventDefault();

			// The data-modal-id is now on the inner button/div element
			const innerButton = this.querySelector('.blockons-adv-btn');
			const modalId = innerButton
				? innerButton.getAttribute('data-modal-id')
				: null;
			const modalElement = modalId
				? document.getElementById(modalId)
				: null;

			if (modalElement) {
				// Get the modal content (excluding overlay and wrapper elements)
				const modalInner = modalElement.querySelector(
					'.blockons-modal-inner',
				);
				const modalContent = modalInner
					? modalInner.innerHTML
					: modalElement.innerHTML;

				// Get the width of the modal inner element
				const modalWidth = modalInner
					? window.getComputedStyle(modalInner).maxWidth
					: 'auto';

				// Show SweetAlert modal with the content
				MySwal.fire({
					html: modalContent,
					showCloseButton: true,
					showConfirmButton: false,
					showDenyButton: false,
					width: modalWidth !== 'none' ? modalWidth : 'auto',
					position: 'center',
					customClass: {
						container:
							'blockons-popup-container blockons-modal-popup',
						popup: 'blockons-popup-swal blockons-modal-swal',
					},
					showClass: {
						popup: 'animate__animated animate__zoomIn animate__faster',
					},
					hideClass: {
						popup: 'animate__animated animate__zoomOut animate__faster',
					},
					// Remove default padding to let the content control its own spacing
					padding: 0,
					// Allow HTML content
					// allowHtml: true,
					// Allow backdrop click to close
					allowOutsideClick: true,
					// Enable backdrop
					backdrop: true,
					// Custom styling and callbacks
					didOpen: () => {
						// Add custom class to body when modal is open
						document.body.classList.add('blockons-modal-open');

						// Custom styling for the modal
						const popup = Swal.getPopup();
						if (popup) {
							popup.style.maxWidth = '90vw';
							popup.style.maxHeight = '90vh';
							popup.style.borderRadius = '8px';

							const htmlContainer = popup.querySelector(
								'.swal2-html-container',
							);
							if (htmlContainer) {
								htmlContainer.style.padding = '20px';
								htmlContainer.style.overflowY = 'auto';
								htmlContainer.style.maxHeight = '80vh';
							}

							// Trigger DOMContentLoaded event on modal content
							// This will cause most JavaScript that listens for DOM ready to reinitialize
							setTimeout(() => {
								const event = new Event('DOMContentLoaded', {
									bubbles: true,
									cancelable: false,
								});
								htmlContainer.dispatchEvent(event);

								// Also trigger a custom event for additional compatibility
								const customEvent = new CustomEvent(
									'blockons:modalReady',
									{
										bubbles: true,
										detail: { container: htmlContainer },
									},
								);
								htmlContainer.dispatchEvent(customEvent);
							}, 100); // Small delay to ensure modal is fully rendered
						}
					},
					didClose: () => {
						// Remove custom class when modal is closed
						document.body.classList.remove('blockons-modal-open');
					},
				});
			} else {
				if (!modalId) {
					console.warn('Modal ID not found on button element');
				} else {
					console.warn('Modal element not found for ID:', modalId);
				}
			}
		});
	});
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initAdvancedButtonModal);

// Re-initialize after dynamic content changes (for compatibility with other plugins)
if (typeof window.blockonsInitAdvancedButtonModal === 'undefined') {
	window.blockonsInitAdvancedButtonModal = initAdvancedButtonModal;
}

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initAdvancedButtonModal);
} else {
	initAdvancedButtonModal();
}
