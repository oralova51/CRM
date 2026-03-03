import { Crown, TrendingUp, Activity, Sparkles } from "lucide-react";
import { StatusCard } from "./StatusCard";
import { FinancialCard } from "./FinancialCard";
import { ActivityCard } from "./ActivityCard";
import { PricingCard } from "./PricingCard";

export function Dashboard() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl text-neutral-900 mb-1">
            Добро пожаловать
          </h1>
          <p className="text-neutral-600">
            Ваша личная панель лояльности
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Status Block - Full Width on Mobile, Spans 2 columns on Desktop */}
          <div className="lg:col-span-2">
            <StatusCard />
          </div>

          {/* Financial Benefits */}
          <FinancialCard />

          {/* Activity Statistics */}
          <ActivityCard />

          {/* Personal Pricing - Full Width */}
          <div className="lg:col-span-2">
            <PricingCard />
          </div>

          {/* Motivational Banner */}
          <div className="lg:col-span-2 bg-gradient-to-r from-neutral-900 to-neutral-700 rounded-2xl p-6 lg:p-8 text-white">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg lg:text-xl mb-2">
                  Вы особенная для нас
                </h3>
                <p className="text-white/80 text-sm lg:text-base">
                  Продолжайте заботиться о себе. Всего 8,500 ₽ до статуса Diamond
                  и ещё больших преимуществ!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
