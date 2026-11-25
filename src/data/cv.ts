import { profile } from './profile';
import { experience } from './experience';
import { education } from './education';
import { certifications, languages, skillGroups } from './skills';

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
  meta: { canonical: `${site}/api/profile.json`, pdf: `${site}/documents/higor-lima-cv.pdf` },
};
