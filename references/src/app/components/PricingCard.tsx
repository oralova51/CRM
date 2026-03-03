import { Tag, Sparkles } from "lucide-react";

const pricing = [
  {
    service: "LPG",
    yourPrice: 1450,
    regularPrice: 1700,
  },
  {
    service: "Ручной массаж",
    yourPrice: 1000,
    regularPrice: null, // fixed price
  },
  {
    service: "Лимфодренажный массаж",
    yourPrice: 1320,
    regularPrice: 1500,
  },
  {
    service: "Кавитация",
    yourPrice: 2640,
    regularPrice: 3000,
  },
];

export function PricingCard() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 lg:p-8 border border-amber-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-amber-100 rounded-xl">
          <Tag className="w-5 h-5 text-amber-700" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg lg:text-xl text-neutral-900">
            Ваши индивидуальные цены
          </h3>
          <p className="text-sm text-neutral-600 mt-0.5">
            Эксклюзивно для вас
          </p>
        </div>
        <Sparkles className="w-5 h-5 text-amber-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
        {pricing.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 border border-amber-100 hover:border-amber-300 transition-colors"
          >
            <h4 className="text-neutral-900 mb-3">{item.service}</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl text-neutral-900">
                {item.yourPrice.toLocaleString("ru-RU")} ₽
              </span>
              {item.regularPrice && (
                <span className="text-sm text-neutral-400 line-through">
                  {item.regularPrice.toLocaleString("ru-RU")} ₽
                </span>
              )}
              {!item.regularPrice && (
                <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                  фикс. цена
                </span>
              )}
            </div>
            {item.regularPrice && (
              <p className="text-xs text-emerald-600 mt-2">
                Экономия {item.regularPrice - item.yourPrice} ₽
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-amber-200">
        <p className="text-sm text-neutral-600 text-center">
          Цены действительны при бронировании через личный кабинет
        </p>
      </div>
    </div>
  );
}
