class Node {
    readonly name: string | null;
    readonly path: string | null;
    readonly extension: string | null;
    readonly directory: boolean | null;
    readonly parentDir: string | null;
    readonly createdDate: string | null;
    readonly size: string | null;

    constructor({
        name = null,
        path = null,
        extension = null,
        directory = null,
        parentDir = null,
        createdDate = null,
        size = null,
    }) {
        this.name = name;
        this.path = path;
        this.extension = extension;
        this.directory = directory;
        this.parentDir = parentDir;
        this.createdDate = createdDate;
        this.size = size;
    }
}

export default Node;
