import {
  createReducer,
  createAsyncThunk,
  isFulfilled,
  isRejected,
  isPending,
} from '@reduxjs/toolkit';
import { User, UserService } from 'alex-holanda-sdk';

interface UserState {
  list: User.Summary[];
  fetching: boolean;
}

const initialState: UserState = {
  list: [],
  fetching: false,
};

export const getAllUsers = createAsyncThunk('user/getAllUsers', async () =>
  UserService.getAllUsers({})
);

export const toggleUserStatus = createAsyncThunk(
  'user/toggleUserStatus',
  async (user: User.Summary | User.Detailed) => {
    user.active
      ? await UserService.deactivateExistingUser(user.id)
      : await UserService.activateExistingUser(user.id);

    return user;
  }
);

export default createReducer(initialState, (builder) => {
  const success = isFulfilled(getAllUsers, toggleUserStatus);
  const error = isRejected(getAllUsers, toggleUserStatus);
  const loading = isPending(getAllUsers, toggleUserStatus);

  builder
    .addCase(getAllUsers.fulfilled, (state, action) => {
      state.list = action.payload;
    })
    .addCase(toggleUserStatus.fulfilled, (state, action) => {
      state.list = state.list.map((user) => {
        if (user.id === action.payload.id) {
          return { ...user, active: !user.active };
        }
        return user;
      });
    })
    .addMatcher(success, (state) => {
      state.fetching = false;
    })
    .addMatcher(error, (state) => {
      state.fetching = false;
    })
    .addMatcher(loading, (state) => {
      state.fetching = true;
    });
});
