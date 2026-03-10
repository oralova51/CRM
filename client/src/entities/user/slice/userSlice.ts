import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { initialUserState, type UserType } from '../model';
import { refreshThunk, signInThunk, signOutThunk, signUpThunk, getMeThunk, searchUserThunk } from '../api/UserApi';


const userSlice = createSlice({
    name: 'user',
    initialState: initialUserState,
    reducers: {
        setUser: (state, action: PayloadAction<UserType>) => {
            state.user = action.payload;
        },
        clearUser: (state) =>{
            state.user = null;
        },
        clearSearch: (state) => {
            state.searchResults = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(refreshThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        builder.addCase(refreshThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isInitialized = true;
            state.user = action.payload;
        })
        builder.addCase(refreshThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || null;
            state.user = null;
            state.isInitialized = true;
        })

        builder.addCase(signUpThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        builder.addCase(signUpThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isInitialized = true;
            state.user = action.payload;
        })
        builder.addCase(signUpThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || null;
            state.user = null;
            state.isInitialized = true;
        })
        builder.addCase(signInThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        builder.addCase(signInThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isInitialized = true;
            state.user = action.payload;
        })
        builder.addCase(signInThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || null;
            state.user = null;
            state.isInitialized = true;
        })
        builder.addCase(signOutThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        builder.addCase(signOutThunk.fulfilled, (state) => {
            state.isLoading = false;
            state.isInitialized = true;
            state.user = null;
        })
        builder.addCase(signOutThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || null;
            state.user = null;
            state.isInitialized = true;
        })
        builder.addCase(getMeThunk.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        builder.addCase(getMeThunk.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isInitialized = true;
            state.user = action.payload;
        })
        builder.addCase(getMeThunk.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || null;
            state.user = null;
            state.isInitialized = true;
        })
        builder.addCase(searchUserThunk.pending, (state) => {
            state.searchLoading = true;
            state.searchError = null;
        })
        builder.addCase(searchUserThunk.fulfilled, (state, action) => {
            state.searchLoading = false;
            state.searchResults = action.payload;
        })
        builder.addCase(searchUserThunk.rejected, (state, action) => {
            state.searchLoading = false;
            state.searchError = action.payload || null;
        })
    }
})

export const {setUser, clearUser, clearSearch} = userSlice.actions;

export const userReducer = userSlice.reducer;