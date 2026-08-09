import uxImg from "@/assets/services/UX Research & Strategy.png";
import brandImg from "@/assets/services/Brand Identity.png";
import webProductImg from "@/assets/services/Web & Product Design.png";
import webDevImg from "@/assets/services/Web Development.png";
import marketingImg from "@/assets/services/Digital Marketing & CRO.png";
import aiImg from "@/assets/services/AI Development & Automation.png";

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
  subtitle: string;
  description: string;
  heroColor: string;
  heroImage: string;
  featureImage: string;
  portfolioImages?: string[];
  seo: {
    title: string;
    description: string;
    keywords: string;
  };
  benefits: {
    title: string;
    description: string;
  }[];
  process: {
    title: string;
    description: string;
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
}

export const servicesData: ServiceData[] = [
  {
    slug: "ux-research-strategy",
    title: "UX Research & Strategy",
    subtitle: "Strategy-led UX and UI engineered to convert and retain.",
    description:
      "We don't just design interfaces; we engineer digital experiences rooted in deep user psychology and business strategy. Our UX research uncovers the friction points costing you revenue, while our strategic UI design builds calm, intuitive pathways that guide users seamlessly toward conversion. From enterprise SaaS platforms to consumer mobile apps, we create digital products that people actually want to use.",
    heroColor: "#a855f7",
    heroImage: uxImg,
    featureImage: uxImg,
    portfolioImages: [p_ux1, p_ux2, p_webdesign1, p_webdesign2],
    seo: {
      title: "UX Research & Strategy Services | StellR IT LLC",
      description: "Enterprise UX research and UI strategy services. We design intuitive, high-converting digital products, SaaS platforms, and mobile applications.",
      keywords: "UX research services, UI design agency, enterprise UX design, SaaS product design, user experience strategy, usability testing",
    },
    benefits: [
      {
        title: "Increased Conversion Rates",
        description: "By removing friction and aligning interfaces with user intent, we significantly lift conversion metrics across your digital products.",
      },
      {
        title: "Reduced Churn",
        description: "Intuitive, calm interfaces reduce user frustration, leading to higher retention rates and increased customer lifetime value (LTV).",
      },
      {
        title: "Lower Development Costs",
        description: "Validating concepts through rigorous research and prototyping prevents costly engineering rework down the line.",
      },
      {
        title: "Data-Driven Decisions",
        description: "We replace subjective design opinions with empirical data gathered from real users and market analysis.",
      },
    ],
    process: [
      {
        title: "Discovery & Audit",
        description: "We analyze your current product, market positioning, and competitors to identify immediate opportunities for UX improvement.",
      },
      {
        title: "User Research",
        description: "Conducting interviews, surveys, and behavioral analysis to understand your users' true needs, pain points, and motivations.",
      },
      {
        title: "Information Architecture",
        description: "Structuring content and navigation logic to ensure users can intuitively find what they need, exactly when they need it.",
      },
      {
        title: "Prototyping & Testing",
        description: "Creating high-fidelity interactive prototypes and validating them with real users before writing a single line of code.",
      },
    ],
    faqs: [
      {
        q: "How long does a UX research phase typically take?",
        a: "A comprehensive UX research and strategy phase usually takes 3 to 6 weeks, depending on the complexity of the product and the availability of users for testing.",
      },
      {
        q: "Do you design for B2B or B2C products?",
        a: "We have extensive experience in both. We've designed complex, data-heavy B2B SaaS platforms as well as high-traffic, conversion-focused B2C mobile applications.",
      },
      {
        q: "What deliverables are included in your UX service?",
        a: "Deliverables typically include user personas, journey maps, wireframes, interactive prototypes, a comprehensive design system, and a detailed research findings report.",
      },
    ],
  },
  {
    slug: "brand-identity",
    title: "Brand Identity Design",
    subtitle: "Iconic identities that command attention and drive growth.",
    description:
      "Your brand is your most valuable business asset. We craft distinctive, memorable brand identities that position you as the premium authority in your space. We go beyond logos, building comprehensive brand systems—including naming, verbal strategy, typography, and visual architecture—that feel inevitable and resonate deeply with your target market. We build brands designed to scale.",
    heroColor: "#ff8a5b",
    heroImage: brandImg,
    featureImage: brandImg,
    portfolioImages: [p_brand1, p_brand2, p_brand3, p_brand4],
    seo: {
      title: "Premium Brand Identity Design Services | StellR IT LLC",
      description: "Crafting iconic brand identities, naming, and messaging for enterprise brands and market leaders. Elevate your market positioning with StellR IT.",
      keywords: "brand identity design, branding agency, corporate branding, visual identity, brand positioning strategy, startup branding",
    },
    benefits: [
      {
        title: "Premium Market Positioning",
        description: "A cohesive, high-end brand identity allows you to command premium pricing and attract higher-tier enterprise clients.",
      },
      {
        title: "Instant Recognition",
        description: "We design distinctive visual systems that ensure your brand is instantly recognizable in crowded and competitive markets.",
      },
      {
        title: "Internal Alignment",
        description: "A strong brand foundation unites your team around a common purpose, voice, and vision, driving operational cohesion.",
      },
      {
        title: "Trust & Credibility",
        description: "Professional, meticulously crafted branding builds immediate trust with investors, partners, and prospective customers.",
      },
    ],
    process: [
      {
        title: "Brand Workshop",
        description: "A deep dive into your business goals, target audience, competitive landscape, and core values.",
      },
      {
        title: "Strategy & Positioning",
        description: "Defining your brand archetype, voice, tone, and the unique value proposition that sets you apart.",
      },
      {
        title: "Visual Exploration",
        description: "Developing initial concepts for the logo, typography, color palette, and overarching visual language.",
      },
      {
        title: "System Guidelines",
        description: "Delivering a comprehensive brand book that dictates exactly how the brand should be applied across all touchpoints.",
      },
    ],
    faqs: [
      {
        q: "What is included in a brand identity project?",
        a: "Projects typically include brand strategy, logo design (primary and secondary), typography selection, color palette development, brand guidelines, and key marketing collateral.",
      },
      {
        q: "Do you offer naming services?",
        a: "Yes, we offer comprehensive naming and verbal strategy services, including trademark pre-screening and domain availability analysis.",
      },
      {
        q: "How do we ensure the new brand aligns with our business goals?",
        a: "Every branding project begins with an intensive strategic workshop to ensure the visual identity is a direct manifestation of your business objectives and target market psychology.",
      },
    ],
  },
  {
    slug: "web-product-design",
    title: "Web & Product Design",
    subtitle: "Beautifully engineered digital products that scale.",
    description:
      "We design digital products that look stunning and perform flawlessly. Our web and product design service bridges the gap between aesthetic excellence and technical feasibility. Whether you are building a complex SaaS dashboard, a high-converting marketing site, or a native mobile app, we create cohesive design systems that ensure a premium, consistent experience across every screen size and device.",
    heroColor: "#cc7aff",
    heroImage: webProductImg,
    featureImage: webProductImg,
    portfolioImages: [p_webdesign1, p_webdesign2, p_webdesign3, p_webdesign4],
    seo: {
      title: "Web & Product Design Services | StellR IT LLC",
      description: "Design beautifully engineered digital products, SaaS platforms, and enterprise websites with StellR IT's expert product design team.",
      keywords: "web design agency, digital product design, SaaS design, UI design services, custom website design",
    },
    benefits: [
      {
        title: "Scalable Design Systems",
        description: "We build component-based design systems that allow your engineering team to build faster and maintain consistency as you scale.",
      },
      {
        title: "Cross-Platform Consistency",
        description: "Ensuring your brand and user experience remain flawless whether accessed via desktop, tablet, or mobile device.",
      },
      {
        title: "Accessibility Compliance",
        description: "We design with WCAG guidelines in mind, ensuring your digital products are usable by everyone and legally compliant.",
      },
      {
        title: "Future-Proof Aesthetics",
        description: "We leverage modern design trends (like glassmorphism and bento grids) while maintaining a timeless foundation that won't look dated next year.",
      },
    ],
    process: [
      {
        title: "Concept & Wireframing",
        description: "Translating UX strategy into low-fidelity layouts to establish structure and content hierarchy.",
      },
      {
        title: "High-Fidelity UI Design",
        description: "Applying the brand identity to create pixel-perfect, visually stunning interface designs.",
      },
      {
        title: "Motion & Interaction",
        description: "Designing micro-interactions and animations that make the product feel alive and responsive.",
      },
      {
        title: "Developer Handoff",
        description: "Providing meticulously organized design files and specifications to ensure a seamless transition to the engineering team.",
      },
    ],
    faqs: [
      {
        q: "What design tools do you use?",
        a: "We primarily use Figma for all UI/UX design, prototyping, and developer handoff, allowing for real-time collaboration with your team.",
      },
      {
        q: "Do you build the websites you design?",
        a: "Yes, we are a full-stack agency. Our engineering team works hand-in-hand with our designers to bring the vision to life perfectly.",
      },
      {
        q: "What is a design system?",
        a: "A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications efficiently.",
      },
    ],
  },
  {
    slug: "web-development",
    title: "Custom Web & Software Development",
    subtitle: "Enterprise-grade engineering for ambitious brands.",
    description:
      "We build robust, scalable, and secure web applications using modern technology stacks. For us, performance, accessibility, and security are core features, not afterthoughts. We specialize in React, Next.js, and Node.js, delivering everything from high-performance marketing sites with headless CMS architectures to complex, data-intensive enterprise portals and bespoke software solutions.",
    heroColor: "#7a2adc",
    heroImage: webDevImg,
    featureImage: webDevImg,
    portfolioImages: [p_webdev1, p_webdev2, p_webdev3, p_webdev4],
    seo: {
      title: "Custom Web & Software Development Services | StellR IT LLC",
      description: "Full-stack web and software development using React, Next.js, and modern tech stacks. Enterprise-grade performance and security.",
      keywords: "custom software development, web application development, React development agency, Next.js developers, enterprise web development",
    },
    benefits: [
      {
        title: "Blazing Fast Performance",
        description: "We utilize server-side rendering (SSR) and edge computing to ensure sub-second load times, boosting both SEO and user retention.",
      },
      {
        title: "Enterprise Security",
        description: "Implementing industry-standard security practices, data encryption, and robust authentication (OAuth, SSO) to protect your business.",
      },
      {
        title: "Seamless Integrations",
        description: "Expertly integrating third-party APIs, CRMs (Salesforce, HubSpot), ERPs, and payment gateways (Stripe) into your ecosystem.",
      },
      {
        title: "Scalable Architecture",
        description: "Building cloud-native applications on AWS or GCP designed to handle massive traffic spikes without degradation.",
      },
    ],
    process: [
      {
        title: "Architecture Planning",
        description: "Selecting the optimal tech stack, database structure, and hosting environment for your specific requirements.",
      },
      {
        title: "Agile Development",
        description: "Working in two-week sprints, providing regular updates, and delivering functional software incrementally.",
      },
      {
        title: "Rigorous QA Testing",
        description: "Comprehensive automated and manual testing (unit, integration, e2e) to ensure zero critical bugs upon launch.",
      },
      {
        title: "Deployment & DevOps",
        description: "Setting up CI/CD pipelines for automated, zero-downtime deployments and continuous monitoring.",
      },
    ],
    faqs: [
      {
        q: "What technologies do you specialize in?",
        a: "Our core stack revolves around TypeScript: React, Next.js, and Vue for the frontend; Node.js, Express, and Python for the backend; and PostgreSQL/MongoDB for databases.",
      },
      {
        q: "Do you work with existing codebases?",
        a: "Yes. We frequently conduct code audits, refactor legacy systems, and take over ongoing development for existing applications.",
      },
      {
        q: "Who owns the intellectual property (IP)?",
        a: "You do. Upon project completion and final payment, all source code and intellectual property rights are fully transferred to your company.",
      },
    ],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing & CRO",
    subtitle: "Data-driven campaigns that unlock compounding growth.",
    description:
      "Building a great product is only half the battle; acquiring customers efficiently is the other. Our digital marketing strategies are rooted in deep data analytics and relentless experimentation. We combine technical SEO, high-ROI paid media campaigns, and rigorous Conversion Rate Optimization (CRO) to lower your Customer Acquisition Cost (CAC) and scale your revenue predictably.",
    heroColor: "#ff8a5b",
    heroImage: marketingImg,
    featureImage: marketingImg,
    portfolioImages: [p_marketing1, p_marketing2],
    seo: {
      title: "Digital Marketing & CRO Services | StellR IT LLC",
      description: "Data-driven digital marketing, technical SEO, Google Ads, and Conversion Rate Optimization (CRO) to scale your business revenue.",
      keywords: "digital marketing agency, technical SEO services, conversion rate optimization, Google Ads management, growth marketing",
    },
    benefits: [
      {
        title: "Lower Customer Acquisition Cost",
        description: "Through precise targeting and continuous CRO, we maximize the efficiency of every dollar spent on advertising.",
      },
      {
        title: "Compounding Organic Traffic",
        description: "Our technical and content SEO strategies build long-term, sustainable organic traffic that reduces reliance on paid media.",
      },
      {
        title: "Data-Backed Confidence",
        description: "Advanced analytics tracking (GA4, GTM) ensures you always know exactly which campaigns are driving true ROI.",
      },
      {
        title: "Full-Funnel Optimization",
        description: "We don't just drive traffic; we optimize the entire user journey from the first click to the final conversion event.",
      },
    ],
    process: [
      {
        title: "Audit & Tracking Setup",
        description: "Conducting a comprehensive audit of existing campaigns and ensuring pixel-perfect analytics tracking is in place.",
      },
      {
        title: "Strategy Formulation",
        description: "Developing a multi-channel growth plan tailored to your specific target audience, industry, and revenue goals.",
      },
      {
        title: "Execution & Management",
        description: "Launching paid campaigns, implementing technical SEO fixes, and deploying content strategies.",
      },
      {
        title: "A/B Testing & Scaling",
        description: "Continuously testing ad copy, landing pages, and offers, then scaling the highest-performing segments.",
      },
    ],
    faqs: [
      {
        q: "What ad platforms do you manage?",
        a: "We manage campaigns across Google Ads (Search, Display, Performance Max), Meta (Facebook/Instagram), LinkedIn Ads (B2B), and TikTok Ads.",
      },
      {
        q: "How long does SEO take to show results?",
        a: "While technical SEO fixes can yield immediate improvements, significant organic growth typically takes 3 to 6 months of consistent effort.",
      },
      {
        q: "What is CRO (Conversion Rate Optimization)?",
        a: "CRO is the systemic process of increasing the percentage of website visitors who take a desired action (e.g., filling out a form, making a purchase) through A/B testing and user psychology.",
      },
    ],
  },
  {
    slug: "ai-software-development",
    title: "AI Software Development",
    subtitle: "Integrate generative AI to automate, scale, and innovate.",
    description:
      "We help enterprises leverage the power of Artificial Intelligence to gain a massive competitive advantage. Whether you need to integrate LLMs (like OpenAI's GPT-4 or Anthropic's Claude) into your existing software, build a custom RAG (Retrieval-Augmented Generation) system trained on your proprietary data, or deploy autonomous AI agents to automate complex workflows, our specialized AI engineering team can deliver.",
    heroColor: "#38bdf8",
    heroImage: aiImg,
    featureImage: aiImg,
    portfolioImages: [p_ai1, p_ai2],
    seo: {
      title: "AI Software Development & Integration Services | StellR IT LLC",
      description: "Custom AI software development, LLM integration, RAG systems, and AI automation. Leverage generative AI to scale your enterprise.",
      keywords: "AI software development, generative AI integration, LLM development, custom AI solutions, RAG system development, AI automation",
    },
    benefits: [
      {
        title: "Massive Efficiency Gains",
        description: "Automate repetitive, time-consuming tasks, allowing your human workforce to focus on high-value, strategic initiatives.",
      },
      {
        title: "Proprietary Intelligence",
        description: "Build AI systems securely trained on your own corporate data, turning your knowledge base into an interactive, intelligent asset.",
      },
      {
        title: "Enhanced Customer Experience",
        description: "Deploy highly capable, context-aware AI agents to provide instant, accurate, 24/7 support to your customers.",
      },
      {
        title: "Future-Proof Operations",
        description: "Stay ahead of the curve by integrating cutting-edge AI technologies that redefine your industry standards.",
      },
    ],
    process: [
      {
        title: "AI Feasibility Assessment",
        description: "Analyzing your business workflows and data architecture to identify the highest ROI opportunities for AI integration.",
      },
      {
        title: "Data Preparation & Pipeline",
        description: "Cleaning, structuring, and vectorizing your proprietary data for use in Retrieval-Augmented Generation (RAG) models.",
      },
      {
        title: "Model Selection & Engineering",
        description: "Choosing the right foundational models (OpenAI, Anthropic, Llama) and engineering precise prompts and orchestration layers (LangChain).",
      },
      {
        title: "Testing, Deployment & Guardrails",
        description: "Implementing strict security guardrails to prevent hallucinations, ensuring data privacy, and deploying to a scalable cloud environment.",
      },
    ],
    faqs: [
      {
        q: "Is my corporate data secure when using AI?",
        a: "Yes. We utilize enterprise-grade API endpoints (which do not train public models on your data) and implement strict access controls and vector database security.",
      },
      {
        q: "What is a RAG system?",
        a: "Retrieval-Augmented Generation (RAG) is a technique that connects an LLM (like ChatGPT) to your private database, allowing it to answer questions based *only* on your specific company documents and data.",
      },
      {
        q: "Can AI integrate with our existing software?",
        a: "Absolutely. We build custom API middlewares that allow AI agents to interact directly with your CRM, ERP, databases, and internal tools.",
      },
    ],
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    subtitle: "Native and cross-platform apps that dominate the App Store.",
    description:
      "We design and build world-class mobile applications for iOS and Android. Our expertise spans native development (Swift, Kotlin) for maximum performance and hardware integration, as well as cross-platform development (React Native, Flutter) for rapid time-to-market and cost efficiency. We don't just write code; we build mobile experiences that users love, characterized by smooth animations, intuitive navigation, and rock-solid stability.",
    heroColor: "#10b981",
    heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop", // Used graph instead, wait let's use phone
    featureImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop", // Mobile phone modern
    portfolioImages: [p_app1, p_app2, p_app3, p_app4],
    seo: {
      title: "Mobile App Development Services | iOS & Android | StellR IT LLC",
      description: "Custom mobile app development for iOS and Android. We build high-performance native and cross-platform apps using React Native and Flutter.",
      keywords: "mobile app development agency, iOS app developers, Android app development, React Native agency, Flutter developers",
    },
    benefits: [
      {
        title: "Exceptional User Experience",
        description: "We adhere strictly to Apple's HIG and Google's Material Design guidelines to create apps that feel natural and intuitive on every device.",
      },
      {
        title: "High Performance",
        description: "Optimized code, efficient memory management, and smooth 60fps animations ensure a premium feel.",
      },
      {
        title: "Offline Capabilities",
        description: "Robust local database integration ensures your app remains functional and fast even when network connectivity is poor.",
      },
      {
        title: "Faster Time-to-Market",
        description: "Utilizing modern frameworks like React Native allows us to deploy to both iOS and Android simultaneously, saving time and budget.",
      },
    ],
    process: [
      {
        title: "Mobile UX/UI Design",
        description: "Creating mobile-first interfaces with intuitive touch targets, gesture controls, and responsive layouts.",
      },
      {
        title: "API & Backend Integration",
        description: "Developing or connecting to secure, scalable REST or GraphQL APIs to power the mobile application.",
      },
      {
        title: "Frontend Development",
        description: "Writing clean, maintainable code using React Native, Flutter, Swift, or Kotlin, depending on project requirements.",
      },
      {
        title: "App Store Deployment",
        description: "Handling the rigorous submission processes for both the Apple App Store and Google Play Store.",
      },
    ],
    faqs: [
      {
        q: "Should I build a Native or Cross-Platform app?",
        a: "For 90% of business apps, React Native or Flutter is the best choice (faster, cheaper, single codebase). Native is only required for heavy 3D gaming or intense hardware specific processing.",
      },
      {
        q: "Do you handle the App Store submission process?",
        a: "Yes, we handle the entire submission, review, and approval process for both Apple and Google, ensuring full compliance with their guidelines.",
      },
      {
        q: "How do you handle push notifications?",
        a: "We integrate robust push notification systems (like Firebase Cloud Messaging or OneSignal) for segmented, targeted user engagement.",
      },
    ],
  },
  {
    slug: "dedicated-teams",
    title: "Dedicated Engineering Teams",
    subtitle: "Scale your capacity instantly with elite remote talent.",
    description:
      "StellR IT provides white-label, dedicated remote development teams for digital agencies, enterprises, and fast-growing startups worldwide. Avoid the massive overhead and delays of local hiring. We provide fully managed, pre-vetted teams of senior full-stack developers, AI engineers, UI/UX designers, QA testers, and DevOps specialists who integrate seamlessly into your existing workflows and timezones.",
    heroColor: "#f43f5e",
    heroImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop", // Team working
    featureImage: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop", // Modern office/collaboration
    portfolioImages: [p_webdev1, p_webdev2, p_pools1, p_pools2],
    seo: {
      title: "Dedicated Engineering Teams & IT Staff Augmentation | StellR IT",
      description: "Hire dedicated remote development teams and elite software engineers. White-label staff augmentation for agencies and enterprises.",
      keywords: "dedicated development team, IT staff augmentation, hire remote developers, white label software development",
    },
    benefits: [
      {
        title: "Zero Hiring Overhead",
        description: "Skip the months of recruiting, interviewing, and onboarding. Access top-tier engineering talent immediately.",
      },
      {
        title: "Cost Efficiency",
        description: "Reduce engineering costs by up to 40% compared to local hiring, without sacrificing quality or communication.",
      },
      {
        title: "Ultimate Flexibility",
        description: "Scale your team up or down based on your current project pipeline and business needs.",
      },
      {
        title: "Seamless Integration",
        description: "Our engineers adapt to your tools (Jira, Slack, GitHub) and your agile ceremonies, becoming true extensions of your company.",
      },
    ],
    process: [
      {
        title: "Requirement Analysis",
        description: "We work with you to understand the exact technical skills, seniority levels, and cultural fit required for your team.",
      },
      {
        title: "Team Assembly",
        description: "We hand-pick the perfect candidates from our roster of senior engineers and present them to you for final approval.",
      },
      {
        title: "Onboarding & Integration",
        description: "Seamlessly integrating the team into your communication channels, code repositories, and project management tools.",
      },
      {
        title: "Ongoing Management",
        description: "We provide an Account Manager to handle HR, payroll, and ensure performance metrics are consistently met.",
      },
    ],
    faqs: [
      {
        q: "What timezones do your developers work in?",
        a: "We offer timezone-aligned teams. Our engineers overlap with your standard business hours (EST, PST, GMT) to ensure real-time communication.",
      },
      {
        q: "Can I interview the developers before they start?",
        a: "Absolutely. You have the final say on who joins your dedicated team after reviewing their profiles and conducting technical interviews.",
      },
      {
        q: "What happens if a developer is not a good fit?",
        a: "In the rare event of a mismatch, we provide a rapid, hassle-free replacement at no additional cost to ensure your project stays on track.",
      },
    ],
  },
  {
    slug: "saas-development",
    title: "SaaS Development",
    subtitle: "End-to-end architecture for scalable software products.",
    description:
      "Building a successful Software as a Service (SaaS) product requires more than just good code—it requires exceptional architecture. We handle the entire lifecycle of SaaS development, from multi-tenant database design and robust API infrastructure to complex billing integrations (Stripe) and high-performance React frontends. We build platforms designed to handle thousands of concurrent users securely.",
    heroColor: "#3b82f6",
    heroImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop", // Tech architecture/servers
    featureImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop", // Dashboard UI
    portfolioImages: [p_ux3, p_ux4, p_webdesign3, p_webdesign4],
    seo: {
      title: "Custom SaaS Development Services & Architecture | StellR IT",
      description: "End-to-end SaaS application development. We build scalable, secure, multi-tenant software platforms with modern tech stacks.",
      keywords: "SaaS development company, SaaS architecture, multi-tenant application development, custom software as a service",
    },
    benefits: [
      {
        title: "Multi-Tenant Architecture",
        description: "Secure, scalable database design that perfectly isolates customer data while maintaining a single, maintainable codebase.",
      },
      {
        title: "Frictionless Billing",
        description: "Expert integration with Stripe or Paddle to handle complex subscription tiers, metered billing, prorations, and invoicing.",
      },
      {
        title: "Enterprise-Ready Security",
        description: "Implementing SOC2-compliant security practices, Role-Based Access Control (RBAC), and comprehensive audit logging.",
      },
      {
        title: "High Availability DevOps",
        description: "Automated scaling and self-healing infrastructure on AWS/GCP to guarantee 99.99% uptime for your users.",
      },
    ],
    process: [
      {
        title: "Product Strategy & Architecture",
        description: "Defining the core feature set (MVP) and designing the cloud architecture and database schema for scale.",
      },
      {
        title: "Frontend & Backend Engineering",
        description: "Building the secure API layer and a lightning-fast, responsive frontend using Next.js and React.",
      },
      {
        title: "Subscription Integration",
        description: "Implementing user authentication, role management, and complex payment/subscription logic.",
      },
      {
        title: "Launch & Iterate",
        description: "Deploying the platform, setting up analytics, and continuously iterating based on user feedback and metrics.",
      },
    ],
    faqs: [
      {
        q: "Can you help build an MVP (Minimum Viable Product)?",
        a: "Yes, we specialize in rapid MVP development to get your core SaaS features to market quickly for user validation and investor pitching.",
      },
      {
        q: "How do you handle multi-tenancy?",
        a: "We architect multi-tenant systems using either row-level security (RLS) in PostgreSQL or separate database schemas, depending on your isolation and compliance requirements.",
      },
      {
        q: "Do you integrate with third-party tools?",
        a: "Yes, we heavily utilize webhooks and APIs to integrate your SaaS with CRMs, marketing automation tools, Slack, and other enterprise software.",
      },
    ],
  }
];
