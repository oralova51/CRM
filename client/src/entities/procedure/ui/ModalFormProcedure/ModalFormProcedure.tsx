// client/src/entities/procedure/ui/ModalFormProcedure/ModalFormProcedure.tsx

import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import { useToast } from '@/shared/lib/toast/ToastContext';
import { ToggleSwitch } from '@/shared/ui/ToggleSwitch/ToggleSwitch';
import styles from './ModalFormProcedure.module.css';

type Procedure = {
  id: number;
  name: string;
  description: string;
  duration_min: number;
  price: number;
  is_active: boolean;
};

type ModalFormProcedureProps = {
  onClose: () => void;
};

export default function ModalFormProcedure({ onClose }: ModalFormProcedureProps) {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [filteredProcedures, setFilteredProcedures] = useState<Procedure[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetchProcedures();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProcedures(procedures);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredProcedures(
        procedures.filter(proc => 
          proc.name.toLowerCase().includes(query) ||
          proc.description?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, procedures]);

  const fetchProcedures = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/procedure');
      if (response.data?.data) {
        setProcedures(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching procedures:', error);
      toast.error('Не удалось загрузить процедуры');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProcedureStatus = async (procedure: Procedure) => {
    setUpdatingId(procedure.id);
    try {
      const response = await axiosInstance.put(`/procedure/${procedure.id}`, {
        is_active: !procedure.is_active
      });

      if (response.data?.data) {
        setProcedures(prev => 
          prev.map(p => p.id === procedure.id ? response.data.data : p)
        );
        toast.success(
          `Процедура "${procedure.name}" ${!procedure.is_active ? 'активирована' : 'деактивирована'}`
        );
      }
    } catch (error) {
      console.error('Error toggling procedure:', error);
      toast.error('Не удалось изменить статус процедуры');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Управление процедурами</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Поиск */}
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по названию..."
            className={styles.searchInput}
            autoFocus
          />
        </div>

        {/* Список процедур */}
        <div className={styles.proceduresList}>
          {isLoading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : filteredProcedures.length === 0 ? (
            <div className={styles.emptyState}>
              {searchQuery ? 'Ничего не найдено' : 'Нет процедур'}
            </div>
          ) : (
            filteredProcedures.map((procedure) => (
              <div key={procedure.id} className={styles.procedureItem}>
                <div className={styles.procedureInfo}>
                  <div className={styles.procedureName}>
                    {procedure.name}
                    {!procedure.is_active && (
                      <span className={styles.inactiveBadge}>Неактивна</span>
                    )}
                  </div>
                  <div className={styles.procedureMeta}>
                    <span>{procedure.duration_min} мин</span>
                    <span>{procedure.price.toLocaleString()} ₽</span>
                  </div>
                </div>
                
                <div className={styles.procedureToggle}>
                  <ToggleSwitch
                    isActive={procedure.is_active}
                    onChange={() => toggleProcedureStatus(procedure)}
                    disabled={updatingId === procedure.id}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.footer}>
          <button className={styles.closeFooterButton} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}