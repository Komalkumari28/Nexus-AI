/**
 * Nexus AI - Advanced Educational Neural Engine
 * Provides context-aware, topic-specific educational responses with realistic streaming.
 */

interface TopicResponse {
  summary: string;
  concepts: string[];
  code?: string;
  tip?: string;
  roadmap?: string[];
}

const TOPICS: Record<string, TopicResponse> = {
  "html": {
    summary: "HyperText Markup Language (HTML) is the standard markup language for documents designed to be displayed in a web browser. It defines the content and structure of web pages.",
    concepts: ["Semantic HTML", "DOM Structure", "Attributes & Elements", "Forms & Input", "Accessibility (Aria)"],
    code: `<!DOCTYPE html>\n<html>\n<head>\n  <title>Nexus Learning</title>\n</head>\n<body>\n  <h1>Welcome to HTML5</h1>\n  <p>Building the web with structure.</p>\n</body>\n</html>`,
    tip: "Always use semantic elements like <main>, <article>, and <section> instead of just <div>. It improves SEO and accessibility.",
    roadmap: ["Tags & Elements", "Forms", "Semantic HTML", "SEO Basics", "Accessibility"]
  },
  "css": {
    summary: "Cascading Style Sheets (CSS) is a style sheet language used for describing the presentation of a document written in HTML. It controls the layout, colors, fonts, and overall visual feel.",
    concepts: ["Box Model", "Flexbox & Grid", "Selectors & Specificity", "Responsive Design", "Animations"],
    code: `.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: 2rem;\n  background: var(--primary);\n}`,
    tip: "Use CSS Variables (Custom Properties) to maintain a consistent design system across your application.",
    roadmap: ["Selectors", "Box Model", "Flexbox", "Grid", "Advanced Animations"]
  },
  "javascript": {
    summary: "JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. It is the core language of the web, enabling interactivity.",
    concepts: ["Asynchronous JS (Promises/Async-Await)", "ES6+ Features", "DOM Manipulation", "Closures & Scope", "Functional Programming"],
    code: `const fetchData = async () => {\n  const response = await fetch('/api/data');\n  const data = await response.json();\n  console.log(data);\n};`,
    tip: "Prefer const and let over var to avoid scope-related bugs and improve code readability.",
    roadmap: ["Basics", "DOM", "Async JS", "Modules", "Frameworks (React/Vue)"]
  },
  "react": {
    summary: "React is a declarative, component-based JavaScript library for building user interfaces. It's designed to be efficient and flexible, allowing developers to create complex UIs from small, isolated pieces of code called components.",
    concepts: ["Declarative UI", "Component Architecture", "Virtual DOM", "Unidirectional Data Flow", "Hooks (useState, useEffect)"],
    code: `import React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;\n}`,
    tip: "Always keep your state as local as possible. Only lift state up when it's absolutely necessary for child components to share data.",
    roadmap: ["JSX & Components", "Props & State", "Hooks", "Context API", "React Query/SWR", "Next.js"]
  },
  "next.js": {
    summary: "Next.js is the React framework for the web. It enables powerful features like Server-Side Rendering (SSR) and Static Site Generation (SSG) right out of the box.",
    concepts: ["App Router", "Server Components", "Streaming", "Edge Runtime", "Static/Dynamic Rendering"],
    code: `// app/page.tsx\nexport default async function Page() {\n  const data = await fetchData();\n  return <main>{data.title}</main>;\n}`,
    tip: "Use Server Components by default to reduce the bundle size sent to the client.",
    roadmap: ["Routing", "Data Fetching", "Caching", "Authentication", "Deployment (Vercel)"]
  },
  "docker": {
    summary: "Docker is an open platform for developing, shipping, and running applications. It allows you to separate your applications from your infrastructure so you can deliver software quickly.",
    concepts: ["Containers vs VMs", "Images & Layers", "Dockerfile", "Docker Compose", "Volumes & Networking"],
    code: `FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]`,
    tip: "Use multi-stage builds to keep your final production images small and secure.",
    roadmap: ["CLI Basics", "Images", "Containers", "Compose", "Kubernetes"]
  },
  "devops": {
    summary: "DevOps is a set of practices that combines software development (Dev) and IT operations (Ops). It aims to shorten the systems development life cycle and provide continuous delivery with high software quality.",
    concepts: ["CI/CD Pipelines", "Infrastructure as Code (IaC)", "Monitoring & Logging", "Microservices", "Automated Testing"],
    tip: "Automate everything that is repetitive. Manual steps are the enemy of scaling.",
    roadmap: ["Linux/Bash", "Git", "Cloud (AWS/Azure)", "CI/CD (GitHub Actions)", "Terraform", "Monitoring"]
  },
  "cloud": {
    summary: "Cloud computing is the on-demand availability of computer system resources, especially data storage and computing power, without direct active management by the user.",
    concepts: ["SaaS, PaaS, IaaS", "Serverless Architecture", "Elasticity & Scalability", "Identity & Access Management (IAM)", "VPCs & Subnets"],
    tip: "Implement 'Least Privilege' access in your cloud environments from day one.",
    roadmap: ["Cloud Fundamentals", "Networking", "Compute (EC2/Lambda)", "Storage (S3/RDS)", "Architecture Patterns"]
  },
  "ai": {
    summary: "Artificial Intelligence (AI) involves creating systems that can perform tasks that would normally require human intelligence, such as visual perception, speech recognition, and decision-making.",
    concepts: ["Machine Learning", "Neural Networks", "Natural Language Processing (NLP)", "Large Language Models (LLMs)", "Deep Learning"],
    tip: "The quality of your AI's output is directly proportional to the quality and diversity of your training data.",
    roadmap: ["Linear Algebra/Calculus", "Python (NumPy, Pandas)", "Scikit-Learn", "PyTorch/TensorFlow", "LLM Integration"]
  },
  "ml": {
    summary: "Machine Learning (ML) is a subset of AI that focuses on building systems that learn from data to improve their performance on a specific task over time.",
    concepts: ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Feature Engineering", "Model Overfitting"],
    tip: "Always split your data into Training, Validation, and Test sets to ensure your model generalizes well.",
    roadmap: ["Probability & Statistics", "Data Preprocessing", "Algorithms (Regression, Trees)", "Neural Nets", "Deployment"]
  },
  "dsa": {
    summary: "Data Structures and Algorithms (DSA) form the foundation of computer science and technical problem-solving. They are essential for writing efficient and scalable code.",
    concepts: ["Big O Notation", "Linked Lists & Arrays", "Trees & Graphs", "Dynamic Programming", "Sorting & Searching"],
    code: `// Binary Search Example\nfunction binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    let mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}`,
    tip: "Before jumping into code, dry-run your logic with a small example on paper or a whiteboard.",
    roadmap: ["Complexity Analysis", "Core Data Structures", "Recursion", "Greedy Algorithms", "Dynamic Programming"]
  },
  "cybersecurity": {
    summary: "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These attacks are usually aimed at accessing, changing, or destroying sensitive information.",
    concepts: ["Encryption (AES/RSA)", "Penetration Testing", "Cross-Site Scripting (XSS)", "SQL Injection", "Zero Trust Architecture"],
    tip: "Never trust user input. Sanitize and validate everything that comes from outside your system.",
    roadmap: ["Networking Basics", "Security Protocols", "Ethical Hacking", "Cloud Security", "Compliance"]
  },
  "career": {
    summary: "A successful career in tech requires more than just coding skills. It involves continuous learning, networking, and understanding the business side of technology.",
    concepts: ["Personal Branding", "Technical Interviewing", "Open Source Contribution", "Soft Skills", "Networking"],
    tip: "Don't just learn a language; learn how to solve problems using that language.",
    roadmap: ["Build Projects", "Contribute to OSS", "Technical Writing", "Interview Prep", "Job Hunting"]
  }
};

