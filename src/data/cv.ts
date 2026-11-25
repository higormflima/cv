import { profile } from './profile';
import { experience } from './experience';
import { education } from './education';
import { certifications, languages, skillGroups } from './skills';
import { bayerStats, decisions, goldenTest, talks } from './contributions';

const site = 'https://higormflima.github.io/cv';

/** Public, machine-readable CV. Intentionally omits the phone number. */
export const cv = {
  $schema: 'https://jsonresume.org/schema',
  basics: {
    name: profile.name,
    label: profile.title,
    headline: profile.headline,
    email: profile.email,
    url: `${site}/`,
    summary: profile.summary,
    location: { city: 'Warsaw', countryCode: 'PL' },
    profiles: [{ network: 'LinkedIn', url: profile.linkedIn }],
  },
  work: experience.map((role) => ({
    name: role.organization,
    position: role.role,
    location: role.location,
    startDate: role.start,
    endDate: role.end,
    highlights: role.highlights,
    ...(role.stack ? { keywords: role.stack } : {}),
  })),
  education: education.map((item) => ({
    institution: item.institution,
    area: item.qualification,
    startDate: item.start.slice(0, 4),
    endDate: item.end.slice(0, 4),
  })),
  skills: skillGroups.map((group) => ({ name: group.title, keywords: group.items })),
  certificates: certifications.map((name) => ({ name })),
  languages: languages.map((item) => ({ language: item.name, fluency: item.level })),
  projects: [
    {
      name: 'AI-ready data products (Bayer)',
      description: 'Docs-as-code metadata platform turning version-controlled documentation into data products for Databricks, a data product registry and AI agents.',
      highlights: [
        `Golden-query test against an AI agent: ${goldenTest.passed}/${goldenTest.total} passed, average score ${goldenTest.averageScore}/${goldenTest.maxScore}.`,
        ...bayerStats.map((stat) => `${stat.value} ${stat.label} (${stat.detail})`),
      ],
      url: `${site}/projects/ai-ready-data-products/`,
    },
    { name: 'Enterprise Data Integration', url: `${site}/projects/enterprise-data-integration/` },
    { name: 'Odisseia Mundana', url: `${site}/projects/odisseia-mundana/` },
  ],
  talks: talks.map((talk) => ({ title: talk.title, event: talk.event, date: talk.date })),
  decisions: decisions.map((adr) => ({ id: adr.id, title: adr.title, status: adr.status })),
  meta: { canonical: `${site}/api/profile.json`, pdf: `${site}/documents/higor-lima-cv.pdf` },
};
