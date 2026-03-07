import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialMeasurementState, MeasurementType } from "../model";
import { P } from "node_modules/react-router/dist/development/router-5iOvts3c.mjs";
import { createMeasurementThunk, deleteMeasurementThunk, getMeasurementByIdThunk, getMeasurementThunk, updateMeasurementThunk } from "../api/MeasurementApi";

const measurementSlice = createSlice({
    name: 'measurement',
    initialState: initialMeasurementState,
    reducers: {
        setMeasurements: (state, action: PayloadAction<MeasurementType[]>  ) => {
            state.measurements = action.payload
        },
        setCurrentMeasurement: (state, action: PayloadAction<MeasurementType | null>) => {
            state.currentMeasurement = action.payload
        },
        clearMeasurement: (state) => {
            state.measurements = [];
            state.currentMeasurement = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getMeasurementThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        builder.addCase(getMeasurementThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.measurements = action.payload;
        })
        builder.addCase(getMeasurementThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || null;
        })

        builder.addCase(getMeasurementByIdThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        builder.addCase(getMeasurementByIdThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentMeasurement = action.payload;
        })
        builder.addCase(getMeasurementByIdThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || null;
        })

        builder.addCase(createMeasurementThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        builder.addCase(createMeasurementThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentMeasurement = action.payload;
        })
        builder.addCase(createMeasurementThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || null;   
        })
        builder.addCase(updateMeasurementThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        builder.addCase(updateMeasurementThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentMeasurement = action.payload;
        })
        builder.addCase(updateMeasurementThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || null;
        })
        builder.addCase(deleteMeasurementThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        builder.addCase(deleteMeasurementThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentMeasurement = null;
        })
        builder.addCase(deleteMeasurementThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || null;
        })
    }
})

export const {setMeasurements, setCurrentMeasurement, clearMeasurement} = measurementSlice.actions;
export const measurementReducer = measurementSlice.reducer;