// datauri is used to convert files (usually uploaded files like images) into Data URLs (Base64 format).
// Import DataUriParser to convert file buffer into Base64 Data URI format
const DataUriParser = require("datauri/parser.js");

// Node path module helps extract file extensions
const path = require("path");

// Create a new parser instance
const parser = new DataUriParser();

/**
 * Converts an uploaded file into a Data URI (Base64 encoded format)
 * @param {Object} file - Multer file object containing originalname and buffer
 * @returns {String} Base64 Data URI string (like data:image/png;base64,...)
 */
const getDataUri = (file) => {
    // Extract the file extension from the uploaded file name (e.g. .png, .jpg)
    const extName = path.extname(file.originalname).toString();

    // Convert the file buffer to Base64 encoded data URI
    // parser.format() returns an object with { content, ... }
    return parser.format(extName, file.buffer).content;
};

// Export function so it can be reused in routes/controllers
module.exports = {
    getDataUri
};
