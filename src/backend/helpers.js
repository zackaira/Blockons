/*
 * Convert Text to slug
 */
export const blockonsConvertToSlug = (text) => {
	return text
		.toLowerCase()
		.replace(/[^\w ]+/g, "")
		.replace(/ +/g, "_");
};
