import { Button } from '@/shared/ui/Button/Button'
import FormInput from '@/shared/ui/FormInput/FormInput'
import React, { useState } from 'react'
import OrderApi from '../../api/OrderApi';
import './ModalForm.css';
import { PaymentMethod, OrderStatus } from '../../model';
import type { UserWithoutPassword } from '@/entities/user/model';


export default function ModalForm({ onClose, selectedUser }: { onClose: () => void, selectedUser: UserWithoutPassword | null }) {

    console.log(selectedUser);

    const [isOpen, setIsOpen] = useState(false);
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
    };

    const handleCreateOrder = async () => {
        if (!selectedUser?.id) return;

        // Валидация
        if (!formData.price || !formData.final_price) {
            // можно показать toast/alert
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
        <>
            <div className="modal-form">
                <button className="modal-form__close" onClick={onClose}>Закрыть</button>
                <FormInput
                    label="Цена"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    type="number"
                    required
                />
                <FormInput
                    label="Скидка"
                    name="discount_pct"
                    value={formData.discount_pct}
                    onChange={handleChange}
                    type="number"
                    required
                />
                <FormInput
                    label="Финальная цена"
                    name="final_price"
                    value={formData.final_price}
                    onChange={handleChange}
                    type="number"
                    required
                />
                <FormInput
                    label="Статус"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    type="text"
                    required
                />
                <FormInput
                    label="Метод оплаты"
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    type="text"
                    required
                />
                <Button
                    onClick={handleCreateOrder}
                >
                    Создать заказ
                </Button>
            </div>
        </>
    )
}
