document.addEventListener('DOMContentLoaded', function() {
    const tocElement = document.querySelector('.blockons-toc');
    const tocLinks = document.querySelectorAll('.blockons-toc-link');
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    const dataAnchor = tocElement.getAttribute('data-anchor');

    // Create a map of heading text to their elements
    const headingMap = new Map();
    headings.forEach((heading) => {
        const text = heading.textContent.trim();
        if (!headingMap.has(text)) {
            headingMap.set(text, heading);
        }
    });

    // Add toggle functionality if .blockons-toc has .collapsible class
    if (tocElement.classList.contains('collapsible')) {
        const tocUl = tocElement.querySelector('.blockons-toc-content');
        const tocClick = tocElement.querySelector('.header.toggle');

        if (tocClick ) {
            tocClick.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent event from bubbling up
                tocElement.classList.toggle('open');
                // this.innerHTML = tocElement.classList.contains('open') ? '▲' : '▼';
                
                if (tocElement.classList.contains('open')) {
                    tocUl.style.maxHeight = tocUl.scrollHeight + "px";
                } else {
                    tocUl.style.maxHeight = "0";
                }
            });
        }

        // Initially hide the list
        tocUl.style.maxHeight = "0";
        tocElement.classList.remove('open');
    }

    // Process TOC links and match with headings
    tocLinks.forEach((link) => {
        const linkText = link.textContent.trim();
        const targetAnchor = link.getAttribute('href').substring(1); // Remove the '#'
        const matchingHeading = headingMap.get(linkText);

        if (matchingHeading) {
            matchingHeading.id = targetAnchor;

            // Add anchor and copy icons
            if (dataAnchor) {
                const iconContainer = document.createElement('span');
                iconContainer.className = 'blockons-toc-icons';

                if (dataAnchor) {
                    const anchorIcon = document.createElement('span');
                    anchorIcon.className = 'toc-icon fa-solid fa-link';
                    anchorIcon.addEventListener('click', function(e) {
                        e.preventDefault();
                        const newUrl = window.location.href.split('#')[0] + '#' + targetAnchor;
                        window.history.pushState(null, '', newUrl);
                        navigator.clipboard.writeText(newUrl);
                        matchingHeading.scrollIntoView({ behavior: 'smooth' });
                    });
                    iconContainer.appendChild(anchorIcon);
                }

                matchingHeading.appendChild(iconContainer);
            }
        }

        // Add click event listener for smooth scrolling
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetElement = document.getElementById(targetAnchor);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});