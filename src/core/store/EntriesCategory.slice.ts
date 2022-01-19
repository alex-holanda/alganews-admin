import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CashFlow, CashFlowService } from 'alex-holanda-sdk';

import getThunkStatus from 'core/util/getThunkStatus';

interface EntriesCategoryState {
  fetching: boolean;
  expenses: CashFlow.CategorySummary[];
  revenues: CashFlow.CategorySummary[];
}

const initialState: EntriesCategoryState = {
  fetching: false,
  expenses: [],
  revenues: [],
};

export const getCategories = createAsyncThunk(
  'cash-flow/categories/getCategories',
  async (_, { dispatch }) => {
    const categories = await CashFlowService.getAllCategories({
      sort: ['id', 'desc'],
    });

    /**
     * utilizando filtro local, a API não provê uma
     * forma de recuperar as categorias separadamente
     * por tipo
     *
     * @todo: melhorar quanod a API prover um endpoint
     */
    const expensesCategory = categories.filter((c) => c.type === 'EXPENSE');
    const revenuesCategory = categories.filter((c) => c.type === 'REVENUE');

    await dispatch(storeExpenses(expensesCategory));
    await dispatch(storeRevenues(revenuesCategory));
  }
);

const entriesCategorySlice = createSlice({
  initialState,
  name: 'cash-flow/categories',
  reducers: {
    storeFetching(state, action: PayloadAction<boolean>) {
      state.fetching = action.payload;
    },
    storeExpenses(state, action: PayloadAction<CashFlow.CategorySummary[]>) {
      state.expenses = action.payload;
    },
    storeRevenues(state, action: PayloadAction<CashFlow.CategorySummary[]>) {
      state.revenues = action.payload;
    },
  },
  extraReducers(builder) {
    const { error, loading, success } = getThunkStatus([getCategories]);

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

export const { storeFetching, storeExpenses, storeRevenues } =
  entriesCategorySlice.actions;

const entriesCategory = entriesCategorySlice.reducer;
export default entriesCategory;
