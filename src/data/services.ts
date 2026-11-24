import uxImg from "@/assets/services/UX Research & Strategy.png";
import brandImg from "@/assets/services/Brand Identity.png";
import webProductImg from "@/assets/services/Web & Product Design.png";
import webDevImg from "@/assets/services/Web Development.png";
import marketingImg from "@/assets/services/Digital Marketing & CRO.png";
import aiImg from "@/assets/services/AI Development & Automation.png";
import appHeroImg from "@/assets/app.jpg";
import productHeroImg from "@/assets/product.jpg";

// Portfolio Imports
import p_ux1 from "@/assets/portfolio_collect/product_development/product1.jpg";
import p_ux2 from "@/assets/portfolio_collect/product_development/product2.jpg";
import p_ux3 from "@/assets/portfolio_collect/product_development/product3.jpg";
import p_ux4 from "@/assets/portfolio_collect/product_development/product4.jpg";

import p_brand1 from "@/assets/portfolio_collect/brand_building/desktop.jpg";
import p_brand2 from "@/assets/portfolio_collect/brand_building/Goat-Milk.jpg";
import p_brand3 from "@/assets/portfolio_collect/brand_building/laptop.jpg";
import p_brand4 from "@/assets/portfolio_collect/brand_building/Mobile.jpg";

import p_webdesign1 from "@/assets/portfolio_collect/product_development/pools1.jpg";
import p_webdesign2 from "@/assets/portfolio_collect/product_development/pools2.jpg";
import p_webdesign3 from "@/assets/portfolio_collect/product_development/pools3.jpg";
import p_webdesign4 from "@/assets/portfolio_collect/product_development/pools4.jpg";

import p_webdev1 from "@/assets/portfolio_collect/websites/first/a1.jpg";
import p_webdev2 from "@/assets/portfolio_collect/websites/first/a2.jpg";
import p_webdev3 from "@/assets/portfolio_collect/websites/second/b1.jpg";
import p_webdev4 from "@/assets/portfolio_collect/websites/second/b2.jpg";

import p_marketing1 from "@/assets/portfolio_collect/growth-marketing/a1.jpg";
import p_marketing2 from "@/assets/portfolio_collect/growth-marketing/a2.jpg";

import p_ai1 from "@/assets/portfolio_collect/ai_automation/a1.jpg";
import p_ai2 from "@/assets/portfolio_collect/ai_automation/a2.jpg";

import p_app1 from "@/assets/portfolio_collect/app_development/Mobile.jpg";
import p_app2 from "@/assets/portfolio_collect/app_development/Mobile-1.jpg";
import p_app3 from "@/assets/portfolio_collect/app_development/Mobile-2.jpg";
import p_app4 from "@/assets/portfolio_collect/app_development/product1.jpg";

import p_pools1 from "@/assets/portfolio_collect/pools/pools1.jpg";
import p_pools2 from "@/assets/portfolio_collect/pools/pools2.jpg";

export interface ServiceData {
  slug: string;
  title: string;
  serviceType: string;
  subtitle: string;
  description: string;
  heroColor: string;
  heroImage: string;
  featureImage: string;
  portfolioImages?: string[];
  portfolioCaptions?: string[];
  seo: {
    title: string;
    description: string;
  };
  problemsSolved: string[];
  whoNeedsIt: string[];
  technologies: string[];
  industries: string[];
  benefits: {
    title: string;
    description: string;
  }[];
  process: {
    title: string;
    description: string;
  }[];
  relatedServices: { slug: string; title: string }[];
  relatedCaseStudies: { slug: string; title: string; subtitle: string }[];
  faqs: {
    q: string;
    a: string;
  }[];
}

