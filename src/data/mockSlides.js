// Mock dataset standing in for what GET /api/slides will eventually return.
// Shape matches the spec: title, description, tags/category, preview image,
// institution/competition name, and year.

export const CATEGORIES = ['Strategy', 'Finance', 'Marketing', 'Social Impact'];

export const mockSlides = [
  {
    id: 's1',
    title: 'Project Olympus: Global Expansion Framework',
    description:
      'A comprehensive analysis of entry modes for emerging markets, using a hybrid joint-venture and licensing model.',
    category: 'Strategy',
    competition: 'Harvard Business School',
    year: 2023,
    previewColor: 'from-violet-600/40 to-noir-800',
    views: 1240,
  },
  {
    id: 's2',
    title: 'Urban Micro-Mobility Equity',
    description:
      'A sustainable business model for deploying e-transport networks in underserved urban districts.',
    category: 'Social Impact',
    competition: 'Wharton Impact',
    year: 2023,
    previewColor: 'from-emerald-500/30 to-noir-800',
    views: 980,
  },
  {
    id: 's3',
    title: 'Revitalizing Legacy Brands',
    description:
      'Leveraging digital nostalgia and omnichannel presence to bring heritage retail back to relevance.',
    category: 'Marketing',
    competition: 'LBS Challenge',
    year: 2023,
    previewColor: 'from-cyan-500/30 to-noir-800',
    views: 2110,
  },
  {
    id: 's4',
    title: 'Restructuring the Tech Supply Chain',
    description:
      'Cost optimization and risk mitigation strategies in semiconductor manufacturing under export controls.',
    category: 'Finance',
    competition: 'INSEAD Global',
    year: 2024,
    previewColor: 'from-amber-500/20 to-noir-800',
    views: 760,
  },
  {
    id: 's5',
    title: 'Net-Zero Logistics Pivot',
    description:
      'A phased decarbonization roadmap for a mid-size freight operator balancing cost and emissions targets.',
    category: 'Strategy',
    competition: 'INSEAD Global',
    year: 2024,
    previewColor: 'from-violet-600/30 to-noir-800',
    views: 540,
  },
  {
    id: 's6',
    title: 'Series B Capital Allocation Strategy',
    description:
      'A scenario-based model for allocating a $40M raise across product, growth, and runway extension.',
    category: 'Finance',
    competition: 'Wharton Impact',
    year: 2024,
    previewColor: 'from-cyan-500/20 to-noir-800',
    views: 1890,
  },
  {
    id: 's7',
    title: 'Gen Z Loyalty Architecture',
    description:
      'Rebuilding a loyalty program around community and creator partnerships rather than discounting.',
    category: 'Marketing',
    competition: 'LBS Challenge',
    year: 2025,
    previewColor: 'from-emerald-500/20 to-noir-800',
    views: 1320,
  },
  {
    id: 's8',
    title: 'Microfinance for Climate Resilience',
    description:
      'Designing micro-lending products that help smallholder farmers adapt to volatile growing seasons.',
    category: 'Social Impact',
    competition: 'Harvard Business School',
    year: 2025,
    previewColor: 'from-amber-500/15 to-noir-800',
    views: 410,
  },
  {
    id: 's9',
    title: 'Vertical SaaS Roll-Up Thesis',
    description:
      'An acquisition framework for consolidating fragmented vertical SaaS tools into one platform play.',
    category: 'Strategy',
    competition: 'INSEAD Global',
    year: 2025,
    previewColor: 'from-violet-600/25 to-noir-800',
    views: 2680,
  },
];
