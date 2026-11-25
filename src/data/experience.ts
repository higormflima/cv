export type Track = 'military' | 'engineering' | 'quality' | 'data';

export interface Role {
  id: string;
  organization: string;
  location: string;
  dates: string;
  /** ISO year-month, used by the career Gantt chart. */
  start: string;
  /** ISO year-month, or null for the current role. */
  end: string | null;
  track: Track;
  stack?: string[];
  role: string;
  highlights: string[];
}

export const trackLabels: Record<Track, string> = {
  military: 'Military & aviation',
  engineering: 'Engineering',
  quality: 'Quality & testing',
  data: 'Data & analytics',
};

/** Role titles without inline date ranges; promotions are joined with an arrow. */
export const shortRole = (role: Pick<Role, 'role'>) =>
  role.role
    .split(';')
    .map((part) => part.split(' (')[0].trim())
    .join(' → ');

export const experience: Role[] = [
  {
    id: 'bayer',
    organization: 'Bayer',
    location: 'Warsaw, Mazowieckie, Poland',
    dates: 'March 2026 – Present',
    start: '2026-03',
    end: null,
    track: 'data',
    stack: ['Databricks', 'Unity Catalog', 'Data governance', 'Data quality', 'Metadata', 'Technical documentation', 'YAML', 'JSON Schema', 'Python', 'GitHub Actions', 'MkDocs', 'Cursor', 'GitHub Copilot', 'Claude', 'Databricks Genie', 'MCP', 'Scrum', 'Azure DevOps', 'Stakeholder communication'],
    role: 'Data Analyst',
    highlights: [
      'Help run a docs-as-code metadata platform: data products are described in version-controlled YAML, validated in CI, and published to Databricks, the UCL (Unified Consumption Layer) federated registry and Talk-to-Data agents.',
      'Co-designed and delivered the first pillar data products of a marketing analytics product family, and tested one end to end against an AI agent: 4 of 4 golden queries passed (average score 4.57 of 5).',
      'Onboarded six teams to the semantic layer, covering the metadata model, the PR-based workflow, the expert-review quality gate and the deployment chain.',
      'Set up repository governance with native GitHub controls (CODEOWNERS, rulesets), issue forms, PR templates and live docs previews; 37 pull requests merged and 19 code reviews.',
      'Rebuilt the consumer core data asset wiki and data catalog to a 13-section standard, and acted as scrum master and project coordinator for the asset team.',
      'In a Talk-to-Data pilot, turned marketing business questions into SQL, compared AI assistants, and built Databricks Genie spaces enriched with validated metadata.',
      'Wrote design proposals for an Agent Skills hub and a Semantic Quality Framework, and decision records on access control, data product structure and schema evolution.',
      'Work AI-assisted with Cursor, GitHub Copilot, Claude and Databricks Genie: AI drafts, I frame, review, validate and decide.',
      'Promoted enterprise-wide adoption of UCL with talks at two internal events, and wrote its federated registry capability card and quick-start guide.',
    ],
  },
  {
    id: 'chubb',
    organization: 'Chubb Fire & Security',
    location: 'Warsaw, Mazowieckie, Poland',
    dates: 'July 2025 – December 2025',
    start: '2025-07',
    end: '2025-12',
    track: 'data',
    stack: ['Requirements analysis', 'Data modeling', 'Data transformation', 'User acceptance testing', 'Stakeholder communication'],
    role: 'Business Analyst',
    highlights: [
      'Supported data transformation initiatives and translated stakeholder needs into business and functional requirements.',
      'Mapped data across business systems and collaborated with data modelers and engineers on integration-ready models.',
      'Defined business logic and transformation needs, and contributed data definitions to a shared data model.',
      'Created user stories and supported delivery traceability, stakeholder validation, testing, and requirement refinement.',
    ],
  },
  {
    id: 'reckitt',
    organization: 'Reckitt',
    location: 'Warsaw, Mazowieckie, Poland',
    dates: 'May 2024 – April 2025',
    start: '2024-05',
    end: '2025-04',
    track: 'data',
    stack: ['Google BigQuery', 'Databricks', 'Power BI', 'Agile', 'Scrum', 'Media analytics', 'User acceptance testing'],
    role: 'Senior Business Analyst',
    highlights: [
      'Collaborated with product managers, engineers, data scientists, developers, and stakeholders to build and maintain data streams for marketing and sales analytics.',
      'Used Google BigQuery and Databricks for data processing, supporting data quality and accessibility across 15 Power BI dashboards.',
      'Supported product development across two teams, managed backlogs and sprint cycles, and led Agile ceremonies.',
      'Developed four Power BI dashboards, two Gantt charts, and analytical tools to monitor product usage and team productivity.',
      'Identified consumer trends and product opportunities, and conducted more than 20 user acceptance tests.',
    ],
  },
  {
    id: 'capgemini',
    organization: 'Capgemini (supporting Unilever)',
    location: 'Warsaw, Mazowieckie, Poland',
    dates: 'February 2023 – May 2024',
    start: '2023-02',
    end: '2024-05',
    track: 'data',
    stack: ['Power BI', 'Dataiku', 'Google Analytics', 'Jira', 'Agile', 'Media analytics', 'Business intelligence', 'Excel', 'PowerPoint'],
    role: 'Business Data Analyst (February 2023 – February 2024); Business Intelligence Consultant (February 2024 – May 2024)',
    highlights: [
      'Analyzed data from more than 15 sources, including digital media, consumer reviews, and market research, to support global brand teams.',
      'Delivered more than 25 business reports and presentations with insights and recommendations, and developed two Power BI dashboards.',
      'Translated business briefs into analytical projects and conducted consumer, search, social listening, and competitor analysis.',
      'Presented findings and recommendations to stakeholders across marketing, brand, and business strategy teams.',
    ],
  },
  {
    id: 'accenture',
    organization: 'Accenture',
    location: 'Warsaw, Mazowieckie, Poland',
    dates: 'April 2021 – February 2023',
    start: '2021-04',
    end: '2023-02',
    track: 'data',
    stack: ['Data analysis'],
    role: 'Data Analyst',
    highlights: [
      'Analyzed operational performance, conducted root cause analysis, and developed metrics to answer business questions.',
      'Collaborated with a global team on data-driven initiatives and cross-functional operational needs.',
    ],
  },
  {
    id: 'testronic',
    organization: 'Testronic',
    location: 'Warsaw, Mazowieckie, Poland',
    dates: 'October 2020 – April 2021',
    start: '2020-10',
    end: '2021-04',
    track: 'quality',
    stack: ['Technical documentation'],
    role: 'Quality Assurance Specialist',
    highlights: [
      'Tested more than 20 software applications on gaming platforms for localization and functionality.',
      'Tracked and reported bugs and issues, and created test documentation.',
      'Executed compliance, integration, exploratory, and regression testing.',
    ],
  },
  {
    id: 'ifi',
    organization: 'IFI — Instituto de Fomento e Coordenação Industrial',
    location: 'São José dos Campos, São Paulo, Brazil',
    dates: 'August 2015 – September 2017',
    start: '2015-08',
    end: '2017-09',
    track: 'engineering',
    role: 'Aeronautical Product Certifier',
    highlights: [
      'Certified six aeronautical systems for aircraft programs, including KC-390 and Gripen.',
      'Collaborated with multidisciplinary teams to evaluate designs, conduct testing, and validate performance for certification.',
    ],
  },
  {
    id: 'gerdau',
    organization: 'Gerdau',
    location: 'Pindamonhangaba, São Paulo, Brazil',
    dates: 'April 2014 – August 2015',
    start: '2014-04',
    end: '2015-08',
    track: 'engineering',
    role: 'Mechanical Engineering Intern',
    highlights: [
      'Tested and implemented tools to improve rolling mill machining processes.',
      'Contributed to continuous improvement projects with approximately US$100,000 in cost savings.',
    ],
  },
  {
    id: 'maxion',
    organization: 'Maxion Structural Components',
    location: 'Cruzeiro, São Paulo, Brazil',
    dates: 'December 2013 – April 2014',
    start: '2013-12',
    end: '2014-04',
    track: 'engineering',
    role: 'Quality Engineering Intern',
    highlights: [
      'Supported quality engineering for truck structural components and assembly, including dimensional analysis, statistical control, and technical documentation.',
    ],
  },
  {
    id: 'army',
    organization: 'Brazilian Army',
    location: 'Manaus, Amazonas, Brazil',
    dates: 'July 2006 – December 2012',
    start: '2006-07',
    end: '2012-12',
    track: 'military',
    role: 'Platoon Sergeant',
    highlights: [
      'Led small teams in more than 30 missions and accumulated over 500 hours as a flight mechanic on helicopter models in the Brazilian Amazon.',
    ],
  },
];
