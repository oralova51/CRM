import MeasurementApi from "@/entities/measurement/api/MeasurementApi";
import { MeasurementType } from "@/entities/measurement/model";
import MeasurementCard from "@/entities/measurement/ui/MeasurementCard";
import { CLIENT_ROUTES } from "@/shared/consts/clientRoutes";
import { useAppSelector } from "@/shared/hooks/useReduxHooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PushNotificationToggle } from '@/features/push-notifications/PushNotificationToggle';

export default function MeasurementPage() {
  const [measurements, setMeasurements] = useState<MeasurementType[]>([]);
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      navigate(CLIENT_ROUTES.AUTH);
      return;
    }
    const getMeasurementsByUser = async (): Promise<void> => {
      try {
        const response = await MeasurementApi.getMeasurementsByUser();
        if (response && Array.isArray(response.data)) {
          setMeasurements(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getMeasurementsByUser();
  }, [user]);
  console.log(measurements);

  return (
    <div>
      {measurements.length > 0 ? (
        measurements.map((measurement) => (
          <MeasurementCard key={measurement.id} measurement={measurement} />
        ))
      ) : (
        <h1>Нет замеров</h1>
      )}
      <div >
        <h2 >Настройки уведомлений</h2>
        <PushNotificationToggle />
      </div>
    </div>

  );
}

// {new Date(mea.measured_at).toLocaleDateString()}: note-{mea.notes}
