// Sample AI startup data for demo reliability

import { ArticleData } from "@/types/index";

export const SAMPLE_ARTICLES: ArticleData[] = [
  {
    title: "Anthropic Raises $5B Series C Funding for AI Safety",
    url: "https://example.com/anthropic-5b",
    source: "TechCrunch",
    publishedAt: new Date("2024-03-20"),
    content: `Anthropic, an AI safety company founded by Dario and Daniela Amodei, has announced a Series C funding round of $5 billion. The funding will support research into developing more interpretable and safer AI systems. Founded in 2021, Anthropic focuses on creating advanced AI models. Key team members include Dario Amodei (CEO) and researcher team from top institutions. The company plans to expand its team and research capabilities. Email: contact@anthropic.com. Developer tool category focused on AI infrastructure.`,
  },
  {
    title: "OpenAI Secures $6B Strategic Investment from Microsoft",
    url: "https://example.com/openai-6b-ms",
    source: "Bloomberg",
    publishedAt: new Date("2024-03-15"),
    content: `OpenAI has received a strategic investment of $6 billion from Microsoft to support the development of its next-generation AI models and infrastructure. Founded in 2015 by Sam Altman and others, OpenAI has become a leader in large language models. The funding will accelerate development of GPT-5 and agent capabilities. Key persons: Sam Altman (CEO), Greg Brockman (President). Contact: investors@openai.com. Focus: AI infrastructure and LLM tools for developers.`,
  },
  {
    title: "Together AI Completes $102M Series B for AI Inference Platform",
    url: "https://example.com/together-102m",
    source: "VentureBeat",
    publishedAt: new Date("2024-03-10"),
    content: `Together AI, a developer platform for AI inference and fine-tuning, has raised $102 million in Series B funding. The company was founded by entrepreneurs focused on making AI development more accessible. Founders: Nathan Lambert, Stephanie Sussman, and team. Together AI provides tools for developers to build and deploy AI applications. Email: hello@together.ai. Marketing contact: marketing@together.ai. Category: AI Dev Tools and Infrastructure.`,
  },
  {
    title: "Hugging Face Announces $235M Series D at $4.5B Valuation",
    url: "https://example.com/huggingface-235m",
    source: "TechCrunch",
    publishedAt: new Date("2024-03-05"),
    content: `Hugging Face, the open-source AI platform for building machine learning applications, has raised $235 million in Series D funding at a $4.5 billion valuation. Founder: Clement Delangue. The company provides tools for developers to build, train, and deploy AI models. Hugging Face has become essential infrastructure for ML engineers globally. Contact: business@huggingface.co. Focus: AI Developer Tools and Model Hub.`,
  },
  {
    title: "Mistral AI Raises $415M European AI Startup Record",
    url: "https://example.com/mistral-415m",
    source: "Reuters",
    publishedAt: new Date("2024-02-28"),
    content: `Mistral AI, a Parisian AI research company, has raised €400 million ($415M), setting a record for European AI startups. Founded by Guillaume Lample and Timothée Lacroix, formerly at Meta. The company focuses on developing efficient large language models. Mistral provides developer tools for LLM deployment. Team includes top AI researchers. Email: hello@mistral.ai. Category: LLM Tools and AI Infrastructure.`,
  },
  {
    title: "Stability AI Raises $101M Seed 2 for Diffusion Models",
    url: "https://example.com/stability-101m",
    source: "TechCrunch",
    publishedAt: new Date("2024-02-20"),
    content: `Stability AI, the creator of Stable Diffusion, has raised $101 million in additional funding. Founded by Emad Mostaque, the company focuses on generative AI models. Stability provides developer tools for image generation and AI applications. The company has built an open model ecosystem. Contact: dev@stability.ai. Marketing: partnerships@stability.ai. Category: AI Dev Tools for generative AI.`,
  },
  {
    title: "Replicate Launches Agent-as-a-Service for AI Developers",
    url: "https://example.com/replicate-agents",
    source: "Product Hunt",
    publishedAt: new Date("2024-03-25"),
    content: `Replicate, a machine learning infrastructure platform, announced new agent-as-a-service capabilities for developers. Founded by Ben Firshman, Replicate makes it easy to run ML models in the cloud. The platform now supports autonomous agents for developers. Email: hello@replicate.com. Focus: AI Infrastructure and Agent Platform. Category: Agent Platform and AI Dev Tools.`,
  },
];

export function getSampleArticles(): ArticleData[] {
  return SAMPLE_ARTICLES;
}

export function getSampleArticleByIndex(index: number): ArticleData | undefined {
  return SAMPLE_ARTICLES[index];
}

export function getRandomSampleArticles(count: number = 3): ArticleData[] {
  const shuffled = [...SAMPLE_ARTICLES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
