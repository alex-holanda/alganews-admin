import {
  createReducer,
  createAsyncThunk,
  isFulfilled,
  isRejected,
  isPending,
} from '@reduxjs/toolkit';

import { Metric, MetricService } from 'alex-holanda-sdk';

interface MetricState {
  monthlyRevenuesExpenses: Metric.MonthlyRevenuesExpenses;
  fetching: boolean;
}

const initialState: MetricState = {
  monthlyRevenuesExpenses: [],
  fetching: false,
};

export const getMonthlyRevenuesExpenses = createAsyncThunk(
  'metric/monthlyRevenuesExpenses',
  async () => MetricService.getMonthlyRevenuesExpenses()
);

export default createReducer(initialState, (builder) => {
  const success = isFulfilled(getMonthlyRevenuesExpenses);
  const error = isRejected(getMonthlyRevenuesExpenses);
  const loading = isPending(getMonthlyRevenuesExpenses);

  builder
    .addCase(getMonthlyRevenuesExpenses.fulfilled, (state, action) => {
      state.monthlyRevenuesExpenses = action.payload;
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
