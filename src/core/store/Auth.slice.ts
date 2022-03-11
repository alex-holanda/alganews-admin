import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UserService } from 'alex-holanda-sdk';

import AuthService from 'auth/Authorization.service';

interface AuthState {
  user: User.Detailed | null;
  fetching: boolean;
}

const initialState: AuthState = {
  user: null,
  fetching: false,
};

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (userId: number, { dispatch, rejectWithValue }) => {
    try {
      const user = await UserService.getDetailedUser(userId);

      if (user.role === 'EDITOR') {
        window.alert('Você não é autorizado a utilizar esse sistema');
        AuthService.imperativelySendToLogout();

        return;
      }

      await dispatch(storeUser(user));
    } catch (error) {
      return rejectWithValue({ ...error });
    }
  }
);

const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    storeUser(state, action: PayloadAction<User.Detailed>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { storeUser, clearUser } = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;
