import React, { useState } from "react";
import type { MeasurementType } from "../model";
import "./MeasurementCard.css"; // создадим отдельный файл со стилями
import { useAppSelector } from "@/shared/hooks/useReduxHooks";

type MeasurementCardProps = {
  measurement: MeasurementType;
  onDelete: (id: number) => void;
  onUpdate: (measurement: MeasurementType) => void;
};

export default function MeasurementCard({
  measurement,
  onDelete,
  onUpdate,
}: MeasurementCardProps) {
  const { user } = useAppSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="measurement-card">
      {/* Тонкая строчка с названием */}
      <div
        className={`measurement-header ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="header-title">
          📅 {new Date(measurement.measured_at).toLocaleDateString()}
          <span className="header-notes">{measurement.notes}</span>
        </span>
        <span className="arrow">{isOpen ? "▼" : "▶"}</span>
      </div>

      {/* Полная информация (условный рендеринг) */}
      {isOpen && (
        <div className="measurement-content">
          {user?.role === "isAdmin" && (
            <>
              <button
                className="delete-button"
                onClick={() => onDelete(measurement.id)}
              >
                {"❌"}
              </button>
              <button onClick={() => onUpdate(measurement)}>{"✏️"}</button>
            </>
          )}
          <div className="content-grid">
            <div className="measurement-item">
              <span className="measurement-label">📏 Окружность талии</span>
              <span className="measurement-value">
                {measurement.waist_cm} см
              </span>
            </div>

            <div className="measurement-item">
              <span className="measurement-label">📏 Окружность бедер</span>
              <span className="measurement-value">
                {measurement.hips_cm} см
              </span>
            </div>

            <div className="measurement-item">
              <span className="measurement-label">🦵 Левое бедро</span>
              <span className="measurement-value">{measurement.hip_1} см</span>
            </div>

            <div className="measurement-item">
              <span className="measurement-label">📏 Окружность груди</span>
              <span className="measurement-value">
                {measurement.chest_cm} см
              </span>
            </div>

            <div className="measurement-item">
              <span className="measurement-label">💪 Бицепс</span>
              <span className="measurement-value">
                {measurement.arms_cm} см
              </span>
            </div>
          </div>

          {measurement.notes && (
            <div className="notes-section">
              <span className="notes-label">📝 Заметки:</span>
              <p className="notes-text">{measurement.notes}</p>
            </div>
          )}

          {(measurement.photo_before || measurement.photo_after) && (
            <div className="photos-section">
              {measurement.photo_before && (
                <div className="photo-container">
                  <span className="photo-label">Фото до</span>
                  <img
                    src={measurement.photo_before}
                    alt="Фото до"
                    className="measurement-photo"
                  />
                </div>
              )}
              {measurement.photo_after && (
                <div className="photo-container">
                  <span className="photo-label">Фото после</span>
                  <img
                    src={measurement.photo_after}
                    alt="Фото после"
                    className="measurement-photo"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
