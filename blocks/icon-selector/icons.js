import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

// Add icons to library only once
library.add(fas, far, fab);

/**
 * Check if a term appears as a distinct word in the icon name
 */
const hasExactTerm = (iconName, term) => {
	// Split the icon name into parts by hyphens
	const parts = iconName.split('-');
	// Check if any part matches the term exactly
	return parts.some((part) => part === term);
};

// Icon categories with their search terms
export const ICON_CATEGORIES = {
	brands: {
		label: 'Brands',
		filter: (icon) => icon.prefix === 'fab',
	},
	arrows: {
		label: 'Arrows',
		filter: (icon) =>
			[
				'arrow',
				'caret',
				'chevron',
				'angle',
				'up',
				'down',
				'left',
				'right',
			].some((term) => hasExactTerm(icon.name, term)),
	},
	editor: {
		label: 'Editor',
		filter: (icon) =>
			[
				'mobile',
				'laptop',
				'tablet',
				'link',
				'database',
				'server',
				'power',
				'head',
				'pen',
				'file',
				'folder',
				'calendar',
				'copy',
				'chart',
				'code',
				'comment',
				'wifi',
				'user',
				'poll',
				'figma', // Added Figma-related terms
				'square-figma',
			].some((term) => hasExactTerm(icon.name, term)),
	},
	design: {
		// Added new design category
		label: 'Design',
		filter: (icon) =>
			[
				'figma',
				'sketch',
				'adobe',
				'palette',
				'brush',
				'pen',
				'pencil',
				'crop',
				'layer',
				'vector',
				'square-figma',
			].some((term) => hasExactTerm(icon.name, term)),
	},
};

// Icon grouping patterns for sorting
const ICON_GROUPS = [
	{ prefix: 'caret', weight: 1 },
	{ prefix: 'chevron', weight: 2 },
	{ prefix: 'arrow', weight: 3 },
	{ prefix: 'angle', weight: 4 },
	{ prefix: 'circle', weight: 5 },
	{ prefix: 'square', weight: 6 },
	{ prefix: 'file', weight: 20 },
	{ prefix: 'folder', weight: 21 },
	{ prefix: 'user', weight: 30 },
	{ prefix: 'users', weight: 31 },
	{ prefix: 'figma', weight: 40 }, // Added Figma group
];

/**
 * Get the sorting weight for an icon name
 */
const getIconWeight = (iconName) => {
	// Find the first matching group
	const group = ICON_GROUPS.find((g) => iconName.startsWith(g.prefix));
	if (group) {
		// Return base weight for the group plus position within group
		return group.weight * 1000 + iconName.length;
	}
	// Default weight for unmatched icons
	return 100000;
};

/**
 * Sort icons by group and name
 */
export const sortIcons = (icons) => {
	return [...icons].sort((a, b) => {
		const weightA = getIconWeight(a.name);
		const weightB = getIconWeight(b.name);

		if (weightA === weightB) {
			// If same weight, sort alphabetically
			return a.name.localeCompare(b.name);
		}
		return weightA - weightB;
	});
};

// Cache for icon list
let iconListCache = null;

/**
 * Get all available icons from Font Awesome with caching
 */
export const getIconList = () => {
	// Return cached list if available
	if (iconListCache) {
		return iconListCache;
	}

	// Helper to process each icon set
	const processIconSet = (iconSet) => {
		return Object.values(iconSet)
			.filter(
				(def) =>
					// Only process actual icon definitions
					def &&
					def.prefix &&
					def.iconName &&
					Array.isArray(def.icon),
			)
			.map((def) => ({
				name: def.iconName,
				prefix: def.prefix,
			}));
	};

	// Process each icon set
	const solidIcons = processIconSet(fas);
	const regularIcons = processIconSet(far);
	const brandIcons = processIconSet(fab);

	// Combine all icons and remove duplicates using a Set
	const seen = new Set();
	const allIcons = [...solidIcons, ...regularIcons, ...brandIcons].filter(
		(icon) => {
			const key = `${icon.prefix}-${icon.name}`;
			if (seen.has(key)) {
				return false;
			}
			seen.add(key);
			return true;
		},
	);

	// Sort icons before caching
	iconListCache = sortIcons(allIcons);
	return iconListCache;
};
