const s = {
  // Layout
  section: { marginBottom: 88, paddingBottom: 64, borderBottom: "1px solid var(--border)" },
  sectionLast: { marginBottom: 0, paddingBottom: 0, borderBottom: "none" },

  // Headings
  h2: { fontSize: 17, fontWeight: 700, color: "var(--text)", marginBottom: 6, letterSpacing: "-0.01em" },
  h2Sub: { fontSize: 11, color: "var(--text2)", marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid var(--border)", lineHeight: 1.55 },
  h3: { fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 12, marginTop: 40 },

  // Text
  p: { fontSize: 11, color: "var(--text2)", lineHeight: 1.55, marginBottom: 8, marginTop: 0 },
  ul: { fontSize: 11, color: "var(--text2)", lineHeight: 1.55, marginBottom: 0, marginTop: 0 },
  strong: { color: "var(--text)", fontWeight: 600 },

  // Tables
  table: { width: "100%", borderCollapse: "collapse", marginBottom: 12, marginTop: 10, fontSize: 10, tableLayout: "fixed" },
  th: { padding: "10px 12px 10px 0", textAlign: "left", borderBottom: "1px solid var(--border)", color: "var(--text)", fontWeight: 600, fontSize: 10, verticalAlign: "top" },
  td: { padding: "10px 12px 10px 0", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.03)", color: "var(--text2)", fontSize: 10, lineHeight: 1.45, verticalAlign: "top", wordBreak: "break-word" },
  tdNum: { padding: "10px 12px 10px 0", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.03)", color: "var(--text)", fontSize: 10, verticalAlign: "top", fontVariantNumeric: "tabular-nums" },

  // Pills (tipo de trabajo) — alineados con catColors en src/data/constants.js
  pill: { display: "inline-block", padding: "2px 7px", borderRadius: 4, fontSize: 9, fontWeight: 700, letterSpacing: "0.03em", textTransform: "uppercase" },
  pillCoord: { background: "rgba(100,116,139,0.12)", color: "#94a3b8", border: "1px solid rgba(100,116,139,0.3)" },
  pillExec: { background: "rgba(59,130,246,0.12)", color: "#60a5fa", border: "1px solid rgba(59,130,246,0.3)" },
  pillReason: { background: "rgba(168,85,247,0.12)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.3)" },

  // Callouts
  calloutInfo: { background: "rgba(192,132,252,0.05)", borderLeft: "3px solid #c084fc", padding: "10px 14px", borderRadius: "2px 4px 4px 2px", color: "var(--text2)", fontSize: 11, lineHeight: 1.5, marginBottom: 16, marginTop: 4 },
  calloutWarn: { background: "rgba(251,191,36,0.05)", borderLeft: "3px solid #fbbf24", padding: "10px 14px", borderRadius: "2px 4px 4px 2px", color: "var(--text2)", fontSize: 11, lineHeight: 1.5, marginBottom: 16, marginTop: 4 },
  calloutTitleWarn: { fontSize: 10, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 },
  calloutTitleInfo: { fontSize: 10, fontWeight: 700, color: "#c084fc", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 },

  // Sí / No columns
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16, marginTop: 4 },
  colOk: { border: "1px solid rgba(74,222,128,0.25)", background: "rgba(74,222,128,0.03)", borderRadius: 6, padding: "12px 14px" },
  colNo: { border: "1px solid rgba(248,113,113,0.25)", background: "rgba(248,113,113,0.03)", borderRadius: 6, padding: "12px 14px" },
  colOkHeader: { fontSize: 11, fontWeight: 700, color: "#4ade80", marginBottom: 10, letterSpacing: "0.03em", textTransform: "uppercase" },
  colNoHeader: { fontSize: 11, fontWeight: 700, color: "#f87171", marginBottom: 10, letterSpacing: "0.03em", textTransform: "uppercase" },

  // Steps
  stepList: { marginTop: 8 },
  step: { display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.04)" },
  stepLast: { borderBottom: "none", marginBottom: 0, paddingBottom: 0 },
  stepNum: { flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: "rgba(192,132,252,0.12)", border: "1px solid rgba(192,132,252,0.4)", color: "#c084fc", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" },
  stepBody: { flex: 1, paddingTop: 2 },
  stepTitle: { fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 4 },
  stepDesc: { fontSize: 11, color: "var(--text2)", lineHeight: 1.5 },

  // Inline accents
  threshold: { color: "#4ade80", fontWeight: 600, fontVariantNumeric: "tabular-nums" },
  stat: { color: "#fbbf24", fontWeight: 700 },
  mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 10, color: "var(--text)" },
};

