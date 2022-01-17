import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CashFlow, CashFlowService } from 'alex-holanda-sdk';

import { Key } from 'antd/lib/table/interface';
import getThunkStatus from 'core/util/getThunkStatus';
import moment from 'moment';

import { RootState } from './';

interface RevenueState {
  list: CashFlow.EntrySummary[];
  fetching: boolean;
  query: CashFlow.Query;
  selected: Key[];
}

const initialState: RevenueState = {
  list: [],
  fetching: false,
  query: {
    type: 'REVENUE',
    sort: ['transactedOn', 'desc'],
    yearMonth: moment().format('YYYY-MM'),
  },
  selected: [],
};

export const getRevenues = createAsyncThunk(
  'cash-flow/revenues/getRevenues',
  async (_, { getState, dispatch }) => {
    const { query } = (getState() as RootState).revenue;
    const revenues = await CashFlowService.getAllEntries(query);

    await dispatch(storeList(revenues));
  }
);

export const removeEntriesInBatch = createAsyncThunk(
  'cash-flow/revenues/removeEntriesInBatch',
  async (ids: number[], { dispatch }) => {
    await CashFlowService.removeEntriesBatch(ids);
    await dispatch(getRevenues());
  }
);

const RevenueSlice = createSlice({
  initialState,
  name: 'cash-flow/Revenues',
  reducers: {
    storeList(state, action: PayloadAction<CashFlow.EntrySummary[]>) {
      state.list = action.payload;
    },
    setSelectExpanses(state, action: PayloadAction<Key[]>) {
      state.selected = action.payload;
    },
    setQuery(state, action: PayloadAction<Partial<CashFlow.Query>>) {
      state.query = {
        ...state.query,
        ...action.payload,
      };
    },
    setFetching(state, action: PayloadAction<boolean>) {
      state.fetching = action.payload;
    },
  },
  extraReducers(builder) {
    const { error, loading, success } = getThunkStatus([
      getRevenues,
      removeEntriesInBatch,
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

export const { storeList, setFetching, setQuery, setSelectExpanses } =
  RevenueSlice.actions;

const RevenueReducer = RevenueSlice.reducer;
export default RevenueReducer;
