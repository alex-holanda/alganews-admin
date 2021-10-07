import { configureStore } from '@reduxjs/toolkit';
import LatestPostsReducer from './Post.reducer';
import UserReducer from './User.reducer';

export const store = configureStore({
  reducer: {
    user: UserReducer,
    post: LatestPostsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
