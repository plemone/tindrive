'use strict'; // to allow ES6 syntax

var FSContentInfo = require("./FSContentInfo.js");

// encapsulates the properties of a file
// blue print for a file info object
class FileInfo extends FSContentInfo {
	constructor(n, lM, s, t, p, tr) {
		super(n, p, tr); // base class initializer syntax
		this.lastModified = lM;
		this.size = s;
		this.type = t;
	}
}

module.exports = FileInfo;