import { Handle, Position, type NodeProps } from 'reactflow';
import type { Certainty, Language, Person } from '../types';

export interface PersonNodeData {
  person: Person;
  language: Language;
  selected: boolean;
  certainty?: Certainty;
}

export function PersonNode({ data }: NodeProps<PersonNodeData>) {
  const label = data.person.displayName[data.language];
  const meta = data.person.labels[0]?.[data.language];
  const featured = ['adam', 'eve', 'noah'].includes(data.person.id);
  const compactLine = !featured && ['cain', 'abel', 'seth'].includes(data.person.id);
  const nodeClass = [
    'person-node',
    featured ? 'person-node-featured' : 'person-node-lineage',
    compactLine ? 'person-node-compact-line' : '',
    data.person.gender === 'female' ? 'person-node-female' : '',
    data.selected ? 'person-node-selected' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={nodeClass}>
      <Handle type="target" position={Position.Top} />
      {featured ? <span className={`portrait portrait-${data.person.id}`} aria-hidden="true" /> : null}
      <span className="node-label">
        <strong>{label}</strong>
        {featured && meta ? <span>{meta}</span> : null}
      </span>
      {!featured && data.person.ageAtDeath ? <small>{data.person.ageAtDeath}</small> : null}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
