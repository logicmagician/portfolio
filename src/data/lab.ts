// Laboratory registry. "available" tools have a calculator in src/lib/lab/calculators.ts.
// "planned" tools are listed for transparency and have no page or working code yet.

export type LabStatus = "available" | "planned";

export type LabTool = {
  slug: string;
  title: string;
  category: string;
  status: LabStatus;
  summary: string;
  assumptions: string[];
  limitations: string[];
};

export const labCategories = [
  "Electrical Engineering",
  "Solar & Renewable Energy",
  "Electronics",
  "Programming & Data",
  "Engineering Experiments",
];

export const labTools: LabTool[] = [
  {
    slug: "ohm-law",
    title: "Ohm's law calculator",
    category: "Electrical Engineering",
    status: "available",
    summary: "Enter any two of voltage, current, resistance and power to solve the other two.",
    assumptions: ["Ideal resistive DC circuit", "Values are steady, not time-varying"],
    limitations: ["Does not model tolerance, temperature or non-linear components"],
  },
  {
    slug: "resistor-combination",
    title: "Series and parallel resistance",
    category: "Electrical Engineering",
    status: "available",
    summary: "Combine a list of resistors in series and in parallel.",
    assumptions: ["Ideal resistors with no tolerance applied"],
    limitations: ["Does not account for wiring resistance or component power ratings"],
  },
  {
    slug: "voltage-divider",
    title: "Voltage divider",
    category: "Electronics",
    status: "available",
    summary: "Calculate the output voltage of a two-resistor divider.",
    assumptions: ["No load connected to the output node"],
    limitations: ["A load on the output changes the result; the calculator does not model it"],
  },
  {
    slug: "led-resistor",
    title: "LED current-limiting resistor",
    category: "Electronics",
    status: "available",
    summary: "Find the series resistor for an LED from supply voltage, forward voltage and target current.",
    assumptions: ["LED forward voltage is constant at the target current"],
    limitations: ["Does not select a standard value or check the LED's maximum current rating"],
  },
  {
    slug: "solar-pv-energy",
    title: "Solar PV energy estimate",
    category: "Solar & Renewable Energy",
    status: "available",
    summary: "Estimate daily and monthly energy from array size, peak sun hours and performance ratio.",
    assumptions: ["Average peak sun hours represent the site", "Performance ratio captures typical system losses"],
    limitations: ["Not a system design. Ignores shading, temperature, degradation and inverter sizing."],
  },
  {
    slug: "data-visualization",
    title: "Data visualization",
    category: "Programming & Data",
    status: "planned",
    summary: "Interactive charts for engineering datasets.",
    assumptions: [],
    limitations: [],
  },
  {
    slug: "ml-demonstration",
    title: "Machine learning demonstration",
    category: "Programming & Data",
    status: "planned",
    summary: "Small, explained models applied to sample engineering data.",
    assumptions: [],
    limitations: [],
  },
  {
    slug: "algorithm-demonstration",
    title: "Algorithm demonstration",
    category: "Programming & Data",
    status: "planned",
    summary: "Step-through visualizations of common algorithms.",
    assumptions: [],
    limitations: [],
  },
  {
    slug: "circuit-simulation",
    title: "Circuit simulation",
    category: "Engineering Experiments",
    status: "planned",
    summary: "Browser-based circuit simulation for teaching.",
    assumptions: [],
    limitations: [],
  },
];
