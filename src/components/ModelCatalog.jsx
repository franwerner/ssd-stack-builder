export default function ModelCatalog({ models }) {
  if (!models || models.length === 0) return null;

  return (
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
        {models.map(m => (
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
            <div style={{ fontSize: 10, color: m.price === "Gratis" ? "#22c55e" : "var(--text2)" }}>
              {m.price}
            </div>
            {m.tier && (
              <div style={{ fontSize: 9, color: "var(--text3)", marginTop: 4 }}>{m.tier}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
