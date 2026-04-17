import { useState } from "react";
import { tokenPresets } from "./data/constants";
import { resolveModel } from "./utils/cost";
import { useOpenRouterModels } from "./hooks/useOpenRouterModels";
import { useProfile } from "./hooks/useProfile";
import Simulator from "./components/Simulator";
import StackDashboard from "./components/StackDashboard";
import StackBuilder from "./components/StackBuilder";
import GuideContent from "./components/GuideContent";
import CommandModal from "./components/CommandModal";
import ComplexityModal from "./components/ComplexityModal";
import GitHubIcon from "./components/GitHubIcon";

export default function App() {
  const [view, setView] = useState("inicio");
  const [customStacks, setCustomStacks] = useState([]);
  const [featuresPerDay, setFeaturesPerDay] = useState(10);
  const [workDays, setWorkDays] = useState(20);
  const [tokenPreset, setTokenPreset] = useState("medium");
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingStack, setEditingStack] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [cmdModalStack, setCmdModalStack] = useState(null);
  const [showComplexity, setShowComplexity] = useState(false);
  const [customPresets, setCustomPresets] = useState({});
  const { models: orModels, loading: orLoading, error: orError } = useOpenRouterModels();
  const { data: profileData, loading: profileLoading } = useProfile("/profiles/franwerner.json");

  const myStacks = profileData?.stacks || [];
  const referenceModels = profileData?.referenceModels || [];
  const myModelContext = profileData?.modelContext || {};
  const myModelCatalog = profileData?.modelCatalog || [];

  const totalFeatures = featuresPerDay * workDays;
  const allPresets = { ...tokenPresets, ...customPresets };
  const preset = allPresets[tokenPreset] || tokenPresets.medium;

  const handleSaveComplexity = (presetData) => {
    const key = presetData.label.toLowerCase().replace(/\s+/g, "-");
    setCustomPresets(prev => ({ ...prev, [key]: presetData }));
    setTokenPreset(key);
  };

  const handleSaveStack = (stack) => {
    if (editingIndex !== null) {
      setCustomStacks(prev => prev.map((s, i) => i === editingIndex ? stack : s));
      setEditingStack(null);
      setEditingIndex(null);
    } else {
      setCustomStacks(prev => [...prev, stack]);
    }
    closeBuilder();
  };

  const handleEditStack = (stack, index) => {
    setEditingStack(stack);
    setEditingIndex(index);
    setShowBuilder(true);
  };

  const closeBuilder = () => {
    setShowBuilder(false);
    setEditingStack(null);
    setEditingIndex(null);
  };

  const handleDeleteStack = (idx) => {
    setCustomStacks(prev => prev.filter((_, i) => i !== idx));
  };

  const resolveModelApi = (modelName, modelId) => resolveModel(modelName, modelId, orModels);

  const exportStacks = (stacks, filename) => {
    const exportData = stacks.map(s => ({
      name: s.name,
      color: s.color,
      bestFor: s.bestFor || "",
      limits: s.limits || "",
      phases: Object.fromEntries(
        Object.entries(s.phases).map(([k, v]) => [k, { modelId: v.modelId }])
      ),
    }));
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExport = () => exportStacks(customStacks, "sdd-stacks.json");
  const handleExportMy = () => exportStacks(myStacks, "franwerner-stacks.json");

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          const arr = Array.isArray(data) ? data : [data];
          const valid = arr.filter(s => s.name && s.phases && s.color);
          if (valid.length > 0) {
            setCustomStacks(prev => [...prev, ...valid]);
          }
        } catch { /* ignore invalid json */ }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Resolve all model data reactively from API
  const resolvedCustomStacks = customStacks.map(s => ({
    ...s,
    phases: Object.fromEntries(
      Object.entries(s.phases).map(([k, v]) => {
        const resolved = resolveModelApi(v.model, v.modelId);
        return [k, {
          model: v.model || resolved.name,
          modelId: v.modelId || resolved.id,
          input: v.input ?? resolved.input,
          output: v.output ?? resolved.output,
          context: v.context || resolved.context,
        }];
      })
    ),
  }));

  const customModelContext = {};
  resolvedCustomStacks.forEach(s => {
    Object.values(s.phases).forEach(p => {
      if (!customModelContext[p.model]) {
        customModelContext[p.model] = p.context || "";
      }
    });
  });

  const customModelCatalog = (() => {
    const seen = new Set();
    const catalog = [];
    resolvedCustomStacks.forEach(s => {
      Object.values(s.phases).forEach(p => {
        if (!seen.has(p.model)) {
          seen.add(p.model);
          catalog.push({
            name: p.model,
            price: p.input === 0 && p.output === 0
              ? "Gratis"
              : `$${p.input.toFixed(2)} / $${p.output.toFixed(2)}`,
            ctx: customModelContext[p.model] || "",
          });
        }
      });
    });
    return catalog;
  })();

  return (
    <div style={{
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      background: "var(--bg, #0a0a0b)",
      color: "var(--text, #e2e2e6)",
      minHeight: "100vh",
      padding: 0,
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
        html { zoom: 1.15; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: var(--surface); }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: "32px 24px 0",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: "var(--text3)", letterSpacing: 3, textTransform: "uppercase" }}>
            gentle-ai &times; opencode
          </span>
          <a
            href="https://github.com/franwerner"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              fontSize: 11,
              fontWeight: 600,
              fontFamily: "inherit",
              color: "var(--text2)",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 5,
              textDecoration: "none",
              transition: "border-color 0.15s",
            }}
          >
            <GitHubIcon size={14} />
            franwerner
          </a>
        </div>
        <h1 style={{
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: -0.5,
          marginBottom: 8,
        }}>
          SDD Stack Builder
        </h1>
        <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.5, marginBottom: 16 }}>
          Comparativa de configuraciones por costo-rendimiento para Spec-Driven Development
        </p>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0 }}>
          {[
            { key: "inicio", label: "Inicio" },
            { key: "stack", label: "Personalizado", count: customStacks.length },
            { key: "franwerner", label: "franwerner", count: myStacks.length, icon: true },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setView(tab.key)}
              style={{
                padding: "10px 20px",
                fontSize: 11,
                fontWeight: view === tab.key ? 700 : 400,
                fontFamily: "inherit",
                background: view === tab.key ? "var(--surface)" : "transparent",
                color: view === tab.key ? "var(--text)" : "var(--text3)",
                border: "1px solid var(--border)",
                borderBottom: view === tab.key ? "1px solid var(--surface)" : "1px solid var(--border)",
                borderRadius: "6px 6px 0 0",
                cursor: "pointer",
                marginBottom: -1,
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {tab.icon && <GitHubIcon size={12} />}
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  marginLeft: 6,
                  fontSize: 9,
                  background: view === tab.key ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.05)",
                  color: view === tab.key ? "#c084fc" : "var(--text3)",
                  padding: "2px 6px",
                  borderRadius: 3,
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {view === "inicio" && (
        <GuideContent />
      )}

      {view === "franwerner" && (profileLoading ? (
        <div style={{ padding: "60px 24px", textAlign: "center" }}>
          <span style={{ fontSize: 12, color: "var(--text3)" }}>Cargando perfil...</span>
        </div>
      ) : (
        <>

          <Simulator
            featuresPerDay={featuresPerDay}
            setFeaturesPerDay={setFeaturesPerDay}
            workDays={workDays}
            setWorkDays={setWorkDays}
            tokenPreset={tokenPreset}
            setTokenPreset={setTokenPreset}
            totalFeatures={totalFeatures}
            preset={preset}
            allPresets={allPresets}
          />
           <div style={{ padding: "16px 24px 0", display: "flex", justifyContent: "flex-end", gap: 6 }}>
            <button
              onClick={handleExportMy}
              style={{
                padding: "6px 12px",
                fontSize: 10,
                fontFamily: "inherit",
                background: "rgba(59,130,246,0.1)",
                color: "#60a5fa",
                border: "1px solid rgba(59,130,246,0.2)",
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              Exportar JSON
            </button>
            <button
              onClick={() => setShowComplexity(true)}
              style={{
                padding: "6px 12px",
                fontSize: 10,
                fontFamily: "inherit",
                background: "rgba(6,182,212,0.1)",
                color: "#22d3ee",
                border: "1px solid rgba(6,182,212,0.2)",
                borderRadius: 5,
                cursor: "pointer",
              }}
            >
              + Complejidad
            </button>
          </div>
          <StackDashboard
            stacks={myStacks}
            referenceModels={referenceModels}
            modelContext={myModelContext}
            modelCatalog={myModelCatalog}
            preset={preset}
            totalFeatures={totalFeatures}
            onGenerateCmd={setCmdModalStack}
          />
        </>
      ))}

      {view === "stack" && (
        <>
          <Simulator
            featuresPerDay={featuresPerDay}
            setFeaturesPerDay={setFeaturesPerDay}
            workDays={workDays}
            setWorkDays={setWorkDays}
            tokenPreset={tokenPreset}
            setTokenPreset={setTokenPreset}
            totalFeatures={totalFeatures}
            preset={preset}
            allPresets={allPresets}
          />
          {customStacks.length === 0 ? (
            <>
              <div style={{ padding: "16px 24px 0", display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={handleImport}
                  style={{
                    padding: "6px 12px",
                    fontSize: 10,
                    fontFamily: "inherit",
                    background: "rgba(34,197,94,0.1)",
                    color: "#4ade80",
                    border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: 5,
                    cursor: "pointer",
                  }}
                >
                  Importar JSON
                </button>
              </div>
              <StackBuilder onSave={handleSaveStack} preset={preset} models={orModels} modelsLoading={orLoading} modelsError={orError} />
            </>
          ) : (
            <>
              <div style={{
                padding: "16px 24px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <span style={{
                  fontSize: 11,
                  color: "var(--text3)",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}>
                  Mis Stacks ({customStacks.length})
                </span>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <button
                    onClick={handleExport}
                    style={{
                      padding: "6px 12px",
                      fontSize: 10,
                      fontFamily: "inherit",
                      background: "rgba(59,130,246,0.1)",
                      color: "#60a5fa",
                      border: "1px solid rgba(59,130,246,0.2)",
                      borderRadius: 5,
                      cursor: "pointer",
                    }}
                  >
                    Exportar JSON
                  </button>
                  <button
                    onClick={handleImport}
                    style={{
                      padding: "6px 12px",
                      fontSize: 10,
                      fontFamily: "inherit",
                      background: "rgba(34,197,94,0.1)",
                      color: "#4ade80",
                      border: "1px solid rgba(34,197,94,0.2)",
                      borderRadius: 5,
                      cursor: "pointer",
                    }}
                  >
                    Importar JSON
                  </button>
                  <button
                    onClick={() => { setEditingStack(null); setEditingIndex(null); setShowBuilder(true); }}
                    style={{
                      padding: "6px 14px",
                      fontSize: 11,
                      fontWeight: 600,
                      fontFamily: "inherit",
                      background: "rgba(168,85,247,0.12)",
                      color: "#c084fc",
                      border: "1px solid rgba(168,85,247,0.25)",
                      borderRadius: 5,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    + Nuevo Stack
                  </button>
                  <button
                    onClick={() => setShowComplexity(true)}
                    style={{
                      padding: "6px 12px",
                      fontSize: 10,
                      fontFamily: "inherit",
                      background: "rgba(6,182,212,0.1)",
                      color: "#22d3ee",
                      border: "1px solid rgba(6,182,212,0.2)",
                      borderRadius: 5,
                      cursor: "pointer",
                    }}
                  >
                    + Complejidad
                  </button>
                </div>
              </div>
              <StackDashboard
                stacks={resolvedCustomStacks}
                referenceModels={referenceModels}
                modelContext={customModelContext}
                modelCatalog={customModelCatalog}
                preset={preset}
                totalFeatures={totalFeatures}
                onDeleteStack={handleDeleteStack}
                onGenerateCmd={setCmdModalStack}
                onEditStack={handleEditStack}
              />
            </>
          )}

          {/* Modal */}
          {showBuilder && (customStacks.length > 0 || editingStack) && (
            <div
              onClick={closeBuilder}
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
                  maxWidth: 800,
                  width: "100%",
                  maxHeight: "85vh",
                  overflow: "auto",
                  position: "relative",
                }}
              >
                <button
                  onClick={closeBuilder}
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
                    zIndex: 1,
                  }}
                >
                  &times;
                </button>
                <StackBuilder onSave={handleSaveStack} preset={preset} models={orModels} modelsLoading={orLoading} modelsError={orError} allPresets={allPresets} defaultPreset={tokenPreset} initialData={editingStack} key={editingStack?.name || "new"} />
              </div>
            </div>
          )}
        </>
      )}
      {showComplexity && (
        <ComplexityModal
          onSave={handleSaveComplexity}
          onClose={() => setShowComplexity(false)}
        />
      )}

      {cmdModalStack && (
        <CommandModal
          stack={cmdModalStack}
          onClose={() => setCmdModalStack(null)}
        />
      )}
    </div>
  );
}
