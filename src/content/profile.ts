export const profile = {
  name: 'Mikita Valkunovich',
  role: 'Robotization, IT and AI | Technical Director',
  tags: ['AI/ML', 'Computer Vision', 'IoT', 'LLMs'],
  stats: [
    { value: '11+', label: 'years in IT' },
    { value: '20,200+', label: 'hours of engineering' },
    { value: '50+', label: 'delivered projects' },
  ],
  intro:
    "I'm a systems architect and senior engineer. Currently focused on production robotics and AI automation — leading a full-cycle team that handles everything from electronics and firmware to enclosures and on-site installation of robotic systems at production facilities.",
  photo: 'assets/photo.jpeg',
  email: 'progprogect@gmail.com',
  linkedin: 'https://www.linkedin.com/in/volknick/',
} as const;

export const whatIDo = {
  title: 'What I do',
  lead: 'I build IT products powered by AI — from the first architecture call to a running production system.',
  items: [
    {
      title: 'AI-powered products',
      text: 'LLM agents, RAG systems, Computer Vision pipelines — designed, trained and shipped to production.',
    },
    {
      title: 'Product architecture',
      text: 'System design that scales: APIs, data flows, infrastructure and integration with existing stacks.',
    },
    {
      title: 'Full-cycle delivery',
      text: 'From requirements to release: I lead the team, manage vendors and hand over a running product.',
    },
    {
      title: 'Infrastructure & IoT',
      text: 'Cloud, edge and hardware working together as one reliable system.',
    },
    {
      title: 'Production robotics',
      text: 'For clients who need physical automation — robotic systems from electronics to on-site install.',
    },
  ],
} as const;
