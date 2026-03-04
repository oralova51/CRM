import "./MainPage.css";
import LoyaltyApi from "@/entities/loyaltyLevel/api/LoyaltyApi";

export default function MainPage() {
  console.log(LoyaltyApi.getLoyaltyLevels());
  console.log(LoyaltyApi.getUserDiscount());
  
  
  return (
    <section className="page main-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">CRM-панель</h1>
          <p className="page-subtitle">
            Краткий обзор задач и активности. Используйте меню, чтобы перейти к
            нужному разделу.
          </p>
        </div>
      </header>

      <div className="main-card">
        <div className="main-card-text">
          <h2>Добро пожаловать</h2>
          <p>
            Здесь вы можете отслеживать задачи, работать с клиентами и
            планировать работу команды в едином интерфейсе.
          </p>
        </div>
        <div className="main-card-image">
          <img src="/beaver-1.jpg" alt="Бобр" />
        </div>
      </div>
    </section>
  );
}
