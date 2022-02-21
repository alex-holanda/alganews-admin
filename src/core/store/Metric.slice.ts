import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ForbiddenError, Metric, MetricService } from 'alex-holanda-sdk';
import getThunkStatus from 'core/util/getThunkStatus';

interface MetricState {
  list: Metric.MonthlyRevenuesExpenses;
  fetching: boolean;
  forbidden: boolean;
}

const initialState: MetricState = {
  list: [],
  fetching: false,
  forbidden: false,
};

export const getMonthlyRevenuesExpenses = createAsyncThunk(
  'metric/monthlyRevenuesExpenses',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const metricMonthlyRevenuesExpenses =
        await MetricService.getMonthlyRevenuesExpenses();

      await dispatch(storeList(metricMonthlyRevenuesExpenses));
    } catch (error) {
      console.table(error);
      console.log(error instanceof ForbiddenError);
      await dispatch(setForbidden(error instanceof ForbiddenError));

      return rejectWithValue({ ...error });
    }
  }
);

const metricSlice = createSlice({
  initialState,
  name: 'metric',
  reducers: {
    storeList(state, action: PayloadAction<Metric.MonthlyRevenuesExpenses>) {
      state.list = action.payload;
    },
    setFetching(state, action: PayloadAction<boolean>) {
      state.fetching = action.payload;
    },
    setForbidden(state, action: PayloadAction<boolean>) {
      state.forbidden = action.payload;
    },
  },
  extraReducers(builder) {
    const { error, loading, success } = getThunkStatus([
      getMonthlyRevenuesExpenses,
    ]);

    builder
      .addMatcher(error, (state) => {
        state.fetching = false;
      })
      .addMatcher(loading, (state) => {
        state.fetching = true;
      })
      .addMatcher(success, (state) => {
        state.fetching = false;
      });
  },
});

export const { storeList, setFetching, setForbidden } = metricSlice.actions;
const metricReducer = metricSlice.reducer;

export default metricReducer;
