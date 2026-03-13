import React from 'react';
import styles from './ToggleSwitch.module.css';

type ToggleSwitchProps = {
  isActive: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

export function ToggleSwitch({ isActive, onChange, label }: ToggleSwitchProps) {
  return (
    <div className={styles.container}>
      {label && <span className={styles.label}>{label}</span>}
      <button
        className={`${styles.toggle} ${isActive ? styles.active : ''}`}
        onClick={() => onChange(!isActive)}
        role="switch"
        aria-checked={isActive}
      >
        <span className={styles.slider} />
      </button>
    </div>
  );
}