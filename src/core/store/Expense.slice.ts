import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CashFlow, CashFlowService } from 'alex-holanda-sdk';

import { Key } from 'antd/lib/table/interface';
import getThunkStatus from 'core/util/getThunkStatus';
import moment from 'moment';

import { RootState } from './';

interface ExpenseState {
  list: CashFlow.EntrySummary[];
  fetching: boolean;
  query: CashFlow.Query;
  selected: Key[];
}

const initialState: ExpenseState = {
  list: [],
  fetching: false,
  query: {
    type: 'EXPENSE',
    sort: ['transactedOn', 'desc'],
    yearMonth: moment().format('YYYY-MM'),
  },
  selected: [],
};

export const getExpenses = createAsyncThunk(
  'cash-flow/expenses/getExpenses',
  async (_, { getState, dispatch }) => {
    const { query } = (getState() as RootState).cashFlow.expense;
    const expenses = await CashFlowService.getAllEntries(query);

    await dispatch(storeList(expenses));
  }
);

export const setQuery = createAsyncThunk(
  'cash-flow/expenses/query',
  async (query: Partial<CashFlow.Query>, { dispatch }) => {
    await dispatch(storeQuery(query));
    await dispatch(getExpenses());
  }
);

export const createExpense = createAsyncThunk(
  'cash-flow/expenses/createExpense',
  async (expense: CashFlow.EntryInput, { dispatch, rejectWithValue }) => {
    try {
      await CashFlowService.insertNewEntry(expense);

      await dispatch(getExpenses());
    } catch (error) {
      return rejectWithValue({ ...error });
    }
  }
);

export const updateExpense = createAsyncThunk(
  'cash-flow/expenses/updateExpense',
  async (
    { entryId, entry }: { entryId: number; entry: CashFlow.EntryInput },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await CashFlowService.updateExistingEntry(entryId, entry);

      await dispatch(getExpenses());
    } catch (error) {
      return rejectWithValue({ ...error });
    }
  }
);

export const removeEntry = createAsyncThunk(
  'cash-flow/expenses/removeEntry',
  async (id: number, { dispatch }) => {
    await CashFlowService.removeExistingEntry(id);
    await dispatch(getExpenses());
  }
);

export const removeEntriesInBatch = createAsyncThunk(
  'cash-flow/expenses/removeEntriesInBatch',
  async (ids: number[], { dispatch }) => {
    await CashFlowService.removeEntriesBatch(ids);
    await dispatch(getExpenses());
  }
);

const expenseSlice = createSlice({
  initialState,
  name: 'cash-flow/expenses',
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
      getExpenses,
      removeEntriesInBatch,
      createExpense,
      updateExpense,
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
  expenseSlice.actions;

const expenseReducer = expenseSlice.reducer;
export default expenseReducer;
