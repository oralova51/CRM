import { axiosInstance, setAccessToken } from '@/shared/lib/axiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { UserSignInData, UserSignUpData, UserType, UserWithTokenType } from '../model';
import type { ServerResponseType } from '@/shared/types';
import { AxiosError } from 'axios';


const USER_THUNK_NAMES = {
  SIGN_UP: 'user/signUp',
  SIGN_IN: 'user/signIn',
  REFRESH: 'user/refresh',
  SIGN_OUT: 'user/signOut',
  ME: 'user/getMe'
} as const;

const USER_API_URL = {
  SIGN_UP: '/auth/signup',
  SIGN_IN: '/auth/signin',
  REFRESH: '/auth/refresh',
  SIGN_OUT: '/auth/signout',
  ME: '/auth/me'
} as const;


export const refreshThunk = createAsyncThunk<UserType, void, { rejectValue: string }>(USER_THUNK_NAMES.REFRESH, async (_, { rejectWithValue }) => {

  try {
    const { data } = await axiosInstance.get<ServerResponseType<UserWithTokenType>>(USER_API_URL.REFRESH)

    if (data.statusCode === 200 && data.data?.user) {
      setAccessToken(data.data?.accessToken || '');
      return data.data.user
    }
    return rejectWithValue('Ошибка при обновлении токенов');
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при обновлении токенов');
    }
    return rejectWithValue('Ошибка при обновлении токенов');
  }
});

export const getMeThunk = createAsyncThunk<UserType, void, { rejectValue: string }>(
  USER_THUNK_NAMES.ME, 
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<ServerResponseType<UserType>>(USER_API_URL.ME)

      if (data.statusCode === 200 && data.data) {
        // Не вызываем setAccessToken - токен не меняется!
        return data.data; // data.data - это сам пользователь
      }
      return rejectWithValue('Ошибка при получении данных пользователя');
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || 'Ошибка при получении данных пользователя');
      }
      return rejectWithValue('Ошибка при получении данных пользователя');
    }
  }
);

export const signUpThunk = createAsyncThunk<UserType, UserSignUpData, { rejectValue: string }>(USER_THUNK_NAMES.SIGN_UP, async (userData, { rejectWithValue }) => {

  try {
    const { data } = await axiosInstance.post<ServerResponseType<UserWithTokenType>>(USER_API_URL.SIGN_UP, userData)

    if (data.statusCode === 201 && data.data?.user) {
      setAccessToken(data.data?.accessToken || '');
      return data.data.user
    }
    return rejectWithValue('Ошибка при регистрации');
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при регистрации');
    }
    return rejectWithValue('Ошибка при регистрации');
  }
});

export const signInThunk = createAsyncThunk<UserType, UserSignInData, { rejectValue: string }>(USER_THUNK_NAMES.SIGN_IN, async (userData, { rejectWithValue }) => {

  try {
    const { data } = await axiosInstance.post<ServerResponseType<UserWithTokenType>>(USER_API_URL.SIGN_IN, userData)

    if (data.statusCode === 200 && data.data?.user) {
      setAccessToken(data.data?.accessToken || '');
      return data.data.user
    }
    return rejectWithValue('Ошибка при входе в приложение');
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при входе в приложение');
    }
    return rejectWithValue('Ошибка при входе в приложение');
  }
})


export const signOutThunk = createAsyncThunk<void, void, { rejectValue: string }>(USER_THUNK_NAMES.SIGN_OUT, async (_, { rejectWithValue }) => {

  try {
    const { data } = await axiosInstance.get<ServerResponseType<null>>(USER_API_URL.SIGN_OUT)

    if (data.statusCode === 200 ) {
      setAccessToken('');
      return undefined;
    }
    return rejectWithValue('Ошибка при входе в приложение');
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при входе в приложение');
    }
    return rejectWithValue('Ошибка при входе в приложение');
  }
})

// export default class UserApi {
//   static async signUp(userData: SignUpRequest): Promise<AuthResponse> {
//     try {
//       const response = await axiosInstance.post<ApiResponse<AuthPayload>>(
//         "/auth/signup",
//         userData,
//       );
//       return response.data;
//     } catch (error) {
//       console.log(error);
//       return {
//         statusCode: 500,
//         message: "Ошибка при регистрации",
//         data: {} as AuthPayload,
//         error: "Ошибка при регистрации",
//       };
//     }
//   }

//   static async signIn(userData: SignInRequest): Promise<AuthResponse> {
//     try {
//       const response = await axiosInstance.post<ApiResponse<AuthPayload>>(
//         "/auth/signin",
//         userData,
//       );
//       return response.data;
//     } catch (error) {
//       console.log(error);
//       return {
//         statusCode: 500,
//         message: "Ошибка при входе",
//         data: {} as AuthPayload,
//         error: "Ошибка при входе",
//       };
//     }
//   }

//   static async refresh(): Promise<AuthResponse> {
//     try {
//       const response =
//         await axiosInstance.get<ApiResponse<AuthPayload>>("/auth/refresh");
//       return response.data;
//     } catch (error) {
//       console.log(error);
//       return {
//         statusCode: 500,
//         message: "Ошибка при продлении сессии",
//         data: {} as AuthPayload,
//         error: "Ошибка при продлении сессии",
//       };
//     }
//   }

//   static async signOut(): Promise<SignOutResponse> {
//     try {
//       const response =
//         await axiosInstance.get<SignOutResponse>("/auth/signout");
//       return response.data;
//     } catch (error) {
//       console.log(error);
//       return {
//         statusCode: 500,
//         message: "Ошибка при выходе",
//         data: null,
//         error: "Ошибка при выходе",
//       };
//     }
//   }
// }
