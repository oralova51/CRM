import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Button } from '@/shared/ui/Button/Button';
import PaymentModal from '../PaymentModal/PaymentModal';
import { UserWithoutPassword } from '@/entities/user/model';
import styles from './PaymentButton.module.css';

interface PaymentButtonProps {
  selectedUser: UserWithoutPassword | null;
}

export default function PaymentButton({ selectedUser }: PaymentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <Button onClick={handleOpen} className={styles.button}>
        <CreditCard size={18} />
        <span>Внести оплату</span>
      </Button>
      {isOpen && <PaymentModal onClose={handleClose} selectedUser={selectedUser} />}
    </>
  );
}