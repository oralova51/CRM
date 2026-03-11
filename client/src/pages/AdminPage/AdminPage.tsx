import { useState } from "react";
import { useUserSearch } from "@/shared/hooks/useUserSearch";
import { UserWithoutPassword } from "@/entities/user/model";
import MeasurementApi from "@/entities/measurement/api/MeasurementApi";
import MeasurementCard from "@/entities/measurement/ui/MeasurementCard";
import {
  MeasurementInputData,
  MeasurementType,
  CreateMeasurementType,
} from "@/entities/measurement/model";
import { Button } from "@/shared/ui/Button/Button";

export default function AdminPage() {
  // Поиск
  const { query, setQuery, results } = useUserSearch();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithoutPassword | null>(
    null,
  );
  const [measurements, setMeasurements] = useState<MeasurementType[]>([]);

  const handleSelectUser = async (user: UserWithoutPassword) => {
    setSelectedUser(user);
    setQuery("");
    setShowCreateForm(false);
    try {
      const response = await MeasurementApi.AdminGetUsersMeasurements(user.id);
      if (response && Array.isArray(response.data)) {
        setMeasurements(response.data);
      } else {
        setMeasurements([]);
      }
    } catch (error) {
      console.error("Error fetching measurements:", error);
      setMeasurements([]);
    }
  };

  // Создание замера
  async function handleCreate() {
    if (!selectedUser) return;

    const newMeasurement: CreateMeasurementType = {
      user_id: selectedUser.id,
      measured_at: new Date(),
      waist_cm: 0,
      hips_cm: 0,
      hip_1: 0,
      chest_cm: 0,
      arms_cm: 0,
      photo_before: "",
      photo_after: "",
      notes: "",
    };

    try {
      const response = await MeasurementApi.createMeasurement(newMeasurement);
      if (response?.data) {
        const newMeasurementData: MeasurementType = response.data;
        setMeasurements((prev) => [...prev, newMeasurementData]);
      }
    } catch (error) {
      console.error("Error creating measurement:", error);
    }
  }

  // Обновление замера
  async function handleUpdate(updatedMeasurement: MeasurementType) {
    try {
      const response = await MeasurementApi.updateMeasurement(
        updatedMeasurement.id,
        updatedMeasurement,
      );
      if (response?.data) {
        const updatedData: MeasurementType = response.data;
        setMeasurements((prev) =>
          prev.map((m) => (m.id === updatedData.id ? updatedData : m)),
        );
      }
    } catch (error) {
      console.error("Error updating measurement:", error);
    }
  }

  // Удаление замера
  const handleDelete = async (id: number) => {
    await MeasurementApi.deleteMeasurement(id);
    setMeasurements(measurements.filter((m) => m.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Админ панель</h1>

      {/* Поиск */}
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск клиента... email, имя, телефон."
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        {/* Результаты поиска */}
        {results.length > 0 && (
          <div style={{ border: "1px solid #ccc", marginBottom: 20 }}>
            {results.map((user) => (
              <div
                key={user.id}
                onClick={() => handleSelectUser(user)}
                style={{
                  padding: 10,
                  borderBottom: "1px solid #eee",
                  cursor: "pointer",
                }}
              >
                <div>{user.name}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{user.phone}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Инфо о клиенте */}
      {selectedUser && (
        <div style={{ marginBottom: 20, padding: 15, background: "#f5f5f5" }}>
          <h3>{selectedUser.name}</h3>
          <p>Email: {selectedUser.email}</p>
          <p>Телефон: {selectedUser.phone}</p>
        </div>
      )}

      {/* Замеры */}
      {selectedUser && (
        <div>
          <Button onClick={handleCreate}>Создать замер</Button>
          <h3>Замеры клиента</h3>
          {measurements.map((measurement) => (
            <MeasurementCard
              key={measurement.id}
              measurement={measurement}
              onDelete={() => handleDelete(measurement.id)}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