const INTENTS = {
  beginner: "Explain this in very simple terms, as if you're teaching a beginner. Focus on high-level concepts and avoid jargon.",
  example: "Provide a practical, real-world code example that demonstrates how this works in a production environment.",
  quiz: "Generate a short quiz (3-4 questions) to test understanding of this topic. Include multiple choice or short answer questions.",
  summarize: "Give me a concise summary of the most important points I need to know about this topic.",
  interview: "What are the top 3-5 technical interview questions related to this topic, and how should I answer them professionally?",
  roadmap: "Provide a step-by-step learning roadmap to master this specific area, starting from the basics to advanced concepts."
};

/**
 * Intelligent Neural Router
 * Analyzes the user query to detect topic and intent.
 */
const routeNeuralQuery = (query: string) => {
  const lowerQuery = query.toLowerCase();
  
  // Detect Topic
  let detectedTopic = "";
  for (const topic in TOPICS) {
    if (lowerQuery.includes(topic)) {
      detectedTopic = topic;
      break;
    }
  }

  // Detect Intent
  let detectedIntent = "";
  for (const intent in INTENTS) {
    if (lowerQuery.includes(intent) || lowerQuery.includes(intent.replace("ize", "ise"))) {
      detectedIntent = intent;
      break;
    }
  }

  return { topic: detectedTopic, intent: detectedIntent };
};

/**
 * Format the response based on topic and intent
 */
