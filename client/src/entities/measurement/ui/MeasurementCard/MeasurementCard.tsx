import React, { useRef, useState } from "react";
import type { MeasurementType } from "../../model";
import "./MeasurementCard.css"; // создадим отдельный файл со стилями
import { useAppSelector } from "@/shared/hooks/useReduxHooks";
import MeasurementApi from "@/entities/measurement/api/MeasurementApi";

type MeasurementCardProps = {
  measurement: MeasurementType;
  onDelete: (id: number) => void;
  onEdit: (measurement: MeasurementType) => void;
  onPhotoUpdate?: (updatedMeasurement: MeasurementType) => void;
};

export default function MeasurementCard({
  measurement,
  onDelete,
  onEdit,
  onPhotoUpdate,
}: MeasurementCardProps) {
  const { user } = useAppSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const beforeFileInputRef = useRef<HTMLInputElement>(null);
  const afterFileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadBefore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onPhotoUpdate) return;
    setIsUploading(true);
    try {
      const response = await MeasurementApi.uploadPhotoBefore(
        measurement.id,
        file,
      );
      if (response?.data) {
        onPhotoUpdate(response.data);
      }
    } catch (error) {
      console.error("Ошибка загрузки фото:", error);
    } finally {
      setIsUploading(false);
      if (beforeFileInputRef.current) beforeFileInputRef.current.value = "";
    }
  };

  const handleUploadAfter = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onPhotoUpdate) return;
    setIsUploading(true);
    try {
      const response = await MeasurementApi.uploadPhotoAfter(
        measurement.id,
        file,
      );
      if (response?.data) {
        onPhotoUpdate(response.data);
      }
    } catch (error) {
      console.error("Ошибка загрузки фото:", error);
    } finally {
      setIsUploading(false);
      if (afterFileInputRef.current) afterFileInputRef.current.value = "";
    }
  };

  const handleDeletePhoto = async (photoType: "before" | "after") => {
    if (
      !confirm(`Удалить фото ${photoType === "before" ? '"до"' : '"после"'}?`)
    )
      return;
    if (!onPhotoUpdate) return;

    try {
      const response = await MeasurementApi.deletePhoto(
        measurement.id,
        photoType,
      );
      if (response?.data) {
        onPhotoUpdate(response.data);
      }
    } catch (error) {
      console.error("Ошибка удаления фото:", error);
    }
  };

  return (
    <div className="measurement-card">
      <input
        type="file"
        ref={beforeFileInputRef}
        onChange={handleUploadBefore}
        accept="image/*"
        style={{ display: "none" }}
        disabled={isUploading}
      />
      <input
        type="file"
        ref={afterFileInputRef}
        onChange={handleUploadAfter}
        accept="image/*"
        style={{ display: "none" }}
        disabled={isUploading}
      />
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
            <div className="admin-actions">
              <button onClick={() => onEdit(measurement)}>{"✏️"}</button>
              <button
                className="delete-button"
                onClick={() => onDelete(measurement.id)}
              >
                {"❌"}
              </button>
            </div>
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

          <div className="photos-section">
            {/* Фото "до" */}
            <div className="photo-container">
              <div className="photo-header">
                <span className="photo-label">Фото до</span>
                {user?.role === "isAdmin" && (
                  <div className="photo-actions">
                    <button
                      onClick={() => beforeFileInputRef.current?.click()}
                      disabled={isUploading}
                      title="Загрузить фото"
                    >
                      📤
                    </button>
                    {measurement.photo_before && (
                      <button
                        onClick={() => handleDeletePhoto("before")}
                        disabled={isUploading}
                        title="Удалить фото"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                )}
              </div>
              {measurement.photo_before ? (
                <img
                  src={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${measurement.photo_before}`}
                  alt="Фото до"
                  className="measurement-photo"
                />
              ) : (
                <div className="photo-placeholder">Нет фото</div>
              )}
            </div>

            {/* Фото "после" */}
            <div className="photo-container">
              <div className="photo-header">
                <span className="photo-label">Фото после</span>
                {user?.role === "isAdmin" && (
                  <div className="photo-actions">
                    <button
                      onClick={() => afterFileInputRef.current?.click()}
                      disabled={isUploading}
                      title="Загрузить фото"
                    >
                      📤
                    </button>
                    {measurement.photo_after && (
                      <button
                        onClick={() => handleDeletePhoto("after")}
                        disabled={isUploading}
                        title="Удалить фото"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                )}
              </div>
              {measurement.photo_after ? (
                <img
                  src={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}${measurement.photo_after}`}
                  alt="Фото после"
                  className="measurement-photo"
                />
              ) : (
                <div className="photo-placeholder">Нет фото</div>
              )}
            </div>
          </div>

          {isUploading && <div className="uploading">Загрузка...</div>}
        </div>
      )}
    </div>
  );
}
