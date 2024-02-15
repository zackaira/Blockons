document.addEventListener("DOMContentLoaded", function () {
	// Function to normalize text content for comparison
	function normalizeText(text) {
		return text.trim().toLowerCase();
	}

	// Function to create a unique ID for a heading based on its text
	function createHeadingId(heading) {
		return heading.textContent.trim().toLowerCase().replace(/\s+/g, "-");
	}

	// Find all .blockons-toc-link elements and process each
	document.querySelectorAll(".blockons-toc-link").forEach((tocLink, index) => {
		const tocLinkText = normalizeText(tocLink.textContent);
		let matchedHeading = null;

		// Search for a matching heading
		document.querySelectorAll(".wp-block-heading").forEach((heading) => {
			if (normalizeText(heading.textContent) === tocLinkText) {
				matchedHeading = heading;
			}
		});

		// If a matching heading is found, assign an ID and update the TOC link
		if (matchedHeading) {
			const id = createHeadingId(matchedHeading) + "-" + index;
			matchedHeading.id = id;
			tocLink.href = "#" + id;
		}
	});

	// Function to handle the click event on each table of contents link
	function scrollToHeading(event) {
		event.preventDefault(); // Prevent the default anchor link behavior

		// Extract the target heading ID from the clicked link's href attribute
		const targetId = event.currentTarget.getAttribute("href").substring(1);

		// Find the heading element with the corresponding ID
		const targetElement = document.getElementById(targetId);

		if (targetElement) {
			// Calculate position to scroll to, with an offset (e.g., 50 pixels)
			const offset = 50; // Adjust this value as needed
			const elementPosition =
				targetElement.getBoundingClientRect().top + window.pageYOffset;
			const offsetPosition = elementPosition - offset;

			// Scroll to the target position smoothly
			window.scrollTo({
				top: offsetPosition,
				behavior: "smooth",
			});
		}
	}

	// Add event listeners to all .blockons-toc-link elements
	document.querySelectorAll(".blockons-toc-link").forEach((link) => {
		link.addEventListener("click", scrollToHeading);
	});
});
