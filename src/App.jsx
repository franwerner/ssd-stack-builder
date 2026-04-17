import { useState } from "react";

const stacks = [
  {
    name: "FREE",
    color: "#22c55e",
    costPerFeature: 0,
    monthly: 0,
    phases: {
      orchestrator: { model: "MiniMax M2.5 :free", input: 0, output: 0 },
      init: { model: "MiniMax M2.5 :free", input: 0, output: 0 },
      explore: { model: "Gemma 4 31B :free", input: 0, output: 0 },
      propose: { model: "GPT-OSS-120B :free", input: 0, output: 0 },
      spec: { model: "GPT-OSS-120B :free", input: 0, output: 0 },
      design: { model: "GPT-OSS-120B :free", input: 0, output: 0 },
      tasks: { model: "Nemotron 3 Super :free", input: 0, output: 0 },
      apply: { model: "Nemotron 3 Super :free", input: 0, output: 0 },
      verify: { model: "MiniMax M2.5 :free", input: 0, output: 0 },
      archive: { model: "MiniMax M2.5 :free", input: 0, output: 0 },
    },
    limits: "200 req/día por modelo • Output 8K en M2.5 • Recolección de datos",
    bestFor: "Experimentación, prototipos, aprender SDD",
  },
  {
    name: "LOW",
    color: "#3b82f6",
    costPerFeature: 0.18,
    monthly: 36,
    phases: {
      orchestrator: { model: "MiniMax M2.5", input: 0.118, output: 0.99 },
      init: { model: "MiniMax M2.5", input: 0.118, output: 0.99 },
      explore: { model: "DeepSeek V3.2", input: 0.26, output: 0.38 },
      propose: { model: "DeepSeek V3.2", input: 0.26, output: 0.38 },
      spec: { model: "DeepSeek V3.2", input: 0.26, output: 0.38 },
      design: { model: "DeepSeek V3.2", input: 0.26, output: 0.38 },
      tasks: { model: "DeepSeek V3.2", input: 0.26, output: 0.38 },
      apply: { model: "DeepSeek V3.2", input: 0.26, output: 0.38 },
      verify: { model: "MiniMax M2.5", input: 0.118, output: 0.99 },
      archive: { model: "MiniMax M2.5", input: 0.118, output: 0.99 },
    },
    limits: "Sin rate limits • Sin recolección de datos",
    bestFor: "Features simples, fixes, módulos pequeños",
  },
  {
    name: "LOW-MED",
    color: "#a855f7",
    costPerFeature: 0.28,
    monthly: 56,
    phases: {
      orchestrator: { model: "MiniMax M2.5", input: 0.118, output: 0.99 },
      init: { model: "MiniMax M2.5", input: 0.118, output: 0.99 },
      explore: { model: "DeepSeek V3.2", input: 0.26, output: 0.38 },
      propose: { model: "V3.2 Speciale", input: 0.40, output: 1.20 },
      spec: { model: "V3.2 Speciale", input: 0.40, output: 1.20 },
      design: { model: "V3.2 Speciale", input: 0.40, output: 1.20 },
      tasks: { model: "DeepSeek V3.2", input: 0.26, output: 0.38 },
      apply: { model: "DeepSeek V3.2", input: 0.26, output: 0.38 },
      verify: { model: "MiniMax M2.5", input: 0.118, output: 0.99 },
      archive: { model: "MiniMax M2.5", input: 0.118, output: 0.99 },
    },
    limits: "Sin rate limits • Speciale en propose/spec/design",
    bestFor: "Desarrollo diario, features modulares",
  },
  {
    name: "MEDIUM",
    color: "#f59e0b",
    costPerFeature: 0.30,
    monthly: 60,
    phases: {
      orchestrator: { model: "MiniMax M2.5", input: 0.118, output: 0.99 },
      init: { model: "MiniMax M2.5", input: 0.118, output: 0.99 },
      explore: { model: "DeepSeek V3.2", input: 0.26, output: 0.38 },
      propose: { model: "V3.2 Speciale", input: 0.40, output: 1.20 },
      spec: { model: "V3.2 Speciale", input: 0.40, output: 1.20 },
      design: { model: "GLM 5.1", input: 0.95, output: 3.15 },
      tasks: { model: "DeepSeek V3.2", input: 0.26, output: 0.38 },
      apply: { model: "DeepSeek V3.2", input: 0.26, output: 0.38 },
      verify: { model: "MiniMax M2.5", input: 0.118, output: 0.99 },
      archive: { model: "MiniMax M2.5", input: 0.118, output: 0.99 },
    },
    limits: "GLM 5.1 en design • Speciale en propose/spec",
    bestFor: "Features complejas, refactors medianos",
  },
  {
    name: "HIGH",
    color: "#ef4444",
    costPerFeature: 0.55,
    monthly: 110,
    phases: {
      orchestrator: { model: "MiniMax M2.7", input: 0.30, output: 1.20 },
      init: { model: "MiniMax M2.5", input: 0.118, output: 0.99 },
      explore: { model: "V3.2 Speciale", input: 0.40, output: 1.20 },
      propose: { model: "GLM 5.1", input: 0.95, output: 3.15 },
      spec: { model: "GLM 5.1", input: 0.95, output: 3.15 },
      design: { model: "GLM 5.1", input: 0.95, output: 3.15 },
      tasks: { model: "V3.2 Speciale", input: 0.40, output: 1.20 },
      apply: { model: "V3.2 Speciale", input: 0.40, output: 1.20 },
      verify: { model: "DeepSeek V3.2", input: 0.26, output: 0.38 },
      archive: { model: "MiniMax M2.5", input: 0.118, output: 0.99 },
    },
    limits: "GLM 5.1 en diseño completo • Speciale en ejecución",
    bestFor: "Arquitectura nueva, sistemas complejos, producción",
  },
];

