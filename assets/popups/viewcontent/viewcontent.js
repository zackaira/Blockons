/**
 * Initialize Advanced Button ViewContent functionality
 */
export const initAdvancedButtonViewContent = () => {
	// Find all advanced button viewcontent triggers
	const viewContentTriggers = document.querySelectorAll(
		'.blockons-viewcontent-trigger',
	);

	viewContentTriggers.forEach((trigger) => {
		// Remove any existing event listeners to prevent duplicates
		const newTrigger = trigger.cloneNode(true);
		trigger.parentNode.replaceChild(newTrigger, trigger);

		newTrigger.addEventListener('click', function (e) {
			e.preventDefault();

			// The data-viewcontent-id is on the inner button/div element
			const innerButton = this.querySelector('.blockons-adv-btn');
			const viewContentId = innerButton
				? innerButton.getAttribute('data-viewcontent-id')
				: null;
			const viewContentElement = viewContentId
				? document.getElementById(viewContentId)
				: null;

			if (viewContentElement) {
				// Toggle the visibility of the content with accordion animation
				const isHidden = viewContentElement.classList.contains(
					'blockons-viewcontent-hidden',
				);

				if (isHidden) {
					// Show content with accordion animation
					viewContentElement.classList.remove(
						'blockons-viewcontent-hidden',
					);
					viewContentElement.classList.add(
						'blockons-viewcontent-show',
					);

					// Get the content inner element
					const contentInner = viewContentElement.querySelector(
						'.blockons-viewcontent-inner',
					);

					if (contentInner) {
						// Set initial height to 0 and then animate to full height
						const fullHeight = contentInner.scrollHeight;
						viewContentElement.style.height = '0px';
						viewContentElement.style.overflow = 'hidden';

						// Force reflow
						viewContentElement.offsetHeight;

						// Animate to full height
						viewContentElement.style.transition =
							'height 0.3s ease-out';
						viewContentElement.style.height = fullHeight + 'px';

						// Clean up after animation
						setTimeout(() => {
							viewContentElement.style.height = 'auto';
							viewContentElement.style.overflow = 'visible';
							viewContentElement.style.transition = '';
						}, 300);
					}

					// Scroll to content smoothly after a short delay
					setTimeout(() => {
						viewContentElement.scrollIntoView({
							behavior: 'smooth',
							block: 'start',
						});
					}, 150);
				} else {
					// Hide content with accordion animation
					const contentInner = viewContentElement.querySelector(
						'.blockons-viewcontent-inner',
					);

					if (contentInner) {
						// Set current height and animate to 0
						const currentHeight = viewContentElement.scrollHeight;
						viewContentElement.style.height = currentHeight + 'px';
						viewContentElement.style.overflow = 'hidden';
						viewContentElement.style.transition =
							'height 0.3s ease-in';

						// Force reflow
						viewContentElement.offsetHeight;

						// Animate to 0 height
						viewContentElement.style.height = '0px';

						// Clean up after animation
						setTimeout(() => {
							viewContentElement.classList.add(
								'blockons-viewcontent-hidden',
							);
							viewContentElement.classList.remove(
								'blockons-viewcontent-show',
							);
							viewContentElement.style.height = '';
							viewContentElement.style.overflow = '';
							viewContentElement.style.transition = '';
						}, 300);
					} else {
						// Fallback if no inner element
						viewContentElement.classList.add(
							'blockons-viewcontent-hidden',
						);
						viewContentElement.classList.remove(
							'blockons-viewcontent-show',
						);
					}
				}

				// Trigger custom event for other scripts to hook into
				const customEvent = new CustomEvent(
					'blockons:viewContentToggle',
					{
						bubbles: true,
						detail: {
							element: viewContentElement,
							isVisible: isHidden,
							trigger: newTrigger,
						},
					},
				);
				document.dispatchEvent(customEvent);
			} else {
				if (!viewContentId) {
					console.warn('ViewContent ID not found on button element');
				} else {
					console.warn(
						'ViewContent element not found for ID:',
						viewContentId,
					);
				}
			}
		});
	});
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initAdvancedButtonViewContent);

// Re-initialize after dynamic content changes (for compatibility with other plugins)
if (typeof window.blockonsInitAdvancedButtonViewContent === 'undefined') {
	window.blockonsInitAdvancedButtonViewContent =
		initAdvancedButtonViewContent;
}

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
	document.addEventListener(
		'DOMContentLoaded',
		initAdvancedButtonViewContent,
	);
} else {
	initAdvancedButtonViewContent();
}
