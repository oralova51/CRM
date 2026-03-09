// client/src/entities/procedure/ui/ProcedureRadioCard/ProcedureRadioCard.tsx

import type { Procedure } from "../../model/types";
import styles from "./ProcedureRadioCard.module.css";

type Props = {
  procedure: Procedure;
  selected: boolean;
  onSelect: () => void;
};

export function ProcedureRadioCard({ procedure, selected, onSelect }: Props) {
  return (
    <button
      className={`${styles.card} ${selected ? styles.selected : ""}`}
      onClick={onSelect}
    >
      <div className={styles.content}>
        <span className={styles.name}>{procedure.name}</span>
        <div className={styles.priceInfo}>
          <span className={styles.price}>{procedure.price} ₽</span>
          <span className={styles.duration}>{procedure.duration_min} мин</span>
        </div>
      </div>
      <div className={`${styles.radio} ${selected ? styles.radioSelected : ""}`} />
    </button>
  );
}