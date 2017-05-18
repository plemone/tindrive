'use strict';

// encapsulates the properties of a file
// blue print for a file info object
class FileInfo {
	constructor(n, lM, s, t, p) {
		this.filename = n;
		this.lastModified = lM;
		this.size = s;
		this.type = t;
		this.path = p;
	}
}

module.exports = FileInfo;