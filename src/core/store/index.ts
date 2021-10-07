import { configureStore } from '@reduxjs/toolkit';
import MetricReducer from './Metric.reducer';
import PostReducer from './Post.reducer';
import UserReducer from './User.reducer';

export const store = configureStore({
  reducer: {
    user: UserReducer,
    post: PostReducer,
    metric: MetricReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
