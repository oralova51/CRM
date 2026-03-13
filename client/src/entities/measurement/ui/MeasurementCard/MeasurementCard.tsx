import React, { useRef, useState } from "react";
import type { MeasurementType } from "../../model";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";
import MeasurementApi from "@/entities/measurement/api/MeasurementApi";
import { 
  Calendar, ChevronDown, ChevronUp, Edit2, Trash2, Upload, 
  Camera, X, ZoomIn, ChevronLeft, ChevronRight 
} from "lucide-react";
import styles from "./MeasurementCard.module.css";

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
  const [selectedPhoto, setSelectedPhoto] = useState<{ url: string; type: 'before' | 'after' } | null>(null);

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
    if (!confirm(`Удалить фото ${photoType === "before" ? "«до»" : "«после»"}?`)) return;
    if (!onPhotoUpdate) return;

    try {
      const response = await MeasurementApi.deletePhoto(measurement.id, photoType);
      if (response?.data) {
        onPhotoUpdate(response.data);
      }
    } catch (error) {
      console.error("Ошибка удаления фото:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getFullImageUrl = (path: string) => {
    return `${import.meta.env.VITE_API_URL || "http://localhost:3000"}${path}`;
  };

  return (
    <>
      <div className={styles.card}>
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

        {/* Заголовок карточки */}
        <div className={styles.header} onClick={() => setIsOpen(!isOpen)}>
          <div className={styles.headerLeft}>
            <div className={styles.dateIcon}>
              <Calendar size={18} />
            </div>
            <div>
              <div className={styles.date}>{formatDate(measurement.measured_at)}</div>
              {measurement.notes && (
                <div className={styles.notePreview}>{measurement.notes}</div>
              )}
            </div>
          </div>
          <div className={styles.headerRight}>
            {user?.role === "isAdmin" && (
              <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                <button className={styles.editButton} onClick={() => onEdit(measurement)}>
                  <Edit2 size={16} />
                </button>
                <button className={styles.deleteButton} onClick={() => onDelete(measurement.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            <button className={styles.expandButton}>
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>

        {/* Детальная информация */}
        {isOpen && (
          <div className={styles.content}>
            {/* Сетка с замерами */}
            <div className={styles.measurementsGrid}>
              <div className={styles.measurementItem}>
                <span className={styles.measurementLabel}>Талия</span>
                <span className={styles.measurementValue}>{measurement.waist_cm} см</span>
              </div>
              <div className={styles.measurementItem}>
                <span className={styles.measurementLabel}>Бедра</span>
                <span className={styles.measurementValue}>{measurement.hips_cm} см</span>
              </div>
              <div className={styles.measurementItem}>
                <span className={styles.measurementLabel}>Левое бедро</span>
                <span className={styles.measurementValue}>{measurement.hip_1} см</span>
              </div>
              <div className={styles.measurementItem}>
                <span className={styles.measurementLabel}>Грудь</span>
                <span className={styles.measurementValue}>{measurement.chest_cm} см</span>
              </div>
              <div className={styles.measurementItem}>
                <span className={styles.measurementLabel}>Бицепс</span>
                <span className={styles.measurementValue}>{measurement.arms_cm} см</span>
              </div>
            </div>

            {/* Заметки */}
            {measurement.notes && (
              <div className={styles.notes}>
                <span className={styles.notesLabel}>Заметки:</span>
                <p className={styles.notesText}>{measurement.notes}</p>
              </div>
            )}

            {/* Фото */}
            <div className={styles.photos}>
              {/* Фото "до" */}
              <div className={styles.photoContainer}>
                <div className={styles.photoHeader}>
                  <span className={styles.photoLabel}>До</span>
                  {user?.role === "isAdmin" && (
                    <div className={styles.photoActions}>
                      <button
                        className={styles.photoAction}
                        onClick={() => beforeFileInputRef.current?.click()}
                        disabled={isUploading}
                        title="Загрузить фото"
                      >
                        <Upload size={14} />
                      </button>
                      {measurement.photo_before && (
                        <button
                          className={`${styles.photoAction} ${styles.deletePhoto}`}
                          onClick={() => handleDeletePhoto("before")}
                          disabled={isUploading}
                          title="Удалить фото"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {measurement.photo_before ? (
                  <div 
                    className={styles.photoWrapper}
                    onClick={() => setSelectedPhoto({ 
                      url: getFullImageUrl(measurement.photo_before), 
                      type: 'before' 
                    })}
                  >
                    <img
                      src={getFullImageUrl(measurement.photo_before)}
                      alt="Фото до"
                      className={styles.photo}
                    />
                    <div className={styles.photoOverlay}>
                      <ZoomIn size={24} />
                    </div>
                  </div>
                ) : (
                  <div className={styles.photoPlaceholder}>
                    <Camera size={24} />
                    <span>Нет фото</span>
                  </div>
                )}
              </div>

              {/* Фото "после" */}
              <div className={styles.photoContainer}>
                <div className={styles.photoHeader}>
                  <span className={styles.photoLabel}>После</span>
                  {user?.role === "isAdmin" && (
                    <div className={styles.photoActions}>
                      <button
                        className={styles.photoAction}
                        onClick={() => afterFileInputRef.current?.click()}
                        disabled={isUploading}
                        title="Загрузить фото"
                      >
                        <Upload size={14} />
                      </button>
                      {measurement.photo_after && (
                        <button
                          className={`${styles.photoAction} ${styles.deletePhoto}`}
                          onClick={() => handleDeletePhoto("after")}
                          disabled={isUploading}
                          title="Удалить фото"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {measurement.photo_after ? (
                  <div 
                    className={styles.photoWrapper}
                    onClick={() => setSelectedPhoto({ 
                      url: getFullImageUrl(measurement.photo_after), 
                      type: 'after' 
                    })}
                  >
                    <img
                      src={getFullImageUrl(measurement.photo_after)}
                      alt="Фото после"
                      className={styles.photo}
                    />
                    <div className={styles.photoOverlay}>
                      <ZoomIn size={24} />
                    </div>
                  </div>
                ) : (
                  <div className={styles.photoPlaceholder}>
                    <Camera size={24} />
                    <span>Нет фото</span>
                  </div>
                )}
              </div>
            </div>

            {isUploading && (
              <div className={styles.uploading}>
                <div className={styles.spinner} />
                <span>Загрузка...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Модалка для просмотра фото */}
      {selectedPhoto && (
        <div className={styles.lightbox} onClick={() => setSelectedPhoto(null)}>
          <button 
            className={styles.lightboxClose}
            onClick={() => setSelectedPhoto(null)}
          >
            <X size={24} />
          </button>
          <img 
            src={selectedPhoto.url} 
            alt={`Фото ${selectedPhoto.type === 'before' ? 'до' : 'после'}`}
            className={styles.lightboxImage}
            onClick={(e) => e.stopPropagation()}
          />
          <div className={styles.lightboxCaption}>
            {selectedPhoto.type === 'before' ? 'Фото до' : 'Фото после'} — {formatDate(measurement.measured_at)}
          </div>
        </div>
      )}
    </>
  );
}