import { useState, useMemo } from "react";
import { phaseOrder, phaseLabels, phaseCategories, catColors } from "../data/constants";
import { calcCostPerFeature, resolveModel } from "../utils/cost";

const defaultColors = ["#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#f97316"];

function ModelSelect({ value, onChange, models, search, setSearch, open, setOpen }) {

  const filtered = useMemo(() => {
    if (!search) return models.slice(0, 50);
    const q = search.toLowerCase();
    return models.filter(m => m.name.toLowerCase().includes(q) || m.id.toLowerCase().includes(q)).slice(0, 50);
  }, [models, search]);

  return (
    <div style={{ position: "relative" }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "6px 8px",
          fontSize: 10,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 4,
          cursor: "pointer",
          color: value ? "var(--text)" : "var(--text3)",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minHeight: 28,
        }}
      >
        {value || "Elegir modelo..."}
      </div>
      {open && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          zIndex: 100,
          background: "var(--surface2)",
          border: "1px solid var(--border)",
          borderRadius: 4,
          maxHeight: 220,
          overflow: "auto",
          minWidth: 280,
        }}>
          <input
            autoFocus
            placeholder="Buscar modelo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClick={e => e.stopPropagation()}
            style={{
              width: "100%",
              padding: "8px",
              fontSize: 10,
              fontFamily: "inherit",
              background: "var(--surface)",
              border: "none",
              borderBottom: "1px solid var(--border)",
              color: "var(--text)",
              outline: "none",
            }}
          />
          {filtered.map(m => (
            <div
              key={m.id}
              onClick={(e) => {
                e.stopPropagation();
                onChange(m);
                setOpen(false);
                setSearch("");
              }}
              style={{
                padding: "6px 8px",
                fontSize: 10,
                cursor: "pointer",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(168,85,247,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {m.name}
              </span>
              <span style={{
                color: m.isFree ? "#22c55e" : "var(--text3)",
                flexShrink: 0,
                fontSize: 9,
              }}>
                {m.isFree ? "Gratis" : `$${m.inputPer1M.toFixed(2)}/$${m.outputPer1M.toFixed(2)}`}
                {m.context > 0 && ` \u2022 ${(m.context / 1000).toFixed(0)}K`}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 12, fontSize: 10, color: "var(--text3)", textAlign: "center" }}>
              Sin resultados
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function resolveInitialPhases(initialData, models) {
  if (!initialData?.phases) return Object.fromEntries(phaseOrder.map(p => [p, { model: "", input: 0, output: 0 }]));
  return Object.fromEntries(phaseOrder.map(p => {
    const v = initialData.phases[p] || {};
    const needsResolve = !v.input && !v.output && (v.modelId || v.model);
    if (!needsResolve && v.model) return [p, v];
    const resolved = resolveModel(v.model, v.modelId, models);
    return [p, {
      model: v.model || resolved.name,
      modelId: v.modelId || resolved.id,
      context: v.context || resolved.context,
      input: v.input ?? resolved.input,
      output: v.output ?? resolved.output,
    }];
  }));
}

export default function StackBuilder({ onSave, models, modelsLoading: loading, modelsError: error, initialData, allPresets, defaultPreset }) {
  const [localPreset, setLocalPreset] = useState(defaultPreset || "medium");
  const preset = allPresets?.[localPreset] || allPresets?.medium || { inputTotal: 108000, outputTotal: 63000 };
  const [name, setName] = useState(initialData?.name || "");
  const [color, setColor] = useState(initialData?.color || defaultColors[1]);
  const [bestFor, setBestFor] = useState(initialData?.bestFor || "");
  const [limits, setLimits] = useState(initialData?.limits || "");
  const [openPhase, setOpenPhase] = useState(null);
  const [phases, setPhases] = useState(() => resolveInitialPhases(initialData, models));
  const [searchStates, setSearchStates] = useState(
    Object.fromEntries(phaseOrder.map(p => [p, ""]))
  );

  const [defaultSearch, setDefaultSearch] = useState("");

  const applyToAll = (model) => {
    const ctx = model.context > 0 ? `${(model.context / 1000).toFixed(0)}K` : "";
    const entry = { model: model.name, modelId: model.id, context: ctx, input: model.inputPer1M, output: model.outputPer1M };
    setPhases(Object.fromEntries(phaseOrder.map(p => [p, { ...entry }])));
  };

  const handleModelSelect = (phase, model) => {
    const ctx = model.context > 0 ? `${(model.context / 1000).toFixed(0)}K` : "";
    setPhases(prev => ({
      ...prev,
      [phase]: {
        model: model.name,
        modelId: model.id,
        context: ctx,
        input: model.inputPer1M,
        output: model.outputPer1M,
      },
    }));
  };

  const setSearchForPhase = (phase, val) => {
    setSearchStates(prev => ({ ...prev, [phase]: val }));
  };

  const stack = { name: name || "NEW", color, phases, bestFor, limits };
  const cpf = calcCostPerFeature(stack, preset);
  const allPhasesSet = phaseOrder.every(p => phases[p].model);

  const handleSave = () => {
    if (!name.trim() || !allPhasesSet) return;
    onSave({ ...stack, name: name.trim() });
    setName("");
    setBestFor("");
    setLimits("");
    setPhases(Object.fromEntries(phaseOrder.map(p => [p, { model: "", input: 0, output: 0 }])));
  };

  return (
    <div style={{ padding: "20px 24px" }}>
      <div style={{
        fontSize: 11,
        color: "var(--text3)",
        letterSpacing: 2,
        textTransform: "uppercase",
        marginBottom: 16,
      }}>
        {initialData ? "Editar Stack" : "Crear Stack"}
      </div>

      {error && (
        <div style={{
          padding: "10px 14px",
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.2)",
          borderRadius: 6,
          fontSize: 11,
          color: "#ef4444",
          marginBottom: 16,
        }}>
          Error cargando modelos de OpenRouter: {error}
        </div>
      )}

      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: 16,
      }}>
        {/* Stack meta */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div>
            <label style={{ fontSize: 10, color: "var(--text3)", display: "block", marginBottom: 4 }}>Nombre</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Mi Stack"
              style={{
                padding: "6px 10px",
                fontSize: 12,
                fontFamily: "inherit",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                color: "var(--text)",
                width: 160,
                outline: "none",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 10, color: "var(--text3)", display: "block", marginBottom: 4 }}>Color</label>
            <div style={{ display: "flex", gap: 4 }}>
              {defaultColors.map(c => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  style={{
                    width: 20, height: 20,
                    borderRadius: 4,
                    background: c,
                    cursor: "pointer",
                    border: color === c ? "2px solid var(--text)" : "2px solid transparent",
                  }}
                />
              ))}
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 140 }}>
            <label style={{ fontSize: 10, color: "var(--text3)", display: "block", marginBottom: 4 }}>Ideal para</label>
            <input
              value={bestFor}
              onChange={e => setBestFor(e.target.value)}
              placeholder="Descripci&oacute;n breve..."
              style={{
                padding: "6px 10px",
                fontSize: 11,
                fontFamily: "inherit",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                color: "var(--text)",
                width: "100%",
                outline: "none",
              }}
            />
          </div>
          <div style={{
            padding: "6px 12px",
            background: "var(--surface2)",
            borderRadius: 4,
            border: "1px solid var(--border)",
            textAlign: "center",
          }}>
            <div style={{ fontSize: 9, color: "var(--text3)" }}>Costo/feature</div>
            <div style={{ fontSize: 16, fontWeight: 700, color }}>
              ${cpf === 0 ? "0" : cpf < 0.01 ? cpf.toFixed(4) : cpf.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Local complexity selector */}
        {allPresets && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
            paddingBottom: 14,
            borderBottom: "1px solid var(--border)",
          }}>
            <span style={{ fontSize: 10, color: "var(--text3)" }}>Complejidad</span>
            <div style={{ display: "flex", gap: 4 }}>
              {Object.entries(allPresets).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => setLocalPreset(key)}
                  style={{
                    padding: "3px 8px",
                    fontSize: 9,
                    fontWeight: localPreset === key ? 700 : 400,
                    fontFamily: "inherit",
                    background: localPreset === key ? "rgba(168,85,247,0.15)" : "var(--surface)",
                    color: localPreset === key ? "#c084fc" : "var(--text3)",
                    border: `1px solid ${localPreset === key ? "rgba(168,85,247,0.3)" : "var(--border)"}`,
                    borderRadius: 3,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <span style={{ fontSize: 8, color: "var(--text3)" }}>
              {(preset.inputTotal / 1000).toFixed(0)}K entrada + {(preset.outputTotal / 1000).toFixed(0)}K salida
            </span>
          </div>
        )}

        {/* Phase assignment */}
        {loading ? (
          <div style={{ padding: 20, textAlign: "center", fontSize: 11, color: "var(--text3)" }}>
            Cargando modelos de OpenRouter...
          </div>
        ) : (
          <div>
            {/* Default model for all */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr auto",
              gap: "6px 12px",
              alignItems: "center",
              marginBottom: 10,
              paddingBottom: 10,
              borderBottom: "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#c084fc",
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#c084fc" }}>Todas</span>
              </div>
              <ModelSelect
                value=""
                onChange={m => { applyToAll(m); }}
                models={models}
                search={defaultSearch}
                setSearch={setDefaultSearch}
                open={openPhase === "__all__"}
                setOpen={v => setOpenPhase(v ? "__all__" : null)}
              />
              <span style={{ fontSize: 9, color: "var(--text3)", whiteSpace: "nowrap" }}>
                Aplicar a todas las fases
              </span>
            </div>

          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr auto", gap: "6px 12px", alignItems: "center" }}>
            {phaseOrder.map(phase => {
              const cat = phaseCategories[phase];
              const p = phases[phase];
              return [
                <div key={`${phase}-label`} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: catColors[cat].text,
                    flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 11, fontWeight: 500 }}>{phaseLabels[phase]}</span>
                </div>,
                <ModelSelect
                  key={`${phase}-select`}
                  value={p.model}
                  onChange={m => handleModelSelect(phase, m)}
                  models={models}
                  search={searchStates[phase]}
                  setSearch={val => setSearchForPhase(phase, val)}
                  open={openPhase === phase}
                  setOpen={v => setOpenPhase(v ? phase : null)}
                />,
                <span key={`${phase}-info`} style={{ fontSize: 9, color: "var(--text3)", whiteSpace: "nowrap", display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ color: p.model ? (p.input === 0 && p.output === 0 ? "#4ade80" : "var(--text2)") : "var(--text3)" }}>
                    {p.model ? (
                      p.input === 0 && p.output === 0
                        ? "Gratis"
                        : `$${p.input.toFixed(2)} / $${p.output.toFixed(2)}`
                    ) : "—"}
                  </span>
                  {p.context && (
                    <span style={{ background: "var(--surface)", padding: "1px 5px", borderRadius: 3, fontSize: 8 }}>
                      {p.context}
                    </span>
                  )}
                </span>,
              ];
            })}
          </div>
          </div>
        )}

        {/* Save */}
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={handleSave}
            disabled={!name.trim() || !allPhasesSet}
            style={{
              padding: "8px 20px",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "inherit",
              background: name.trim() && allPhasesSet ? color : "var(--surface2)",
              color: name.trim() && allPhasesSet ? "#fff" : "var(--text3)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              cursor: name.trim() && allPhasesSet ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            {initialData ? "Actualizar Stack" : "Guardar Stack"}
          </button>
        </div>
      </div>
    </div>
  );
}
