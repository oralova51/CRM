import React, { useState } from 'react'
import OrderApi from '../../api/OrderApi';
import { useAppSelector } from '@/app/store/store';
import ModalForm from '../ModalForm/ModalForm';
import { UserWithoutPassword } from '@/entities/user/model';


interface CreateOrderProps {
    selectedUser: UserWithoutPassword | null;
  }

export default function CreateOrder({ selectedUser }: CreateOrderProps) {
    
    const [isOpen, setIsOpen] = useState(false);


    const handleOpenModal = () => {
        setIsOpen(true);
    }

    const handleCloseModal = () => {
        setIsOpen(false);
    }
  return (
    <>
     <button onClick={handleOpenModal}>Сделать заказ</button>
     {isOpen && <ModalForm onClose={handleCloseModal}  selectedUser={selectedUser} />}
    </>
  )
}
