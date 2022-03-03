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

const params = new URLSearchParams(window.location.search);
const yearMonth = params.get('yearMonth');

const initialState: RevenueState = {
  list: [],
  fetching: false,
  query: {
    type: 'REVENUE',
    sort: ['transactedOn', 'desc'],
    yearMonth: yearMonth || moment().format('YYYY-MM'),
  },
  selected: [],
};

export const getRevenues = createAsyncThunk(
  'cash-flow/revenues/getRevenues',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const { query } = (getState() as RootState).cashFlow.revenue;
      const revenues = await CashFlowService.getAllEntries(query);

      await dispatch(storeList(revenues));
    } catch (error) {
      return rejectWithValue({ ...error });
    }
  }
);

export const setQuery = createAsyncThunk(
  'cash-flow/revenues/query',
  async (query: Partial<CashFlow.Query>, { dispatch }) => {
    await dispatch(storeQuery(query));
    await dispatch(getRevenues());
  }
);

export const createRevenue = createAsyncThunk(
  'cash-flow/revenues/createRevenue',
  async (revenue: CashFlow.EntryInput, { dispatch, rejectWithValue }) => {
    try {
      await CashFlowService.insertNewEntry(revenue);

      await dispatch(getRevenues());
    } catch (error) {
      return rejectWithValue({ ...error });
    }
  }
);

export const updateRevenue = createAsyncThunk(
  'cash-flow/revenues/updateRevenue',
  async (
    { entryId, entry }: { entryId: number; entry: CashFlow.EntryInput },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await CashFlowService.updateExistingEntry(entryId, entry);

      await dispatch(getRevenues());
    } catch (error) {
      return rejectWithValue({ ...error });
    }
  }
);

export const removeEntry = createAsyncThunk(
  'cash-flow/revenues/removeEntry',
  async (id: number, { dispatch }) => {
    await CashFlowService.removeExistingEntry(id);
    await dispatch(getRevenues());
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
    setSelectedExpanses(state, action: PayloadAction<Key[]>) {
      state.selected = action.payload;
    },
    storeQuery(state, action: PayloadAction<Partial<CashFlow.Query>>) {
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
      createRevenue,
      updateRevenue,
      removeEntry,
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

export const { storeList, setFetching, storeQuery, setSelectedExpanses } =
  RevenueSlice.actions;

const RevenueReducer = RevenueSlice.reducer;
export default RevenueReducer;
