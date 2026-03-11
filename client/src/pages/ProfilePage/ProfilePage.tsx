// client/src/pages/ProfilePage/ui/ProfilePage.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { User, Mail, Phone, Calendar, Award, Settings, Ruler } from "lucide-react";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";
import { PushNotificationToggle } from '@/features/push-notifications/PushNotificationToggle';
import MeasurementApi from "@/entities/measurement/api/MeasurementApi";
import { MeasurementType } from "@/entities/measurement/model";
import MeasurementCard from "@/entities/measurement/ui/MeasurementCard";
import { CLIENT_ROUTES } from "@/shared/consts/clientRoutes";
import styles from "./ProfilePage.module.css";

export default function ProfilePage() {
  // 🔥 Вся оригинальная логика сохранена!
  const [measurements, setMeasurements] = useState<MeasurementType[]>([]);
  const navigate = useNavigate();
  const { user, isInitialized } = useAppSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState<'info' | 'measurements' | 'notifications'>('measurements');

  // 🔥 Оригинальный useEffect с защитой
  useEffect(() => {
    if (!isInitialized) return;
    
    if (!user) {
      navigate(CLIENT_ROUTES.AUTH);
      return;
    }
    
    const getMeasurementsByUser = async (): Promise<void> => {
      try {
        const response = await MeasurementApi.getMeasurementsByUser();
        if (response && Array.isArray(response.data)) {
          setMeasurements(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    
    getMeasurementsByUser();
  }, [user, isInitialized, navigate]); // добавил isInitialized в зависимости

  // 🔥 Оригинальный console.log
  console.log(measurements);

  // Если пользователь не проинициализирован — показываем загрузку
  if (!isInitialized) {
    return <div className={styles.loading}>Загрузка профиля...</div>;
  }

  // Если нет пользователя — не рендерим (редирект уже в useEffect)
  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Мой профиль</h1>
          <p className={styles.subtitle}>Управляйте своими данными и настройками</p>
        </div>

        {/* Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              <span className={styles.avatarPlaceholder}>{getInitials(user.name)}</span>
            </div>
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>{user.name}</h2>
              <div className={styles.profileBadge}>
                <Award className={styles.badgeIcon} />
                <span>{user.role === 'isAdmin' ? 'Администратор' : 'Клиент'}</span>
              </div>
            </div>
          </div>

          <div className={styles.contactGrid}>
            <div className={styles.contactItem}>
              <Mail className={styles.contactIcon} />
              <div className={styles.contactContent}>
                <span className={styles.contactLabel}>Email</span>
                <span className={styles.contactValue}>{user.email}</span>
              </div>
            </div>
            
            <div className={styles.contactItem}>
              <Phone className={styles.contactIcon} />
              <div className={styles.contactContent}>
                <span className={styles.contactLabel}>Телефон</span>
                <span className={styles.contactValue}>{user.phone || 'Не указан'}</span>
              </div>
            </div>
            
            <div className={styles.contactItem}>
              <Calendar className={styles.contactIcon} />
              <div className={styles.contactContent}>
                <span className={styles.contactLabel}>Регистрация</span>
                <span className={styles.contactValue}>{formatDate(user.createdAt)}</span>
              </div>
            </div>
            
            <div className={styles.contactItem}>
              <Ruler className={styles.contactIcon} />
              <div className={styles.contactContent}>
                <span className={styles.contactLabel}>Всего замеров</span>
                <span className={styles.contactValue}>{measurements.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'measurements' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('measurements')}
          >
            <Ruler className={styles.tabIcon} />
            <span>Мои замеры</span>
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'notifications' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Settings className={styles.tabIcon} />
            <span>Уведомления</span>
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'info' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('info')}
          >
            <User className={styles.tabIcon} />
            <span>Обо мне</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className={styles.tabContent}>
          {activeTab === 'measurements' && (
            <div className={styles.measurementsSection}>
              <h3 className={styles.sectionTitle}>Мои замеры</h3>
              {measurements.length > 0 ? (
                <div className={styles.measurementsGrid}>
                  {measurements.map((measurement) => (
                    <MeasurementCard 
                      key={measurement.id} 
                      measurement={measurement}  
                      onDelete={() => {}} 
                      onUpdate={() => {}} 
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p>У вас пока нет замеров</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className={styles.notificationsSection}>
              <h3 className={styles.sectionTitle}>Настройки уведомлений</h3>
              <div className={styles.notificationCard}>
                <PushNotificationToggle />
              </div>
              <div className={styles.notificationInfo}>
                <p className={styles.infoNote}>
                  💡 Уведомления приходят за 2 часа, 1 час и 30 минут до процедуры
                </p>
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className={styles.infoSection}>
              <h3 className={styles.sectionTitle}>Обо мне</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Имя:</span>
                  <span className={styles.infoValue}>{user.name}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>{user.email}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Телефон:</span>
                  <span className={styles.infoValue}>{user.phone || 'Не указан'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Дата регистрации:</span>
                  <span className={styles.infoValue}>{formatDate(user.createdAt)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Всего потрачено:</span>
                  <span className={styles.infoValue}>{user.totalSpent?.toLocaleString() || 0} ₽</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}