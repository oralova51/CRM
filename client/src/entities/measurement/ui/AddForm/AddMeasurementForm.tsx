import React from 'react';
import styles from './AddMeasurementForm.module.css';

type AddMeasurementFormProps = {
  submitHandler: (e: React.SubmitEvent<HTMLFormElement>) => void;
};

export default function AddMeasurementForm({ submitHandler }: AddMeasurementFormProps) {
  return (
    <form onSubmit={submitHandler} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Талия (см)</label>
        <input
          type="number"
          step="0.1"
          placeholder="0"
          name="waist_cm"
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Бедра (см)</label>
        <input
          type="number"
          step="0.1"
          placeholder="0"
          name="hips_cm"
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Левое бедро (см)</label>
        <input
          type="number"
          step="0.1"
          placeholder="0"
          name="hip_1"
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Грудь (см)</label>
        <input
          type="number"
          step="0.1"
          placeholder="0"
          name="chest_cm"
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Бицепс (см)</label>
        <input
          type="number"
          step="0.1"
          placeholder="0"
          name="arms_cm"
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Заметки</label>
        <input
          type="text"
          placeholder="Дополнительная информация"
          name="notes"
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Фото до</label>
        <input
          type="file"
          name="photo_before"
          accept="image/*"
          className={styles.fileInput}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Фото после</label>
        <input
          type="file"
          name="photo_after"
          accept="image/*"
          className={styles.fileInput}
        />
      </div>

      <button type="submit" className={styles.submitButton}>
        Создать замер
      </button>
    </form>
  );
}