const sonnetRef = { costPerFeature: 5.85, monthly: 1170 };
const opusRef = { costPerFeature: 17.50, monthly: 3500 };

const modelContext = {
  "MiniMax M2.5 :free": "196K",
  "MiniMax M2.5": "196K",
  "MiniMax M2.7": "196K",
  "Gemma 4 31B :free": "256K",
  "GPT-OSS-120B :free": "131K",
  "Nemotron 3 Super :free": "262K",
  "DeepSeek V3.2": "163K",
  "V3.2 Speciale": "163K",
  "GLM 5.1": "203K",
};

const phaseOrder = [
  "orchestrator", "init", "explore", "propose", "spec",
  "design", "tasks", "apply", "verify", "archive",
];

const phaseLabels = {
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

const phaseCategories = {
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

const catColors = {
  coord: { bg: "rgba(100,116,139,0.12)", text: "#94a3b8", label: "Coordinación" },
  exec: { bg: "rgba(59,130,246,0.12)", text: "#60a5fa", label: "Ejecución" },
  reason: { bg: "rgba(168,85,247,0.12)", text: "#c084fc", label: "Razonamiento" },
};

export default function SddComparison() {
  const [selected, setSelected] = useState(null);
  const [featuresPerDay, setFeaturesPerDay] = useState(10);
  const [workDays, setWorkDays] = useState(20);

  const totalFeatures = featuresPerDay * workDays;

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      background: "var(--bg, #0a0a0b)",
      color: "var(--text, #e2e2e6)",
      minHeight: "100vh",
      padding: "0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap');
        :root {
          --bg: #0a0a0b;
          --surface: #111113;
          --surface2: #18181b;
          --border: #27272a;
          --text: #e2e2e6;
          --text2: #a1a1aa;
          --text3: #71717a;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: var(--surface); }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "32px 24px 24px",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: "var(--text3)", letterSpacing: 3, textTransform: "uppercase" }}>
            gentle-ai × opencode
          </span>
        </div>
        <h1 style={{
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: -0.5,
          marginBottom: 8,
        }}>
          SDD Stack Profiles
        </h1>
        <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.5 }}>
          Comparativa de 5 configuraciones por costo-rendimiento para Spec-Driven Development
        </p>
      </div>

      {/* Calculator */}
      <div style={{
        padding: "16px 24px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        gap: 24,
        alignItems: "center",
        flexWrap: "wrap",
      }}>
        <span style={{ fontSize: 11, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 2 }}>
          Simulador
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 11, color: "var(--text2)" }}>Features/día</label>
          <input
            type="range" min={1} max={30} value={featuresPerDay}
            onChange={e => setFeaturesPerDay(+e.target.value)}
            style={{ width: 80, accentColor: "#a855f7" }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, minWidth: 24 }}>{featuresPerDay}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontSize: 11, color: "var(--text2)" }}>Días/mes</label>
          <input
            type="range" min={5} max={30} value={workDays}
            onChange={e => setWorkDays(+e.target.value)}
            style={{ width: 80, accentColor: "#a855f7" }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, minWidth: 24 }}>{workDays}</span>
        </div>
        <span style={{ fontSize: 11, color: "var(--text3)" }}>
          = {totalFeatures} features/mes
        </span>
      </div>

      {/* Stack Cards */}
      <div style={{
        padding: "20px 24px",
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 8,
      }}>
        {stacks.map((stack, i) => {
          const isSelected = selected === i;
          const monthlyCost = (stack.costPerFeature * totalFeatures).toFixed(0);
          const savingsSonnet = ((1 - stack.costPerFeature / sonnetRef.costPerFeature) * 100).toFixed(0);
          const savingsOpus = ((1 - stack.costPerFeature / opusRef.costPerFeature) * 100).toFixed(0);

          return (
            <div
              key={stack.name}
              onClick={() => setSelected(isSelected ? null : i)}
              style={{
                background: isSelected ? "var(--surface2)" : "var(--surface)",
                border: `1px solid ${isSelected ? stack.color : "var(--border)"}`,
                borderRadius: 8,
                padding: "16px 14px",
                cursor: "pointer",
                transition: "all 0.2s",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Color bar */}
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 3,
                background: stack.color,
                opacity: isSelected ? 1 : 0.4,
              }} />

              <div style={{
                fontSize: 11,
                fontWeight: 700,
                color: stack.color,
                letterSpacing: 2,
                marginBottom: 12,
                textTransform: "uppercase",
              }}>
                {stack.name}
              </div>

              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 2, lineHeight: 1 }}>
                ${stack.costPerFeature === 0 ? "0" : stack.costPerFeature.toFixed(2)}
              </div>
              <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 16 }}>
                por feature
              </div>

              <div style={{
                fontSize: 18,
                fontWeight: 600,
                color: stack.costPerFeature === 0 ? "#22c55e" : "var(--text)",
              }}>
                ${monthlyCost}
                <span style={{ fontSize: 10, color: "var(--text3)", fontWeight: 400 }}>/mes</span>
              </div>

              {stack.costPerFeature > 0 && (
                <div style={{
                  fontSize: 10,
                  color: "#22c55e",
                  marginTop: 4,
                  fontWeight: 500,
                  lineHeight: 1.6,
                }}>
                  <div>{savingsSonnet}% vs Sonnet</div>
                  <div>{savingsOpus}% vs Opus</div>
                </div>
              )}

              {stack.costPerFeature === 0 && (
                <div style={{
                  fontSize: 10,
                  color: "#22c55e",
                  marginTop: 4,
                  fontWeight: 500,
                }}>
                  100% gratis
                </div>
              )}

              <div style={{
                marginTop: 14,
                paddingTop: 12,
                borderTop: "1px solid var(--border)",
                fontSize: 10,
                color: "var(--text3)",
                lineHeight: 1.5,
              }}>
                {stack.bestFor}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reference Bars */}
      <div style={{
        margin: "0 24px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}>
        <div style={{
          padding: "10px 14px",
          background: "rgba(249,115,22,0.06)",
          border: "1px solid rgba(249,115,22,0.15)",
          borderRadius: 6,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 11,
        }}>
          <span style={{ color: "var(--text3)" }}>
            Ref: <strong style={{ color: "#f97316" }}>Sonnet 4.6</strong> — $5.85/feature • $3.9/$19.5 per 1M tokens
          </span>
          <span style={{ color: "#f97316", fontWeight: 600 }}>
            ${(sonnetRef.costPerFeature * totalFeatures).toFixed(0)}/mes
          </span>
        </div>
        <div style={{
          padding: "10px 14px",
          background: "rgba(220,38,38,0.06)",
          border: "1px solid rgba(220,38,38,0.15)",
          borderRadius: 6,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 11,
        }}>
          <span style={{ color: "var(--text3)" }}>
            Ref: <strong style={{ color: "#dc2626" }}>Opus 4.6</strong> — $17.50/feature • $15/$75 per 1M tokens
          </span>
          <span style={{ color: "#dc2626", fontWeight: 600 }}>
            ${(opusRef.costPerFeature * totalFeatures).toFixed(0)}/mes
          </span>
        </div>
      </div>

      {/* Detail Table */}
      <div style={{
        padding: "20px 24px",
      }}>
        <div style={{
          fontSize: 11,
          color: "var(--text3)",
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 12,
        }}>
          Asignación por fase
        </div>

        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "120px repeat(5, 1fr)",
            borderBottom: "1px solid var(--border)",
            padding: "10px 14px",
          }}>
            <span style={{ fontSize: 10, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
              Fase
            </span>
            {stacks.map(s => (
              <span key={s.name} style={{
                fontSize: 10,
                color: s.color,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1,
                textAlign: "center",
              }}>
                {s.name}
              </span>
            ))}
          </div>

          {/* Rows */}
          {phaseOrder.map((phase, idx) => {
            const cat = phaseCategories[phase];
            return (
              <div
                key={phase}
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px repeat(5, 1fr)",
                  padding: "8px 14px",
                  borderBottom: idx < phaseOrder.length - 1 ? "1px solid var(--border)" : "none",
                  background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: catColors[cat].text,
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 11, fontWeight: 500 }}>
                    {phaseLabels[phase]}
                  </span>
                </div>
                {stacks.map(s => (
                  <div key={s.name} style={{
                    fontSize: 10,
                    color: "var(--text2)",
                    textAlign: "center",
                    lineHeight: 1.4,
                  }}>
                    <div style={{ fontWeight: 500, color: "var(--text)" }}>
                      {s.phases[phase].model}
                    </div>
                    {s.phases[phase].input > 0 && (
                      <div style={{ color: "var(--text3)", fontSize: 9, marginTop: 2 }}>
                        ${s.phases[phase].input}/{s.phases[phase].output} • {modelContext[s.phases[phase].model] || "—"}
                      </div>
                    )}
                    {s.phases[phase].input === 0 && (
                      <div style={{ color: "#22c55e", fontSize: 9, marginTop: 2 }}>
                        free • {modelContext[s.phases[phase].model] || "—"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Category Legend */}
        <div style={{
          display: "flex",
          gap: 16,
          marginTop: 10,
          justifyContent: "flex-end",
        }}>
          {Object.entries(catColors).map(([key, val]) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: val.text,
              }} />
              <span style={{ fontSize: 10, color: "var(--text3)" }}>{val.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Comparison Bar Chart */}
      <div style={{ padding: "0 24px 24px" }}>
        <div style={{
          fontSize: 11,
          color: "var(--text3)",
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 12,
        }}>
          Costo mensual comparativo
        </div>

        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "20px 14px",
        }}>
          {[...stacks,
          { name: "Sonnet 4.6", color: "#f97316", costPerFeature: sonnetRef.costPerFeature },
          { name: "Opus 4.6", color: "#dc2626", costPerFeature: opusRef.costPerFeature },
          ].map(s => {
            const cost = s.costPerFeature * totalFeatures;
            const maxCost = opusRef.costPerFeature * totalFeatures;
            const width = Math.max((cost / maxCost) * 100, cost === 0 ? 1 : 0.5);

            return (
              <div key={s.name} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 10,
              }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: s.color,
                  width: 70,
                  textAlign: "right",
                  flexShrink: 0,
                }}>
                  {s.name}
                </span>
                <div style={{
                  flex: 1,
                  height: 20,
                  background: "var(--surface2)",
                  borderRadius: 4,
                  overflow: "hidden",
                  position: "relative",
                }}>
                  <div style={{
                    width: `${width}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${s.color}33, ${s.color}88)`,
                    borderRadius: 4,
                    transition: "width 0.5s ease",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 8,
                  }}>
                    {width > 8 && (
                      <span style={{ fontSize: 10, fontWeight: 600, color: s.color }}>
                        ${cost.toFixed(0)}
                      </span>
                    )}
                  </div>
                  {width <= 8 && (
                    <span style={{
                      position: "absolute",
                      left: `calc(${width}% + 6px)`,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 10,
                      fontWeight: 600,
                      color: s.color,
                    }}>
                      ${cost.toFixed(0)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Models Used */}
      <div style={{ padding: "0 24px 32px" }}>
        <div style={{
          fontSize: 11,
          color: "var(--text3)",
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 12,
        }}>
          Modelos utilizados
        </div>
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: "16px 14px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: 12,
        }}>
          {[
            { name: "MiniMax M2.5", price: "$0.118 / $0.99", tier: "Mecánico", ctx: "196K" },
            { name: "MiniMax M2.7", price: "$0.30 / $1.20", tier: "Agentic multi-agent", ctx: "196K" },
            { name: "DeepSeek V3.2", price: "$0.26 / $0.38", tier: "Coding GPT-5 class", ctx: "163K" },
            { name: "V3.2 Speciale", price: "$0.40 / $1.20", tier: "Reasoning frontier", ctx: "163K" },
            { name: "GLM 5.1", price: "$0.95 / $3.15", tier: "#1 SWE-Pro • 8h autónomo", ctx: "203K" },
            { name: "GPT-OSS-120B", price: "Free", tier: "OpenAI open-weight 120B", ctx: "131K" },
            { name: "Gemma 4 31B", price: "Free", tier: "Google open-weight", ctx: "256K" },
            { name: "Nemotron 3 Super", price: "Free", tier: "NVIDIA 120B MoE hybrid", ctx: "262K" },
          ].map(m => (
            <div key={m.name} style={{
              padding: "10px 12px",
              background: "var(--surface2)",
              borderRadius: 6,
              border: "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 600 }}>{m.name}</span>
                <span style={{ fontSize: 9, color: "var(--text3)", background: "var(--surface)", padding: "2px 6px", borderRadius: 3 }}>{m.ctx}</span>
              </div>
              <div style={{ fontSize: 10, color: m.price === "Free" ? "#22c55e" : "var(--text2)" }}>
                {m.price}
              </div>
              <div style={{ fontSize: 9, color: "var(--text3)", marginTop: 4 }}>{m.tier}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}