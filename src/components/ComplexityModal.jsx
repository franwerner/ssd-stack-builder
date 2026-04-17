import { useState } from "react";
import { phaseOrder, phaseLabels, phaseCategories, catColors } from "../data/constants";

export default function ComplexityModal({ onSave, onClose }) {
  const [name, setName] = useState("");
  const [phases, setPhases] = useState(
    Object.fromEntries(phaseOrder.map(p => [p, { input: "", output: "" }]))
  );

  const setPhaseValue = (phase, field, val) => {
    setPhases(prev => ({ ...prev, [phase]: { ...prev[phase], [field]: val } }));
  };

  const totalInput = phaseOrder.reduce((sum, p) => sum + (parseInt(phases[p].input) || 0), 0);
  const totalOutput = phaseOrder.reduce((sum, p) => sum + (parseInt(phases[p].output) || 0), 0);
  const allFilled = phaseOrder.every(p => phases[p].input && phases[p].output) && name.trim();

  const handleSave = () => {
    if (!allFilled) return;
    const preset = {
      label: name.trim(),
      inputTotal: totalInput * 1000,
      outputTotal: totalOutput * 1000,
    };
    const distribution = Object.fromEntries(
      phaseOrder.map(p => [p, {
        input: parseInt(phases[p].input) * 1000,
        output: parseInt(phases[p].output) * 1000,
      }])
    );
    onSave(preset, distribution);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          maxWidth: 520,
          width: "100%",
          maxHeight: "85vh",
          overflow: "auto",
          position: "relative",
          padding: 24,
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 28,
            height: 28,
            fontSize: 16,
            fontFamily: "inherit",
            background: "var(--surface2)",
            color: "var(--text3)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          &times;
        </button>

        <div style={{
          fontSize: 11,
          color: "var(--text3)",
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 16,
        }}>
          Complejidad personalizada
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 10, color: "var(--text3)", display: "block", marginBottom: 4 }}>
            Nombre del preset
          </label>
          <input
            autoFocus
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="ej: Mi proyecto"
            style={{
              padding: "8px 12px",
              fontSize: 12,
              fontFamily: "inherit",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 5,
              color: "var(--text)",
              width: "100%",
              outline: "none",
            }}
          />
        </div>

        <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 8 }}>
          Tokens por fase (en K, ej: 8 = 8.000 tokens)
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "110px 1fr 1fr",
          gap: "6px 10px",
          alignItems: "center",
          marginBottom: 16,
        }}>
          <span style={{ fontSize: 9, color: "var(--text3)", fontWeight: 600 }}>FASE</span>
          <span style={{ fontSize: 9, color: "var(--text3)", fontWeight: 600, textAlign: "center" }}>INPUT (K)</span>
          <span style={{ fontSize: 9, color: "var(--text3)", fontWeight: 600, textAlign: "center" }}>OUTPUT (K)</span>

          {phaseOrder.map(phase => {
            const cat = phaseCategories[phase];
            return [
              <div key={`${phase}-l`} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: catColors[cat].text,
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 11, fontWeight: 500 }}>{phaseLabels[phase]}</span>
              </div>,
              <input
                key={`${phase}-i`}
                type="number"
                min="0"
                value={phases[phase].input}
                onChange={e => setPhaseValue(phase, "input", e.target.value)}
                placeholder="0"
                style={{
                  padding: "5px 8px",
                  fontSize: 11,
                  fontFamily: "inherit",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  color: "var(--text)",
                  width: "100%",
                  outline: "none",
                  textAlign: "center",
                }}
              />,
              <input
                key={`${phase}-o`}
                type="number"
                min="0"
                value={phases[phase].output}
                onChange={e => setPhaseValue(phase, "output", e.target.value)}
                placeholder="0"
                style={{
                  padding: "5px 8px",
                  fontSize: 11,
                  fontFamily: "inherit",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  color: "var(--text)",
                  width: "100%",
                  outline: "none",
                  textAlign: "center",
                }}
              />,
            ];
          })}
        </div>

        {/* Totals */}
        <div style={{
          display: "flex",
          gap: 16,
          marginBottom: 16,
          padding: "10px 14px",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 6,
        }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "var(--text3)" }}>Total entrada</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#c084fc" }}>{totalInput}K</div>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "var(--text3)" }}>Total salida</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#c084fc" }}>{totalOutput}K</div>
          </div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: "var(--text3)" }}>Total</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{totalInput + totalOutput}K</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleSave}
            disabled={!allFilled}
            style={{
              padding: "8px 20px",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "inherit",
              background: allFilled ? "rgba(168,85,247,0.15)" : "var(--surface2)",
              color: allFilled ? "#c084fc" : "var(--text3)",
              border: `1px solid ${allFilled ? "rgba(168,85,247,0.3)" : "var(--border)"}`,
              borderRadius: 6,
              cursor: allFilled ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            Guardar preset
          </button>
        </div>
      </div>
    </div>
  );
}
