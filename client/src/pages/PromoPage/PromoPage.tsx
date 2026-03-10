import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store/store';
import { getAllProceduresThunk } from '../../entities/procedure/api/procedureApi';
import { ProcedureRadioCard } from '../../entities/procedure/ui/ProcedureRadioCard/ProcedureRadioCard';
import type { Procedure } from '../../entities/procedure/model/types';
import './PromoPage.css';

// Типы для формы
type ContactMethod = 'Telegram' | 'WhatsApp' | 'Phone call';

type AppointmentFormData = {
  name: string;
  phone: string;
  desiredDate: string;
  procedure: string;
  procedureId?: number;
  preferredContact: ContactMethod | '';
  consentGiven: boolean;
  infoAgreement: boolean;
};

// Временные заглушки для картинок
const getPlaceholderImage = (id: number) => {
  const images = [
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
    'https://images.unsplash.com/photo-1519823551278-64ac92734ab1?w=400',
    'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400',
    'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400',
  ];
  return images[id % images.length];
};

// Функция для определения новых процедур
const isNewProcedure = (createdAt: string): boolean => {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
  return daysDiff <= 30;
};

// Локальный тип для отображения
type ProcedureDisplay = Procedure & {
  isNew?: boolean;
  imageUrl?: string;
};

const PromoPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedProcedureId, setSelectedProcedureId] = useState<number | null>(null);
  const [formData, setFormData] = useState<AppointmentFormData>({
    name: '',
    phone: '',
    desiredDate: '',
    procedure: '',
    preferredContact: '',
    consentGiven: false,
    infoAgreement: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // ✅ ИСПРАВЛЕНО: используем state.procedures (как в store.ts)
  const { procedures, isLoading, error } = useAppSelector((state) => state.procedures);

  // Добавляем мета-информацию
  const proceduresWithMeta: ProcedureDisplay[] = procedures
    .filter(proc => proc.is_active)
    .map(proc => ({
      ...proc,
      isNew: isNewProcedure(proc.createdAt),
      description: proc.description || 'Описание временно отсутствует'
    }));

  useEffect(() => {
    dispatch(getAllProceduresThunk());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      // Здесь будет отправка на бэкенд
      console.log('Submitting:', formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setSubmitError('Ошибка при отправке');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProcedureSelect = (procedure: Procedure) => {
    setSelectedProcedureId(procedure.id);
    setFormData(prev => ({ 
      ...prev, 
      procedure: procedure.name
    }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <main className="promo-page">
      {/* Hero секция с формой */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1 className="hero-title">Студия идеального тела</h1>
              <p className="hero-subtitle">Работаем с 2019 года.</p>
            </div>

            <div className="appointment-card">
              <h2 className="appointment-title">Онлайн запись</h2>
              <p className="appointment-description">
                Оставьте свои данные, и я свяжусь с вами для подтверждения.
              </p>

              <form onSubmit={handleSubmit} className="appointment-form">
                <div className="form-group">
                  <label htmlFor="name">Имя</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Имя"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Телефон</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+7 (000) 000-00-00"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="desiredDate">Желаемая дата</label>
                    <input
                      type="date"
                      id="desiredDate"
                      name="desiredDate"
                      value={formData.desiredDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="procedure">Процедура</label>
                    <select
                      id="procedure"
                      name="procedure"
                      value={formData.procedure}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Выберите процедуру</option>
                      {proceduresWithMeta.map((proc) => (
                        <option key={proc.id} value={proc.name}>
                          {proc.name} - {formatPrice(proc.price)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="preferredContact">Предпочтительный способ связи</label>
                  <select
                    id="preferredContact"
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Выберите способ</option>
                    <option value="Telegram">Telegram</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Phone call">Телефонный звонок</option>
                  </select>
                </div>

                <div className="form-checkboxes">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="consentGiven"
                      checked={formData.consentGiven}
                      onChange={handleInputChange}
                      required
                    />
                    <span>
                      Нажимая кнопку, я даю согласие на обработку персональных 
                      данных и принимаю условия Политики конфиденциальности.
                    </span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="infoAgreement"
                      checked={formData.infoAgreement}
                      onChange={handleInputChange}
                    />
                    <span>
                      Даю согласие на информационное обновление, акциях и 
                      изменениях в услугах.
                    </span>
                  </label>
                </div>

                {submitError && (
                  <div className="error-message">{submitError}</div>
                )}

                {success && (
                  <div className="success-message">
                    Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.
                  </div>
                )}

                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={submitting}
                >
                  {submitting ? 'Отправка...' : 'Оставить заявку'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Секция с услугами */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">Наши процедуры</h2>
          
          {isLoading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Загрузка процедур...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              Ошибка загрузки: {error}
            </div>
          ) : (
            <div className="procedures-grid">
              {proceduresWithMeta.map((procedure) => (
                <article key={procedure.id} className="procedure-card">
                  <div className="procedure-image">
                    <img 
                      src={procedure.imageUrl || getPlaceholderImage(procedure.id)} 
                      alt={procedure.name}
                      loading="lazy"
                    />
                    {procedure.isNew && (
                      <span className="new-badge">НОВИНКА</span>
                    )}
                  </div>
                  
                  <div className="procedure-content">
                    <h3 className="procedure-title">{procedure.name}</h3>
                    <p className="procedure-description">
                      {procedure.description}
                    </p>
                    
                    <div className="procedure-selector">
                      <ProcedureRadioCard
                        procedure={procedure}
                        selected={selectedProcedureId === procedure.id}
                        onSelect={() => handleProcedureSelect(procedure)}
                      />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!isLoading && !error && proceduresWithMeta.length === 0 && (
            <div className="no-data">
              <p>Нет доступных процедур</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default PromoPage;