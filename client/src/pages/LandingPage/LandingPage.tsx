import { Info, Sparkles, Calendar, Award } from "lucide-react";
import styles from "./LandingPage.module.css";

export function LandingPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Hero секция */}
        <div className={styles.hero}>
          <h1 className={styles.title}>Ideal Body Studio</h1>
          <p className={styles.subtitle}>
            Ваш путь к идеальному телу начинается здесь
          </p>
          <button 
            className={styles.ctaButton}
            onClick={() => window.location.href = '/auth'}
          >
            Начать свой путь
          </button>
        </div>

        {/* Преимущества */}
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Sparkles />
            </div>
            <h3>Современные методики</h3>
            <p>LPG, кавитация, RF-лифтинг и другие передовые процедуры</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Award />
            </div>
            <h3>Программа лояльности</h3>
            <p>Накопительные скидки и персональные предложения</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Calendar />
            </div>
            <h3>Удобная запись</h3>
            <p>Онлайн-календарь и напоминания о визитах</p>
          </div>
        </div>

        {/* Призыв к регистрации */}
        <div className={styles.ctaSection}>
          <h2>Готовы начать?</h2>
          <p>Зарегистрируйтесь и получите скидку 10% на первое посещение</p>
          <button 
            className={styles.ctaSecondary}
            onClick={() => window.location.href = '/auth'}
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
}