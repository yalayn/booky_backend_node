/**
 * Normalizes a string by:
 * 1. Converting it to lowercase.
 * 2. Removing diacritics (accents).
 * 3. Replacing multiple spaces with a single space.
 * 4. Trimming leading and trailing spaces.
 *
 * @param {string} str - The string to normalize.
 * @returns {string} - The normalized string.
 */
const normalizeText = (str) => {
    if (typeof str !== 'string') {
        return ''; // Return an empty string if input is not a string
    }
    return str
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, ' ')
        .trim();
}

module.exports = normalizeText;
