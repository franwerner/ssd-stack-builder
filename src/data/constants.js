export const phaseOrder = [
  "orchestrator", "init", "explore", "propose", "spec",
  "design", "tasks", "apply", "verify", "archive",
];

export const phaseLabels = {
  orchestrator: "Orchestrator",
  init: "Init",
  explore: "Explore",
  propose: "Propose",
  spec: "Spec",
  design: "Design",
  tasks: "Tasks",
  apply: "Apply",
  verify: "Verify",
  archive: "Archive",
};

export const phaseCategories = {
  orchestrator: "coord",
  init: "coord",
  explore: "exec",
  propose: "reason",
  spec: "reason",
  design: "reason",
  tasks: "exec",
  apply: "exec",
  verify: "coord",
  archive: "coord",
};

export const catColors = {
  coord: { bg: "rgba(100,116,139,0.12)", text: "#94a3b8", label: "Coordinación" },
  exec: { bg: "rgba(59,130,246,0.12)", text: "#60a5fa", label: "Ejecución" },
  reason: { bg: "rgba(168,85,247,0.12)", text: "#c084fc", label: "Razonamiento" },
};

export const phaseTokens = {
  orchestrator: { input: 8000, output: 2000 },
  init: { input: 5000, output: 1000 },
  explore: { input: 15000, output: 5000 },
  propose: { input: 10000, output: 8000 },
  spec: { input: 12000, output: 10000 },
  design: { input: 15000, output: 12000 },
  tasks: { input: 10000, output: 6000 },
  apply: { input: 20000, output: 15000 },
  verify: { input: 10000, output: 3000 },
  archive: { input: 3000, output: 1000 },
};

export const baseInputTotal = 108000;
export const baseOutputTotal = 63000;

export const tokenPresets = {
  light: { label: "Light", inputTotal: 70000, outputTotal: 40000, desc: "Features chicas" },
  medium: { label: "Medium", inputTotal: 108000, outputTotal: 63000, desc: "Features modulares" },
  heavy: { label: "Heavy", inputTotal: 180000, outputTotal: 100000, desc: "Features complejas" },
};
