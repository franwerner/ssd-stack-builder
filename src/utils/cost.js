import { phaseOrder, phaseTokens, baseInputTotal, baseOutputTotal } from "../data/constants";

export function calcCostPerFeature(stack, preset) {
  const inputScale = preset.inputTotal / baseInputTotal;
  const outputScale = preset.outputTotal / baseOutputTotal;
  let cost = 0;
  for (const phase of phaseOrder) {
    const t = phaseTokens[phase];
    const m = stack.phases[phase];
    cost += (t.input * inputScale * m.input + t.output * outputScale * m.output) / 1_000_000;
  }
  return cost;
}

export function calcRefCost(ref, preset) {
  return (preset.inputTotal * ref.input + preset.outputTotal * ref.output) / 1_000_000;
}

export function resolveModel(modelName, modelId, orModels) {
  const lower = (modelName || "").toLowerCase();
  const found =
    (modelId && orModels.find(m => m.id === modelId))
    || (modelName && orModels.find(m => m.name === modelName))
    || (lower && orModels.find(m => m.name.toLowerCase().includes(lower) || m.id.toLowerCase().includes(lower.replace(/\s+/g, "-"))));
  return {
    name: found?.name || modelName || "",
    id: found?.id || modelId || "",
    input: found?.inputPer1M || 0,
    output: found?.outputPer1M || 0,
    context: found?.context > 0 ? `${(found.context / 1000).toFixed(0)}K` : "",
  };
}
