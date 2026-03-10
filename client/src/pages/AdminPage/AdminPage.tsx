import { useState } from "react";
import { useUserSearch } from "@/shared/hooks/useUserSearch";
import { UserWithoutPassword } from "@/entities/user/model";
import MeasurementApi from "@/entities/measurement/api/MeasurementApi";
import MeasurementCard from "@/entities/measurement/ui/MeasurementCard";
import { MeasurementType } from "@/entities/measurement/model";

export default function AdminPage() {
  // Поиск
  const { query, setQuery, results } = useUserSearch();
  const [selectedUser, setSelectedUser] = useState<UserWithoutPassword | null>(
    null,
  );
  const [measurements, setMeasurements] = useState<MeasurementType[]>([]);

  const handleSelectUser = async (user: UserWithoutPassword) => {
    setSelectedUser(user);
    setQuery('');
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

  // Обновление замера
  const handleUpdate = async (measurement: MeasurementType) => {
    await MeasurementApi.updateMeasurement(measurement.id, measurement);
  };

  // Удаление замера
  const handleDelete = async (id: number) => {
    await MeasurementApi.deleteMeasurement(id);
    setMeasurements(measurements.filter((m) => m.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Админка</h1>

      {/* Поиск */}
      <div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск клиента..."
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
          <h3>Замеры клиента</h3>
          {measurements.map((measurement) => (
            <MeasurementCard
              key={measurement.id}
              measurement={measurement}
              onDelete={() => handleDelete(m.id)}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
