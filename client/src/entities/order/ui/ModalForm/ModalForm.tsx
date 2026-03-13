import { Button } from '@/shared/ui/Button/Button';
import { X, CreditCard, DollarSign, Percent, Tag, CheckCircle } from 'lucide-react';
import React, { useState } from 'react';
import OrderApi from '../../api/OrderApi';
import { PaymentMethod, OrderStatus } from '../../model';
import type { UserWithoutPassword } from '@/entities/user/model';
import styles from './ModalForm.module.css';

export default function ModalForm({ onClose, selectedUser }: { onClose: () => void, selectedUser: UserWithoutPassword | null }) {
    const [formData, setFormData] = useState({
        price: '',
        discount_pct: 0,
        final_price: '',
        status: 'pending' as OrderStatus,
        payment_method: 'card' as PaymentMethod,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'discount_pct' ? Number(value) || 0 : value,
        }));

        // Автоматический расчет финальной цены при изменении цены или скидки
        if (name === 'price' || name === 'discount_pct') {
            const price = parseFloat(name === 'price' ? value : formData.price) || 0;
            const discount = name === 'discount_pct' ? Number(value) || 0 : formData.discount_pct;
            const finalPrice = price - (price * discount / 100);
            setFormData(prev => ({
                ...prev,
                final_price: finalPrice.toFixed(2)
            }));
        }
    };

    const handleCreateOrder = async () => {
        if (!selectedUser?.id) return;

        if (!formData.price || !formData.final_price) {
            alert('Заполните обязательные поля');
            return;
        }

        const response = await OrderApi.createOrder({
            user_id: selectedUser.id,
            price: formData.price,
            status: formData.status,
            payment_method: formData.payment_method,
            discount_pct: formData.discount_pct,
            final_price: formData.final_price,
        });

        if (response.statusCode === 201) {
            onClose();
        } else {
            console.error('Ошибка создания заказа:', response.message ?? response.error);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Создать заказ</h2>
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

                <div className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>
                            <DollarSign size={16} />
                            <span>Цена</span>
                        </label>
                        <input
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            type="number"
                            required
                            placeholder="0"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>
                            <Percent size={16} />
                            <span>Скидка %</span>
                        </label>
                        <input
                            name="discount_pct"
                            value={formData.discount_pct}
                            onChange={handleChange}
                            type="number"
                            placeholder="0"
                            className={styles.input}
                            min="0"
                            max="100"
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>
                            <Tag size={16} />
                            <span>Финальная цена</span>
                        </label>
                        <input
                            name="final_price"
                            value={formData.final_price}
                            onChange={handleChange}
                            type="number"
                            required
                            placeholder="0"
                            className={styles.input}
                            readOnly
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>
                            <CheckCircle size={16} />
                            <span>Способ оплаты</span>
                        </label>
                        <div className={styles.paymentMethods}>
                            <button
                                type="button"
                                className={`${styles.methodButton} ${formData.payment_method === 'card' ? styles.active : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, payment_method: 'card' }))}
                            >
                                Карта
                            </button>
                            <button
                                type="button"
                                className={`${styles.methodButton} ${formData.payment_method === 'cash' ? styles.active : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, payment_method: 'cash' }))}
                            >
                                Наличные
                            </button>
                            <button
                                type="button"
                                className={`${styles.methodButton} ${formData.payment_method === 'online' ? styles.active : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, payment_method: 'online' }))}
                            >
                                Онлайн
                            </button>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>
                            <CheckCircle size={16} />
                            <span>Статус</span>
                        </label>
                        <div className={styles.statusButtons}>
                            <button
                                type="button"
                                className={`${styles.statusButton} ${formData.status === 'pending' ? styles.active : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, status: 'pending' }))}
                            >
                                В ожидании
                            </button>
                            <button
                                type="button"
                                className={`${styles.statusButton} ${formData.status === 'completed' ? styles.active : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, status: 'completed' }))}
                            >
                                Завершен
                            </button>
                            <button
                                type="button"
                                className={`${styles.statusButton} ${formData.status === 'cancelled' ? styles.active : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, status: 'cancelled' }))}
                            >
                                Отменен
                            </button>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Отмена
                        </Button>
                        <Button onClick={handleCreateOrder}>
                            Создать заказ
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}