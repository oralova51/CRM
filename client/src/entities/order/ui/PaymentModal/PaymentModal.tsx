// client/src/entities/order/ui/PaymentModal/PaymentModal.tsx

import React, { useState, useEffect } from 'react';
import { X, CreditCard, Calendar, Hash, Percent, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/shared/ui/Button/Button';
import { UserWithoutPassword } from '@/entities/user/model';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import { useToast } from '@/shared/lib/toast/ToastContext';
import styles from './PaymentModal.module.css';

type PaymentModalProps = {
  onClose: () => void;
  selectedUser: UserWithoutPassword | null;
};

type LoyaltyData = {
  discount: number;
  level: string;
  min_spent: number;
  nextLevel?: {
    name: string;
    discount: number;
    min_spent: number;
    needed: number;
  } | null;
  totalSpent: number;
};

export default function PaymentModal({ onClose, selectedUser }: PaymentModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'online'>('cash');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Данные о скидке
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
  const [isLoadingDiscount, setIsLoadingDiscount] = useState(false);
  
  const toast = useToast();

  // Получаем информацию о скидке клиента
  useEffect(() => {
    const fetchDiscount = async () => {
      if (!selectedUser) return;
      
      setIsLoadingDiscount(true);
      try {
        // Используем новый эндпоинт для получения скидки выбранного пользователя
        const response = await axiosInstance.get(`/loyalty/user/${selectedUser.id}`);
        
        if (response.data?.data) {
          setLoyaltyData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching discount:', error);
        toast.error('Не удалось получить информацию о скидке');
        
        // Заглушка для демо, пока бэкенд не готов
        setLoyaltyData({
          discount: 12,
          level: 'Платиновый',
          min_spent: 100000,
          nextLevel: {
            name: 'Бриллиантовый',
            discount: 15,
            min_spent: 150000,
            needed: 22000
          },
          totalSpent: 128000
        });
      } finally {
        setIsLoadingDiscount(false);
      }
    };

    fetchDiscount();
  }, [selectedUser, toast]);

  const numericAmount = Number(amount) || 0;
  const discountAmount = loyaltyData ? numericAmount * (loyaltyData.discount / 100) : 0;
  const finalAmount = numericAmount - discountAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      toast.error('Клиент не выбран');
      return;
    }

    if (numericAmount <= 0) {
      toast.error('Введите корректную сумму');
      return;
    }

    setIsProcessing(true);
    
    try {
      // TODO: API вызов для сохранения платежа
      // const response = await axiosInstance.post('/payments', {
      //   userId: selectedUser.id,
      //   amount: numericAmount,
      //   finalAmount,
      //   discount: loyaltyData?.discount || 0,
      //   description,
      //   paymentMethod
      // });

      // Имитация запроса
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Оплата ${numericAmount.toLocaleString()} ₽ успешно проведена`);
      onClose();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Ошибка при проведении оплаты');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Внести оплату</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {selectedUser?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className={styles.userName}>{selectedUser?.name}</div>
            <div className={styles.userEmail}>{selectedUser?.email}</div>
          </div>
        </div>

        {/* Блок программы лояльности */}
        {!isLoadingDiscount && loyaltyData && (
          <div className={styles.loyaltySection}>
            <div className={styles.loyaltyHeader}>
              <Award size={18} />
              <span>Программа лояльности</span>
            </div>
            
            <div className={styles.loyaltyInfo}>
              <div className={styles.loyaltyRow}>
                <span className={styles.loyaltyLabel}>Уровень:</span>
                <span className={styles.loyaltyValue}>{loyaltyData.level}</span>
              </div>
              <div className={styles.loyaltyRow}>
                <span className={styles.loyaltyLabel}>Скидка:</span>
                <span className={styles.loyaltyDiscount}>{loyaltyData.discount}%</span>
              </div>
              <div className={styles.loyaltyRow}>
                <span className={styles.loyaltyLabel}>Всего потрачено:</span>
                <span className={styles.loyaltyValue}>{loyaltyData.totalSpent.toLocaleString()} ₽</span>
              </div>
            </div>

            {/* Прогресс до следующего уровня */}
            {loyaltyData.nextLevel && (
              <div className={styles.nextLevel}>
                <div className={styles.nextLevelHeader}>
                  <TrendingUp size={14} />
                  <span>До уровня {loyaltyData.nextLevel.name}</span>
                </div>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill}
                    style={{ 
                      width: `${Math.min(100, (loyaltyData.totalSpent / loyaltyData.nextLevel.min_spent) * 100)}%` 
                    }}
                  />
                </div>
                <div className={styles.nextLevelInfo}>
                  <span>Осталось {loyaltyData.nextLevel.needed.toLocaleString()} ₽</span>
                  <span>Скидка {loyaltyData.nextLevel.discount}%</span>
                </div>
              </div>
            )}
          </div>
        )}

        {isLoadingDiscount && (
          <div className={styles.loadingDiscount}>
            <div className={styles.spinner} />
            <span>Загрузка информации о скидке...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>
              <CreditCard size={16} />
              <span>Сумма</span>
            </label>
            <div className={styles.amountInputWrapper}>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                required
                className={styles.amountInput}
                min="0"
                step="100"
              />
              <span className={styles.currency}>₽</span>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              <Hash size={16} />
              <span>Описание</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Например: Абонемент LPG 5 сеансов"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              <Calendar size={16} />
              <span>Способ оплаты</span>
            </label>
            <div className={styles.paymentMethods}>
              <button
                type="button"
                className={`${styles.methodButton} ${paymentMethod === 'cash' ? styles.active : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                Наличные
              </button>
              <button
                type="button"
                className={`${styles.methodButton} ${paymentMethod === 'card' ? styles.active : ''}`}
                onClick={() => setPaymentMethod('card')}
              >
                Карта
              </button>
              <button
                type="button"
                className={`${styles.methodButton} ${paymentMethod === 'online' ? styles.active : ''}`}
                onClick={() => setPaymentMethod('online')}
              >
                Онлайн
              </button>
            </div>
          </div>

          {amount && (
            <div className={styles.preview}>
              {loyaltyData && loyaltyData.discount > 0 && (
                <>
                  <div className={styles.previewRow}>
                    <span>Сумма без скидки:</span>
                    <span className={styles.previewOriginal}>
                      {numericAmount.toLocaleString()} ₽
                    </span>
                  </div>
                  <div className={styles.previewRow}>
                    <span>Скидка {loyaltyData.discount}%:</span>
                    <span className={styles.previewDiscount}>
                      −{discountAmount.toLocaleString()} ₽
                    </span>
                  </div>
                </>
              )}
              <div className={`${styles.previewRow} ${styles.totalRow}`}>
                <span className={styles.previewLabel}>Итого к оплате:</span>
                <span className={styles.previewAmount}>
                  {(loyaltyData ? finalAmount : numericAmount).toLocaleString()} ₽
                </span>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <Button type="button" variant="ghost" onClick={onClose}>
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={!amount || isProcessing}
              className={styles.submitButton}
            >
              {isProcessing ? 'Обработка...' : 'Подтвердить оплату'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}