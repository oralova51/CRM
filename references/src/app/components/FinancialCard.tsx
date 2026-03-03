import { TrendingUp, Wallet } from "lucide-react";

export function FinancialCard() {
  const totalPaid = 128000;
  const discountsReceived = 21340;
  const savedPercentage = 16.6;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-emerald-50 rounded-xl">
          <Wallet className="w-5 h-5 text-emerald-600" />
        </div>
        <h3 className="text-lg text-neutral-900">
          Финансовые преимущества
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-neutral-600 mb-1">Вы заплатили в студии</p>
          <p className="text-2xl text-neutral-900">
            {totalPaid.toLocaleString("ru-RU")} ₽
          </p>
        </div>

        <div className="h-px bg-neutral-200" />

        <div>
          <p className="text-sm text-neutral-600 mb-1">Получено скидок</p>
          <p className="text-2xl text-emerald-600">
            {discountsReceived.toLocaleString("ru-RU")} ₽
          </p>
        </div>

        {/* Savings Highlight */}
        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-emerald-900">Ваша экономия</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span className="text-2xl text-emerald-600">
                {savedPercentage}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
