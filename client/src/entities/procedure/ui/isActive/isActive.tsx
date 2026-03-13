import { Button } from '@/shared/ui/Button/Button'
import React, { useState } from 'react'
import ModalFormProcedure from '../ModalFormProcedure/ModalFormProcedure'

export default function isActive() {
  const [showModal, setShowModal] = useState(false);

  const handleIsActive = () => {
    setShowModal(true);
  }
  return (
    <>
      <Button onClick={handleIsActive}> Отключить процедуру</Button>
      {showModal && <ModalFormProcedure onClose={() => setShowModal(false)} />}
      </>
  )
}
