/**
 * Convert string to lowercase but set first letter uppercase
 * @param {string} str
 * @returns {string} formatted string
 */
export function onlyFirstCapital(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
