import { useState } from "react";
import { calcCostPerFeature } from "../utils/cost";

export default function StackCards({ stacks, preset, totalFeatures, sonnetCPF, opusCPF, onDeleteStack, onGenerateCmd, onEditStack }) {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{
      padding: "20px 24px",
      display: "grid",
      gridTemplateColumns: `repeat(${Math.min(stacks.length, 5)}, 1fr)`,
      gap: 8,
    }}>
      {stacks.map((stack, i) => {
        const isSelected = selected === i;
        const costPerFeature = calcCostPerFeature(stack, preset);
        const monthlyCost = (costPerFeature * totalFeatures).toFixed(0);
        const savingsSonnet = ((1 - costPerFeature / sonnetCPF) * 100).toFixed(0);
        const savingsOpus = ((1 - costPerFeature / opusCPF) * 100).toFixed(0);

        return (
          <div
            key={stack.name}
            onClick={() => setSelected(isSelected ? null : i)}
            style={{
              background: isSelected ? "var(--surface2)" : "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "16px 14px",
              cursor: "pointer",
              transition: "all 0.2s",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: 3,
              background: stack.color,
              opacity: isSelected ? 1 : 0.4,
            }} />

            {(onEditStack || onGenerateCmd || onDeleteStack) && (
              <div style={{
                position: "absolute",
                top: 7,
                right: 7,
                display: "flex",
                gap: 2,
              }}>
                {onEditStack && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onEditStack(stack, i); }}
                    title="Editar"
                    style={{
                      width: 18, height: 18, padding: 0,
                      background: "none", border: "none", borderRadius: 3,
                      color: "var(--text3)", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: 0.4, transition: "opacity 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "0.4"}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </button>
                )}
                {onGenerateCmd && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onGenerateCmd(stack); }}
                    title="CLI"
                    style={{
                      width: 18, height: 18, padding: 0,
                      background: "none", border: "none", borderRadius: 3,
                      color: "var(--text3)", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: 0.4, transition: "opacity 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "0.4"}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="4 17 10 11 4 5" />
                      <line x1="12" y1="19" x2="20" y2="19" />
                    </svg>
                  </button>
                )}
                {onDeleteStack && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDeleteStack(i); }}
                    title="Eliminar"
                    style={{
                      width: 18, height: 18, padding: 0,
                      background: "none", border: "none", borderRadius: 3,
                      color: "var(--text3)", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontFamily: "inherit",
                      opacity: 0.4, transition: "opacity 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = "#ef4444"; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = "0.4"; e.currentTarget.style.color = "var(--text3)"; }}
                  >
                    &times;
                  </button>
                )}
              </div>
            )}

            <div style={{
              fontSize: 11,
              fontWeight: 700,
              color: stack.color,
              letterSpacing: 2,
              marginTop: 16,
              marginBottom: 12,
              textTransform: "uppercase",
            }}>
              {stack.name}
            </div>

            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 2, lineHeight: 1 }}>
              ${costPerFeature === 0 ? "0" : costPerFeature < 0.01 ? costPerFeature.toFixed(4) : costPerFeature.toFixed(2)}
            </div>
            <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 16 }}>
              por feature
            </div>

            <div style={{
              fontSize: 18,
              fontWeight: 600,
              color: costPerFeature === 0 ? "#22c55e" : "var(--text)",
            }}>
              ${monthlyCost}
              <span style={{ fontSize: 10, color: "var(--text3)", fontWeight: 400 }}>/mes</span>
            </div>

            {costPerFeature > 0 && (
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

            {costPerFeature === 0 && (
              <div style={{
                fontSize: 10,
                color: "#22c55e",
                marginTop: 4,
                fontWeight: 500,
              }}>
                100% Gratis
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
  );
}
