// Areas of work, drawn from the owner's GitHub profile. These are not certified services,
// fixed offers or published prices. Availability and scope are confirmed by direct contact.

export type Service = {
  id: string;
  title: string;
  summary: string;
  technologies: string[];
  examples: string[];
};

export const servicesScopeNote =
  "These are areas of work shown in my projects and learning. They are not fixed offers, certifications or published prices. Contact me to discuss scope and availability.";

export const services: Service[] = [
  {
    id: "software-development",
    title: "Software development",
    summary: "Web applications and client-side tools that work offline where it helps.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Node.js", "Express.js", "Git"],
    examples: ["Progressive Web Apps", "Interactive quiz and planning tools"],
  },
  {
    id: "data-analysis",
    title: "Data analysis",
    summary: "Cleaning, querying and summarising datasets, with charts for reporting.",
    technologies: ["Python", "SQL", "MySQL", "SQLite", "MATLAB", "Google Analytics"],
    examples: ["Dataset cleaning and summaries", "Analytics review"],
  },
  {
    id: "technical-documentation",
    title: "Technical documentation",
    summary: "Clear reports and documentation for technical work.",
    technologies: ["Overleaf / LaTeX", "Markdown"],
    examples: ["Project reports", "Technical write-ups and notes"],
  },
  {
    id: "circuit-and-simulation",
    title: "Circuit design and simulation support",
    summary: "Circuit simulation, component calculations and schematic work.",
    technologies: ["NI Multisim", "Proteus", "MATLAB", "AutoCAD"],
    examples: ["Circuit simulation for coursework or prototypes", "Component and power calculations"],
  },
  {
    id: "embedded-and-automation",
    title: "Embedded and automation prototypes",
    summary: "Microcontroller-based sensing, telemetry and relay-logic prototypes.",
    technologies: ["C", "C++", "Python", "Proteus"],
    examples: ["Sensor telemetry prototypes", "Relay-based power switching logic"],
  },
  {
    id: "research-collaboration",
    title: "Engineering research collaboration",
    summary: "Collaboration on engineering questions that use data and simulation.",
    technologies: ["MATLAB", "Python"],
    examples: ["Literature and data review", "Analysis for shared research questions"],
  },
];
