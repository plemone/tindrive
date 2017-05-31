'use strict' // to allow ES6 syntax


class FSContentInfo {
	constructor(n, p, tr) {
		if (this.constructor === FSContentInfo) { // makes the class un constructable as it is an abstract class
			throw Error("Abstract class cannot be constructed...");
		}
		this.name = n;
		this.path = p;
		if (!tr) {
			this.trashed = false;
		} else {
			this.trashed = tr; // indicates whether the file is in the trash folder or not
		}
	}
}


module.exports = FSContentInfo;