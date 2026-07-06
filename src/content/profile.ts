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
  lead: 'End-to-end delivery: from requirements and architecture to operations and trained client teams.',
  items: [
    {
      title: 'Turnkey production robotics',
      text: 'Robotic systems for real factories — electronics, firmware, enclosures, on-site installation.',
    },
    {
      title: 'AI/ML & Computer Vision',
      text: 'Agents, RAG, CV pipelines — designed, trained and shipped to production.',
    },
    {
      title: 'End-to-end delivery',
      text: 'From first requirements call to operations, monitoring and hand-over.',
    },
    {
      title: 'Team & vendor management',
      text: 'Building and leading cross-functional engineering teams, managing vendors.',
    },
    {
      title: 'Infrastructure & IoT',
      text: 'Cloud, edge and hardware working together as one reliable system.',
    },
  ],
} as const;
