import { profile } from './profile';
import { experience, shortRole } from './experience';
import { education } from './education';
import { certifications, languages, skillGroups } from './skills';
import { storyIntro } from './story';

export interface KnowledgeChunk {
  title: string;
  text: string;
  href: string;
  /** Extra search terms that are indexed but not shown in answers. */
  keywords?: string;
  kind: 'profile' | 'role' | 'skills' | 'education' | 'certifications' | 'languages' | 'contact' | 'story' | 'project';
}

/** Retrieval corpus for the in-browser "Ask my CV" assistant. Built from the same data the pages render. */
export const knowledge: KnowledgeChunk[] = [
  { kind: 'profile', title: 'Summary', text: `${profile.summary} ${profile.focus} Headline: ${profile.headline}.`, href: '/' },
  { kind: 'story', title: 'Story', text: storyIntro, href: '/story/' },
  {
    kind: 'contact',
    title: 'Contact',
    text: `Email ${profile.email}. LinkedIn ${profile.linkedIn}. Based in ${profile.location}. A PDF CV can be downloaded from the site.`,
    href: '/',
  },
  ...experience.flatMap((role) =>
    role.highlights.map((highlight) => ({
      kind: 'role' as const,
      title: `${shortRole(role)} · ${role.organization} (${role.dates})`,
      text: highlight,
      keywords: role.stack?.join(' '),
      href: `/experience/#${role.id}`,
    })),
  ),
  ...skillGroups.map((group) => ({
    kind: 'skills' as const,
    title: `Skills · ${group.title}`,
    text: group.items.join(', '),
    href: '/skills/',
  })),
  ...education.map((item) => ({
    kind: 'education' as const,
    title: `Education · ${item.qualification}`,
    text: `${item.qualification} at ${item.institution}, ${item.dates}.`,
    href: '/experience/#education',
  })),
  { kind: 'certifications', title: 'Certifications', text: certifications.join('; '), href: '/skills/' },
  {
    kind: 'languages',
    title: 'Languages',
    text: languages.map((item) => `${item.name}: ${item.level}`).join('; '),
    href: '/skills/',
  },
  {
    kind: 'project',
    title: 'Project · Enterprise Data Integration',
    text: 'Business analysis for connecting data across separate business systems: requirements, field mapping across source systems, transformation rules, shared data model definitions, and user stories.',
    href: '/projects/enterprise-data-integration/',
  },
  {
    kind: 'project',
    title: 'Project · Odisseia Mundana',
    text: 'Personal travel magazine and knowledge hub built with Astro and GitHub Pages, including a handcrafted Iveco motorhome record and a browser-based electrical planning tool that generates PDF reports.',
    href: '/projects/odisseia-mundana/',
  },
];

export const currentRole = experience[0];
