export interface Service {
  id: string;
  title: string;
  text: string;
  images: string[];
}

export const servicesSection = {
  title: 'How I can help',
  lead: 'Eight areas where I take a task from idea to a working system.',
} as const;

export const services: Service[] = [
  {
    id: 'architecture',
    title: 'Architecture & Planning',
    text: 'System design, C4 diagrams, delivery roadmaps and estimation — a clear plan before a single line of code.',
    images: ['assets/architecture.png', 'assets/project-plan.png'],
  },
  {
    id: 'solutions',
    title: 'Picking Proven Solutions',
    text: 'Choosing battle-tested open-source models and libraries instead of reinventing wheels — faster and cheaper.',
    images: ['assets/github.png', 'assets/HF.png'],
  },
  {
    id: 'infrastructure',
    title: 'Infrastructure, Databases & Servers',
    text: 'Cloud and on-premise setups, database design, CI/CD, monitoring — infrastructure that stays up.',
    images: ['assets/infrastructure.webp'],
  },
  {
    id: 'fullstack',
    title: 'Backend & Frontend Development',
    text: 'APIs, services and interfaces — full product development with modern, maintainable stacks.',
    images: ['assets/FrontBack.jpeg'],
  },
  {
    id: 'ml',
    title: 'ML & CV Model Development',
    text: 'Training and deploying machine learning and computer vision models — from dataset to real-time inference.',
    images: ['assets/ML.png'],
  },
  {
    id: 'llm',
    title: 'LLM & Agent Integration',
    text: 'LLM-powered agents, RAG pipelines and workflows — including self-hosted models with LoRA fine-tuning.',
    images: ['assets/LangGraph.png'],
  },
  {
    id: 'mechanisms',
    title: 'Mechanism Design',
    text: 'Designing mechanical systems and robotic cells for production lines — geometry, kinematics, integration.',
    images: ['assets/robots.jpg'],
  },
  {
    id: 'electronics',
    title: 'Electronics, PCB & Hardware Software',
    text: 'Board design, firmware and the software that drives hardware — one team from schematic to device.',
    images: ['assets/pcb-board.webp'],
  },
];
