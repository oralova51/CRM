// client/src/pages/PromoPage/ui/PromoPage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/app/store/store';
import { getAllProceduresThunk } from '@/entities/procedure/api/procedureApi';
import type { Procedure } from '@/entities/procedure/model/types';
import { CLIENT_ROUTES } from '@/shared/consts/clientRoutes';
import { 
  Sparkles, Clock, CheckCircle, Gift } from 'lucide-react';
import styles from './PromoPage.module.css';

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

// Данные для абонементов
const MEMBERSHIPS = [
  {
    id: 1,
    category: "LPG тела",
    duration: "40 минут",
    sessions: [
      { count: 5, price: 7000, savings: "20%" },
      { count: 10, price: 13000, savings: "28%" },
      { count: 15, price: 18000, savings: "33%" },
      { count: 20, price: 22000, savings: "39%" },
    ]
  },
  {
    id: 2,
    category: "LPG тела",
    duration: "30 минут",
    sessions: [
      { count: 5, price: 6000, savings: "20%" },
      { count: 10, price: 11000, savings: "27%" },
      { count: 15, price: 15000, savings: "33%" },
      { count: 20, price: 18000, savings: "40%" },
    ]
  },
  {
    id: 3,
    category: "LPG лица",
    duration: "30 минут",
    sessions: [
      { count: 5, price: 5000, savings: "17%" },
      { count: 10, price: 9000, savings: "25%" },
      { count: 15, price: 12000, savings: "33%" },
    ]
  },
  {
    id: 4,
    category: "Криолиполиз (тело)",
    duration: "40 минут",
    sessions: [
      { count: 2, price: 5000, savings: "15%" },
      { count: 4, price: 8000, savings: "20%" },
      { count: 6, price: 10500, savings: "25%" },
      { count: 8, price: 12000, savings: "28%" },
      { count: 10, price: 14000, savings: "30%" },
    ]
  },
  {
    id: 5,
    category: "Индиба",
    note: "1 зона",
    isNew: true,
    sessions: [
      { count: 3, price: 5500, savings: "15%" },
      { count: 6, price: 10000, savings: "22%" },
      { count: 9, price: 13500, savings: "25%" },
      { count: 12, price: 16000, savings: "27%" },
      { count: 15, price: 18000, savings: "30%" },
      { count: 18, price: 20000, savings: "32%" },
      { count: 21, price: 21000, savings: "33%" },
    ]
  },
  {
    id: 6,
    category: "Sketch массаж",
    duration: "40 минут",
    isNew: true,
    sessions: [
      { count: 5, price: 8000, savings: "20%" },
      { count: 10, price: 14000, savings: "30%" },
      { count: 15, price: 18000, savings: "33%" },
      { count: 20, price: 20000, savings: "37%" },
    ]
  },
  {
    id: 7,
    category: "Sketch массаж лица",
    duration: "30 минут",
    isNew: true,
    sessions: [
      { count: 5, price: 6000, savings: "20%" },
      { count: 10, price: 10000, savings: "27%" },
      { count: 15, price: 12000, savings: "33%" },
      { count: 20, price: 14000, savings: "36%" },
    ]
  },
  {
    id: 8,
    category: "Турбомассаж / Горячий вакуум",
    duration: "40 минут",
    sessions: [
      { count: 5, price: 7000, savings: "20%" },
      { count: 10, price: 13000, savings: "28%" },
      { count: 15, price: 18000, savings: "33%" },
      { count: 20, price: 22000, savings: "39%" },
    ]
  }
];

