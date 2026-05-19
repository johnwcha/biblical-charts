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
  enosh: { x: 520, y: 164, sourcePosition: 'right', targetPosition: 'left' },
  kenan: { x: 670, y: 164, sourcePosition: 'right', targetPosition: 'left' },
  mahalaleel: { x: 830, y: 164, sourcePosition: 'right', targetPosition: 'left' },
  jared: { x: 958, y: 264, sourcePosition: 'bottom', targetPosition: 'top' },
  enoch: { x: 795, y: 340, sourcePosition: 'left', targetPosition: 'right' },
  methuselah: { x: 610, y: 340, sourcePosition: 'left', targetPosition: 'right' },
  lamech: { x: 442, y: 340, sourcePosition: 'left', targetPosition: 'right' },
  noah: { x: 198, y: 320, sourcePosition: 'bottom', targetPosition: 'right' },
};

function relationshipEdge(relationship: Relationship): Edge {
  const uncertain = relationship.certainty !== 'explicit';
  const enochTurn = ['jared-enoch', 'enoch-methuselah'].includes(relationship.id);

  return {
    id: relationship.id,
    source: relationship.sourcePersonId,
    target: relationship.targetPersonId,
    type: relationship.type === 'spouse' ? 'straight' : 'step',
    animated: uncertain,
    className: [uncertain ? 'edge-uncertain' : 'edge-explicit', enochTurn ? 'edge-highlight' : ''].filter(Boolean).join(' '),
    label: uncertain ? relationship.certainty : undefined,
    style: { strokeWidth: relationship.type === 'spouse' ? 2.5 : 4 },
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

    return layoutNodes(baseNodes, visibleRelationships.map(relationshipEdge), 'LR') as Node<PersonNodeData>[];
  }, [language, selectedPersonId, viewMode, visibleRelationships]);

  const edges = useMemo(() => visibleRelationships.map(relationshipEdge), [visibleRelationships]);

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
