import type { SkillGroup } from "@/types/content";

// Skill groups taken from the owner's GitHub profile README.
// No proficiency levels or certifications are listed; add them only with verifiable evidence.

export const skills: SkillGroup[] = [
  {
    title: "Programming Languages",
    items: ["C", "C++", "Python", "Java", "JavaScript"],
  },
  {
    title: "Web Development",
    items: ["HTML5", "CSS3", "Node.js", "Express.js"],
  },
  {
    title: "Databases & Analytics",
    items: ["MySQL", "SQLite", "Oracle", "Google Analytics"],
  },
  {
    title: "DevOps & Developer Tools",
    items: ["Git", "GitHub Actions", "Docker", "VS Code", "Postman", "Overleaf / LaTeX"],
  },
  {
    title: "Engineering & Simulation",
    items: ["MATLAB", "NI Multisim", "Proteus", "AutoCAD"],
  },
  {
    title: "AI Assistants & Tools",
    description: "AI tools used in study and development work.",
    items: ["ChatGPT", "Gemini", "Claude", "Perplexity"],
  },
];
