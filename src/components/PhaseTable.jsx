import { phaseOrder, phaseLabels, phaseCategories, catColors } from "../data/constants";

export default function PhaseTable({ stacks, modelContext }) {
  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{
        fontSize: 11,
        color: "var(--text3)",
        letterSpacing: 2,
        textTransform: "uppercase",
        marginBottom: 12,
      }}>
        Asignaci&oacute;n por fase
      </div>

      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        overflow: "hidden",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: `120px repeat(${stacks.length}, 1fr)`,
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

        {phaseOrder.map((phase, idx) => {
          const cat = phaseCategories[phase];
          return (
            <div
              key={phase}
              style={{
                display: "grid",
                gridTemplateColumns: `120px repeat(${stacks.length}, 1fr)`,
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
              {stacks.map(s => {
                const p = s.phases[phase];
                const ctx = modelContext[p.model];
                return (
                  <div key={s.name} style={{
                    fontSize: 10,
                    color: "var(--text2)",
                    textAlign: "center",
                    lineHeight: 1.4,
                  }}>
                    <div style={{ fontWeight: 500, color: "var(--text)" }}>
                      {p.model}
                    </div>
                    {p.input > 0 ? (
                      <div style={{ color: "var(--text3)", fontSize: 9, marginTop: 2 }}>
                        ${p.input.toFixed(2)}/${p.output.toFixed(2)} {ctx ? `\u2022 ${ctx}` : ""}
                      </div>
                    ) : (
                      <div style={{ color: "#22c55e", fontSize: 9, marginTop: 2 }}>
                        Gratis {ctx ? `\u2022 ${ctx}` : ""}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

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
  );
}