export default function PromoPage() {
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

  const handleMembershipSelect = (membership: typeof MEMBERSHIPS[0], session: typeof MEMBERSHIPS[0]['sessions'][0]) => {
    sessionStorage.setItem('selectedMembership', JSON.stringify({
      category: membership.category,
      duration: membership.duration,
      count: session.count,
      price: session.price,
      savings: session.savings
    }));
    navigate(CLIENT_ROUTES.AUTH);
  };

  return (
    <div className={styles.page}>
      {/* Hero секция */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Студия<br />идеального тела
            </h1>
            <p className={styles.heroSubtitle}>
              Работаем с 2019 года. Помогаем вам стать лучшей версией себя.
            </p>
            <div className={styles.heroButtons}>
              <button 
                className={styles.heroButtonPrimary}
                onClick={() => {
                  document.getElementById('procedures')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Выбрать процедуру
              </button>
              <button 
                className={styles.heroButtonSecondary}
                onClick={() => {
                  document.getElementById('memberships')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Абонементы
              </button>
            </div>
          </div>
          
          {/* Статистика */}
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>8+</div>
              <div className={styles.statLabel}>лет опыта</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>1500+</div>
              <div className={styles.statLabel}>клиентов</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>15+</div>
              <div className={styles.statLabel}>процедур</div>
            </div>
          </div>
        </div>
      </section>

      {/* О студии */}
      <section className={styles.about}>
        <div className={styles.container}>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutContent}>
              <h2 className={styles.sectionTitle}>О нашей студии</h2>
              <p className={styles.aboutText}>
                <strong>Студия идеального тела</strong> — это пространство, где забота о себе становится 
                приятной и эффективной привычкой. Мы объединили современные аппаратные методики 
                с индивидуальным подходом, чтобы помочь вам достичь желаемых результатов.
              </p>
              
              <div className={styles.features}>
                <div className={styles.feature}>
                  <CheckCircle className={styles.featureIcon} />
                  <span>Сертифицированные специалисты</span>
                </div>
                <div className={styles.feature}>
                  <CheckCircle className={styles.featureIcon} />
                  <span>Европейское оборудование</span>
                </div>
                <div className={styles.feature}>
                  <CheckCircle className={styles.featureIcon} />
                  <span>Индивидуальные программы</span>
                </div>
                <div className={styles.feature}>
                  <CheckCircle className={styles.featureIcon} />
                  <span>Работаем без выходных</span>
                </div>
              </div>
            </div>

            <div className={styles.quoteCard}>
              <Sparkles className={styles.quoteIcon} />
              <p className={styles.quoteText}>
                "Мы не просто делаем процедуры — мы помогаем вам полюбить свое тело 
                и чувствовать себя уверенно каждый день"
              </p>
              <p className={styles.quoteAuthor}>— Основатель студии</p>
            </div>
          </div>
        </div>
      </section>

      {/* Процедуры */}
      <section id="procedures" className={styles.procedures}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Наши процедуры</h2>
          
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Загрузка процедур...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              Ошибка загрузки: {error}
            </div>
          ) : (
            <div className={styles.proceduresGrid}>
              {proceduresWithMeta.map((procedure) => (
                <article key={procedure.id} className={styles.procedureCard}>
                  {procedure.isNew && (
                    <span className={styles.newBadge}>Новинка</span>
                  )}
                  
                  <div className={styles.procedureImage}>
                    <img 
                      src={getProcedureImageUrl(procedure.name)} 
                      alt={procedure.name}
                      loading="lazy"
                    />
                  </div>
                  
                  <div className={styles.procedureContent}>
                    <h3 className={styles.procedureTitle}>{procedure.name}</h3>
                    <p className={styles.procedureDescription}>
                      {procedure.description}
                    </p>
                    
                    <div className={styles.procedureMeta}>
                      <span className={styles.procedureDuration}>
                        <Clock className={styles.metaIcon} />
                        {procedure.duration_min} мин
                      </span>
                      <span className={styles.procedurePrice}>
                        {formatPrice(procedure.price)}
                      </span>
                    </div>
                    
                    <button
                      className={styles.selectButton}
                      onClick={() => handleProcedureSelect(procedure)}
                    >
                      Выбрать процедуру
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Абонементы */}
      <section id="memberships" className={styles.memberships}>
        <div className={styles.container}>
          <div className={styles.membershipsHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Абонементы</h2>
              <p className={styles.membershipsSubtitle}>Приобретая абонемент, вы экономите до 40%</p>
            </div>
            <div className={styles.savingsBadge}>
              <Gift className={styles.savingsIcon} />
              <span>Выгода до 40%</span>
            </div>
          </div>
          
          <div className={styles.membershipsGrid}>
            {MEMBERSHIPS.map((membership) => (
              <div key={membership.id} className={styles.membershipCard}>
                <div className={styles.membershipHeader}>
                  <h3 className={styles.membershipTitle}>{membership.category}</h3>
                  {membership.duration && (
                    <span className={styles.membershipDuration}>
                      <Clock className={styles.membershipDurationIcon} />
                      {membership.duration}
                    </span>
                  )}
                  {membership.note && (
                    <span className={styles.membershipNote}>{membership.note}</span>
                  )}
                  {membership.isNew && (
                    <span className={styles.membershipNew}>Новинка</span>
                  )}
                </div>
                
                <div className={styles.sessionsList}>
                  {membership.sessions.map((session, index) => (
                    <div key={index} className={styles.sessionItem}>
                      <div className={styles.sessionInfo}>
                        <span className={styles.sessionCount}>{session.count} сеансов</span>
                        <span className={styles.sessionSavings}>−{session.savings}</span>
                      </div>
                      <div className={styles.sessionPrice}>
                        <span className={styles.price}>{session.price.toLocaleString()} ₽</span>
                        <span className={styles.pricePerSession}>
                          {Math.round(session.price / session.count)} ₽/сеанс
                        </span>
                      </div>
                      <button 
                        className={styles.sessionSelectButton}
                        onClick={() => handleMembershipSelect(membership, session)}
                      >
                        Выбрать
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Призыв к действию */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Готовы начать?</h2>
            <p className={styles.ctaText}>
              Запишитесь на процедуру и получите скидку 10% на первое посещение
            </p>
            <button 
              className={styles.ctaButton}
              onClick={() => navigate(CLIENT_ROUTES.AUTH)}
            >
              Записаться сейчас
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}