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

  return (
    <div className={`person-node ${data.selected ? 'person-node-selected' : ''}`}>
      <Handle type="target" position={Position.Top} />
      <strong>{label}</strong>
      {meta ? <span>{meta}</span> : null}
      {data.person.ageAtDeath ? <small>{data.person.ageAtDeath} yrs</small> : null}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
