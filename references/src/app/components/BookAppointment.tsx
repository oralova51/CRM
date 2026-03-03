import { useState } from "react";
import { Calendar as CalendarIcon, Clock, ChevronRight } from "lucide-react";
import * as RadioGroup from "@radix-ui/react-radio-group";

const services = [
  "LPG",
  "Ручной массаж",
  "Лимфодренажный массаж",
  "Кавитация",
  "Вакуумно-роликовый массаж",
  "Прессотерапия",
];

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

export function BookAppointment() {
  const [selectedService, setSelectedService] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [step, setStep] = useState(1);

  const handleConfirm = () => {
    // Mock confirmation
    alert(`Запись подтверждена!\nУслуга: ${selectedService}\nДата: ${selectedDate}\nВремя: ${selectedTime}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 py-6 lg:py-8">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl text-neutral-900 mb-2">
            Запись на процедуру
          </h1>
          <p className="text-neutral-600">
            Выберите услугу, дату и удобное время
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  step >= s
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-200 text-neutral-500"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step > s ? "bg-neutral-900" : "bg-neutral-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Service Selection */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
            <h2 className="text-xl text-neutral-900 mb-4">Выберите услугу</h2>
            <RadioGroup.Root
              value={selectedService}
              onValueChange={setSelectedService}
              className="space-y-2"
            >
              {services.map((service) => (
                <RadioGroup.Item
                  key={service}
                  value={service}
                  className="flex items-center justify-between w-full p-4 rounded-xl border-2 border-neutral-200 hover:border-neutral-300 data-[state=checked]:border-neutral-900 data-[state=checked]:bg-neutral-50 transition-all cursor-pointer"
                >
                  <span className="text-neutral-900">{service}</span>
                  <ChevronRight className="w-5 h-5 text-neutral-400" />
                </RadioGroup.Item>
              ))}
            </RadioGroup.Root>

            <button
              onClick={() => setStep(2)}
              disabled={!selectedService}
              className="w-full mt-6 bg-neutral-900 text-white py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors"
            >
              Далее
            </button>
          </div>
        )}

        {/* Step 2: Date Selection */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
            <h2 className="text-xl text-neutral-900 mb-4">Выберите дату</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {Array.from({ length: 15 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const dateStr = date.toLocaleDateString("ru-RU");
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedDate === dateStr
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    }`}
                  >
                    <div className="text-xs text-neutral-600 mb-1">
                      {date.toLocaleDateString("ru-RU", { weekday: "short" })}
                    </div>
                    <div className="text-lg text-neutral-900">
                      {date.getDate()}
                    </div>
                    <div className="text-xs text-neutral-600">
                      {date.toLocaleDateString("ru-RU", { month: "short" })}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-neutral-100 text-neutral-900 py-4 rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Назад
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedDate}
                className="flex-1 bg-neutral-900 text-white py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors"
              >
                Далее
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Time Selection */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
            <h2 className="text-xl text-neutral-900 mb-4">Выберите время</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedTime === time
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <Clock className="w-4 h-4 mx-auto mb-2 text-neutral-600" />
                  <div className="text-sm text-neutral-900">{time}</div>
                </button>
              ))}
            </div>

            {/* Summary */}
            {selectedTime && (
              <div className="bg-neutral-50 rounded-xl p-4 mb-6">
                <h3 className="text-sm text-neutral-600 mb-3">Ваша запись:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Услуга:</span>
                    <span className="text-neutral-900">{selectedService}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Дата:</span>
                    <span className="text-neutral-900">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Время:</span>
                    <span className="text-neutral-900">{selectedTime}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-neutral-100 text-neutral-900 py-4 rounded-xl hover:bg-neutral-200 transition-colors"
              >
                Назад
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selectedTime}
                className="flex-1 bg-neutral-900 text-white py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-800 transition-colors"
              >
                Подтвердить запись
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
