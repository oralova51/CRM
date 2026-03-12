import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/useReduxHooks";
import { getAllProceduresThunk } from "@/entities/procedure/api/procedureApi";
import { StepIndicator } from "@/widgets/booking-form/StepIndicator/StepIndicator";
import { ServiceSelectionStep } from "@/widgets/booking-form/ServiceSelectionStep/ServiceSelectionStep";
import { DateSelectionStep } from "@/widgets/booking-form/DateSelectionStep/DateSelectionStep";
import { TimeSelectionStep } from "@/widgets/booking-form/TimeSelectionStep/TimeSelectionStep";
import { useCreateBooking } from "@/features/bookings/create-booking/useCreateBooking";
import { CLIENT_ROUTES } from "@/shared/consts/clientRoutes";
import styles from "./BookAppointmentPage.module.css";
import { useToast } from '@/shared/lib/toast/ToastContext';

type Step = 1 | 2 | 3;

export default function BookAppointmentPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { procedures, isLoading: proceduresLoading } = useAppSelector((state) => state.procedures);
  const { createBooking, isLoading: creatingBooking } = useCreateBooking();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    dispatch(getAllProceduresThunk());
  }, [dispatch]);

  const selectedProcedure = procedures.find(p => p.id === selectedServiceId);

  const handleServiceNext = () => {
    if (selectedServiceId) {
      setCurrentStep(2);
    }
  };

  const handleDateNext = () => {
    if (selectedDate) {
      setCurrentStep(3);
    }
  };

  const handleConfirm = async () => {
    if (!selectedProcedure || !selectedDate || !selectedTime) return;

    try {
      // Формируем дату и время в ISO формат
      const scheduledAt = `${selectedDate}T${selectedTime}:00`;

      await createBooking({
        procedure_id: selectedProcedure.id,
        scheduled_at: scheduledAt,
      });

      toast.success('Запись успешно создана! Ждём вас в студии!');
      navigate(CLIENT_ROUTES.PROCEDURES);
    } catch (error) {
      toast.error('Не удалось создать запись. Попробуйте позже.');
    }
  };

  if (proceduresLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loading}>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Запись на процедуру</h1>
          <p className={styles.subtitle}>Выберите услугу, дату и удобное время</p>
        </div>

        <StepIndicator currentStep={currentStep} totalSteps={3} />

        {currentStep === 1 && (
          <ServiceSelectionStep
            procedures={procedures.filter(p => p.is_active)}
            selectedId={selectedServiceId}
            onSelect={setSelectedServiceId}
            onNext={handleServiceNext}
          />
        )}

        {currentStep === 2 && (
          <DateSelectionStep
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
            onNext={handleDateNext}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && selectedProcedure && (
          <TimeSelectionStep
            selectedTime={selectedTime}
            onSelect={setSelectedTime}
            onConfirm={handleConfirm}
            onBack={() => setCurrentStep(2)}
            selectedService={selectedProcedure.name}
            selectedDate={selectedDate || ""}
          />
        )}

        {creatingBooking && (
          <div className={styles.overlay}>
            <div className={styles.loading}>Создание записи...</div>
          </div>
        )}
      </div>
    </div>
  );
}