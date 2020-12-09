import { FileSystem, Node } from '../lib';

function getNodes(): Node[] {
    const fs: FileSystem = new FileSystem();
    const nodes: Node[] = fs.ls();
    const directoriesToVisit: Node[] = nodes.filter((node) => node.directory);

    while (directoriesToVisit.length !== 0) {
        const node: Node = directoriesToVisit.pop();
        fs.cd(node.path);
        const newNodes: Node[] = fs.ls();
        for (const node of newNodes) {
            nodes.push(node);
            if (node.directory) {
                directoriesToVisit.push(node);
            }
        }
    }
    return nodes;
}

((): void => {
    const nodes: Node[] = getNodes();
    console.log(nodes);
})();
