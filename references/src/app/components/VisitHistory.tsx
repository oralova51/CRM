import { Calendar as CalendarIcon, TrendingUp } from "lucide-react";
import { useState } from "react";

const monthNames = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

// Mock visit data - dates when user visited
const visitDates = [
  "2026-03-01",
  "2026-03-05",
  "2026-02-25",
  "2026-02-18",
  "2026-02-12",
  "2026-02-05",
  "2026-01-28",
  "2026-01-21",
  "2026-01-15",
];

export function VisitHistory() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Adjust firstDay (Monday = 0 instead of Sunday = 0)
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
  
  // Check if a date has a visit
  const hasVisit = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return visitDates.includes(dateStr);
  };
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  // Create calendar grid
  const calendarDays = [];
  
  // Empty cells before first day
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="aspect-square" />);
  }
  
  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const isVisitDay = hasVisit(day);
    const isToday = 
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear();
    
    calendarDays.push(
      <div
        key={day}
        className={`aspect-square flex items-center justify-center rounded-lg text-sm transition-colors ${
          isVisitDay
            ? "bg-neutral-900 text-white font-medium"
            : isToday
            ? "border-2 border-neutral-300 text-neutral-900"
            : "text-neutral-600 hover:bg-neutral-100"
        }`}
      >
        {day}
      </div>
    );
  }
  
  // Calculate stats for current month
  const visitsThisMonth = visitDates.filter(date => {
    const [y, m] = date.split("-");
    return parseInt(y) === year && parseInt(m) === month + 1;
  }).length;
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 py-6 lg:py-8">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl text-neutral-900 mb-2">
            История визитов
          </h1>
          <p className="text-neutral-600">
            Отслеживайте свою активность
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 lg:gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 lg:p-5 shadow-sm border border-neutral-200">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="w-4 h-4 text-neutral-600" />
              <span className="text-sm text-neutral-600">В этом месяце</span>
            </div>
            <div className="text-3xl text-neutral-900">{visitsThisMonth}</div>
            <p className="text-xs text-neutral-500 mt-1">посещений</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 lg:p-5 shadow-sm border border-neutral-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-neutral-600">Всего</span>
            </div>
            <div className="text-3xl text-neutral-900">{visitDates.length}</div>
            <p className="text-xs text-neutral-500 mt-1">визитов</p>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-neutral-200">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            
            <h2 className="text-lg lg:text-xl text-neutral-900">
              {monthNames[month]} {year}
            </h2>
            
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((day) => (
              <div
                key={day}
                className="text-center text-sm text-neutral-600 pb-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-neutral-200 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-neutral-900" />
              <span className="text-sm text-neutral-600">День визита</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-neutral-300" />
              <span className="text-sm text-neutral-600">Сегодня</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
