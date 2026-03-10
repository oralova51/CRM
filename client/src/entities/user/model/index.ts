export type UserType = {
  id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  totalSpent: number;
  role: 'isAdmin' | 'isClient';
  createdAt: string;
  updatedAt: string;
}

export type UserWithTokenType = {
  user: UserType;
  accessToken: string;
};

export type UserSignUpData = {
  name: string;
  email: string;
  password: string;
  phone: string;

}

export type UserSignInData = {
  email: string;
  password: string;
}

export type UserState = {
  user: UserType | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  searchResults: UserWithoutPassword[];
  searchLoading: boolean;
  searchError: string | null
}

export const initialUserState: UserState = {
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  searchResults: [],
  searchLoading: false,
  searchError: null
}

export type UserWithoutPassword = Omit<UserType, 'password'>;