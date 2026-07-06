export interface StackGroup {
  title: string;
  items: string[];
}

export const stackSection = {
  title: 'Stack',
  lead: 'Tools I use daily to design, build and ship.',
} as const;

export const stack: StackGroup[] = [
  {
    title: 'Languages',
    items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'Go', 'C++', 'PHP'],
  },
  {
    title: 'AI / LLM',
    items: ['LangChain', 'LangGraph', 'RAG', 'OpenAI API', 'Claude API', 'Hugging Face'],
  },
  {
    title: 'ML / Deep Learning',
    items: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'XGBoost', 'ONNX', 'TensorRT', 'CUDA'],
  },
  {
    title: 'Computer Vision',
    items: ['OpenCV', 'YOLO', 'Ultralytics'],
  },
  {
    title: 'Frontend',
    items: ['React', 'Next.js', 'Vue.js', 'Three.js'],
  },
  {
    title: 'Backend',
    items: ['FastAPI', 'Node.js', 'Spring Boot', 'Laravel'],
  },
  {
    title: 'Cloud & DevOps',
    items: ['AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'Kafka', 'GitHub Actions'],
  },
  {
    title: 'Databases',
    items: ['PostgreSQL', 'MongoDB', 'Redis', 'Qdrant', 'DynamoDB'],
  },
];
