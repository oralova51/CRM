import { Activity, Calendar, CheckCircle2 } from "lucide-react";

export function ActivityCard() {
  const stats = {
    visits: 37,
    completedCourses: 4,
    averageInterval: 6,
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-purple-50 rounded-xl">
          <Activity className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg text-neutral-900">
          Статистика активности
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-sm text-neutral-600">Посещений</span>
          </div>
          <span className="text-xl text-neutral-900">{stats.visits}</span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-sm text-neutral-600">Завершённых курсов</span>
          </div>
          <span className="text-xl text-neutral-900">{stats.completedCourses}</span>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <Activity className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-sm text-neutral-600">Средний интервал</span>
          </div>
          <span className="text-xl text-neutral-900">{stats.averageInterval} дней</span>
        </div>
      </div>
    </div>
  );
}
