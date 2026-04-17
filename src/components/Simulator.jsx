export default function Simulator({
  featuresPerDay, setFeaturesPerDay,
  workDays, setWorkDays,
  tokenPreset, setTokenPreset,
  totalFeatures, preset,
  allPresets,
}) {
  return (
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
        <label style={{ fontSize: 11, color: "var(--text2)" }}>Features/d&iacute;a</label>
        <input
          type="range" min={1} max={30} value={featuresPerDay}
          onChange={e => setFeaturesPerDay(+e.target.value)}
          style={{ width: 80, accentColor: "#a855f7" }}
        />
        <span style={{ fontSize: 13, fontWeight: 600, minWidth: 24 }}>{featuresPerDay}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: "var(--text2)" }}>D&iacute;as/mes</label>
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

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
        <label style={{ fontSize: 11, color: "var(--text2)" }}>Complejidad</label>
        <div style={{ display: "flex", gap: 4 }}>
          {Object.entries(allPresets).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setTokenPreset(key)}
              style={{
                padding: "4px 10px",
                fontSize: 10,
                fontWeight: tokenPreset === key ? 700 : 400,
                fontFamily: "inherit",
                background: tokenPreset === key ? "rgba(168,85,247,0.15)" : "var(--surface)",
                color: tokenPreset === key ? "#c084fc" : "var(--text3)",
                border: `1px solid ${tokenPreset === key ? "rgba(168,85,247,0.3)" : "var(--border)"}`,
                borderRadius: 4,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 9, color: "var(--text3)" }}>
          {(preset.inputTotal / 1000).toFixed(0)}K entrada + {(preset.outputTotal / 1000).toFixed(0)}K salida
        </span>
      </div>
    </div>
  );
}