export const servicesData: ServiceData[] = [
  {
    slug: "ai-software-development",
    title: "AI Software Development",
    serviceType: "AI Development",
    subtitle: "Custom generative AI applications, LLM integrations, and secure enterprise AI systems.",
    description:
      "StellR IT LLC engineers custom AI software tailored to real business workflows—not generic prompt wrappers. From production LLM integrations and Retrieval-Augmented Generation (RAG) architectures to predictive analytics and AI-native SaaS products, our Garland, Texas–based engineering team builds secure, scalable artificial intelligence systems that connect cleanly with your existing databases, CRMs, and cloud infrastructure.",
    heroColor: "#38bdf8",
    heroImage: aiImg,
    featureImage: aiImg,
    portfolioImages: [p_ai1, p_ai2],
    portfolioCaptions: [
      "Enterprise AI model diagnostics and real-time NLP classification dashboard",
      "Automated AI routing logs and model confidence monitoring interface",
    ],
    seo: {
      title: "Custom AI Software Development Company USA | StellR IT LLC",
      description:
        "Partner with StellR IT LLC for custom AI software development, generative AI applications, LLM integration, and enterprise AI consulting in Garland, TX and across the USA.",
    },
    problemsSolved: [
      "Disconnected off-the-shelf AI tools that cannot read proprietary databases or respect user permissions.",
      "AI prototypes stuck in proof-of-concept because of hallucination risk, high latency, or unpredictable token spend.",
      "Legacy software and ERPs that require manual data entry, document triage, or repetitive review.",
      "Data-privacy concerns preventing teams from using public AI interfaces with sensitive customer or corporate files.",
    ],
    whoNeedsIt: [
      "Mid-market and enterprise organizations modernizing operations with private, compliant AI systems.",
      "SaaS companies embedding generative AI copilots, semantic search, or automated insights into their products.",
      "Healthcare, financial, legal, and real estate teams processing high volumes of unstructured documents.",
      "CTOs and product leaders seeking an accountable US-based AI engineering partner from feasibility to production.",
    ],
    technologies: [
      "OpenAI API",
      "Anthropic Claude",
      "Google Gemini",
      "Llama & Open-Weight Models",
      "Python & FastAPI",
      "TypeScript & Node.js",
      "PostgreSQL pgvector",
      "Pinecone & Qdrant",
      "LangGraph & Vercel AI SDK",
      "AWS / GCP / Azure",
    ],
    industries: [
      "Enterprise SaaS",
      "Financial Services & Fintech",
      "Healthcare & Senior Care",
      "Real Estate & Construction",
      "E-Commerce & Wholesale Distribution",
      "Home & Field Services",
    ],
    benefits: [
      {
        title: "Production-Grade Architecture",
        description:
          "We engineer evaluation harnesses, caching layers, structured outputs, and fallback routing so your AI features remain reliable under real traffic.",
      },
      {
        title: "Private, Grounded Intelligence",
        description:
          "Connect LLMs exclusively to your verified company knowledge base via RAG and role-based access controls, with zero-data-retention enterprise endpoints.",
      },
      {
        title: "Deep System Integration",
        description:
          "Our engineers wire AI models directly into Salesforce, HubSpot, PostgreSQL, MongoDB, ERP APIs, and internal tools so AI drives real action.",
      },
      {
        title: "Full IP & Code Ownership",
        description:
          "You own the custom codebase, prompts, pipelines, and cloud deployment—eliminating vendor lock-in and per-seat SaaS markups.",
      },
    ],
    process: [
      {
        title: "AI Feasibility & ROI Audit",
        description:
          "Evaluate your workflows, data quality, security constraints, and unit economics to prioritize high-impact AI use cases.",
      },
      {
        title: "Data & Retrieval Pipeline",
        description:
          "Design ingestion, chunking, vector embeddings, and permission-aware retrieval pipelines over your proprietary documents and records.",
      },
      {
        title: "Model & Application Engineering",
        description:
          "Select optimal foundational or fine-tuned models, build backend orchestration and UI experiences, and integrate with existing APIs.",
      },
      {
        title: "Guardrails, Eval & Deployment",
        description:
          "Run adversarial red-teaming, hallucination testing, latency tuning, and observability setup before deploying to your cloud.",
      },
    ],
    relatedServices: [
      { slug: "ai-automation-agents", title: "AI Automation & Autonomous Agents" },
      { slug: "ai-chatbot-development", title: "Custom AI Chatbot & RAG Development" },
      { slug: "saas-development", title: "SaaS Development" },
      { slug: "dedicated-teams", title: "Dedicated Engineering Teams" },
    ],
    relatedCaseStudies: [
      {
        slug: "ai-automation",
        title: "Enterprise AI Automated Systems",
        subtitle: "Deploying autonomous AI support agent networks and automated task routing.",
      },
      {
        slug: "pool-supply-wholesalers",
        title: "Pool Supply Wholesalers",
        subtitle: "High-speed headless commerce storefront with real-time operations analytics.",
      },
    ],
    faqs: [
      {
        q: "What does an AI development company do?",
        a: "An AI development company designs, builds, integrates, and maintains custom software powered by machine learning and large language models (LLMs). At StellR IT LLC, this includes feasibility assessments, RAG knowledge pipelines, autonomous AI agents, custom chatbots, model evaluation, security guardrails, and full-stack application deployment.",
      },
      {
        q: "How much does custom AI software development cost?",
        a: "Project scope drives investment. Focused AI MVPs, internal RAG assistants, or single-workflow automations typically start around $10,000–$25,000, while multi-agent enterprise platforms with deep ERP/CRM integrations and compliance controls generally range from $35,000 to $100,000+.",
      },
      {
        q: "Is our corporate data kept private when using LLMs?",
        a: "Yes. We deploy enterprise API tiers with zero-data-retention policies (so providers do not train on your inputs) or self-hosted open-weight models inside your own VPC, paired with PII redaction and role-based access control.",
      },
      {
        q: "Can custom AI integrate with our existing CRM, ERP, or databases?",
        a: "Yes. We build secure API middleware and webhooks that let AI systems read and update records in Salesforce, HubSpot, SQL/NoSQL databases, ticketing platforms, and custom internal software with full audit logging.",
      },
    ],
  },
  {
    slug: "ai-automation-agents",
    title: "AI Automation & Autonomous Agents",
    serviceType: "AI Workflow Automation",
    subtitle: "Autonomous AI agents and workflow automation engineered to eliminate operational bottlenecks.",
    description:
      "StellR IT LLC designs and deploys enterprise AI automation and multi-step autonomous AI agents that classify tickets, process documents, qualify leads, sync CRM/ERP records, and trigger downstream business actions reliably. We combine deterministic workflow orchestration with LLM reasoning and human-in-the-loop approvals so your team scales output without scaling manual overhead.",
    heroColor: "#0ea5e9",
    heroImage: aiImg,
    featureImage: p_ai1,
    portfolioImages: [p_ai1, p_ai2],
    portfolioCaptions: [
      "Autonomous AI support agent network and real-time triage diagnostics",
      "Multi-agent workflow routing and confidence telemetry dashboard",
    ],
    seo: {
      title: "AI Automation Agency & AI Agent Development Company | StellR IT LLC",
      description:
        "Automate operations with custom AI workflow automation, autonomous AI agents, and AI customer support systems built by StellR IT LLC in Garland, TX for US & global businesses.",
    },
    problemsSolved: [
      "High-volume support queues, ticket triage backlogs, and slow first-response times.",
      "Repetitive back-office operations—copying data across emails, PDFs, spreadsheets, CRMs, and ERPs.",
      "Brittle no-code automations that break whenever document formats, phrasing, or edge cases change.",
      "Lack of audit trails, approval gates, and error recovery in automated operational pipelines.",
    ],
    whoNeedsIt: [
      "Operations, customer support, and RevOps leaders aiming to automate repetitive multi-system workflows.",
      "Service businesses, agencies, healthcare providers, and financial teams handling high inbound inquiry volumes.",
      "Enterprises needing supervised autonomous AI agents with strict sandboxing and human escalation rules.",
    ],
    technologies: [
      "LangGraph & Multi-Agent Orchestration",
      "OpenAI & Claude Tool Calling",
      "Python & Node.js Workers",
      "n8n / Temporal / Queue Workers",
      "Salesforce & HubSpot APIs",
      "Zendesk / Intercom / Slack",
      "PostgreSQL & Redis",
      "Structured JSON Guardrails",
    ],
    industries: [
      "Customer Operations & Support",
      "Financial & Advisory Services",
      "Healthcare Administration",
      "Real Estate & Property Management",
      "Logistics & Supply Chain",
      "B2B SaaS & Digital Agencies",
    ],
    benefits: [
      {
        title: "Goal-Driven Multi-Step Execution",
        description:
          "Unlike single-trigger scripts, autonomous AI agents plan steps, call verified tools/APIs, validate outputs, and escalate exceptions to humans.",
      },
      {
        title: "Human-in-the-Loop Safety",
        description:
          "Read-only sandboxing, confidence thresholds, and explicit approval checkpoints protect sensitive writes like refunds, billing, or account changes.",
      },
      {
        title: "24/7 Customer Support Automation",
        description:
          "Classify intent, resolve routine inquiries immediately from your knowledge base, and hand complex issues to specialists with complete summaries.",
      },
      {
        title: "Observable & Auditable Pipelines",
        description:
          "Every tool call, token cost, latency metric, and decision trace is logged so operations and security teams retain complete visibility.",
      },
    ],
    process: [
      {
        title: "Workflow Mapping & Bottleneck Audit",
        description:
          "Document manual touchpoints, systems involved, edge cases, and SLA targets to define clear automation boundaries.",
      },
      {
        title: "Agent Architecture & Tool Design",
        description:
          "Define structured schemas, least-privilege API tools, retry policies, and human-escalation triggers.",
      },
      {
        title: "Build, Sandbox & Stress Testing",
        description:
          "Develop agent graphs and test against historical tickets, edge cases, and adversarial inputs before touching production data.",
      },
      {
        title: "Staged Rollout & Telemetry",
        description:
          "Launch in shadow mode or supervised queues, verify accuracy, and monitor throughput and resolution quality continuously.",
      },
    ],
    relatedServices: [
      { slug: "ai-software-development", title: "AI Software Development" },
      { slug: "ai-chatbot-development", title: "Custom AI Chatbot & RAG Development" },
      { slug: "web-development", title: "Custom Web & Software Development" },
      { slug: "dedicated-teams", title: "Dedicated Engineering Teams" },
    ],
    relatedCaseStudies: [
      {
        slug: "ai-automation",
        title: "Enterprise AI Automated Systems",
        subtitle: "Deploying autonomous AI support agent networks and automated task routing.",
      },
    ],
    faqs: [
      {
        q: "What is enterprise AI automation?",
        a: "Enterprise AI automation combines large language models, machine learning classifiers, and backend API integrations to execute complex, unstructured business workflows—such as routing support tickets, extracting invoice or form data, updating CRMs, and drafting verified responses—with full security and auditability.",
      },
      {
        q: "How do autonomous AI agents work?",
        a: "An AI agent receives a goal or event, interprets unstructured input using an LLM, selects from a restricted set of approved software tools (APIs, database queries, email/CRM actions), verifies the result against business rules, and either completes the task or escalates to a human reviewer.",
      },
      {
        q: "How can businesses automate customer support using AI safely?",
        a: "Start by grounding the agent in verified help documentation via RAG, limiting it to read-only lookups and routine ticket triage first, enforcing strict confidence thresholds, and requiring seamless human handoff with conversation summaries for billing, legal, or sensitive account actions.",
      },
      {
        q: "How long does it take to deploy an AI workflow automation system?",
        a: "A focused single-workflow automation or support triage agent typically moves from scoping to pilot in 3 to 5 weeks. Multi-department agent networks with ERP/CRM integrations usually launch in 6 to 12 weeks.",
      },
    ],
  },
  {
    slug: "ai-chatbot-development",
    title: "Custom AI Chatbot & RAG Development",
    serviceType: "Conversational AI & RAG Development",
    subtitle: "Private, hallucination-resistant AI chatbots grounded in your business knowledge and live systems.",
    description:
      "StellR IT LLC builds custom AI chatbots and Retrieval-Augmented Generation (RAG) assistants engineered for accuracy, speed, and data security. Unlike rigid rule-based widgets or generic SaaS bots, our conversational AI solutions query your live documentation, product catalogs, and CRM APIs to answer customer questions, qualify leads, book appointments, and assist internal teams across web, mobile, Slack, and SMS.",
    heroColor: "#8b5cf6",
    heroImage: aiImg,
    featureImage: p_ai2,
    portfolioImages: [p_ai2, p_ai1],
    portfolioCaptions: [
      "Conversational AI routing diagnostics and grounded RAG retrieval monitoring",
      "Enterprise AI support console and automated response quality metrics",
    ],
    seo: {
      title: "Custom AI Chatbot & RAG Development Company | StellR IT LLC",
      description:
        "Build enterprise AI chatbots, RAG knowledge assistants, and LLM-powered conversational AI with StellR IT LLC. Accurate, private, and integrated with your CRM & APIs.",
    },
    problemsSolved: [
      "Frustrating decision-tree chatbots that fail whenever users ask natural, nuanced questions.",
      "AI chat widgets that hallucinate policies, pricing, or product details because they lack grounded retrieval.",
      "Slow lead response times outside business hours causing prospective buyers to bounce to competitors.",
      "Internal teams wasting hours searching across PDFs, wikis, Slack threads, and SOP manuals.",
    ],
    whoNeedsIt: [
      "B2B and B2C brands wanting 24/7 lead qualification, appointment booking, and instant product Q&A.",
      "Enterprise organizations building private internal knowledge-base assistants over SOPs, policies, and docs.",
      "SaaS and eCommerce platforms adding conversational product discovery or in-app AI copilots.",
    ],
    technologies: [
      "Retrieval-Augmented Generation (RAG)",
      "Hybrid Semantic + Keyword Search",
      "PostgreSQL pgvector / Pinecone / Qdrant",
      "OpenAI / Anthropic Claude / Gemini",
      "Streaming WebSockets & SSE",
      "React / Next.js Custom Widgets",
      "Salesforce / HubSpot / Calendly APIs",
      "NeMo & Custom Guardrails",
    ],
    industries: [
      "SaaS & Technology",
      "E-Commerce & Retail",
      "Healthcare & Dental Practices",
      "Real Estate & Home Services",
      "Financial & Legal Firms",
      "Education & Training",
    ],
    benefits: [
      {
        title: "Grounded Answers With Citations",
        description:
          "Hybrid vector + keyword RAG retrieval ensures responses draw strictly from your approved documents, catalogs, and policies—dramatically reducing hallucinations.",
      },
      {
        title: "Action-Capable Conversational AI",
        description:
          "Move beyond static Q&A: capture qualified leads, look up order statuses, schedule discovery calls, and sync transcripts directly into your CRM.",
      },
      {
        title: "Omnichannel Brand Consistency",
        description:
          "Deploy one governed AI core across your website widget, mobile app, WhatsApp, Slack, or SMS with consistent tone and guardrails.",
      },
      {
        title: "Zero Per-Seat Licensing Lock-In",
        description:
          "Own your custom chatbot codebase and vector infrastructure outright, paying only transparent cloud and model usage costs.",
      },
    ],
    process: [
      {
        title: "Knowledge Audit & Data Ingestion",
        description:
          "Collect, clean, chunk, and index your websites, PDFs, help articles, and structured catalogs into an encrypted vector database.",
      },
      {
        title: "RAG Retrieval & Prompt Engineering",
        description:
          "Implement hybrid retrieval, reranking, citation grounding, and brand-voice system instructions.",
      },
      {
        title: "UI Widget & CRM Integration",
        description:
          "Build a lightweight, streaming chat interface and connect lead capture, ticketing, and scheduling APIs.",
      },
      {
        title: "Guardrails, Red-Teaming & Launch",
        description:
          "Test against prompt injection, off-topic queries, and edge cases; deploy with live resolution and feedback analytics.",
      },
    ],
    relatedServices: [
      { slug: "ai-software-development", title: "AI Software Development" },
      { slug: "ai-automation-agents", title: "AI Automation & Autonomous Agents" },
      { slug: "web-development", title: "Custom Web & Software Development" },
      { slug: "ux-research-strategy", title: "UX Research & Strategy" },
    ],
    relatedCaseStudies: [
      {
        slug: "ai-automation",
        title: "Enterprise AI Automated Systems",
        subtitle: "Deploying autonomous AI support agent networks and automated task routing.",
      },
    ],
    faqs: [
      {
        q: "What is Retrieval-Augmented Generation (RAG)?",
        a: "Retrieval-Augmented Generation (RAG) is an architecture that searches your private, up-to-date documents and databases at question time, retrieves the most relevant verified passages, and passes them to an LLM so it generates grounded, accurate answers without retraining the base model.",
      },
      {
        q: "How much does it cost to develop a custom AI chatbot?",
        a: "A focused RAG website chatbot or lead-qualification assistant typically ranges from $8,000 to $18,000. Enterprise omnichannel chatbots with CRM/ERP tool actions, authentication, and strict compliance guardrails generally range from $20,000 to $45,000+.",
      },
      {
        q: "How do you prevent an AI chatbot from hallucinating?",
        a: "We combine hybrid vector and keyword search, relevance reranking, strict grounding prompts that instruct the model to abstain when evidence is absent, automated eval suites, and human handoff triggers for low-confidence queries.",
      },
      {
        q: "Can the chatbot escalate conversations to a live human agent?",
        a: "Yes. Our chatbots support real-time human takeover—transferring the full conversation transcript and detected customer intent directly to your live support dashboard, Slack, or help desk.",
      },
    ],
  },
  {
    slug: "web-development",
    title: "Custom Web & Software Development",
    serviceType: "Custom Software & Web Development",
    subtitle: "Enterprise-grade web applications, custom business software, headless commerce, and APIs.",
    description:
      "StellR IT LLC builds fast, secure, maintainable web applications and custom business software using modern TypeScript, React, Next.js, Node.js, and Python stacks. Whether you need a high-converting marketing platform with a headless CMS, a headless eCommerce storefront, a custom operational portal, or a mission-critical API layer, we engineer performance, SEO crawlability, and security into the foundation.",
    heroColor: "#7a2adc",
    heroImage: webDevImg,
    featureImage: webDevImg,
    portfolioImages: [p_webdev1, p_webdev2, p_webdev3, p_webdev4],
    portfolioCaptions: [
      "Harmony Residential Care accessible healthcare web platform",
      "Care programs overview and conversion-focused page layout",
      "Revitalize Real Estate property listings and local SEO web application",
      "Interactive remodeling gallery and quote estimation platform",
    ],
    seo: {
      title: "Custom Web & Software Development Company USA | StellR IT LLC",
      description:
        "Full-stack custom software development, web applications, Next.js/React engineering, headless eCommerce, and API development by StellR IT LLC in Garland, TX.",
    },
    problemsSolved: [
      "Slow, bloated legacy websites and CMS templates that fail Core Web Vitals and lose organic rankings.",
      "Fragmented spreadsheets and SaaS subscriptions that cannot support proprietary business workflows.",
      "Unreliable third-party integrations, brittle APIs, and security vulnerabilities in aging codebases.",
      "Engineering bottlenecks that delay product releases and hold back revenue growth.",
    ],
    whoNeedsIt: [
      "Growing businesses replacing off-the-shelf templates or legacy systems with custom software.",
      "E-commerce and wholesale distributors upgrading to headless storefronts and real-time operations dashboards.",
      "Enterprises needing modern React/Next.js web portals, customer dashboards, and secure API architectures.",
    ],
    technologies: [
      "TypeScript & JavaScript",
      "React & Next.js",
      "TanStack Start & Vite",
      "Node.js & Python",
      "PostgreSQL & MongoDB",
      "REST & GraphQL APIs",
      "Headless Commerce & Stripe",
      "AWS / GCP / Vercel",
    ],
    industries: [
      "E-Commerce & Wholesale",
      "Real Estate & Construction",
      "Healthcare & Assisted Living",
      "Financial Services",
      "B2B Services & Enterprises",
    ],
    benefits: [
      {
        title: "SSR Speed & Technical SEO Built In",
        description:
          "We engineer server-side rendering, edge caching, clean semantic HTML, and Core Web Vitals optimization from day one so pages load fast and index cleanly.",
      },
      {
        title: "Security-First Architecture",
        description:
          "Role-based access control, encrypted data handling, input validation, and hardened HTTP headers protect your application and user trust.",
      },
      {
        title: "Seamless API & System Integrations",
        description:
          "Connect your web application reliably to Salesforce, HubSpot, Stripe, Algolia, ERP databases, and custom AI microservices.",
      },
      {
        title: "100% Intellectual Property Ownership",
        description:
          "Upon completion, your organization owns the full source code, documentation, and cloud deployment infrastructure.",
      },
    ],
    process: [
      {
        title: "Architecture & Technical Scoping",
        description:
          "Define data models, API contracts, stack selection, security requirements, and milestone deliverables.",
      },
      {
        title: "Agile Sprint Engineering",
        description:
          "Build frontend and backend features in transparent two-week sprints with live staging previews.",
      },
      {
        title: "QA, Performance & Accessibility",
        description:
          "Run automated and manual testing across devices, validate WCAG accessibility, and tune LCP/INP/CLS.",
      },
      {
        title: "Zero-Downtime Launch & Support",
        description:
          "Deploy via CI/CD pipelines with monitoring, error capture, and optional ongoing maintenance SLAs.",
      },
    ],
    relatedServices: [
      { slug: "saas-development", title: "SaaS Development" },
      { slug: "ai-software-development", title: "AI Software Development" },
      { slug: "web-product-design", title: "Web & Product Design" },
      { slug: "digital-marketing", title: "Digital Marketing, SEO & CRO" },
    ],
    relatedCaseStudies: [
      {
        slug: "pool-supply-wholesalers",
        title: "Pool Supply Wholesalers",
        subtitle: "Headless Next.js storefront with real-time sales and inventory dashboard.",
      },
      {
        slug: "harmony-residential-care",
        title: "Harmony Residential Care",
        subtitle: "WCAG-compliant healthcare website and secure family inquiry system.",
      },
    ],
    faqs: [
      {
        q: "How long does custom software or web application development take?",
        a: "Marketing platforms and focused custom web applications typically launch in 4 to 8 weeks. Complex business portals, headless eCommerce builds, and integrated enterprise platforms generally take 8 to 16 weeks depending on integrations and scope.",
      },
      {
        q: "What technologies do you specialize in for web development?",
        a: "Our core stack is TypeScript across the full stack—React, Next.js, and TanStack Start on the frontend; Node.js and Python on the backend; PostgreSQL and MongoDB for databases; and AWS, GCP, or Vercel for cloud hosting.",
      },
      {
        q: "Can StellR IT modernize or take over an existing codebase?",
        a: "Yes. We regularly audit existing applications, resolve performance and security bottlenecks, refactor legacy frontends/APIs, and take over ongoing feature delivery.",
      },
      {
        q: "Who owns the source code and intellectual property?",
        a: "You do. Upon final payment, full intellectual property rights and source code ownership transfer to your business, as outlined in your Statement of Work.",
      },
    ],
  },
  {
    slug: "saas-development",
    title: "SaaS Development",
    serviceType: "SaaS Product Development",
    subtitle: "End-to-end architecture and engineering for multi-tenant, AI-ready software products.",
    description:
      "Building a durable Software as a Service (SaaS) product demands scalable multi-tenant architecture, clean data isolation, seamless subscription billing, and an intuitive product interface. StellR IT LLC partners with founders and enterprises from MVP validation through enterprise scaling—delivering secure APIs, role-based access control, AI feature integration, and resilient cloud DevOps.",
    heroColor: "#3b82f6",
    heroImage: productHeroImg,
    featureImage: p_ux3,
    portfolioImages: [p_ux3, p_ux4, p_webdesign3, p_webdesign4],
    portfolioCaptions: [
      "SaaS design system component architecture and typography mapping",
      "Fintech SaaS onboarding and conversion dashboard interface",
      "Real-time operational analytics and customer telemetry panel",
      "Billing and account management SaaS interface",
    ],
    seo: {
      title: "SaaS Development Company USA | Multi-Tenant Architecture | StellR IT LLC",
      description:
        "End-to-end SaaS application development from MVP to enterprise scale. Multi-tenant databases, Stripe billing, RBAC security, and AI features by StellR IT LLC.",
    },
    problemsSolved: [
      "Slow MVP timelines that burn runway before validating product-market fit with real customers.",
      "Single-tenant or poorly isolated prototypes that cannot pass enterprise security reviews.",
      "Fragile subscription billing, seat management, and permission bugs causing revenue leakage.",
      "High onboarding drop-off caused by unintuitive dashboards and sluggish frontend performance.",
    ],
    whoNeedsIt: [
      "Funded and bootstrapped founders launching a B2B or B2C SaaS MVP.",
      "Established software companies re-architecting legacy desktop or monolithic software into cloud SaaS.",
      "Product teams adding AI copilots, multi-tenant permissions, or enterprise SSO to an existing platform.",
    ],
    technologies: [
      "Next.js & React",
      "TypeScript & Node.js",
      "Python & FastAPI",
      "PostgreSQL (RLS) & MongoDB",
      "Stripe & Paddle Billing",
      "OAuth 2.0 / SAML SSO / RBAC",
      "Docker, AWS & GCP",
      "OpenAI / Claude API Integrations",
    ],
    industries: [
      "Fintech & Wealth Advisory",
      "B2B Productivity & Workflow",
      "Healthcare & Practice Management",
      "PropTech & Real Estate",
      "Commerce & Operations Analytics",
    ],
    benefits: [
      {
        title: "Secure Multi-Tenant Architecture",
        description:
          "Clean tenant isolation via PostgreSQL row-level security or dedicated schemas keeps customer data strictly separated while maintaining one codebase.",
      },
      {
        title: "Subscription & Usage Billing",
        description:
          "Production Stripe or Paddle integrations supporting tiered plans, seat pricing, metered AI usage, trials, prorations, and automated invoicing.",
      },
      {
        title: "Enterprise-Ready Access Control",
        description:
          "Granular Role-Based Access Control (RBAC), audit trails, SSO readiness, and encrypted secrets built for B2B procurement teams.",
      },
      {
        title: "Cloud-Native Reliability",
        description:
          "Automated CI/CD, observability, horizontal scaling, and backup strategies engineered for dependable uptime.",
      },
    ],
    process: [
      {
        title: "Product Scope & Architecture",
        description:
          "Prioritize high-value MVP features, design the multi-tenant data schema, and map user journeys.",
      },
      {
        title: "UX/UI & Core Engineering",
        description:
          "Build a reusable design system alongside the backend APIs, authentication, and frontend workflows.",
      },
      {
        title: "Billing, Permissions & Integrations",
        description:
          "Wire subscription billing, organization roles, webhooks, and third-party CRM or AI integrations.",
      },
      {
        title: "Launch, Telemetry & Iteration",
        description:
          "Deploy to production cloud infrastructure with analytics and iterate rapidly on real user adoption data.",
      },
    ],
    relatedServices: [
      { slug: "web-development", title: "Custom Web & Software Development" },
      { slug: "ai-software-development", title: "AI Software Development" },
      { slug: "ux-research-strategy", title: "UX Research & Strategy" },
      { slug: "dedicated-teams", title: "Dedicated Engineering Teams" },
    ],
    relatedCaseStudies: [
      {
        slug: "ux-ui-conversions",
        title: "Finvise SaaS Product Design",
        subtitle: "Redesigning Finvise onboarding and dashboard UX to lift signup completion.",
      },
      {
        slug: "pool-supply-wholesalers",
        title: "Pool Supply Wholesalers",
        subtitle: "Headless commerce storefront paired with a real-time operations SaaS dashboard.",
      },
    ],
    faqs: [
      {
        q: "What is the difference between custom software and SaaS?",
        a: "Custom software is built specifically for one organization's internal workflows and owned exclusively by that company, whereas SaaS (Software as a Service) is a cloud-hosted product built to serve multiple subscribing customers (tenants) simultaneously. StellR IT LLC builds both custom internal software and commercial multi-tenant SaaS products.",
      },
      {
        q: "How long does it take to build a SaaS MVP?",
        a: "A focused, launch-ready SaaS MVP with authentication, core workflows, and subscription billing typically takes 6 to 10 weeks. Full-featured enterprise SaaS platforms generally take 12 to 20 weeks.",
      },
      {
        q: "How do you handle multi-tenancy and customer data isolation?",
        a: "We architect multi-tenant isolation using PostgreSQL Row-Level Security (RLS), tenant-scoped API authorization middleware, or separate database schemas depending on your compliance and enterprise buyer requirements.",
      },
      {
        q: "Can you integrate AI features into our SaaS product?",
        a: "Yes. We routinely build AI copilots, document summarization, RAG search, and metered LLM usage tracking directly into SaaS platforms.",
      },
    ],
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    serviceType: "Mobile Application Development",
    subtitle: "High-performance iOS, Android, React Native, and Flutter mobile applications.",
    description:
      "StellR IT LLC designs and engineers reliable mobile applications for iOS and Android. We specialize in cross-platform React Native and Flutter engineering for faster time-to-market and shared business logic, as well as native Swift and Kotlin modules where deep hardware integration or maximum graphics performance is required.",
    heroColor: "#10b981",
    heroImage: appHeroImg,
    featureImage: p_app3,
    portfolioImages: [p_app1, p_app2, p_app3, p_app4],
    portfolioCaptions: [
      "Ping Buz mobile application home screen and notification UI",
      "Real-time mobile chat interface with low-latency WebSocket sync",
      "Cross-platform iOS and Android mobile experience showcase",
      "Mobile wallet and transaction interface design",
    ],
    seo: {
      title: "Mobile App Development Company USA | iOS, Android & React Native | StellR IT",
      description:
        "Custom iOS, Android, React Native, and Flutter mobile app development by StellR IT LLC. Fast, reliable cross-platform and native mobile apps built in Garland, TX.",
    },
    problemsSolved: [
      "Sluggish hybrid apps with janky scrolling, high crash rates, and poor App Store reviews.",
      "High cost and slow velocity from maintaining two completely separate iOS and Android teams.",
      "Real-time messaging, offline sync, and push-notification reliability bugs on older devices.",
      "App Store and Google Play review rejections delaying product launches.",
    ],
    whoNeedsIt: [
      "Consumer and B2B startups launching cross-platform iOS and Android apps.",
      "Enterprises extending web/SaaS platforms with mobile companion apps for customers or field staff.",
      "Product teams refactoring slow or crash-prone legacy mobile applications.",
    ],
    technologies: [
      "React Native & Expo",
      "Flutter & Dart",
      "Swift (iOS) & Kotlin (Android)",
      "TypeScript & Node.js APIs",
      "WebSockets & Real-Time Sync",
      "Firebase / Push Notifications",
      "Offline Local Storage & SQLite",
      "App Store & Play Console CI/CD",
    ],
    industries: [
      "Social & Real-Time Communications",
      "Fintech & Payments",
      "Healthcare & Wellness",
      "On-Demand & Home Services",
      "Retail & E-Commerce",
    ],
    benefits: [
      {
        title: "Native-Grade Fluidity",
        description:
          "GPU-accelerated navigation, careful re-render control, and platform-native UX conventions keep interactions smooth across devices.",
      },
      {
        title: "Single-Codebase Efficiency",
        description:
          "React Native and Flutter let you ship simultaneously to iOS and Android with faster iteration cycles and lower total engineering cost.",
      },
      {
        title: "Offline-First & Real-Time Ready",
        description:
          "Local caching and resilient WebSocket synchronization keep your app responsive even on flaky cellular networks.",
      },
      {
        title: "End-to-End Store Deployment",
        description:
          "We manage signing, beta testing (TestFlight / Play Console), privacy declarations, and store approval submissions.",
      },
    ],
    process: [
      {
        title: "Mobile UX & Prototyping",
        description:
          "Design thumb-friendly navigation, gestures, and responsive layouts tailored to iOS and Android patterns.",
      },
      {
        title: "API & Real-Time Backend",
        description:
          "Architect secure REST, GraphQL, or WebSocket services with token auth and push notification pipelines.",
      },
      {
        title: "App Engineering & Device QA",
        description:
          "Build screens, local caching, and native bridges, then test across physical iOS and Android hardware.",
      },
      {
        title: "Store Submission & Telemetry",
        description:
          "Publish to Apple App Store and Google Play with crash reporting, analytics, and OTA update workflows.",
      },
    ],
    relatedServices: [
      { slug: "web-product-design", title: "Web & Product Design" },
      { slug: "saas-development", title: "SaaS Development" },
      { slug: "ai-chatbot-development", title: "Custom AI Chatbot & RAG Development" },
      { slug: "dedicated-teams", title: "Dedicated Engineering Teams" },
    ],
    relatedCaseStudies: [
      {
        slug: "app-development",
        title: "Ping Buz Mobile Application",
        subtitle: "Cross-platform React Native application with real-time WebSocket messaging.",
      },
    ],
    faqs: [
      {
        q: "Should we build a native app or a cross-platform React Native / Flutter app?",
        a: "For most business, SaaS, and consumer applications, React Native or Flutter is the most practical choice—delivering near-native performance across iOS and Android from one codebase. Fully native Swift/Kotlin is mainly warranted for heavy 3D graphics or specialized low-level hardware features.",
      },
      {
        q: "How long does mobile app development take?",
        a: "An MVP mobile application typically takes 8 to 12 weeks from UX design through App Store and Google Play submission. Feature-rich real-time or enterprise apps generally take 12 to 20 weeks.",
      },
      {
        q: "Do you handle Apple App Store and Google Play Store submissions?",
        a: "Yes. We handle build signing, TestFlight and Play Console testing tracks, store compliance checklists, and review submission support.",
      },
    ],
  },
  {
    slug: "dedicated-teams",
    title: "Dedicated Engineering Teams",
    serviceType: "IT Staff Augmentation & Dedicated Teams",
    subtitle: "Senior AI engineers, full-stack developers, designers, and QA embedded directly in your workflow.",
    description:
      "StellR IT LLC provides dedicated remote software and AI engineering teams for US enterprises, fast-growing startups, and digital agencies. Skip months of recruiting overhead and embed pre-vetted senior full-stack engineers, AI/ML specialists, product designers, QA engineers, and DevOps talent who work in your Slack, Jira, and GitHub with US timezone overlap.",
    heroColor: "#f43f5e",
    heroImage: webDevImg,
    featureImage: p_webdev1,
    portfolioImages: [p_webdev1, p_webdev2, p_pools1, p_pools2],
    portfolioCaptions: [
      "Enterprise healthcare web platform delivered by a dedicated engineering pod",
      "Accessible multi-page frontend engineered with React and TypeScript",
      "Headless eCommerce platform scaled with dedicated full-stack developers",
      "Real-time sales and inventory analytics dashboard engineering",
    ],
    seo: {
      title: "Hire Dedicated AI & Software Developers | Staff Augmentation | StellR IT LLC",
      description:
        "Hire dedicated AI developers, full-stack software engineers, and managed remote engineering teams from StellR IT LLC. Flexible staff augmentation with US timezone alignment.",
    },
    problemsSolved: [
      "3-to-6-month local hiring cycles that stall critical product roadmaps and AI initiatives.",
      "High fully-loaded engineering costs, recruiting fees, and HR/payroll administration.",
      "Unreliable freelancers who disappear mid-sprint or ship undocumented code.",
      "Digital agencies turning down client work because internal dev capacity is maxed out.",
    ],
    whoNeedsIt: [
      "CTOs and VPs of Engineering scaling AI, React/Next.js, Python, or mobile delivery capacity.",
      "Digital and creative agencies needing reliable white-label development partners.",
      "Startups needing a cross-functional product squad (designer + senior engineers + QA) without long-term fixed overhead.",
    ],
    technologies: [
      "AI / LLM Engineers (Python, RAG, Agents)",
      "Full-Stack TypeScript (React, Next.js, Node.js)",
      "Mobile (React Native, Flutter)",
      "UI/UX Product Designers (Figma)",
      "QA Automation & DevOps (AWS, GCP, CI/CD)",
      "Slack, Jira, Linear, GitHub Workflows",
    ],
    industries: [
      "Digital & Creative Agencies",
      "B2B & Enterprise SaaS",
      "Fintech & E-Commerce",
      "Healthcare & Real Estate Tech",
      "High-Growth Startups",
    ],
    benefits: [
      {
        title: "Rapid Onboarding",
        description:
          "Skip lengthy recruiting pipelines—interview shortlisted senior engineers and start shipping inside your repositories quickly.",
      },
      {
        title: "US Timezone Overlap & Direct Communication",
        description:
          "Managed from Garland, Texas with real-time overlap across EST, CST, and PST for standups, code reviews, and sprint demos.",
      },
      {
        title: "Flexible Scaling & Transparent Models",
        description:
          "Scale individual specialists or full multi-disciplinary squads up or down cleanly as your roadmap evolves.",
      },
      {
        title: "Accountable Engineering Standards",
        description:
          "Every engineer follows your Git workflows, PR reviews, testing standards, and security policies—backed by dedicated account oversight.",
      },
    ],
    process: [
      {
        title: "Technical & Role Alignment",
        description:
          "Define exact stack requirements, seniority level, timezone overlap, and communication cadence.",
      },
      {
        title: "Candidate Vetting & Interviews",
        description:
          "Review curated senior profiles and conduct technical interviews so you have final approval on every team member.",
      },
      {
        title: "Workflow Integration",
        description:
          "Onboard engineers directly into your Slack, Jira/Linear, GitHub, and security protocols.",
      },
      {
        title: "Ongoing Delivery & Oversight",
        description:
          "Receive regular velocity check-ins, HR/admin coverage, and rapid replacement guarantees if needs shift.",
      },
    ],
    relatedServices: [
      { slug: "ai-software-development", title: "AI Software Development" },
      { slug: "web-development", title: "Custom Web & Software Development" },
      { slug: "saas-development", title: "SaaS Development" },
      { slug: "mobile-app-development", title: "Mobile App Development" },
    ],
    relatedCaseStudies: [
      {
        slug: "pool-supply-wholesalers",
        title: "Pool Supply Wholesalers",
        subtitle: "Headless commerce storefront and real-time admin sales dashboard.",
      },
      {
        slug: "ai-automation",
        title: "Enterprise AI Automated Systems",
        subtitle: "Autonomous AI support agents and workflow orchestration.",
      },
    ],
    faqs: [
      {
        q: "How do I hire dedicated AI or software developers from StellR IT LLC?",
        a: "Reach out through our contact page, email info@stellrit.com, or call (214) 838-0543 with your stack and timeline. We align on requirements, share vetted senior engineer profiles for your technical interview, and onboard selected engineers directly into your tools.",
      },
      {
        q: "What timezones do your dedicated engineers work in?",
        a: "Our teams provide working-hour overlap with US Central (CST), Eastern (EST), and Pacific (PST) business hours—as well as UK/European windows—so standups and collaboration happen in real time.",
      },
      {
        q: "Can we interview developers before committing?",
        a: "Yes. You interview and approve every engineer before they join your team, and we provide a seamless replacement policy if a role fit ever changes.",
      },
      {
        q: "Do you offer white-label development teams for digital agencies?",
        a: "Yes. We support agencies with confidential white-label engineering, AI integration, web development, and UX/UI design under strict NDA.",
      },
    ],
  },
  {
    slug: "ux-research-strategy",
    title: "UX Research & Strategy",
    serviceType: "UX Research & Strategy",
    subtitle: "Strategy-led UX research and interface architecture engineered to convert and retain users.",
    description:
      "We engineer digital experiences rooted in user behavior and business outcomes—not guesswork. Our UX research uncovers the exact onboarding, navigation, and checkout friction costing you leads and revenue, while our information architecture and interactive prototyping validate every flow before engineering begins.",
    heroColor: "#a855f7",
    heroImage: uxImg,
    featureImage: uxImg,
    portfolioImages: [p_ux1, p_ux2, p_webdesign1, p_webdesign2],
    portfolioCaptions: [
      "Fintech analytics and portfolio UX dashboard layout",
      "Streamlined 4-field mobile onboarding flow",
      "E-commerce catalog architecture and search UX wireframe",
      "Conversion-optimized product navigation and filter system",
    ],
    seo: {
      title: "UX Research & Product Strategy Agency USA | StellR IT LLC",
      description:
        "Conversion-focused UX research, usability testing, information architecture, and SaaS UX strategy from StellR IT LLC. Reduce churn and lift signups.",
    },
    problemsSolved: [
      "High bounce rates and form abandonment on pricing, signup, or checkout pages.",
      "Complex B2B SaaS dashboards that overwhelm new users and drive early churn.",
      "Expensive engineering rework caused by building unvalidated product assumptions.",
    ],
    whoNeedsIt: [
      "SaaS and fintech teams optimizing onboarding, activation, and retention.",
      "E-commerce and lead-gen brands seeking measurable lifts in signup and checkout conversion.",
      "Enterprises modernizing legacy portals into intuitive, WCAG-accessible experiences.",
    ],
    technologies: [
      "Figma & FigJam",
      "User Interviews & Usability Testing",
      "Heuristic & Funnel Audits",
      "Information Architecture Mapping",
      "Interactive Prototyping",
      "GA4 & Behavioral Analytics",
    ],
    industries: [
      "Fintech & SaaS",
      "Healthcare & Elder Care",
      "E-Commerce & Wholesale",
      "Real Estate & Services",
    ],
    benefits: [
      {
        title: "Higher Conversion Rates",
        description:
          "Eliminating cognitive load, unnecessary form fields, and unclear hierarchy lifts signups and qualified inquiries.",
      },
      {
        title: "Lower Churn & Support Load",
        description:
          "Calm, self-explanatory workflows help users reach value faster with fewer support tickets.",
      },
      {
        title: "Reduced Engineering Rework",
        description:
          "Validating prototypes with real users before coding avoids costly post-launch rebuilds.",
      },
      {
        title: "Empirical Design Decisions",
        description:
          "Every layout decision is grounded in funnel analytics, usability testing, and user interviews.",
      },
    ],
    process: [
      {
        title: "Discovery & Funnel Audit",
        description:
          "Analyze analytics, user flows, competitors, and drop-off points to pinpoint high-impact opportunities.",
      },
      {
        title: "Qualitative User Research",
        description:
          "Run stakeholder workshops, user interviews, and behavioral reviews to uncover real motivations and blockers.",
      },
      {
        title: "Information Architecture",
        description:
          "Structure navigation, content hierarchy, and user journeys so key actions feel effortless.",
      },
      {
        title: "Prototyping & Usability Testing",
        description:
          "Build clickable Figma prototypes and test them with target users prior to visual polish and code.",
      },
    ],
    relatedServices: [
      { slug: "web-product-design", title: "Web & Product Design" },
      { slug: "saas-development", title: "SaaS Development" },
      { slug: "digital-marketing", title: "Digital Marketing, SEO & CRO" },
      { slug: "web-development", title: "Custom Web & Software Development" },
    ],
    relatedCaseStudies: [
      {
        slug: "ux-ui-conversions",
        title: "Finvise SaaS Product Design",
        subtitle: "Redesigning Finvise onboarding to reduce bounce rates and maximize signups.",
      },
      {
        slug: "harmony-residential-care",
        title: "Harmony Residential Care",
        subtitle: "Compassionate, WCAG-accessible elder care UX and inquiry funnel.",
      },
    ],
    faqs: [
      {
        q: "How long does a UX research and strategy phase typically take?",
        a: "A focused UX audit and prototyping sprint usually takes 2 to 4 weeks; full enterprise product discovery and usability testing typically spans 4 to 6 weeks.",
      },
      {
        q: "Do you design UX for both B2B SaaS and B2C products?",
        a: "Yes. We design data-dense B2B SaaS applications, operational dashboards, and conversion-focused B2C web and mobile experiences.",
      },
      {
        q: "What deliverables do we receive from UX Research & Strategy?",
        a: "Deliverables include audit findings, user personas and journey maps, information architecture, wireframes, interactive Figma prototypes, and prioritized implementation recommendations.",
      },
    ],
  },
  {
    slug: "web-product-design",
    title: "Web & Product Design",
    serviceType: "UI/UX & Product Design",
    subtitle: "Cohesive design systems and conversion-focused interfaces built for real engineering teams.",
    description:
      "We bridge visual craft and engineering feasibility. Whether designing a flagship corporate web platform, a multi-tenant SaaS application, or a mobile app, StellR IT LLC builds scalable Figma design systems, responsive layouts, and developer-ready handoffs that look distinctive and ship cleanly across desktop and mobile.",
    heroColor: "#cc7aff",
    heroImage: webProductImg,
    featureImage: webProductImg,
    portfolioImages: [p_webdesign1, p_webdesign2, p_webdesign3, p_webdesign4],
    portfolioCaptions: [
      "Headless eCommerce storefront UI and search experience",
      "Enterprise admin analytics dashboard design system",
      "Real-time sales and inventory visualization cards",
      "Responsive checkout and mobile order management UI",
    ],
    seo: {
      title: "UI/UX & Digital Product Design Agency USA | StellR IT LLC",
      description:
        "Scalable design systems, SaaS UI design, and custom web product design engineered for conversion and developer handoff by StellR IT LLC.",
    },
    problemsSolved: [
      "Inconsistent interfaces stitched together over years without a unified component system.",
      "Pretty mockups that ignore responsive breakpoints, accessibility contrast, or real data states.",
      "Slow frontend delivery caused by ambiguous design handoffs.",
    ],
    whoNeedsIt: [
      "SaaS founders and product managers elevating product polish and usability.",
      "Brands redesigning marketing sites to improve credibility, speed, and lead conversion.",
      "Engineering teams needing a clean, token-driven component library in Figma.",
    ],
    technologies: [
      "Figma Design Systems & Variables",
      "WCAG 2.1 AA Accessibility",
      "Interactive Motion & Micro-Interactions",
      "Responsive Mobile-First Grids",
      "Tailwind CSS & Component Tokens",
    ],
    industries: [
      "SaaS & AI Products",
      "E-Commerce & Wholesale",
      "Fintech & Advisory",
      "Healthcare & Real Estate",
    ],
    benefits: [
      {
        title: "Component-Based Design Systems",
        description:
          "Reusable tokens, typography scales, and component states accelerate engineering velocity and keep future screens consistent.",
      },
      {
        title: "Cross-Device Responsiveness",
        description:
          "Every layout is crafted purposefully for desktop, tablet, and mobile viewports—not shrunk down as an afterthought.",
      },
      {
        title: "WCAG Accessibility Built In",
        description:
          "Readable typography, strong color contrast, and keyboard-friendly focus states improve usability for every visitor.",
      },
      {
        title: "Zero-Friction Engineering Handoff",
        description:
          "Our designers sit directly alongside our engineers, delivering clean specs and edge-case states ready for production code.",
      },
    ],
    process: [
      {
        title: "Wireframing & Layout Architecture",
        description:
          "Establish clear content hierarchy, calls to action, and responsive grids before visual styling.",
      },
      {
        title: "High-Fidelity Visual UI",
        description:
          "Apply brand identity, typography, color systems, and data visualization across key screens.",
      },
      {
        title: "Interactive Motion & States",
        description:
          "Specify empty, loading, error, and hover/focus states plus purposeful micro-interactions.",
      },
      {
        title: "Design System & Handoff",
        description:
          "Deliver organized Figma libraries, tokens, and specs—or transition straight to our engineering team.",
      },
    ],
    relatedServices: [
      { slug: "ux-research-strategy", title: "UX Research & Strategy" },
      { slug: "web-development", title: "Custom Web & Software Development" },
      { slug: "brand-identity", title: "Brand Identity Design" },
      { slug: "saas-development", title: "SaaS Development" },
    ],
    relatedCaseStudies: [
      {
        slug: "ux-ui-conversions",
        title: "Finvise SaaS Product Design",
        subtitle: "Frictionless SaaS onboarding and analytics dashboard redesign.",
      },
      {
        slug: "pool-supply-wholesalers",
        title: "Pool Supply Wholesalers",
        subtitle: "E-commerce storefront and integrated operations dashboard UI.",
      },
    ],
    faqs: [
      {
        q: "What design tools do you use?",
        a: "We standardize on Figma for UI/UX design, component systems, interactive prototyping, and real-time collaboration with your team.",
      },
      {
        q: "Can StellR IT also engineer the products you design?",
        a: "Yes. As a full-stack software and AI engineering company, our frontend, backend, and mobile engineers work directly with our product designers to build what we design.",
      },
      {
        q: "What is included in a design system?",
        a: "A design system includes design tokens (color, typography, spacing, elevation), reusable UI components with interactive states, responsive patterns, and usage documentation.",
      },
    ],
  },
  {
    slug: "brand-identity",
    title: "Brand Identity Design",
    serviceType: "Brand Strategy & Visual Identity",
    subtitle: "Distinctive brand systems, visual identity, and packaging built for market authority.",
    description:
      "We craft cohesive brand identities that help ambitious companies stand out and command trust across every digital and physical touchpoint. Beyond logos, StellR IT LLC develops positioning strategy, typography, color architecture, packaging systems, and comprehensive brand books designed to scale effortlessly into web and product experiences.",
    heroColor: "#ff8a5b",
    heroImage: brandImg,
    featureImage: brandImg,
    portfolioImages: [p_brand1, p_brand2, p_brand3, p_brand4],
    portfolioCaptions: [
      "TSR Skin & Hair Care desktop brand system and digital storefront",
      "Luxury Goat Milk cosmetic packaging design mockup",
      "Responsive brand book and product showcase on laptop",
      "Mobile visual identity and digital brand guidelines",
    ],
    seo: {
      title: "Brand Identity Design & Branding Agency USA | StellR IT LLC",
      description:
        "Distinctive brand identity design, visual systems, packaging, and brand guidelines for technology, consumer, and enterprise brands by StellR IT LLC.",
    },
    problemsSolved: [
      "Dated or generic visuals that make a strong product look indistinguishable from competitors.",
      "Fragmented brand presentation across websites, pitch decks, packaging, and social channels.",
      "Lack of documented guidelines causing inconsistent output across internal and external teams.",
    ],
    whoNeedsIt: [
      "Startups preparing for launch or institutional fundraising.",
      "Growing consumer, e-commerce, and B2B companies undergoing a strategic rebrand.",
      "Enterprise organizations unifying multiple products under one coherent visual architecture.",
    ],
    technologies: [
      "Brand Strategy & Positioning",
      "Logo & Mark Systems",
      "Typography & Color Architecture",
      "Packaging & Print Production",
      "Digital Brand Books (Figma / Web)",
    ],
    industries: [
      "Consumer Goods & Cosmetics",
      "B2B Technology & SaaS",
      "Real Estate & Hospitality",
      "Healthcare & Professional Services",
    ],
    benefits: [
      {
        title: "Authoritative Market Positioning",
        description:
          "A cohesive, refined visual identity reinforces trust with enterprise buyers, retail partners, and investors.",
      },
      {
        title: "Cross-Channel Consistency",
        description:
          "Clear visual and verbal systems ensure your website, product UI, packaging, and campaigns speak one language.",
      },
      {
        title: "Digital-Ready Assets",
        description:
          "Built with web contrast, responsive scaling, and CSS design tokens in mind—not just static print PDFs.",
      },
      {
        title: "Faster Team Execution",
        description:
          "Documented brand guidelines empower marketing, sales, and engineering teams to ship on-brand assets quickly.",
      },
    ],
    process: [
      {
        title: "Brand Discovery Workshop",
        description:
          "Align on business objectives, audience psychology, competitive white space, and core positioning.",
      },
      {
        title: "Verbal & Strategic Direction",
        description:
          "Define messaging pillars, voice, tone, and brand architecture.",
      },
      {
        title: "Visual System Exploration",
        description:
          "Craft logo marks, typography pairings, color palettes, photography direction, and packaging concepts.",
      },
      {
        title: "Brand Guidelines & Asset Kit",
        description:
          "Deliver production-ready vector assets, digital templates, and comprehensive usage guidelines.",
      },
    ],
    relatedServices: [
      { slug: "web-product-design", title: "Web & Product Design" },
      { slug: "web-development", title: "Custom Web & Software Development" },
      { slug: "digital-marketing", title: "Digital Marketing, SEO & CRO" },
    ],
    relatedCaseStudies: [
      {
        slug: "brand-building",
        title: "TSR Skin & Hair Care Brand Identity",
        subtitle: "Unified packaging design, visual architecture, and digital brand guidelines.",
      },
    ],
    faqs: [
      {
        q: "What is included in a brand identity project?",
        a: "Typical deliverables include positioning strategy, primary and secondary logos, color and typography systems, usage guidelines, digital asset kits, and optional packaging or collateral templates.",
      },
      {
        q: "Do you offer naming and messaging strategy?",
        a: "Yes. We help companies refine naming, taglines, and value propositions alongside their visual identity.",
      },
      {
        q: "Can you roll our new brand directly into a redesigned website?",
        a: "Yes. Because we are an integrated design and software engineering studio, we translate your new brand system straight into a fast, SEO-ready web platform.",
      },
    ],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing, SEO & CRO",
    serviceType: "Technical SEO & Digital Marketing",
    subtitle: "Technical SEO, AI search readiness (AEO/GEO), paid search, and conversion rate optimization.",
    description:
      "StellR IT LLC combines engineering-grade technical SEO, AI search visibility (AEO/GEO), intent-driven paid media, and systematic Conversion Rate Optimization (CRO) to turn search demand into qualified pipeline. Because our growth strategists work alongside full-stack developers, we do not just hand you spreadsheets—we implement the technical fixes, structured data, landing pages, and analytics tracking that drive measurable ROI.",
    heroColor: "#ff8a5b",
    heroImage: marketingImg,
    featureImage: marketingImg,
    portfolioImages: [p_marketing1, p_marketing2],
    portfolioCaptions: [
      "National Home Services SEO and paid search geographic performance mapping",
      "Search query intent alignment and click-through rate analytics",
    ],
    seo: {
      title: "Technical SEO, AEO & Digital Marketing Agency USA | StellR IT LLC",
      description:
        "Drive qualified leads with technical SEO, AI search optimization (AEO/GEO), Google Ads, and conversion rate optimization (CRO) by StellR IT LLC in Garland, TX.",
    },
    problemsSolved: [
      "Technical crawlability, canonical, SSR, and Core Web Vitals issues suppressing organic rankings.",
      "High ad spend and impressions generating low click-through rates and unqualified leads.",
      "Disconnected analytics where leadership cannot see which channels produce real pipeline.",
      "Zero visibility in AI-powered search experiences like Google AI Overviews, ChatGPT Search, and Perplexity.",
    ],
    whoNeedsIt: [
      "B2B, SaaS, and service businesses seeking qualified commercial leads over vanity traffic.",
      "Organizations migrating or relaunching websites that need engineering-led technical SEO.",
      "Marketing leaders improving paid search ROAS and landing page conversion rates.",
    ],
    technologies: [
      "Technical SEO & Schema.org JSON-LD",
      "AEO & GEO (AI Search Readiness)",
      "Google Search Console & Bing Webmaster",
      "GA4 & Google Tag Manager",
      "Google Ads (Search & Performance Max)",
      "Meta & LinkedIn B2B Ads",
      "Landing Page A/B Testing & CRO",
    ],
    industries: [
      "Home & Multi-Location Services",
      "B2B SaaS & Technology",
      "Real Estate & Construction",
      "E-Commerce & Wholesale",
      "Healthcare & Local Services",
    ],
    benefits: [
      {
        title: "Engineering-Led Technical SEO",
        description:
          "We fix crawlability, SSR HTML rendering, canonicals, sitemaps, structured data, and Core Web Vitals directly in code.",
      },
      {
        title: "Intent-Aligned Lead Generation",
        description:
          "Target commercial and transactional queries that bring decision-makers ready to book consultations—not irrelevant clicks.",
      },
      {
        title: "AI Search Visibility (AEO & GEO)",
        description:
          "Clear entity signals, answer-first content, and clean crawler access strengthen discoverability across Google, Bing, ChatGPT, and Perplexity.",
      },
      {
        title: "Full-Funnel Conversion Tracking",
        description:
          "GA4, GTM, form, phone, and referral event tracking give you transparent attribution from first click to closed lead.",
      },
    ],
    process: [
      {
        title: "Technical Audit & Attribution Setup",
        description:
          "Audit crawlability, indexing, metadata, Core Web Vitals, ad accounts, and GA4/GTM conversion tracking.",
      },
      {
        title: "Keyword & Funnel Strategy",
        description:
          "Map high-intent commercial keywords, content gaps, landing pages, and paid search structure.",
      },
      {
        title: "Implementation & Campaign Launch",
        description:
          "Ship technical SEO fixes, structured data, optimized landing pages, and targeted search campaigns.",
      },
      {
        title: "A/B Testing & Monthly Reporting",
        description:
          "Continuously test headlines, offers, and conversion flows with transparent monthly pipeline reporting.",
      },
    ],
    relatedServices: [
      { slug: "web-development", title: "Custom Web & Software Development" },
      { slug: "ux-research-strategy", title: "UX Research & Strategy" },
      { slug: "web-product-design", title: "Web & Product Design" },
    ],
    relatedCaseStudies: [
      {
        slug: "growth-marketing",
        title: "National Home Services Campaign",
        subtitle: "Intent-driven SEO, SEM, and landing page conversion rate optimization.",
      },
      {
        slug: "cinco-tile-platform",
        title: "Revitalize Real Estate",
        subtitle: "Local SEO architecture and remodeling lead-generation web platform.",
      },
    ],
    faqs: [
      {
        q: "How long does technical and content SEO take to produce results?",
        a: "Technical fixes (canonicals, crawlability, sitemaps, Core Web Vitals) often improve indexing within weeks, while compounding organic ranking and lead growth typically builds over 3 to 6 months of consistent authority and content execution.",
      },
      {
        q: "What is AEO and GEO optimization?",
        a: "Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO) structure your company entity, technical HTML, Schema.org data, and authoritative content so AI-powered search tools—such as Google AI Overviews, ChatGPT Search, and Perplexity—can accurately understand and cite your business.",
      },
      {
        q: "What paid advertising channels do you manage?",
        a: "We manage Google Ads (Search, Display, Performance Max), LinkedIn Ads for B2B lead generation, and Meta (Facebook/Instagram) campaigns paired with conversion-tested landing pages.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return servicesData.find((s) => s.slug === slug);
}
