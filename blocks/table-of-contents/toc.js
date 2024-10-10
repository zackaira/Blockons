document.addEventListener('DOMContentLoaded', function() {
    console.log('TOC script loaded!');

    const tocLinks = document.querySelectorAll('.blockons-toc-link');
    console.log('Number of TOC links found:', tocLinks.length);

    // Create an array of heading data from TOC links
    const tocHeadings = Array.from(tocLinks).map((link, index) => ({
        text: link.textContent.trim(),
        anchor: link.getAttribute('data-target'),
        index: index
    }));

    console.log('TOC Headings:', tocHeadings);

    // Find and label the correct headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let headingIndex = 0;

    headings.forEach((heading) => {
        const headingText = heading.textContent.trim();
        const matchingTocHeading = tocHeadings.find(h => h.text === headingText && h.index === headingIndex);

        if (matchingTocHeading) {
            heading.setAttribute('data-toc-anchor', matchingTocHeading.anchor);
            console.log('Labeled heading:', headingText, 'with anchor:', matchingTocHeading.anchor);
            headingIndex++;
        }
    });

    tocLinks.forEach((link) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Link clicked:', this.textContent);
            
            const targetAnchor = this.getAttribute('data-target');
            console.log('Target anchor:', targetAnchor);
            
            const targetElement = document.querySelector(`[data-toc-anchor="${targetAnchor}"]`);
            console.log('Target element found:', targetElement);
            
            if (targetElement) {
                console.log('Scrolling to:', targetElement.textContent);
                targetElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                console.log('Target element not found');
            }
        });
    });

    // Log all elements with data-toc-anchor attribute
    const allAnchors = document.querySelectorAll('[data-toc-anchor]');
    console.log('Number of elements with data-toc-anchor:', allAnchors.length);
    allAnchors.forEach((el, index) => {
        console.log(`Anchor ${index}:`, el.textContent, 'data-toc-anchor:', el.getAttribute('data-toc-anchor'));
    });
});