import { useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, type Edge, type Node } from 'reactflow';
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

function relationshipEdge(relationship: Relationship): Edge {
  const uncertain = relationship.certainty !== 'explicit';

  return {
    id: relationship.id,
    source: relationship.sourcePersonId,
    target: relationship.targetPersonId,
    type: relationship.type === 'spouse' ? 'straight' : 'smoothstep',
    animated: uncertain,
    className: uncertain ? 'edge-uncertain' : 'edge-explicit',
    label: uncertain ? relationship.certainty : undefined,
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

    return layoutNodes(baseNodes, visibleRelationships.map(relationshipEdge), viewMode === 'timeline' ? 'LR' : 'TB') as Node<PersonNodeData>[];
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
          fitViewOptions={{ padding: 0.2 }}
          onNodeClick={(_, node) => onSelectPerson(node.id)}
          minZoom={0.25}
          maxZoom={1.8}
        >
          <Background color="#d5c8a7" gap={28} />
          <MiniMap pannable zoomable className="mini-map" />
          <Controls />
        </ReactFlow>
      </div>
    </section>
  );
}
