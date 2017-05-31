'use strict';

// encapsulates the properties of a file
// blue print for a file info object
class FileInfo {
	constructor(n, lM, s, t, p, tr) {
		this.name = n;
		this.lastModified = lM;
		this.size = s;
		this.type = t;
		this.path = p;
		if (!tr) {
			this.trashed = false;
		} else {
			this.trashed = tr; // indicates whether the file is in the trash folder or not
		}
	}
}

module.exports = FileInfo;