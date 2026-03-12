import { useState } from "react";
import { useUserSearch } from "@/shared/hooks/useUserSearch";
import { UserWithoutPassword } from "@/entities/user/model";
import MeasurementApi from "@/entities/measurement/api/MeasurementApi";
import MeasurementCard from "@/entities/measurement/ui/MeasurementCard/MeasurementCard";
import EditFormMeasurement from "@/entities/measurement/ui/EditForm/EditFormMeasurement";
import {
  MeasurementInputData,
  MeasurementType,
  CreateMeasurementType,
} from "@/entities/measurement/model";
import { Button } from "@/shared/ui/Button/Button";
import AddMeasurementForm from "@/entities/measurement/ui/AddForm/AddMeasurementForm";
import { useAppSelector } from "@/app/store/store";
import CreateOrder from "@/entities/order/ui/CreateOrder/CreateOrder";
import BookingByAdmin from "@/entities/booking/ui/BookingByAdmin/BookingByAdmin";


export default function AdminPage() {
  const currentUser = useAppSelector((state) => state.user.user);
  // Поиск
  const { query, setQuery, results } = useUserSearch();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMeasurement, setEditingMeasurement] =
    useState<MeasurementType | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserWithoutPassword | null>(
    null,
  );
  const [measurements, setMeasurements] = useState<MeasurementType[]>([]);

  function toNumber(value: any): number {
    if (!value) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }

  const handleSelectUser = async (user: UserWithoutPassword) => {
    setSelectedUser(user);
    setQuery("");
    setIsLoading(true);
    setShowCreateForm(false);
    setEditingMeasurement(null);
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
    } finally {
      setIsLoading(false);
    }
  };

  // Создание замера

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedUser) return;
    const formData = new FormData(e.currentTarget);
    const newMeasurement: CreateMeasurementType = {
      user_id: selectedUser.id,
      measured_at: new Date(),
      waist_cm: toNumber(formData.get("waist_cm")),
      hips_cm: toNumber(formData.get("hips_cm")),
      hip_1: toNumber(formData.get("hip_1")),
      chest_cm: toNumber(formData.get("chest_cm")),
      arms_cm: toNumber(formData.get("arms_cm")),
      photo_before: "",
      photo_after: "",
      notes: (formData.get("notes") as string) || "",
      created_by: currentUser?.id || 1,
    };
    try {
      const responce = await MeasurementApi.createMeasurement(newMeasurement);
      if (responce?.data) {
        const newMeasurementData: MeasurementType = responce.data;
        setMeasurements((prev) => [newMeasurementData, ...prev]);
        setShowCreateForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Обновление замера

  const handleEdit = (measurement: MeasurementType) => {
    setEditingMeasurement(measurement);
  };

  const handleCancelEdit = () => {
    setEditingMeasurement(null);
  };
  async function handleFormUpdate(
    e: React.FormEvent<HTMLFormElement>,
    id: number,
  ) {
    e.preventDefault();

    if (!selectedUser || !editingMeasurement) return;

    const formData = new FormData(e.currentTarget);

    const updatedMeasurement: CreateMeasurementType = {
      user_id: selectedUser.id,
      measured_at: editingMeasurement.measured_at,
      waist_cm: toNumber(formData.get("waist_cm")),
      hips_cm: toNumber(formData.get("hips_cm")),
      hip_1: toNumber(formData.get("hip_1")),
      chest_cm: toNumber(formData.get("chest_cm")),
      arms_cm: toNumber(formData.get("arms_cm")),
      photo_before: editingMeasurement.photo_before,
      photo_after: editingMeasurement.photo_after,
      notes: (formData.get("notes") as string) || editingMeasurement.notes,
      created_by: editingMeasurement.created_by || currentUser?.id || 1,
    };
    try {
      const responce = await MeasurementApi.updateMeasurement(
        id,
        updatedMeasurement,
      );
      if (responce?.data) {
        const updatedData: MeasurementType = responce.data;
        setMeasurements((prev) =>
          prev.map((m) => (m.id === updatedData.id ? updatedData : m)),
        );
        setEditingMeasurement(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Удаление замера
  async function handleDelete(id: number) {
    try {
      await MeasurementApi.deleteMeasurement(id);
      setMeasurements((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

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

      {/* Замеры [showCreateForm, setShowCreateForm]*/}
      {selectedUser && (
        <div>
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? "Отмена" : "Новый замер"}
          </Button>
          {/* Форма создания замера */}
          {showCreateForm && (
            <div style={{ marginBottom: "20px" }}>
              <AddMeasurementForm submitHandler={handleFormSubmit} />
            </div>
          )}
          <CreateOrder selectedUser={selectedUser}/>
          <BookingByAdmin selectedUser={selectedUser}/>

          {/* Форма редактирования замера */}
          {editingMeasurement && (
            <div style={{ marginBottom: "20px", marginTop: "20px" }}>
              <EditFormMeasurement
                measurement={editingMeasurement}
                submitHandler={handleFormUpdate}
                onCancel={handleCancelEdit}
              />
            </div>
          )}
          <h3>Замеры клиента</h3>
          {measurements.map((measurement) => (
            <MeasurementCard
              key={measurement.id}
              measurement={measurement}
              onDelete={() => handleDelete(measurement.id)}
              onEdit={() => handleEdit(measurement)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
