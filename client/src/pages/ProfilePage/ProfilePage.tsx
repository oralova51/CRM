import { useAppDispatch, useAppSelector } from '@/shared/hooks/useReduxHooks';
import React from 'react'

export default function MeasurementPage() {
  const {user, isInitialized, isLoading, error,} = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  return (
    <div>
      PROFILE
    </div>
  )
}
