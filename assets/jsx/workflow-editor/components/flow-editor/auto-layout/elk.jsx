import ELK from "elkjs";
import { AUTO_LAYOUT_DIRECTION_RIGHT } from "./constants";

export const useLayoutedElements = ({
    nodes,
    edges,
    onLayout,
    onAnimationFrame = () => null
}) => {
    return ({ direction }) => {
        // Elk has a *huge* amount of options to configure. To see everything you can
        // tweak check out:
        //
        // - https://www.eclipse.org/elk/reference/algorithms.html
        // - https://www.eclipse.org/elk/reference/options.html
        const opts = {
            'elk.direction': direction,
            'elk.algorithm': 'mrtree',
            'elk.spacing.nodeNode': '60',
        };

        const getLayoutedElements = async (nodes, edges, options = {}) => {
            const isHorizontal = options?.['elk.direction'] === AUTO_LAYOUT_DIRECTION_RIGHT;

            const getNodeList = (nodes) => nodes.map((node) => {
                const nodeElement = document.querySelector(`div[data-id="${node.id}"]`);
                const width = nodeElement?.offsetWidth || 127;
                const height = nodeElement?.offsetHeight || 62;
                return {
                    ...node,
                    // Adjust the target and source handle positions based on the layout
                    // direction.
                    targetPosition: isHorizontal ? 'left' : 'top',
                    sourcePosition: isHorizontal ? 'right' : 'bottom',

                    // Hardcode a width and height for elk to use when layouting.
                    width,
                    height,
                };
            });

            const getEdgeList = (edges) => {
                // Sort grouping by source node
                let edgesList = edges.sort((edgeA, edgeB) => edgeA.source.localeCompare(edgeB.source));

                // Sort conditional split edges to avoid crossing the connections
                edgesList = edgesList.sort((edgeA, edgeB) => {
                    if (edgeA.sourceHandle === 'false' && edgeB.sourceHandle === 'true') {
                        return 1;
                    }
                    if (edgeA.sourceHandle === 'true' && edgeB.sourceHandle === 'false') {
                        return -1;
                    }
                    return 0;
                });

                return edgesList;
            };

            const graph = {
                id: 'root',
                layoutOptions: options,
                children: getNodeList(nodes),
                edges: getEdgeList(edges),
            };

            const elk = new ELK();

            try {
                const layoutedGraph = await elk
                    .layout(graph);
                return ({
                    nodes: layoutedGraph.children.map((node_1) => ({
                        ...node_1,
                        // React Flow expects a position property on the node instead of `x`
                        // and `y` fields.
                        position: { x: node_1.x, y: node_1.y },
                    })),

                    edges: layoutedGraph.edges,
                });
            } catch (message) {
                return console.error(message);
            }
        };

        getLayoutedElements(nodes, edges, opts).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
            onLayout(layoutedNodes, layoutedEdges);

            window.requestAnimationFrame(() => onAnimationFrame());
        });
    }
}

export default useLayoutedElements;