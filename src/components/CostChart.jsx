import { calcCostPerFeature } from "../utils/cost";

export default function CostChart({ stacks, preset, totalFeatures, references }) {
  const opusRef = references[references.length - 1];
  const maxCost = opusRef.cpf * totalFeatures;

  const bars = [
    ...stacks.map(s => ({ name: s.name, color: s.color, cpf: calcCostPerFeature(s, preset) })),
    ...references.map(r => ({ name: r.name, color: r.color, cpf: r.cpf })),
  ];

  return (
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
        {bars.map(s => {
          const cost = s.cpf * totalFeatures;
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
  );
}
