export interface AgentMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  actions?: AgentAction[];
  timestamp: number;
}

export interface AgentAction {
  label: string;
  type: "navigate" | "info";
  target?: string; // section ID for navigation
}

interface AgentResponse {
  content: string;
  actions?: AgentAction[];
}

const SECTION_MAP: Record<string, { id: string; name: string; description: string }> = {
  hero: {
    id: "hero",
    name: "Hero",
    description: "Prajwal's landing screen highlighting his profile.",
  },
  works: {
    id: "works",
    name: "Selected Projects",
    description: "DayLens (Habit Tracker), What Did You Do Today?, and Neural Network integrations.",
  },
  gallery: {
    id: "gallery",
    name: "Experience Timeline",
    description: "SIT Pune student life, DayLens development process, and frontend milestones.",
  },
  philosophy: {
    id: "philosophy",
    name: "My Philosophy",
    description: "Sophisticated tech meets clean user experiences.",
  },
  awards: {
    id: "awards",
    name: "Certifications & Skills",
    description: "React Frontend Developer cert, AtomQuest 2025, Cybersec & Crypto certification.",
  },
  footer: {
    id: "footer",
    name: "Contact Info",
    description: "Email: prajwalagrawal1348@gmail.com, Mobile: 9279347733.",
  },
};

const QUICK_SUGGESTIONS: AgentAction[] = [
  { label: "Show me your works", type: "navigate", target: "works" },
  { label: "Your experience", type: "navigate", target: "gallery" },
  { label: "View certifications", type: "navigate", target: "awards" },
  { label: "Get in touch", type: "navigate", target: "footer" },
];

function matchIntent(input: string): AgentResponse {
  const lower = input.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|sup|yo|hola|greetings)/i.test(lower)) {
    return {
      content:
        "Hello! I am Prajwal's AI portfolio guide. I can help you explore his projects, experience, academic background, and skills. What would you like to know?",
      actions: QUICK_SUGGESTIONS,
    };
  }

  // Navigation / Works intents
  if (/work|project|portfolio|daylens|habit|study/i.test(lower)) {
    return {
      content:
        "Prajwal's signature projects include 'DayLens' (a minimal habit tracking app he founded & built) and 'What Did You Do Today?' (a product design & user behavior study). Let me guide you to the projects section.",
      actions: [
        { label: "Go to Selected Works", type: "navigate", target: "works" },
        { label: "Go to Experience Gallery", type: "navigate", target: "gallery" },
      ],
    };
  }

  if (/experience|timeline|sit|symbiosis|college|student/i.test(lower)) {
    return {
      content:
        "Prajwal is currently a Computer Science student at Symbiosis Institute of Technology, Pune (AI/ML specialization). He is also self-employed as the Founder & Developer of DayLens. Let's look at his experience timeline.",
      actions: [
        { label: "Go to Experience Gallery", type: "navigate", target: "gallery" },
      ],
    };
  }

  if (/philosoph|about|who is|motivation|manifesto|belief/i.test(lower)) {
    return {
      content:
        "Prajwal is fascinated by the contrast between complex, sophisticated backend technology and simple, intuitive user interfaces. He believes the best programmers are also product thinkers who create things people love to use.",
      actions: [
        { label: "Read Manifesto", type: "navigate", target: "philosophy" },
      ],
    };
  }

  if (/award|cert|skill|lang|c\+\+|react|js|ts|python|dark web/i.test(lower)) {
    return {
      content:
        "Prajwal is certified in React Frontend Development and Web Security (Dark Web, Cryptography). His technical skills span React.js, C++, TypeScript, Python, and Neural Network design.",
      actions: [
        { label: "Go to Certifications", type: "navigate", target: "awards" },
      ],
    };
  }

  if (/contact|email|reach|talk|hire|phone|mobile|linkedin|github/i.test(lower)) {
    return {
      content:
        "You can reach Prajwal at prajwalagrawal1348@gmail.com or call him at +91 9279347733. His professional profiles are on LinkedIn (prajwal-agrawal-5b7009385) and GitHub (github.com/Praz-ctrl).",
      actions: [
        { label: "Go to Contact Footer", type: "navigate", target: "footer" },
      ],
    };
  }

  if (/top|home|start|hero|beginning|back/i.test(lower)) {
    return {
      content: "Navigating back to the hero header.",
      actions: [
        { label: "Back to Top", type: "navigate", target: "hero" },
      ],
    };
  }

  // Tech / how it's made
  if (/tech|stack|built|made|develop|code|framework/i.test(lower)) {
    return {
      content:
        "This interactive portfolio is engineered with Next.js, React Three Fiber (for the floating 3D geometry), GSAP ScrollTrigger (for the scroll flow), Framer Motion (for interface micro-animations), and Lenis smooth scrolling.",
      actions: QUICK_SUGGESTIONS,
    };
  }

  // Help
  if (/help|guide|what can|how do|navigate|show/i.test(lower)) {
    return {
      content:
        "I'm here to help! Ask me about Prajwal's projects, experience, skills, academic details, or select one of these shortcuts:",
      actions: QUICK_SUGGESTIONS,
    };
  }

  // Fallback
  return {
    content:
      "I can help you navigate Prajwal's student developer profile. Here are some options to get you started:",
    actions: QUICK_SUGGESTIONS,
  };
}

export function getAgentResponse(userMessage: string): AgentResponse {
  return matchIntent(userMessage);
}

export function getWelcomeMessage(): AgentMessage {
  return {
    id: "welcome",
    role: "agent",
    content:
      "Hello, I am Prajwal's AI Assistant. I can guide you through his projects, academic highlights, and technical expertise. What would you like to explore?",
    actions: QUICK_SUGGESTIONS,
    timestamp: Date.now(),
  };
}

export function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}
