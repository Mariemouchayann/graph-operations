class Graphmariem {
    constructor() {
        this.nodes = new Map();
    }

    addNode(node) {
        if (!this.nodes.has(node)) {
            this.nodes.set(node, new Map());
        } else {
            throw new Error('Node already exists in the graph');
        }
    }

    addEdge(nodeA, nodeB, weight) {
        if (this.nodes.has(nodeA) && this.nodes.has(nodeB)) {
            this.nodes.get(nodeA).set(nodeB, weight);
            this.nodes.get(nodeB).set(nodeA, weight); 
        } else {
            throw new Error('Nodes do not exist in the graph');
        }
    }

    shortestPath(startNode, endNode) {
        const distances = new Map();
        const visited = new Set();
        const previousNodes = new Map();
        const queue = [];

        this.nodes.forEach((_, node) => distances.set(node, Infinity));
        distances.set(startNode, 0);
        queue.push({ node: startNode, distance: 0 });

        while (queue.length > 0) {
            queue.sort((a, b) => a.distance - b.distance);
            const { node: currentNode, distance: currentDistance } = queue.shift();

            if (visited.has(currentNode)) continue;
            visited.add(currentNode);

            this.nodes.get(currentNode).forEach((weight, neighbor) => {
                const newDistance = currentDistance + weight;
                if (newDistance < distances.get(neighbor)) {
                    distances.set(neighbor, newDistance);
                    previousNodes.set(neighbor, currentNode);
                    queue.push({ node: neighbor, distance: newDistance });
                }
            });
        }

        const path = [];
        let current = endNode;
        while (current !== undefined) {
            path.unshift(current);
            current = previousNodes.get(current);
        }

        return { path, distance: distances.get(endNode) };
    }

    detectCycle() {
        const visited = new Set();

        const hasCycle = (node, parent) => {
            visited.add(node);

            for (const neighbor of this.nodes.get(node).keys()) {
                if (!visited.has(neighbor)) {
                    if (hasCycle(neighbor, node)) {
                        return true;
                    }
                } else if (neighbor !== parent) {
                    return true;
                }
            }

            return false;
        };

        for (const node of this.nodes.keys()) {
            if (!visited.has(node)) {
                if (hasCycle(node, null)) {
                    return true;
                }
            }
        }

        return false;
    }

    nodeCentrality() {
        const centrality = new Map();

        this.nodes.forEach((_, node) => centrality.set(node, 0));

        this.nodes.forEach((_, startNode) => {
            const distances = new Map();
            const queue = [];

            this.nodes.forEach((_, node) => distances.set(node, Infinity));
            distances.set(startNode, 0);
            queue.push(startNode);

            while (queue.length > 0) {
                const currentNode = queue.shift();

                this.nodes.get(currentNode).forEach((_, neighbor) => {
                    const newDistance = distances.get(currentNode) + 1;
                    if (newDistance < distances.get(neighbor)) {
                        distances.set(neighbor, newDistance);
                        queue.push(neighbor);
                    }
                });
            }

            distances.forEach((distance, node) => {
                if (distance !== Infinity) {
                    centrality.set(node, centrality.get(node) + 1 / distance);
                }
            });
        });

        return centrality;
    }
}

module.exports = Graphmariem;
