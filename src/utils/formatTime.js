/* * @file formatDate.js
 * @description Utility function to format reading time in HH:MM:SS format.
 * @version 1.0.0
 * @license MIT
 */
/**
 * Formats a given reading time in seconds into a string in the format HH:MM:SS.
 *
 * @param {number} readingTime - The reading time in seconds.
 * @returns {string} - The formatted time string in HH:MM:SS format.
 */
const formatTime = (readingTime) => {
    const hours = Math.floor(readingTime / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((readingTime % 3600) / 60).toString().padStart(2, "0");
    const seconds = Math.floor(readingTime % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

module.exports = formatTime;