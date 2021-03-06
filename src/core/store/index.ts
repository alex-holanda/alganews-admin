import { Middleware } from 'redux';

import { configureStore, isRejected, combineReducers } from '@reduxjs/toolkit';

import { notification } from 'antd';

import postReducer from './Post.reducer';
import userReducer from './User.reducer';

import authReducer from './Auth.slice';
import paymentReducer from './Payment.slice';
import expenseReducer from './Expense.slice';
import revenueReducer from './Revenue.slice';
import metricReducer from './Metric.slice';
import entriesCategoryReducer from './EntriesCategory.slice';
import uiReducer from './UI.slice';

const observeActions: Middleware = () => (next) => (action) => {
  if (isRejected(action)) {
    const ignoredActions = [
      'cash-flow/categories/createCategory/rejected',
      'cash-flow/categories/deleteCategory/rejected',
      'cash-flow/expenses/createExpense/rejected',
      'cash-flow/revenues/createRevenue/rejected',
      'cash-flow/categories/getCategories/rejected',
      'metric/monthlyRevenuesExpenses/rejected',
      'user/getAllUsers/rejected',
      'payment/getAllPayments/rejected',
      'cash-flow/revenues/getRevenues/rejected',
      'cash-flow/expenses/getExpenses/rejected',
      'auth/fetchUser/rejected',
    ];

    const shouldNotify = !ignoredActions.includes(action.type);

    if (shouldNotify) {
      notification.error({
        message: action.error.message,
      });
    }
  }

  next(action);
};

const cashFlowReducer = combineReducers({
  expense: expenseReducer,
  revenue: revenueReducer,
  category: entriesCategoryReducer,
});

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    post: postReducer,
    metric: metricReducer,
    payment: paymentReducer,
    cashFlow: cashFlowReducer,
    ui: uiReducer,
  },
  middleware: function (getDefaultMiddlewares) {
    return getDefaultMiddlewares().concat(observeActions);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
