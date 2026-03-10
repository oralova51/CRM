import LoyaltyLevelCard from "@/entities/loyaltyLevel/ui/LoyaltyLevelCard/LoyaltyLevelCard";
import "./MainPage.css";
import { FinansialBenefits } from "@/entities/loyaltyLevel/ui/FinansialBenefits/FinansialBenefits";
import Statistics from "@/entities/loyaltyLevel/ui/Statistics/Statistics";


export default function MainPage() {
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
            Ваша личная панель лояльности
          </p>
        </div>
        <div className="main-card-image">
          {/* <img src="/beaver-1.jpg" alt="Бобр" /> */}
          🥰🥰🥰🥰🥰🥰
        </div>
        <LoyaltyLevelCard />
        <FinansialBenefits />
        <Statistics />
      </div>
    </section>
  );
}
