import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { initialProcedureState, type Procedure } from "../model/types";
import {
  getAllProceduresThunk,
  getOneProcedureThunk,
  createProcedureThunk,
  updateProcedureThunk,
  deleteProcedureThunk,
} from "../api/procedureApi";

const procedureSlice = createSlice({
  name: "procedure",
  initialState: initialProcedureState,
  reducers: {
    setCurrentProcedure: (state, action: PayloadAction<Procedure | null>) => {
      state.currentProcedure = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllProcedures
      .addCase(getAllProceduresThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllProceduresThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.procedures = action.payload;
      })
      .addCase(getAllProceduresThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ошибка при загрузке процедур";
      })

      // getOneProcedure
      .addCase(getOneProcedureThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOneProcedureThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProcedure = action.payload;
      })
      .addCase(getOneProcedureThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ошибка при загрузке процедуры";
      })

      // createProcedure
      .addCase(createProcedureThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createProcedureThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.procedures.push(action.payload);
      })
      .addCase(createProcedureThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ошибка при создании процедуры";
      })

      // updateProcedure
      .addCase(updateProcedureThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProcedureThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.procedures.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.procedures[index] = action.payload;
        }
        state.currentProcedure = action.payload;
      })
      .addCase(updateProcedureThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ошибка при обновлении процедуры";
      })

      // deleteProcedure
      .addCase(deleteProcedureThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProcedureThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.procedures = state.procedures.filter(
          (p) => p.id !== action.payload,
        );
        if (state.currentProcedure?.id === action.payload) {
          state.currentProcedure = null;
        }
      })
      .addCase(deleteProcedureThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Ошибка при удалении процедуры";
      });
  },
});

export const { setCurrentProcedure, clearError } = procedureSlice.actions;
export const procedureReducer = procedureSlice.reducer;