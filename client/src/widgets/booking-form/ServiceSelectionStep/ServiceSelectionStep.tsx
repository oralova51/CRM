import { ProcedureRadioCard } from "@/entities/procedure/ui/ProcedureRadioCard/ProcedureRadioCard";
import type { Procedure } from "@/entities/procedure/model/types";
import styles from "./ServiceSelectionStep.module.css";

type Props = {
  procedures: Procedure[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onNext: () => void;
};

export function ServiceSelectionStep({ procedures, selectedId, onSelect, onNext }: Props) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Выберите услугу</h2>
      
      <div className={styles.list}>
        {procedures.map((procedure) => (
          <ProcedureRadioCard
            key={procedure.id}
            procedure={procedure}
            selected={selectedId === procedure.id}
            onSelect={() => onSelect(procedure.id)}
          />
        ))}
      </div>

      <button
        className={styles.nextButton}
        disabled={!selectedId}
        onClick={onNext}
      >
        Далее
      </button>
    </div>
  );
}