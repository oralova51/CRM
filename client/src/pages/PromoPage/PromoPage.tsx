import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../../app/store/store';
import { getAllProceduresThunk } from '../../entities/procedure/api/procedureApi';
import { ProcedureRadioCard } from '../../entities/procedure/ui/ProcedureRadioCard/ProcedureRadioCard';
import type { Procedure } from '../../entities/procedure/model/types';
import { CLIENT_ROUTES } from '../../shared/consts/clientRoutes';
import './PromoPage.css';

// Маппинг названий процедур на файлы в public/procedures
const PROCEDURE_IMAGE_MAP: Record<string, string> = {
  'Массаж тела по технологии LPG': '/procedures/lpg_telo.jpg',
  'LPG массаж лица': '/procedures/lpg_face.jpg',
  'Sketch массаж': '/procedures/placeholder.svg',
  'Sketch массаж лица': '/procedures/sketch_face.JPG',
  'Индиба (1 зона)': '/procedures/indiba.JPG',
  'Турбо массаж для похудения': '/procedures/turbo.JPG',
  'Криолиполиз (манипула для тела)': '/procedures/cryolipoliz.jpg',
  'Криолиполиз (манипула для подбородка)': '/procedures/placeholder.svg',
  'RF лифтинг для лица': '/procedures/rf_face.JPG',
  'RF лифтинг для тела': '/procedures/rf_lifting.jpg',
  'Кавитация': '/procedures/kavitaciya.jpeg',
  'Миостимуляция': '/procedures/miostimul.jpeg',
  'Прессотерапия': '/procedures/pressoterapia.jpg',
  'Обёртывания': '/procedures/obertivanie.jpeg',
};

const PLACEHOLDER_IMAGE = '/procedures/placeholder.svg';

const getProcedureImageUrl = (name: string): string => {
  const mapped = PROCEDURE_IMAGE_MAP[name];
  return mapped ?? PLACEHOLDER_IMAGE;
};

// Процедуры с плашкой НОВИНКА
const NEW_PROCEDURE_NAMES = new Set(['Индиба (1 зона)', 'Sketch массаж', 'Sketch массаж лица']);

const isNewProcedure = (name: string): boolean => NEW_PROCEDURE_NAMES.has(name);

type ProcedureDisplay = Procedure & {
  isNew?: boolean;
};

const PromoPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedProcedureId, setSelectedProcedureId] = useState<number | null>(null);
  
  const { procedures, isLoading, error } = useAppSelector((state) => state.procedures);

  const proceduresWithMeta: ProcedureDisplay[] = procedures
    .filter(proc => proc.is_active)
    .map(proc => ({
      ...proc,
      isNew: isNewProcedure(proc.name),
      description: proc.description || 'Описание временно отсутствует'
    }));

  useEffect(() => {
    dispatch(getAllProceduresThunk());
  }, [dispatch]);

  const handleProcedureSelect = (procedure: Procedure) => {
    sessionStorage.setItem('selectedProcedure', JSON.stringify({
      id: procedure.id,
      name: procedure.name,
      price: procedure.price,
      duration: procedure.duration_min
    }));
    
    navigate(CLIENT_ROUTES.AUTH);
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
      {/* Hero секция с блогом */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <h1 className="hero-title">Студия идеального тела</h1>
              <p className="hero-subtitle">Работаем с 2019 года.</p>
            </div>

            <div className="blog-card">
              <h2 className="blog-title">О нашей студии</h2>
              
              <div className="blog-content">
                <p className="blog-text">
                  <strong>Студия идеального тела</strong> — это пространство, где забота о себе становится 
                  приятной и эффективной привычкой. Мы объединили современные аппаратные методики 
                  с индивидуальным подходом, чтобы помочь вам достичь желаемых результатов.
                </p>

                <div className="blog-stats">
                  <div className="stat-item">
                    <span className="stat-number">8+</span>
                    <span className="stat-label">лет опыта</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">1500+</span>
                    <span className="stat-label">довольных клиентов</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">15+</span>
                    <span className="stat-label">процедур</span>
                  </div>
                </div>

                <div className="blog-features">
                  <h3 className="features-title">Почему выбирают нас:</h3>
                  <ul className="features-list">
                    <li>✅ Сертифицированные специалисты с медицинским образованием</li>
                    <li>✅ Современное европейское оборудование</li>
                    <li>✅ Индивидуальные программы коррекции</li>
                    <li>✅ Уютная атмосфера и комфортные условия</li>
                    <li>✅ Работаем с 2019 года без выходных</li>
                  </ul>
                </div>

                <div className="blog-quote">
                  <p>
                    "Мы не просто делаем процедуры — мы помогаем вам полюбить свое тело 
                    и чувствовать себя уверенно каждый день"
                  </p>
                  <span className="quote-author">— Основатель студии</span>
                </div>

                <div className="blog-cta">
                  <p>Выберите процедуру ниже и начните свой путь к идеальному телу!</p>
                </div>
              </div>
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
                      src={getProcedureImageUrl(procedure.name)} 
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