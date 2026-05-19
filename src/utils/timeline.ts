import type { Person } from '../types';

export function getTimelinePeople(people: Person[]) {
  return people
    .filter((person) => typeof person.birthYearApprox === 'number' && typeof person.deathYearApprox === 'number')
    .sort((a, b) => (a.birthYearApprox ?? 0) - (b.birthYearApprox ?? 0));
}

export function getTimelineMax(people: Person[]) {
  return Math.max(...getTimelinePeople(people).map((person) => person.deathYearApprox ?? 0));
}
