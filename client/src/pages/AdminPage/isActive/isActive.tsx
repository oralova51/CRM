import { Button } from '@/shared/ui/Button/Button'
import React from 'react'

export default function isActive() {
    const handleIsActive = () => {
        console.log('isActive');
    }
  return (
    <Button onClick={handleIsActive}> Отключить процедуру</Button>
  )
}
