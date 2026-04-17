import { useState, useMemo } from "react";
import { phaseOrder } from "../data/constants";

export default function CommandModal({ stack, onClose }) {
  const [copied, setCopied] = useState(false);

  const profileName = stack.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const commands = useMemo(() => {
    const orchestratorId = stack.phases.orchestrator.modelId || stack.phases.orchestrator.model;
    const cmds = [`gentle-ai sync --profile ${profileName}:openrouter/${orchestratorId}`];
    phaseOrder.forEach(phase => {
      if (phase === "orchestrator") return;
      const p = stack.phases[phase];
      const id = p.modelId || p.model;
      cmds.push(`gentle-ai sync --profile-phase ${profileName}:sdd-${phase}:openrouter/${id}`);
    });
    return cmds;
  }, [stack, profileName]);

  const allText = commands.join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(allText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
          maxWidth: 600,
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

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{
            fontSize: 11,
            color: "var(--text3)",
            letterSpacing: 2,
            textTransform: "uppercase",
          }}>
            Sincronizar perfil
          </span>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            color: stack.color,
          }}>
            {stack.name}
          </span>
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}>
          <span style={{ fontSize: 10, color: "var(--text3)" }}>
            {commands.length} comando{commands.length > 1 ? "s" : ""}
          </span>
          <button
            onClick={handleCopy}
            style={{
              padding: "4px 10px",
              fontSize: 10,
              fontFamily: "inherit",
              background: copied ? "rgba(34,197,94,0.15)" : "rgba(168,85,247,0.12)",
              color: copied ? "#4ade80" : "#c084fc",
              border: `1px solid ${copied ? "rgba(34,197,94,0.25)" : "rgba(168,85,247,0.25)"}`,
              borderRadius: 4,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {copied ? "Copiado" : "Copiar todo"}
          </button>
        </div>

        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: "12px 14px",
          overflowX: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}>
          {commands.map((cmd, i) => (
            <div key={i} style={{
              fontSize: 10,
              color: "var(--text2)",
              fontFamily: "inherit",
              lineHeight: 2,
              whiteSpace: "nowrap",
            }}>
              <span style={{ color: "#4ade80", userSelect: "none" }}>$ </span>
              {cmd}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
