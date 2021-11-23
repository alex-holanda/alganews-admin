import { Middleware } from 'redux';

import { configureStore, isRejected } from '@reduxjs/toolkit';

import { notification } from 'antd';

import MetricReducer from './Metric.reducer';
import PostReducer from './Post.reducer';
import UserReducer from './User.reducer';
import PaymentReducer from './Payment.slice';

const observeActions: Middleware = () => (next) => (action) => {
  if (isRejected(action)) {
    notification.error({
      message: action.error.message,
    });
  }

  next(action);
};

export const store = configureStore({
  reducer: {
    user: UserReducer,
    post: PostReducer,
    metric: MetricReducer,
    payment: PaymentReducer,
  },
  middleware: function (getDefaultMiddlewares) {
    return getDefaultMiddlewares().concat(observeActions);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