const listStyles = `
  .sdd-list, .sdd-olist { list-style: none; padding-left: 0; margin-top: 0; }
  .sdd-list li, .sdd-olist li { margin-bottom: 5px; }
  .sdd-list li::before, .sdd-olist li::before,
  .sdd-list li::marker, .sdd-olist li::marker { content: none; display: none; }
`;

function Pill({ kind }) {
  const variant = kind === "coord" ? s.pillCoord : kind === "reason" ? s.pillReason : s.pillExec;
  const label = kind === "coord" ? "Coordinación" : kind === "reason" ? "Razonamiento" : "Ejecución";
  return <span style={{ ...s.pill, ...variant }}>{label}</span>;
}

function Step({ num, title, children, last }) {
  return (
    <div style={{ ...s.step, ...(last ? s.stepLast : {}) }}>
      <div style={s.stepNum}>{num}</div>
      <div style={s.stepBody}>
        <div style={s.stepTitle}>{title}</div>
        <div style={s.stepDesc}>{children}</div>
      </div>
    </div>
  );
}

export default function GuideContent() {
  return (
    <div style={{ padding: "64px" }}>
      <style>{listStyles}</style>

      {/* ============================================================
           SECCIÓN 1 — LA UNIDAD: FEATURE
         ============================================================ */}
      <div style={{ ...s.section, ...s.sectionLast }}>
        <h2 style={s.h2}>La unidad: feature</h2>
        <p style={s.h2Sub}>
          Una feature es una pasada completa del flujo SDD: las <strong style={s.strong}>9 fases</strong> de inicio a fin. Si se activó SDD, cuenta como <strong style={s.strong}>1 feature</strong> en el cálculo de costo.
        </p>

        {/* Sí / No activa SDD */}
        <h3 style={s.h3}>Cuándo activa SDD</h3>
        <div style={s.twoCol}>
          <div style={s.colOk}>
            <div style={s.colOkHeader}>Sí — cuenta como feature</div>
            <ul className="sdd-list" style={s.ul}>
              <li>Agregar un endpoint de API</li>
              <li>Crear un componente de UI</li>
              <li>Implementar autenticación en un módulo</li>
              <li>Refactorizar un servicio existente</li>
              <li>Agregar validación a un formulario</li>
              <li>Bug que requiere análisis multi-archivo</li>
              <li>Integrar un servicio externo</li>
              <li>Migrar un módulo entre librerías</li>
            </ul>
          </div>
          <div style={s.colNo}>
            <div style={s.colNoHeader}>No — no dispara SDD</div>
            <ul className="sdd-list" style={s.ul}>
              <li>Fix de una línea (se resuelve inline)</li>
              <li>Pregunta sobre el código (responde el chat)</li>
              <li>Cambio de configuración (.env, puertos)</li>
              <li>Renombrar variables o formatear código</li>
            </ul>
          </div>
        </div>

        {/* Las 9 fases — tabla unificada */}
        <h3 style={s.h3}>Las 9 fases (tipo y rol)</h3>
        <table style={s.table}>
          <colgroup>
            <col style={{ width: "18%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "70%" }} />
          </colgroup>
          <thead>
            <tr>
              <th style={s.th}>Fase</th>
              <th style={s.th}>Tipo</th>
              <th style={s.th}>Qué hace</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={s.td}><span style={s.mono}>orchestrator</span></td>
              <td style={s.td}><Pill kind="coord" /></td>
              <td style={s.td}>Coordina muchos turnos cortos entre fases</td>
            </tr>
            <tr>
              <td style={s.td}><span style={s.mono}>init</span></td>
              <td style={s.td}><Pill kind="coord" /></td>
              <td style={s.td}>Lee el proyecto y registra skills</td>
            </tr>
            <tr>
              <td style={s.td}><span style={s.mono}>explore</span></td>
              <td style={s.td}><Pill kind="exec" /></td>
              <td style={s.td}>Lee archivos del repo, analiza estructura existente</td>
            </tr>
            <tr>
              <td style={s.td}><span style={s.mono}>propose</span></td>
              <td style={s.td}><Pill kind="reason" /></td>
              <td style={s.td}>Genera una propuesta de cambio a partir del contexto</td>
            </tr>
            <tr>
              <td style={s.td}><span style={s.mono}>spec</span></td>
              <td style={s.td}><Pill kind="reason" /></td>
              <td style={s.td}>Produce requisitos y escenarios detallados</td>
            </tr>
            <tr>
              <td style={s.td}><span style={s.mono}>design</span></td>
              <td style={s.td}><Pill kind="reason" /></td>
              <td style={s.td}>Decisiones técnicas completas, la fase más pesada</td>
            </tr>
            <tr>
              <td style={s.td}><span style={s.mono}>tasks</span></td>
              <td style={s.td}><Pill kind="exec" /></td>
              <td style={s.td}>Descompone el design en pasos atómicos</td>
            </tr>
            <tr>
              <td style={s.td}><span style={s.mono}>apply</span></td>
              <td style={s.td}><Pill kind="exec" /></td>
              <td style={s.td}>Genera el código real leyendo specs + design + archivos</td>
            </tr>
            <tr>
              <td style={s.td}><span style={s.mono}>verify</span></td>
              <td style={s.td}><Pill kind="exec" /></td>
              <td style={s.td}>Corre tests, lee output de errores, reporta resultados</td>
            </tr>
            <tr>
              <td style={s.td}><span style={s.mono}>archive</span></td>
              <td style={s.td}><Pill kind="coord" /></td>
              <td style={s.td}>Persiste artefactos a engram</td>
            </tr>
          </tbody>
        </table>

      </div>

      {/* ============================================================
           SECCIÓN 2 — ELEGIR MODELO
         ============================================================ */}
      <div style={{ ...s.section, ...s.sectionLast, marginTop: 80 }}>
        <h2 style={s.h2}>Elegir modelo</h2>
        <p style={s.h2Sub}>
          Las 9 fases colapsan en <strong style={s.strong}>3 tipos de trabajo</strong>. Cada tipo prioriza una capacidad distinta del modelo, y por eso se elige con un criterio distinto.
        </p>

        {/* Criterio por tipo — tabla unificada */}
        <h3 style={s.h3}>Criterio por tipo</h3>
        <table style={s.table}>
          <colgroup>
            <col style={{ width: "15%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "37%" }} />
            <col style={{ width: "30%" }} />
          </colgroup>
          <thead>
            <tr>
              <th style={s.th}>Tipo</th>
              <th style={s.th}>Fases</th>
              <th style={s.th}>Benchmark + umbral</th>
              <th style={s.th}>Criterio ganador</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={s.td}><Pill kind="coord" /></td>
              <td style={s.td}><span style={s.mono}>orchestrator, init, archive</span></td>
              <td style={s.td}>Sin filtro exigente — la tarea es simple</td>
              <td style={s.td}>Modelo barato</td>
            </tr>
            <tr>
              <td style={s.td}><Pill kind="reason" /></td>
              <td style={s.td}><span style={s.mono}>propose, spec, design</span></td>
              <td style={s.td}>LiveBench Reasoning <span style={s.threshold}>{">"} 70%</span><br />ARC-AGI (indicador direccional)</td>
              <td style={s.td}>Razonamiento estructurado sin código + reportes reales positivos</td>
            </tr>
            <tr>
              <td style={s.td}><Pill kind="exec" /></td>
              <td style={s.td}><span style={s.mono}>explore</span></td>
              <td style={s.td}>RepoQA <span style={s.threshold}>{">"} 80%</span> (NIAH ya está saturado, no discrimina)</td>
              <td style={s.td}>Comprensión de repo a contexto largo</td>
            </tr>
            <tr>
              <td style={s.td}><Pill kind="exec" /></td>
              <td style={s.td}><span style={s.mono}>tasks</span></td>
              <td style={s.td}>LiveBench Reasoning <span style={s.threshold}>{">"} 65%</span><br />PlanBench (saturado, referencial)</td>
              <td style={s.td}>Descomposición estructurada sin ejecución</td>
            </tr>
            <tr>
              <td style={s.td}><Pill kind="exec" /></td>
              <td style={s.td}><span style={s.mono}>apply, verify</span></td>
              <td style={s.td}>SWE-bench Verified <span style={s.threshold}>{">"} 80%</span><br />Terminal-Bench <span style={s.threshold}>{">"} 50%</span></td>
              <td style={s.td}>Verified alto + Terminal-Bench + token efficiency</td>
            </tr>
          </tbody>
        </table>

        {/* Límites de los benchmarks */}
        <h3 style={s.h3}>Límites de los benchmarks</h3>
        <div style={s.calloutWarn}>
          <div style={s.calloutTitleWarn}>Advertencia al leer benchmarks</div>
          <ul className="sdd-list" style={s.ul}>
            <li><strong style={s.strong}>Son auto-reportados</strong> hasta que un tercero los valida</li>
            <li><strong style={s.strong}>No miden token efficiency</strong> — dos modelos con el mismo score pueden consumir cantidades radicalmente distintas</li>
            <li><strong style={s.strong}>No miden estabilidad en flujos largos</strong> — un modelo puede resolver el issue 1 y fallar el 15</li>
            <li><strong style={s.strong}>No miden recuperación de errores</strong> — qué hace cuando se traba, si replanifica o se queda en loop</li>
          </ul>
        </div>
        <div style={s.calloutInfo}>
          <div style={s.calloutTitleInfo}>Regla práctica</div>
          Si dos modelos están a menos de <span style={s.stat}>3 puntos</span> de diferencia en el mismo benchmark, son <strong style={s.strong}>equivalentes</strong> en la práctica.
        </div>

        {/* Proceso de selección — 4 pasos */}
        <h3 style={s.h3}>Proceso de selección</h3>
        <div style={s.stepList}>
          <Step num="1" title="Filtro de mínimos">
            Descarta candidatos que no cumplen el umbral de benchmarks de la tabla anterior o no soportan tool calling.
          </Step>
          <Step num="2" title="Comparación de los que pasaron">
            En este orden: <strong style={s.strong}>token efficiency</strong> → <strong style={s.strong}>precio por millón</strong> → <strong style={s.strong}>contexto máximo</strong>. Menos tokens = menos costo real, independiente del precio.
          </Step>
          <Step num="3" title="Validación con uso real">
            Reddit (<span style={s.mono}>r/claudedev</span>, <span style={s.mono}>r/localllama</span>) + OpenRouter rankings. Benchmarks altos + reportes negativos = no sirve. Benchmarks medios + reportes positivos = probablemente funciona.
          </Step>
          <Step num="4" title="Asignación por tipo" last>
            Aplicá el <strong style={s.strong}>criterio ganador</strong> de la tabla "Criterio por tipo" a cada fase, según su tipo de trabajo.
          </Step>
        </div>
      </div>
    </div>
  );
}
