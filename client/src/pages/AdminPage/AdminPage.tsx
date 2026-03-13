import { useState } from "react";
import { useUserSearch } from "@/shared/hooks/useUserSearch";
import { UserWithoutPassword } from "@/entities/user/model";
import MeasurementApi from "@/entities/measurement/api/MeasurementApi";
import MeasurementCard from "@/entities/measurement/ui/MeasurementCard/MeasurementCard";
import EditFormMeasurement from "@/entities/measurement/ui/EditForm/EditFormMeasurement";
import {
  MeasurementType,
} from "@/entities/measurement/model";
import { Button } from "@/shared/ui/Button/Button";
import AddMeasurementForm from "@/entities/measurement/ui/AddForm/AddMeasurementForm";
import { useAppSelector } from "@/app/store/store";
import CreateOrder from "@/entities/order/ui/CreateOrder/CreateOrder";
import BookingByAdmin from "@/entities/booking/ui/BookingByAdmin/BookingByAdmin";
import IsActive from "@/entities/procedure/ui/isActive/isActive";
import { Search, User as UserIcon, ChevronDown, ChevronUp } from "lucide-react";
import styles from "./AdminPage.module.css";

export default function AdminPage() {
  const currentUser = useAppSelector((state) => state.user.user);
  const { query, setQuery, results } = useUserSearch();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<MeasurementType | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserWithoutPassword | null>(null);
  const [measurements, setMeasurements] = useState<MeasurementType[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  function toNumber(value: any): number {
    if (!value) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }

  const handlePhotoUpdate = (updatedMeasurement: MeasurementType) => {
    if (!updatedMeasurement || !updatedMeasurement.id) return;
    setMeasurements((prev) =>
      prev.map((m) => m.id === updatedMeasurement.id ? updatedMeasurement : m)
    );
  };

  const handleSelectUser = async (user: UserWithoutPassword) => {
    setSelectedUser(user);
    setQuery("");
    setShowSearchResults(false);
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

  async function handleFormSubmit(
    e: React.FormEvent<HTMLFormElement>,
    photoBefore?: File,
    photoAfter?: File,
  ) {
    e.preventDefault();
    if (!selectedUser || !currentUser) return;

    const formElements = e.currentTarget.elements as any;
    const formData = new FormData();
    formData.append("user_id", String(selectedUser.id));
    formData.append("created_by", String(currentUser.id));
    formData.append("measured_at", new Date().toISOString());
    formData.append("waist_cm", formElements.waist_cm.value || "0");
    formData.append("hips_cm", formElements.hips_cm.value || "0");
    formData.append("hip_1", formElements.hip_1.value || "0");
    formData.append("chest_cm", formElements.chest_cm.value || "0");
    formData.append("arms_cm", formElements.arms_cm.value || "0");
    formData.append("notes", formElements.notes.value || "");

    if (photoBefore) formData.append("photo_before", photoBefore);
    if (photoAfter) formData.append("photo_after", photoAfter);

    try {
      const response = await MeasurementApi.createMeasurementWithPhoto(formData);
      if (response?.data) {
        setMeasurements((prev) => [response.data, ...prev]);
        setShowCreateForm(false);
      }
    } catch (error) {
      console.log("❌ Ошибка при создании замера:", error);
    }
  }

  const handleEdit = (measurement: MeasurementType) => setEditingMeasurement(measurement);
  const handleCancelEdit = () => setEditingMeasurement(null);

  async function handleFormUpdate(e: React.FormEvent<HTMLFormElement>, id: number) {
    e.preventDefault();
    if (!selectedUser || !editingMeasurement) return;

    const formData = new FormData(e.currentTarget);
    const updatedMeasurement = {
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
      const response = await MeasurementApi.updateMeasurement(id, updatedMeasurement);
      if (response?.data) {
        setMeasurements((prev) => prev.map((m) => m.id === response.data?.id ? response.data : m));
        setEditingMeasurement(null);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDelete(id: number) {
    try {
      await MeasurementApi.deleteMeasurement(id);
      setMeasurements((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Админ-панель</h1>

        {/* Блок управления процедурами */}
        <div className={styles.section}>
          <IsActive />
        </div>

        {/* Поиск клиента */}
        <div className={styles.section}>
          <div className={styles.searchHeader}>
            <h2 className={styles.sectionTitle}>Поиск клиента</h2>
          </div>
          <div className={styles.searchContainer}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSearchResults(true);
              }}
              placeholder="Поиск по email, имени или телефону..."
              className={styles.searchInput}
            />
          </div>

          {/* Результаты поиска */}
          {results.length > 0 && showSearchResults && (
            <div className={styles.searchResults}>
              {results.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={styles.searchResultItem}
                >
                  <div className={styles.resultAvatar}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.resultInfo}>
                    <div className={styles.resultName}>{user.name}</div>
                    <div className={styles.resultPhone}>{user.phone}</div>
                    <div className={styles.resultEmail}>{user.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Информация о клиенте */}
        {selectedUser && (
          <div className={styles.section}>
            <div className={styles.userCard}>
              <div className={styles.userCardHeader}>
                <div className={styles.userCardAvatar}>
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
                <div className={styles.userCardInfo}>
                  <h3 className={styles.userCardName}>{selectedUser.name}</h3>
                  <p className={styles.userCardEmail}>{selectedUser.email}</p>
                  <p className={styles.userCardPhone}>{selectedUser.phone}</p>
                </div>
              </div>

              {/* Действия с клиентом */}
              <div className={styles.userActions}>
                <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                  {showCreateForm ? "Отмена" : "Новый замер"}
                </Button>
                <CreateOrder selectedUser={selectedUser} />
                <BookingByAdmin selectedUser={selectedUser} />
              </div>
            </div>
          </div>
        )}

        {/* Форма создания замера */}
        {showCreateForm && selectedUser && (
          <div className={styles.section}>
            <AddMeasurementForm submitHandler={handleFormSubmit} />
          </div>
        )}

        {/* Форма редактирования замера */}
        {editingMeasurement && selectedUser && (
          <div className={styles.section}>
            <EditFormMeasurement
              measurement={editingMeasurement}
              submitHandler={handleFormUpdate}
              onCancel={handleCancelEdit}
            />
          </div>
        )}

        {/* Замеры клиента */}
        {selectedUser && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              Замеры клиента ({measurements.length})
            </h2>
            {isLoading ? (
              <div className={styles.loading}>Загрузка замеров...</div>
            ) : measurements.length > 0 ? (
              <div className={styles.measurementsList}>
                {measurements.map((measurement) => (
                  <MeasurementCard
                    key={measurement.id}
                    measurement={measurement}
                    onDelete={() => handleDelete(measurement.id)}
                    onEdit={() => handleEdit(measurement)}
                    onPhotoUpdate={handlePhotoUpdate}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>У клиента пока нет замеров</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}