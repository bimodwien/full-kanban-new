import { Dispatch } from '@reduxjs/toolkit';
import { axiosInstance } from '@/lib/axios';
import { login } from '../slices/user.slice';
import { TUser } from '@/models/user.model';
import { deleteCookie, getCookie } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';

export const userLogin = ({ username, password }: TUser) => {
  return async (dispatch: Dispatch) => {
    try {
      const response = await axiosInstance().post(
        '/users/login',
        { username, password },
        { withCredentials: true },
      );
      const access_token = getCookie('access_token') || '';
      if (typeof access_token === 'string') {
        const decoded = jwtDecode<{ user: TUser }>(access_token);
        if (!decoded.user) {
          throw new Error('Invalid token data');
        }
        const userData = decoded.user;
        dispatch(login(userData));
        return { success: true, user: userData };
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Login failed: ', error);
      deleteCookie('access_token');
      deleteCookie('refresh_token');

      // Re-throw error so frontend can catch it
      throw error;
    }
  };
};

export const keepLogin = () => async (dispatch: Dispatch) => {
  try {
    const token = getCookie('access_token');

    // Check if token exists and is valid string
    if (typeof token === 'string' && token.trim() !== '') {
      // Additional validation: JWT should have 3 parts separated by dots
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const decode = jwtDecode<{ user: TUser }>(token);

      // Validate decoded token has user data
      if (decode && decode.user) {
        dispatch(login(decode.user));
      } else {
        throw new Error('Invalid token payload');
      }
    }
  } catch (error) {
    console.error('Keep login failed: ', error);
    // Clear invalid tokens
    deleteCookie('access_token');
    deleteCookie('refresh_token');
  }
};
