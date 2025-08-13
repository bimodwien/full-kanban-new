import { TUser } from '@/models/user.model';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { deleteCookie } from 'cookies-next';

const initialUser: TUser = {
  id: '',
  username: '',
  email: '',
  password: '',
  fullName: '',
};

export const userSlice = createSlice({
  name: 'auth',
  initialState: initialUser as TUser,
  reducers: {
    login: (state, action: PayloadAction<TUser>) => {
      return {
        ...state,
        id: action.payload.id || 'NO_ID',
        username: action.payload.username || 'NO_USERNAME',
        email: action.payload.email || 'NO_EMAIL',
        password: action.payload.password || 'NO_PASSWORD',
        fullName: action.payload.fullName || 'NO_FULLNAME',
      };
    },

    logout: (state) => {
      deleteCookie('access_token');
      deleteCookie('refresh_token');
      state.id = '';
      state.username = '';
      state.email = '';
      state.password = '';
      state.fullName = '';
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
