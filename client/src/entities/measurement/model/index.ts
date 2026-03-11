import type { ServerResponseType } from "@/shared/types";
export type MeasurementType = {
  id: number;
  user_id: number;
  measured_at: Date;
  waist_cm: number;
  hips_cm: number;
  hip_1: number;
  chest_cm: number;
  arms_cm: number;
  photo_before: string;
  photo_after: string;
  notes: string;
  created_by: number;
  created_at: string;
  updated_at: string;
};

export type MeasurementInputData = {
  id: number;
  measured_at?: Date;
  waist_cm?: number;
  hips_cm?: number;
  hip_1?: number;
  chest_cm?: number;
  arms_cm?: number;
  photo_before?: string;
  photo_after?: string;
  notes?: string;
};

export type MeasurementState = {
  measurements: MeasurementType[];
  currentMeasurement: MeasurementType | null;
  isLoading: boolean;
  error: string | null;
};

export const initialMeasurementState: MeasurementState = {
  measurements: [],
  currentMeasurement: null,
  isLoading: false,
  error: null,
};

export type MeasurementsListResponse = ServerResponseType<MeasurementType[]>;

export type MeasurementResponse = ServerResponseType<MeasurementType>;

export type CreateMeasurementType = {
  user_id: number;
  measured_at?: Date;
  waist_cm?: number;
  hips_cm?: number;
  hip_1?: number;
  chest_cm?: number;
  arms_cm?: number;
  photo_before?: string;
  photo_after?: string;
  notes?: string;
};