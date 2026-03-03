import { Calendar, Clock, MapPin, CheckCircle2, XCircle, Circle } from "lucide-react";

const appointments = [
  {
    id: 1,
    service: "LPG",
    date: "10 марта 2026",
    time: "14:00",
    status: "upcoming",
    specialist: "Анна Иванова",
  },
  {
    id: 2,
    service: "Ручной массаж",
    date: "15 марта 2026",
    time: "11:00",
    status: "upcoming",
    specialist: "Мария Петрова",
  },
  {
    id: 3,
    service: "Кавитация",
    date: "5 марта 2026",
    time: "16:00",
    status: "completed",
    specialist: "Анна Иванова",
  },
  {
    id: 4,
    service: "Лимфодренажный массаж",
    date: "1 марта 2026",
    time: "10:00",
    status: "completed",
    specialist: "Елена Сидорова",
  },
  {
    id: 5,
    service: "LPG",
    date: "25 февраля 2026",
    time: "15:00",
    status: "cancelled",
    specialist: "Мария Петрова",
  },
];

const getStatusInfo = (status: string) => {
  switch (status) {
    case "upcoming":
      return {
        label: "Предстоит",
        icon: Circle,
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
      };
    case "completed":
      return {
        label: "Завершено",
        icon: CheckCircle2,
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
      };
    case "cancelled":
      return {
        label: "Отменено",
        icon: XCircle,
        color: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
      };
    default:
      return {
        label: status,
        icon: Circle,
        color: "text-neutral-600",
        bg: "bg-neutral-50",
        border: "border-neutral-200",
      };
  }
};

export function ProcedureCalendar() {
  const upcomingAppointments = appointments.filter((a) => a.status === "upcoming");
  const pastAppointments = appointments.filter((a) => a.status !== "upcoming");

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 py-6 lg:py-8">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl text-neutral-900 mb-2">
            Календарь процедур
          </h1>
          <p className="text-neutral-600">
            Ваши предстоящие и прошлые визиты
          </p>
        </div>

        {/* Upcoming Appointments */}
        <div className="mb-8">
          <h2 className="text-lg text-neutral-900 mb-4">
            Предстоящие визиты ({upcomingAppointments.length})
          </h2>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => {
              const statusInfo = getStatusInfo(appointment.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={appointment.id}
                  className="bg-white rounded-xl p-5 shadow-sm border border-neutral-200 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg text-neutral-900 mb-1">
                        {appointment.service}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {appointment.specialist}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${statusInfo.bg} ${statusInfo.border} border`}
                    >
                      <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                      <span className={`text-xs ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Calendar className="w-4 h-4" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 bg-neutral-100 text-neutral-900 py-2.5 rounded-lg text-sm hover:bg-neutral-200 transition-colors">
                      Перенести
                    </button>
                    <button className="flex-1 bg-red-50 text-red-600 py-2.5 rounded-lg text-sm hover:bg-red-100 transition-colors">
                      Отменить
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Past Appointments */}
        <div>
          <h2 className="text-lg text-neutral-900 mb-4">
            История визитов
          </h2>
          <div className="space-y-3">
            {pastAppointments.map((appointment) => {
              const statusInfo = getStatusInfo(appointment.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={appointment.id}
                  className="bg-white rounded-xl p-5 shadow-sm border border-neutral-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-neutral-900 mb-1">
                        {appointment.service}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {appointment.specialist}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${statusInfo.bg} ${statusInfo.border} border`}
                    >
                      <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                      <span className={`text-xs ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Calendar className="w-4 h-4" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