const formatNeuralResponse = (topicKey: string, intentKey: string, query: string): string => {
  if (!topicKey) {
    // If no specific topic is found, generate a smart general response
    if (intentKey === "interview") return "### 💼 General Interview Strategy\nTo excel in technical interviews:\n1. **Clarify**: Ask clarifying questions before coding.\n2. **Plan**: Describe your approach and complexity.\n3. **Implement**: Write clean, modular code.\n4. **Test**: Walk through edge cases.\n\nWhat specific technology are you interviewing for? I can provide more targeted questions.";
    
    return `### 🧠 Neural Interface Active\nI've analyzed your query: "${query}". \n\nWhile I don't have a specific deep-dive protocol for that exact phrase yet, I can assist you with:\n- **Programming & Architecture** (React, Next.js, Node.js)\n- **DevOps & Infrastructure** (Docker, CI/CD, Cloud)\n- **Algorithms & Data Structures**\n- **AI/ML & Career Growth**\n\nPlease try asking about one of these technical domains, or specify if you'd like a **Beginner Explanation**, **Code Example**, or **Interview Prep** for a particular topic.`;
  }

  const topic = TOPICS[topicKey];
  const responseHeader = `## 🎯 ${topicKey.toUpperCase()} Protocol Active\n\n`;

  // Specific Intent Handling
  if (intentKey === "beginner") {
    return `${responseHeader}### 🐣 Beginner Explanation\n${topic.summary.split('.')[0]}. Basically, it's like ${topicKey === 'docker' ? 'a shipping container for your software' : topicKey === 'react' ? 'building with LEGO blocks for the web' : 'a specialized tool'} that makes building software easier.\n\n**Core Ideas:**\n${topic.concepts.map(c => `- **${c}**: A fundamental part of how it works.`).join('\n')}\n\n${topic.tip ? `> [!TIP]\n> ${topic.tip}` : ""}`;
  }

  if (intentKey === "example" && topic.code) {
    return `${responseHeader}### 💻 Code Implementation\nHere is a practical example of **${topicKey}** in action:\n\n\`\`\`${topicKey === 'docker' ? 'dockerfile' : 'typescript'}\n${topic.code}\n\`\`\`\n\n**Key Takeaways:**\n- This implementation follows industry best practices.\n- It focuses on scalability and readability.`;
  }

  if (intentKey === "quiz") {
    return `${responseHeader}### 🧠 Knowledge Check\nLet's verify your understanding of **${topicKey}**:\n\n1. What is the primary purpose of ${topicKey}?\n2. Name two core concepts: **${topic.concepts[0]}** and **${topic.concepts[1]}**. Why are they important?\n3. How would you apply this in a real-world project?\n\n*Try answering these in your head or type them out!*`;
  }

  if (intentKey === "roadmap" && topic.roadmap) {
    return `${responseHeader}### 🗺️ Master Roadmap\nFollow this path to become an expert in **${topicKey}**:\n\n${topic.roadmap.map((step, i) => `${i + 1}. **${step}**`).join('\n')}\n\n> [!INFO]\n> Mastery takes time. Focus on building projects at each step.`;
  }

  if (intentKey === "interview") {
    return `${responseHeader}### 💼 Interview Prep\nBe ready for these common **${topicKey}** questions:\n\n1. **"Can you explain the concept of ${topic.concepts[0]}?"**\n   - *How to answer:* Define it clearly, mention why it's beneficial, and give a brief example.\n2. **"What are the trade-offs when using ${topicKey}?"**\n   - *How to answer:* Discuss pros like scalability and cons like initial complexity.\n3. **"How do you handle state/data in this context?"**\n   - *How to answer:* Reference specific patterns like ${topic.concepts[2]}.\n\n> [!TIP]\n> ${topic.tip}`;
  }

  if (intentKey === "summarize") {
    return `${responseHeader}### 📝 Quick Summary\n**${topicKey.toUpperCase()}** is essential because:\n${topic.concepts.slice(0, 3).map(c => `- It handles **${c}** efficiently.`).join('\n')}\n\n**Verdict:** Use it when you need ${topicKey === 'react' ? 'high interactivity' : 'scalable infrastructure'}.`;
  }

  // Default Full Response
  return `${responseHeader}${topic.summary}\n\n### 🚀 Core Pillars:\n${topic.concepts.map(c => `- **${c}**`).join('\n')}\n\n${topic.code ? `### 💻 Example:\n\`\`\`${topicKey === 'docker' ? 'dockerfile' : 'typescript'}\n${topic.code}\n\`\`\`\n` : ""}\n\n> [!TIP]\n> ${topic.tip}`;
};

/**
 * Simulates a streaming response from the AI
 */
export const simulateStreamingResponse = async (
  prompt: string,
  onChunk: (chunk: string) => void
): Promise<string> => {
  const { topic, intent } = routeNeuralQuery(prompt);
  const responseText = formatNeuralResponse(topic, intent, prompt);

  // Simulate streaming word by word for realism
  let currentText = "";
  const words = responseText.split(" ");
  
  for (let i = 0; i < words.length; i++) {
    currentText += words[i] + " ";
    onChunk(currentText);
    
    // Varying delay for more "human-like" or "processing" feel
    const isNewLine = words[i].includes("\n");
    const delay = isNewLine ? 50 : (10 + Math.random() * 20); 
    
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return currentText;
};
