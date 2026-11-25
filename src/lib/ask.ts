import type { KnowledgeChunk } from '../data/knowledge';

export interface Answer {
  intro: string;
  items: Pick<KnowledgeChunk, 'title' | 'text' | 'href'>[];
  missing: string[];
}

const STOPWORDS = new Set(
  'a an and are as at be been by can could did do does for from had has have he her him his how i in is it its me my of on or our she so than that the their them there these they this to was we were what when where which who whom why will with would you your about any tell much many some does doing done know worked work working use used using higor lima experience experienced skill skills'.split(' '),
);

const SYNONYMS: Record<string, string[]> = {
  ai: ['ai', 'genai', 'scientist', 'feature'],
  ml: ['ai', 'scientist', 'feature'],
  bi: ['business', 'intelligence', 'power', 'dashboard'],
  dashboard: ['dashboard', 'power', 'bi'],
  visualization: ['dashboard', 'power', 'report'],
  visualisation: ['dashboard', 'power', 'report'],
  cloud: ['bigquery', 'databrick', 'azure'],
  sql: ['bigquery', 'databrick', 'spark', 'transformation'],
  governance: ['governance', 'metadata', 'steward', 'quality'],
  lead: ['led', 'lead', 'leadership', 'ceremony', 'team'],
  leadership: ['led', 'lead', 'leadership', 'ceremony', 'team'],
  manage: ['managed', 'backlog', 'sprint', 'management'],
  marketing: ['marketing', 'media', 'brand'],
  agile: ['agile', 'scrum', 'sprint', 'backlog', 'ceremony'],
  test: ['test', 'testing', 'acceptance', 'qa'],
  testing: ['test', 'testing', 'acceptance', 'qa'],
  qa: ['test', 'testing', 'quality'],
  military: ['army', 'mission', 'platoon', 'sergeant'],
  aviation: ['aircraft', 'aeronautical', 'helicopter', 'flight'],
  fmcg: ['fmcg', 'unilever', 'reckitt', 'consumer'],
};

const INTENTS: { pattern: RegExp; kinds: KnowledgeChunk['kind'][]; intro: string }[] = [
  { pattern: /\b(contact|e-?mail|reach|hire|linkedin|get in touch|phone|call)\b/i, kinds: ['contact'], intro: 'Here is how to reach Higor:' },
  { pattern: /\b(languages?|speak|speaks|fluent|polish|spanish|portuguese|english)\b/i, kinds: ['languages'], intro: 'Higor works in four languages:' },
  { pattern: /\b(educat\w*|degree|universit\w*|stud(y|ied)|school|graduat\w*|unesp|senai)\b/i, kinds: ['education'], intro: 'Education:' },
  { pattern: /\bcertif\w*/i, kinds: ['certifications'], intro: 'Certifications listed in the CV:' },
  { pattern: /\b(projects?|portfolio|side project)\b/i, kinds: ['project'], intro: 'Projects on this site:' },
  { pattern: /\b(who is|about (him|higor)|summary|introduce|background|story)\b/i, kinds: ['profile', 'story'], intro: 'In short:' },
];

export const stem = (word: string) => {
  if (word.length > 5 && word.endsWith('ing')) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith('ed')) return word.slice(0, -2);
  if (word.length > 4 && word.endsWith('ies')) return `${word.slice(0, -3)}y`;
  if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
  return word;
};

export const tokenize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9+#]+/)
    .filter((word) => word.length > 1 && !STOPWORDS.has(word))
    .map(stem);

export function createAsker(chunks: KnowledgeChunk[]) {
  const docs = chunks.map((chunk) => tokenize(`${chunk.title} ${chunk.text} ${chunk.keywords ?? ''}`));
  const avgLength = docs.reduce((sum, doc) => sum + doc.length, 0) / docs.length;
  const documentFrequency = new Map<string, number>();
  docs.forEach((doc) => new Set(doc).forEach((term) => documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1)));
  const vocabulary = new Set(documentFrequency.keys());

  const bm25 = (terms: string[], index: number) => {
    const doc = docs[index];
    let score = 0;
    for (const term of terms) {
      const tf = doc.filter((word) => word === term).length;
      if (!tf) continue;
      const df = documentFrequency.get(term) ?? 0;
      const idf = Math.log(1 + (docs.length - df + 0.5) / (df + 0.5));
      score += (idf * tf * 2.2) / (tf + 1.2 * (0.25 + 0.75 * (doc.length / avgLength)));
    }
    return score;
  };

  return function ask(question: string): Answer {
    const pick = (kinds: KnowledgeChunk['kind'][]) => chunks.filter((chunk) => kinds.includes(chunk.kind));

    if (/\b(how (many|long)|years)\b/i.test(question) && /\b(year|experience|long)\w*/i.test(question)) {
      return { intro: 'Higor has 6+ years in tech and data since moving to Warsaw in 2020, after earlier careers in engineering, aviation quality and the Brazilian Army.', items: pick(['profile']), missing: [] };
    }
    if (/\b(where|location|based|live|relocat\w*)\b/i.test(question)) {
      return { intro: 'Higor is based in Warsaw, Poland.', items: pick(['contact']), missing: [] };
    }
    if (/\b(current(ly)?|now|today|present)\b/i.test(question)) {
      return { intro: 'Currently a Data Analyst at Bayer (since March 2026):', items: chunks.filter((chunk) => chunk.href.endsWith('#bayer')).slice(0, 4), missing: [] };
    }
    for (const intent of INTENTS) {
      if (intent.pattern.test(question)) return { intro: intent.intro, items: pick(intent.kinds), missing: [] };
    }

    const queryTerms = tokenize(question);
    const missing = queryTerms.filter((term) => !vocabulary.has(term) && !SYNONYMS[term]);
    const expanded = [...new Set(queryTerms.flatMap((term) => [term, ...(SYNONYMS[term] ?? []).map(stem)]))];
    const ranked = chunks
      .map((chunk, index) => ({ chunk, score: bm25(expanded, index) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score);

    if (!ranked.length) {
      return {
        intro: 'I couldn’t find that in Higor’s CV. Try asking about a tool (Databricks, Power BI), a company (Reckitt, Bayer), data governance, languages or education.',
        items: [],
        missing,
      };
    }

    const top = ranked[0].score;
    const items = ranked.filter((entry) => entry.score >= top * 0.45).slice(0, 4).map((entry) => entry.chunk);
    return { intro: `Found ${items.length} relevant ${items.length === 1 ? 'entry' : 'entries'} in the CV:`, items, missing };
  };
}
