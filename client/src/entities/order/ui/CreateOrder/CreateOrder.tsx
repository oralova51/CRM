import React, { useState } from 'react'
import OrderApi from '../../api/OrderApi';
import { useAppSelector } from '@/app/store/store';
import ModalForm from '../ModalForm/ModalForm';
import { UserWithoutPassword } from '@/entities/user/model';
import { Button } from "@/shared/ui/Button/Button";


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
     <Button onClick={handleOpenModal} >Сделать заказ</Button>
     {isOpen && <ModalForm onClose={handleCloseModal}  selectedUser={selectedUser} />}
    </>
  )
}