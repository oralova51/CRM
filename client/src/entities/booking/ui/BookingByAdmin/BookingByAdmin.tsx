import { Button } from '@/shared/ui/Button/Button'
import React from 'react'
import { UserWithoutPassword } from '@/entities/user/model'
import { useNavigate } from 'react-router'
import { CLIENT_ROUTES } from '@/shared/consts/clientRoutes';

interface BookingByAdminProps {
    selectedUser: UserWithoutPassword | null;
}

export default function BookingByAdmin({ selectedUser }: BookingByAdminProps) {
    const navigate = useNavigate();

    const handleBooking = () => {
        navigate(CLIENT_ROUTES.BOOK, {
            state: { selectedUser }
        });
    }
  return (
    <Button onClick={handleBooking}>Записать клиента</Button>
  )
}
