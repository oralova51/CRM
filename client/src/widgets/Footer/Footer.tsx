import { Link } from "react-router";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.col}>
            <h3 className={styles.heading}>Контакты</h3>
            <p>+7 (XXX) XXX-XX-XX</p>
            <p>info@idealbody.studio</p>
          </div>
          <div className={styles.col}>
            <h3 className={styles.heading}>Поддержка</h3>
            <p>support@idealbody.studio</p>
          </div>
          <div className={styles.col}>
            <Link to="#" className={styles.link}>
              Политика конфиденциальности
            </Link>
            <p className={styles.copyright}>© 2026 Ideal Body Studio</p>
          </div>
        </div>
      </div>
    </footer>
  );
}