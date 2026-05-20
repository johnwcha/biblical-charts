import { useMemo } from 'react';
import ReactFlow, { Background, Controls, type Edge, type Node } from 'reactflow';
import { Search } from 'lucide-react';
import { people, relationships } from '../data/adamToNoah';
import type { Language, Person, Relationship, ViewMode } from '../types';
import { layoutNodes } from '../utils/layout';
import { PersonNode, type PersonNodeData } from './PersonNode';

interface GenealogyViewerProps {
  language: Language;
  selectedPersonId: string;
  viewMode: ViewMode;
  showUncertain: boolean;
  onSelectPerson: (personId: string) => void;
}

const nodeTypes = { person: PersonNode };

const compactPositions: Record<string, { x: number; y: number; sourcePosition?: 'top' | 'right' | 'bottom' | 'left'; targetPosition?: 'top' | 'right' | 'bottom' | 'left' }> = {
  adam: { x: 110, y: 18, sourcePosition: 'bottom', targetPosition: 'left' },
  eve: { x: 370, y: 18, sourcePosition: 'bottom', targetPosition: 'left' },
  cain: { x: 140, y: 164, sourcePosition: 'bottom', targetPosition: 'top' },
  abel: { x: 260, y: 164, sourcePosition: 'bottom', targetPosition: 'top' },
  seth: { x: 380, y: 164, sourcePosition: 'right', targetPosition: 'top' },
  enosh: { x: 575, y: 164, sourcePosition: 'right', targetPosition: 'left' },
  kenan: { x: 740, y: 164, sourcePosition: 'right', targetPosition: 'left' },
  mahalaleel: { x: 910, y: 164, sourcePosition: 'bottom', targetPosition: 'left' },
  jared: { x: 910, y: 284, sourcePosition: 'left', targetPosition: 'top' },
  enoch: { x: 730, y: 284, sourcePosition: 'left', targetPosition: 'right' },
  methuselah: { x: 545, y: 284, sourcePosition: 'left', targetPosition: 'right' },
  lamech: { x: 370, y: 284, sourcePosition: 'left', targetPosition: 'right' },
  noah: { x: 110, y: 284, sourcePosition: 'bottom', targetPosition: 'right' },
};

function relationshipEdge(relationship: Relationship, viewMode: ViewMode): Edge {
  const uncertain = relationship.certainty !== 'explicit';
  const enochTurn = ['jared-enoch', 'enoch-methuselah'].includes(relationship.id);
  const spouse = relationship.type === 'spouse';
  const compact = viewMode === 'compact';
  const sourcePosition = compactPositions[relationship.sourcePersonId];
  const targetPosition = compactPositions[relationship.targetPersonId];
  const sameRow = compact && sourcePosition && targetPosition && sourcePosition.y === targetPosition.y;
  const forward = sameRow && sourcePosition.x < targetPosition.x;

  return {
    id: relationship.id,
    source: relationship.sourcePersonId,
    target: relationship.targetPersonId,
    sourceHandle: compact ? (spouse || sameRow ? (forward ? 'right-source' : 'left-source') : 'bottom-source') : undefined,
    targetHandle: compact ? (spouse || sameRow ? (forward ? 'left-target' : 'right-target') : 'top-target') : undefined,
    type: spouse || sameRow ? 'straight' : 'step',
    animated: uncertain,
    className: [
      uncertain ? 'edge-uncertain' : 'edge-explicit',
      spouse ? 'edge-spouse' : '',
      enochTurn ? 'edge-highlight' : '',
    ]
      .filter(Boolean)
      .join(' '),
    label: uncertain ? relationship.certainty : undefined,
    style: { strokeWidth: spouse ? 3 : 4 },
  };
}

export function GenealogyViewer({
  language,
  selectedPersonId,
  viewMode,
  showUncertain,
  onSelectPerson,
}: GenealogyViewerProps) {
  const visibleRelationships = useMemo(
    () => relationships.filter((relationship) => showUncertain || relationship.certainty === 'explicit'),
    [showUncertain],
  );

  const nodes = useMemo<Node<PersonNodeData>[]>(() => {
    const baseNodes = people.map((person) => ({
      id: person.id,
      type: 'person',
      data: {
        person,
        language,
        selected: person.id === selectedPersonId,
      },
      position: { x: 0, y: 0 },
    }));

    if (viewMode === 'compact') {
      return baseNodes.map((node) => {
        const compactPosition = compactPositions[node.id];

        return {
          ...node,
          position: { x: compactPosition.x, y: compactPosition.y },
          sourcePosition: compactPosition.sourcePosition,
          targetPosition: compactPosition.targetPosition,
        };
      }) as Node<PersonNodeData>[];
    }

    return layoutNodes(baseNodes, visibleRelationships.map((relationship) => relationshipEdge(relationship, viewMode)), 'LR') as Node<PersonNodeData>[];
  }, [language, selectedPersonId, viewMode, visibleRelationships]);

  const edges = useMemo(() => {
    const familyTreeRelationships =
      viewMode === 'compact'
        ? visibleRelationships.filter((relationship) => !['eve-cain-maternal', 'eve-abel-maternal', 'eve-seth-maternal'].includes(relationship.id))
        : visibleRelationships;

    return [
      ...familyTreeRelationships.map((relationship) => relationshipEdge(relationship, viewMode)),
    ];
  }, [viewMode, visibleRelationships]);

  const selectedPerson = people.find((person) => person.id === selectedPersonId) ?? people[0];

  return (
    <section className="viewer">
      <div className="viewer-toolbar">
        <label className="search-box">
          <Search size={16} />
          <select value={selectedPerson.id} onChange={(event) => onSelectPerson(event.target.value)}>
            {people.map((person: Person) => (
              <option value={person.id} key={person.id}>
                {person.displayName[language]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flow-wrap">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.08 }}
          onNodeClick={(_, node) => onSelectPerson(node.id)}
          minZoom={0.35}
          maxZoom={1.8}
        >
          <Background color="#d8d0b9" gap={34} lineWidth={0.6} />
          <Controls />
        </ReactFlow>
      </div>
    </section>
  );
}
