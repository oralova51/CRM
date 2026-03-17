// client/src/entities/procedure/ui/isActive/isActive.tsx

import { Button } from '@/shared/ui/Button/Button';
import { Settings } from 'lucide-react';
import React, { useState } from 'react';
import ModalFormProcedure from '../ModalFormProcedure/ModalFormProcedure';

export default function IsActive() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        <Settings size={18} style={{ marginRight: '8px' }} />
        Управление процедурами
      </Button>
      {showModal && <ModalFormProcedure onClose={() => setShowModal(false)} />}
    </>
  );
}