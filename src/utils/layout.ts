import dagre from '@dagrejs/dagre';
import type { Edge, Node } from 'reactflow';

const defaultNodeWidth = 128;
const defaultNodeHeight = 54;
const featuredNodeWidth = 220;
const featuredNodeHeight = 82;

function nodeSize(node: Node) {
  const personId = typeof node.data?.person?.id === 'string' ? node.data.person.id : '';
  const featured = ['adam', 'eve', 'noah'].includes(personId);

  return {
    width: featured ? featuredNodeWidth : defaultNodeWidth,
    height: featured ? featuredNodeHeight : defaultNodeHeight,
  };
}

export function layoutNodes(nodes: Node[], edges: Edge[], direction: 'TB' | 'LR' = 'TB') {
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({
    rankdir: direction,
    nodesep: direction === 'LR' ? 42 : 28,
    ranksep: direction === 'LR' ? 58 : 76,
  });

  nodes.forEach((node) => graph.setNode(node.id, nodeSize(node)));
  edges.forEach((edge) => graph.setEdge(edge.source, edge.target));

  dagre.layout(graph);

  return nodes.map((node) => {
    const position = graph.node(node.id);
    const size = nodeSize(node);

    return {
      ...node,
      position: {
        x: position.x - size.width / 2,
        y: position.y - size.height / 2,
      },
      sourcePosition: direction === 'LR' ? 'right' : 'bottom',
      targetPosition: direction === 'LR' ? 'left' : 'top',
    } as Node;
  });
}
