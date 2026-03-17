import React, { useRef, useState } from 'react';
import styles from './AddMeasurementForm.module.css';

type AddMeasurementFormProps = {
  submitHandler: (e: React.FormEvent<HTMLFormElement>, photoBefore?: File, photoAfter?: File) => void;
};

export default function AddMeasurementForm({ submitHandler }: AddMeasurementFormProps) {
  const [photoBeforeName, setPhotoBeforeName] = useState('');
  const [photoAfterName, setPhotoAfterName] = useState('');
  
  const photoBeforeRef = useRef<HTMLInputElement>(null);
  const photoAfterRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const photoBeforeFile = photoBeforeRef.current?.files?.[0];
    const photoAfterFile = photoAfterRef.current?.files?.[0];
    
    submitHandler(e, photoBeforeFile, photoAfterFile);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h4 className={styles.formTitle}>Создать новый замер</h4>

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
          ref={photoBeforeRef}
          accept="image/*"
          className={styles.fileInput}
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPhotoBeforeName(file ? file.name : '');
          }}
        />
        {photoBeforeName && <span className={styles.fileName}>Выбран: {photoBeforeName}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Фото после</label>
        <input
          type="file"
          ref={photoAfterRef}
          accept="image/*"
          className={styles.fileInput}
          onChange={(e) => {
            const file = e.target.files?.[0];
            setPhotoAfterName(file ? file.name : '');
          }}
        />
        {photoAfterName && <span className={styles.fileName}>Выбран: {photoAfterName}</span>}
      </div>

      <button type="submit" className={styles.submitButton}>
        Создать замер
      </button>
    </form>
  );
}