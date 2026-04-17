import StackCards from "./StackCards";
import RefBars from "./RefBars";
import PhaseTable from "./PhaseTable";
import CostChart from "./CostChart";
import ModelCatalog from "./ModelCatalog";
import { calcRefCost } from "../utils/cost";

export default function StackDashboard({
  stacks,
  referenceModels,
  modelContext,
  modelCatalog,
  preset,
  totalFeatures,
  onDeleteStack,
  onGenerateCmd,
  onEditStack,
}) {
  const references = referenceModels.map(r => ({
    ...r,
    cpf: calcRefCost(r, preset),
  }));

  const sonnetCPF = references[0]?.cpf || 0;
  const opusCPF = references[1]?.cpf || 0;

  if (stacks.length === 0) {
    return (
      <div style={{ padding: "60px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "var(--text3)" }}>
          No hay stacks. Crea uno en la pesta&ntilde;a Custom.
        </div>
      </div>
    );
  }

  return (
    <>
      <StackCards
        stacks={stacks}
        preset={preset}
        totalFeatures={totalFeatures}
        sonnetCPF={sonnetCPF}
        opusCPF={opusCPF}
        onDeleteStack={onDeleteStack}
        onGenerateCmd={onGenerateCmd}
        onEditStack={onEditStack}
      />
      <RefBars references={references} totalFeatures={totalFeatures} />
      <PhaseTable stacks={stacks} modelContext={modelContext} />
      <CostChart
        stacks={stacks}
        preset={preset}
        totalFeatures={totalFeatures}
        references={references}
      />
      <ModelCatalog models={modelCatalog} />
    </>
  );
}
