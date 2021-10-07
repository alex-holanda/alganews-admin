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

export default createReducer(initialState, (builder) => {
  const success = isFulfilled(getAllUsers);
  const error = isRejected(getAllUsers);
  const loading = isPending(getAllUsers);

  builder
    .addCase(getAllUsers.fulfilled, (state, action) => {
      state.list = action.payload;
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
