export interface Project {
  id: string;
  title: string;
  summary: string;
  highlights: string[];
  tech: string[];
}

export const projectsSection = {
  title: 'Projects',
  lead: 'A selection of systems I have architected and shipped.',
} as const;

/**
 * Adding a new project = adding one object here.
 * Cards, route points and scroll length are generated automatically.
 */
export const projects: Project[] = [
  {
    id: 'mcdonalds-cv',
    title: "McDonald's Drive-In Computer Vision",
    summary:
      "Enterprise-grade computer vision analytics for Drive-In and in-store queue monitoring, deployed across 1,400+ restaurants in Germany.",
    highlights: [
      'Full-cycle delivery from PoC to production across 1,400+ locations',
      'Real-time vehicle and queue detection on edge GPU hardware',
      '2x lower frame processing latency via inference optimization',
      'MLOps and DevOps pipelines on AWS with GPU cost management',
    ],
    tech: ['Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'YOLO', 'TensorRT', 'CUDA', 'AWS', 'Docker', 'MLflow'],
  },
  {
    id: 'amc-placement',
    title: 'AMC Content Placement System',
    summary:
      'An ML model predicting optimal TV ad placement times for AMC — generating $1M+/month in additional ad revenue.',
    highlights: [
      'Ad placement prediction model shipped to production',
      '$1M+/month additional ad revenue generated',
      'Also supervised a Huawei video stabilization ML module using gyroscopic motion prediction',
    ],
    tech: ['Python', 'PyTorch', 'TensorFlow', 'AWS', 'Redis', 'Docker'],
  },
  {
    id: 'inkhub',
    title: 'InkHub — AI Knowledge Platform',
    summary:
      'An enterprise AI platform aggregating 5M+ curated sources for automated whitepaper generation, intelligent search and expert market analysis.',
    highlights: [
      'Architecture and full-cycle delivery of an LLM-based knowledge platform',
      '5+ LLMs (OpenAI, Claude, open-source) integrated for enrichment and semantic retrieval',
      '3x lower infrastructure costs via modular design and GPU/cloud rebalancing',
      'Built and led a cross-functional engineering team of 10',
    ],
    tech: ['Python', 'LangChain', 'RAG', 'OpenAI API', 'AWS', 'PostgreSQL', 'Redis', 'Docker', 'React'],
  },
  {
    id: 'photoseparator',
    title: 'PhotoSeparator IoT — Industrial Defect Detection',
    summary:
      'A real-time computer vision system detecting impurities and sorting material flows on an industrial production line using pneumatic air jets.',
    highlights: [
      'Real-time defect detection pipeline for industrial conveyor lines',
      'Hardware integration with pneumatic actuators within <10ms latency',
      'Edge GPU inference optimized for continuous material flow',
      'End-to-end: camera calibration, data labeling, deployment, electronics design',
    ],
    tech: ['Python', 'PyTorch', 'OpenCV', 'TensorRT', 'CUDA', 'ONNX', 'C++'],
  },
  {
    id: 'ad-automation',
    title: 'Ad Campaign Automation & Analytics',
    summary:
      'Automated management of advertising bids and analytics tracking across Google Ads and Meta platforms with near real-time optimization.',
    highlights: [
      'End-to-end architecture for automated bid management with rule-based and ML strategies',
      '70%+ reduction in manual campaign management overhead',
      'One-click Meta Pixel and Google Analytics 4 setup for client websites at scale',
      'Server-side event tracking via Meta Conversion API and GA4 Measurement Protocol',
    ],
    tech: ['Python', 'FastAPI', 'Google Ads API', 'Meta Marketing API', 'GA4', 'Node.js', 'PostgreSQL', 'AWS'],
  },
  {
    id: 'recommendations',
    title: 'Predictive Recommendations System',
    summary:
      'A personalized product recommendation engine based on user behavioral data, purchase history and real-time session signals.',
    highlights: [
      'Hybrid architecture: collaborative filtering + content-based + real-time behavioral features',
      'Scalable event ingestion pipeline feeding feature stores for training',
      'Significant uplift in CTR and conversion vs. baseline',
      'Low-latency inference API with an A/B testing framework',
    ],
    tech: ['Python', 'Scikit-learn', 'PyTorch', 'FastAPI', 'PostgreSQL', 'Redis', 'AWS', 'Docker'],
  },
  {
    id: 'dokably',
    title: 'Dokably — Collaborative Documentation Platform',
    summary:
      'A real-time collaborative platform for document co-authoring and architecture diagramming — think Notion + Miro.',
    highlights: [
      'Real-time collaborative editing engine with CRDT-based conflict resolution',
      'Interactive drag-and-drop diagram editor for architecture and flow diagrams',
      'Full RAG system: AI assistant for interacting with documents on the platform',
      'Workspaces, permissions, and PDF/PNG/structured export',
    ],
    tech: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'PostgreSQL', 'Redis', 'Docker', 'AWS S3'],
  },
  {
    id: 'aura',
    title: 'Aura — Personal Development Marketplace',
    summary:
      'A marketplace platform connecting clients with personal development specialists: coaches, psychologists and life coaches.',
    highlights: [
      'End-to-end platform architecture: discovery, booking, session management',
      'Search and matching with filtering by specialty, availability and preferences',
      'Secure payment flow and scheduling with automated reminders',
    ],
    tech: ['React', 'Node.js', 'FastAPI', 'PostgreSQL', 'Redis', 'Stripe API', 'Docker', 'AWS'],
  },
  {
    id: 'anti-counterfeit',
    title: 'Anti-Counterfeit Mark Recognition',
    summary:
      'An AI application verifying brand authenticity via visual analysis of product markings, labels and security features.',
    highlights: [
      'CV pipeline for multi-class authenticity classification of security marks and holograms',
      'Robust to varied lighting, angles and label conditions',
      'Real-time scanning via smartphone camera through a mobile-friendly API',
    ],
    tech: ['Python', 'PyTorch', 'OpenCV', 'FastAPI', 'TensorRT', 'Docker', 'AWS'],
  },
  {
    id: 'presales',
    title: 'Enterprise Pre-Sales & Solution Architecture',
    summary:
      'Technical pre-sales leadership and architecture design for enterprise AI, computer vision, NLP and automation projects across 10+ industries.',
    highlights: [
      'Deal conversion rate up from 10% to 15% via a structured PoC and validation framework',
      'Architectures and MVPs for CV defect detection, NLP document analysis, blockchain automation',
      'Contributed to company ISO certification: architecture docs, estimation, security practices',
    ],
    tech: ['Solution Architecture', 'AI/ML', 'NLP', 'Blockchain', 'RPA'],
  },
  {
    id: 'medical-fhir',
    title: 'Medical Data Integration Platform',
    summary:
      'A unified healthcare data platform providing interoperable access to patient records across institutions via the FHIR 4 standard.',
    highlights: [
      'MVP of a medical data harmonization platform delivered in 3 months; PoC in 2 weeks',
      'FHIR 4-compliant data mapping utilities and automated validation tools',
      'Modular Spring Boot microservice architecture reusable across institutions',
    ],
    tech: ['Java', 'Spring Boot', 'FHIR 4', 'PostgreSQL', 'Docker', 'AWS', 'Python'],
  },
  {
    id: 'videoconferencing',
    title: 'Videoconferencing Platform',
    summary:
      'A scalable system for large-scale video conferences with group breakout rooms, participant routing and inter-group communication.',
    highlights: [
      'Architecture supporting dynamic breakout rooms and real-time participant routing',
      'Low-latency WebRTC signaling and media relay for large concurrent sessions',
      'Horizontal scaling for hundreds of simultaneous conference sessions',
    ],
    tech: ['Go', 'WebRTC', 'React', 'Redis', 'PostgreSQL', 'Docker', 'AWS'],
  },
  {
    id: 'streaming',
    title: 'Video Streaming & Server Monitoring',
    summary:
      'An ultra-low-latency live streaming platform for horse racing broadcasts plus an AI-powered server infrastructure monitoring system.',
    highlights: [
      'Ultra-low-latency live streaming with high availability and scalability',
      'Proactive data center monitoring with fault prediction and auto-remediation',
    ],
    tech: ['Node.js', 'WebRTC', 'AWS', 'Docker', 'Redis', 'PostgreSQL'],
  },
  {
    id: 'shuttle',
    title: 'Shuttle Delivery — Food Delivery Platform',
    summary:
      'A full-stack web and mobile food delivery platform for the Korean market: customer app, restaurant dashboard and courier tracking.',
    highlights: [
      'End-to-end platform: ordering, payments, multi-restaurant management',
      'Cloud infrastructure with a CI/CD pipeline',
    ],
    tech: ['React', 'Java', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
  },
  {
    id: 'erp',
    title: 'ERP — Inventory & Production Planning',
    summary:
      'An ERP platform for manufacturing companies covering inventory management, production order planning and supply chain tracking.',
    highlights: [
      'Modular architecture: inventory, production orders, procurement, reporting',
      'Demand-driven planning with multi-warehouse stock management',
      'REST API layer integrating external accounting and logistics systems',
    ],
    tech: ['Python', 'React', 'PostgreSQL', 'Redis', 'Docker', 'Azure'],
  },
  {
    id: 'knox',
    title: 'Knox — Blockchain Storage Service',
    summary:
      'A secure data storage system on the IPFS network with multi-layer encryption.',
    highlights: [
      'IPFS-based blockchain storage with multi-layer encryption',
      'Blockchain MVP delivered in 2 months with continuous feature development',
    ],
    tech: ['Python', 'React', 'IPFS', 'PostgreSQL', 'Docker'],
  },
];

export const cta = {
  question: 'Like what you see?',
  text: 'Want something this cool for your business? Drop me a line.',
  emailLabel: 'Email me',
  linkedinLabel: 'LinkedIn',
} as const;
