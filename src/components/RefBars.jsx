export default function RefBars({ references, totalFeatures }) {
  const colors = { "Sonnet 4.6": "#f97316", "Opus 4.6": "#dc2626" };
  const bgAlpha = { "Sonnet 4.6": "rgba(249,115,22,", "Opus 4.6": "rgba(220,38,38," };

  return (
    <div style={{
      margin: "0 24px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
    }}>
      {references.map(ref => {
        const c = colors[ref.name] || "#888";
        const bg = bgAlpha[ref.name] || "rgba(136,136,136,";
        return (
          <div key={ref.name} style={{
            padding: "10px 14px",
            background: `${bg}0.06)`,
            border: `1px solid ${bg}0.15)`,
            borderRadius: 6,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 11,
          }}>
            <span style={{ color: "var(--text3)" }}>
              Ref: <strong style={{ color: c }}>{ref.name}</strong> — ${ref.cpf.toFixed(2)}/feature
              {" "}&bull; ${ref.input.toFixed(2)}/${ref.output.toFixed(2)} por 1M tokens
            </span>
            <span style={{ color: c, fontWeight: 600 }}>
              ${(ref.cpf * totalFeatures).toFixed(0)}/mes
            </span>
          </div>
        );
      })}
    </div>
  );
}
