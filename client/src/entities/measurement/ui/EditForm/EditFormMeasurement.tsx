import React, { useState, useEffect } from 'react';
import styles from './EditFormMeasurement.module.css';
import { MeasurementType } from '@/entities/measurement/model';

type EditMeasurementFormProps = {
  measurement: MeasurementType;
  submitHandler: (e: React.FormEvent<HTMLFormElement>, id: number) => void;
  onCancel: () => void;
};

export default function EditMeasurementForm({ 
  measurement, 
  submitHandler, 
  onCancel 
}: EditMeasurementFormProps) {
  const [formData, setFormData] = useState({
    waist_cm: measurement.waist_cm,
    hips_cm: measurement.hips_cm,
    hip_1: measurement.hip_1,
    chest_cm: measurement.chest_cm,
    arms_cm: measurement.arms_cm,
    notes: measurement.notes || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitHandler(e, measurement.id);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h4 className={styles.formTitle}>Редактировать замер</h4>
      
      <div className={styles.field}>
        <label className={styles.label}>Талия (см)</label>
        <input
          type="number"
          step="0.1"
          name="waist_cm"
          value={formData.waist_cm}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Бедра (см)</label>
        <input
          type="number"
          step="0.1"
          name="hips_cm"
          value={formData.hips_cm}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Левое бедро (см)</label>
        <input
          type="number"
          step="0.1"
          name="hip_1"
          value={formData.hip_1}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Грудь (см)</label>
        <input
          type="number"
          step="0.1"
          name="chest_cm"
          value={formData.chest_cm}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Бицепс (см)</label>
        <input
          type="number"
          step="0.1"
          name="arms_cm"
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
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          Отмена
        </button>
      </div>
    </form>
  );
}
