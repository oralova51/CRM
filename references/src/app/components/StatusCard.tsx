import { Crown } from "lucide-react";
import * as Progress from "@radix-ui/react-progress";

export function StatusCard() {
  const currentStatus = "PLATINUM";
  const discount = 12;
  const currentSpending = 128000;
  const nextLevelTarget = 136500;
  const toNextLevel = nextLevelTarget - currentSpending;
  const progress = (currentSpending / nextLevelTarget) * 100;

  return (
    <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-2xl p-6 lg:p-8 text-white shadow-lg">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-6 h-6 lg:w-7 lg:h-7 text-amber-400" />
            <span className="text-sm lg:text-base text-neutral-400">Ваш статус</span>
          </div>
          <h2 className="text-3xl lg:text-4xl tracking-wide mb-1">
            {currentStatus}
          </h2>
          <p className="text-neutral-400 text-sm lg:text-base">
            Индивидуальная скидка: <span className="text-white font-medium">{discount}%</span>
          </p>
        </div>
        <div className="px-4 py-2 bg-amber-400/20 rounded-lg border border-amber-400/30">
          <div className="text-2xl lg:text-3xl text-amber-400">{discount}%</div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-neutral-400">До следующего уровня</span>
          <span className="text-lg lg:text-xl">
            {toNextLevel.toLocaleString("ru-RU")} ₽
          </span>
        </div>

        {/* Progress Bar */}
        <Progress.Root
          className="relative overflow-hidden bg-white/10 rounded-full w-full h-3"
          value={progress}
        >
          <Progress.Indicator
            className="bg-gradient-to-r from-amber-400 to-amber-500 w-full h-full transition-transform duration-500 ease-out rounded-full"
            style={{ transform: `translateX(-${100 - progress}%)` }}
          />
        </Progress.Root>

        <div className="flex justify-between text-xs text-neutral-400">
          <span>{currentSpending.toLocaleString("ru-RU")} ₽</span>
          <span>{nextLevelTarget.toLocaleString("ru-RU")} ₽</span>
        </div>
      </div>

      {/* Next Level Info */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-sm text-neutral-400">
          Следующий уровень: <span className="text-white">Diamond</span> • 
          Скидка: <span className="text-white">15%</span>
        </p>
      </div>
    </div>
  );
}
