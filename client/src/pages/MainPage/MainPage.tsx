import LoyaltyLevelCard from "@/entities/loyaltyLevel/ui/LoyaltyLevelCard/LoyaltyLevelCard";
import "./MainPage.css";
import { CTA } from "@/entities/loyaltyLevel/ui/CTA/CTA";
import { FinansialBenefits } from "@/entities/loyaltyLevel/ui/FinansialBenefits/FinansialBenefits";
import { IndividualPrices } from "@/entities/loyaltyLevel/ui/IndividualPrices/IndividualPrices";
import Statistics from "@/entities/loyaltyLevel/ui/Statistics/Statistics";


export default function MainPage() {
  return (
    <section className="page main-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Добро пожаловать</h1>
          <p className="page-subtitle">
          Ваша личная панель лояльности
          </p>
        </div>
      </header>

        <div className="main-card-image">
          {/* <img src="/beaver-1.jpg" alt="Бобр" /> */}
        </div>
        <LoyaltyLevelCard />
        <FinansialBenefits />
        <IndividualPrices />
        <Statistics />
        <CTA />
      
    </section>
  );
}
