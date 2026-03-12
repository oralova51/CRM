import React, { useState, useEffect } from "react";
import styles from "./EditFormMeasurement.module.css";
import { MeasurementType } from "@/entities/measurement/model";

type EditMeasurementFormProps = {
  measurement: MeasurementType;
  submitHandler: (e: React.FormEvent<HTMLFormElement>, id: number) => void;
  onCancel: () => void;
};

export default function EditMeasurementForm({
  measurement,
  submitHandler,
  onCancel,
}: EditMeasurementFormProps) {
  const [formData, setFormData] = useState({
    waist_cm: measurement.waist_cm?.toString() || "",
    hips_cm: measurement.hips_cm?.toString() || "",
    hip_1: measurement.hip_1?.toString() || "",
    chest_cm: measurement.chest_cm?.toString() || "",
    arms_cm: measurement.arms_cm?.toString() || "",
    notes: measurement.notes || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name !== "notes") {
      const onlyNumbers = value.replace(/[^0-9.]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: onlyNumbers,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitHandler(e, measurement.id);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h4 className={styles.formTitle}>Редактировать замер</h4>

      <div className={styles.field}>
        <label className={styles.label}>Талия (см)</label>
        <input
          type="text"
          inputMode="numeric"
          step="0.1"
          name="waist_cm"
          placeholder="0"
          value={formData.waist_cm}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Бедра (см)</label>
        <input
          type="text"
          inputMode="numeric"
          step="0.1"
          name="hips_cm"
          placeholder="0"
          value={formData.hips_cm}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Левое бедро (см)</label>
        <input
          type="text"
          inputMode="numeric"
          step="0.1"
          name="hip_1"
          placeholder="0"
          value={formData.hip_1}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Грудь (см)</label>
        <input
          type="text"
          inputMode="numeric"
          step="0.1"
          name="chest_cm"
          placeholder="0"
          value={formData.chest_cm}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Бицепс (см)</label>
        <input
          type="text"
          inputMode="numeric"
          step="0.1"
          name="arms_cm"
          placeholder="0"
          value={formData.arms_cm}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Заметки</label>
        <input
          type="text"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Дополнительная информация"
          className={styles.input}
        />
      </div>

      <div className={styles.buttonGroup}>
        <button type="submit" className={styles.submitButton}>
          Сохранить
        </button>
        <button
          type="button"
          onClick={onCancel}
          className={styles.cancelButton}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}
