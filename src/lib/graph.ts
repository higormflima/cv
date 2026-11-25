import { skillGroups } from '../data/skills';
import { experience } from '../data/experience';

export type NodeKind = 'group' | 'skill' | 'role';
export interface GraphNode { id: string; label: string; kind: NodeKind; x: number; y: number; r: number; degree: number }
export interface GraphEdge { source: string; target: string; kind: 'group' | 'role' }

const slug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic force-directed layout computed at build time so the graph renders without JavaScript. */
export function buildSkillGraph(width = 1100, height = 680) {
  const random = mulberry32(42);
  const nodes = new Map<string, GraphNode>();
  const edges: GraphEdge[] = [];
  const add = (id: string, label: string, kind: NodeKind) => {
    if (!nodes.has(id)) nodes.set(id, { id, label, kind, x: 0, y: 0, r: 0, degree: 0 });
    return nodes.get(id)!;
  };

  const skillIds = new Map<string, string>();
  skillGroups.forEach((group) => {
    const g = add(`g-${slug(group.title)}`, group.title, 'group');
    group.items.forEach((item) => {
      const s = add(`s-${slug(item)}`, item, 'skill');
      skillIds.set(item, s.id);
      edges.push({ source: g.id, target: s.id, kind: 'group' });
    });
  });
  experience
    .filter((role) => role.stack?.length)
    .forEach((role) => {
      const r = add(`r-${role.id}`, role.organization.replace(/ \(.*\)$/, ''), 'role');
      role.stack!.forEach((tool) => {
        const target = skillIds.get(tool);
        if (target) edges.push({ source: r.id, target, kind: 'role' });
      });
    });

  edges.forEach((edge) => {
    nodes.get(edge.source)!.degree++;
    nodes.get(edge.target)!.degree++;
  });

  const list = [...nodes.values()];
  const groups = list.filter((n) => n.kind === 'group');
  const roles = list.filter((n) => n.kind === 'role');
  const cx = width / 2;
  const cy = height / 2;
  groups.forEach((node, i) => {
    const angle = (i / groups.length) * Math.PI * 2 + Math.PI / 4;
    node.x = cx + Math.cos(angle) * width * 0.32;
    node.y = cy + Math.sin(angle) * height * 0.32;
  });
  roles.forEach((node, i) => {
    const angle = (i / roles.length) * Math.PI * 2;
    node.x = cx + Math.cos(angle) * 90;
    node.y = cy + Math.sin(angle) * 70;
  });
  list.forEach((node) => {
    if (node.kind === 'group') node.r = 11;
    else if (node.kind === 'role') node.r = 8 + Math.min(node.degree, 9) * 0.6;
    else node.r = 3.5 + Math.min(node.degree, 6) * 0.9;
    if (node.kind === 'skill') {
      const group = groups.find((g) => edges.some((e) => e.source === g.id && e.target === node.id))!;
      node.x = group.x + (random() - 0.5) * 160;
      node.y = group.y + (random() - 0.5) * 160;
    }
  });

  const labelWidth = (node: GraphNode) => node.label.length * (node.kind === 'skill' ? 6.2 : 7.6);
  const index = new Map(list.map((n) => [n.id, n]));
  const ticks = 900;

  for (let tick = 0; tick < ticks; tick++) {
    const alpha = 1 - tick / ticks;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy) || 0.01;
        const repel = (9000 / (dist * dist)) * alpha;
        a.x -= (dx / dist) * repel;
        a.y -= (dy / dist) * repel;
        b.x += (dx / dist) * repel;
        b.y += (dy / dist) * repel;

        // Rectangle collision between node + label boxes.
        const overlapX = (Math.max(labelWidth(a), a.r * 2) + Math.max(labelWidth(b), b.r * 2)) / 2 + 10 - Math.abs(dx);
        const overlapY = Math.max(a.r, b.r) + 26 - Math.abs(dy);
        if (overlapX > 0 && overlapY > 0) {
          if (overlapY < overlapX) {
            const push = (overlapY / 2) * 0.5 * Math.sign(dy || random() - 0.5);
            a.y -= push;
            b.y += push;
          } else {
            const push = (overlapX / 2) * 0.5 * Math.sign(dx || random() - 0.5);
            a.x -= push;
            b.x += push;
          }
        }
      }
    }
    for (const edge of edges) {
      const a = index.get(edge.source)!;
      const b = index.get(edge.target)!;
      const target = edge.kind === 'group' ? 120 : 240;
      const strength = edge.kind === 'group' ? 0.05 : 0.006;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dist = Math.hypot(dx, dy) || 0.01;
      const force = (dist - target) * strength * alpha;
      a.x += (dx / dist) * force;
      a.y += (dy / dist) * force;
      b.x -= (dx / dist) * force;
      b.y -= (dy / dist) * force;
    }
    for (const node of list) {
      node.x += (cx - node.x) * 0.0015;
      node.y += (cy - node.y) * 0.003;
      const pad = labelWidth(node) / 2 + 8;
      node.x = Math.min(Math.max(node.x, pad), width - pad);
      node.y = Math.min(Math.max(node.y, 22), height - 30);
    }
  }

  list.forEach((node) => {
    node.x = Math.round(node.x * 10) / 10;
    node.y = Math.round(node.y * 10) / 10;
  });
  const minX = Math.min(...list.map((n) => n.x - labelWidth(n) / 2)) - 12;
  const maxX = Math.max(...list.map((n) => n.x + labelWidth(n) / 2)) + 12;
  const minY = Math.min(...list.map((n) => n.y - n.r - 10)) - 6;
  const maxY = Math.max(...list.map((n) => n.y + n.r + 20)) + 6;
  const viewBox = [minX, minY, maxX - minX, maxY - minY].map((v) => Math.round(v)).join(' ');
  return { nodes: list, edges, viewBox };
}
