import { useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { Key } from 'antd/lib/table/interface';

import { RootState } from '../store';

import { CashFlow } from 'alex-holanda-sdk';

import * as ExpensesActions from '../store/Expense.slice';
import * as RevenuesActions from '../store/Revenue.slice';

type CashFlowEntryType = CashFlow.EntrySummary['type'];

function useCashFlow(type: CashFlowEntryType) {
  const dispatch = useDispatch();

  const query = useSelector((state: RootState) =>
    type === 'EXPENSE'
      ? state.cashFlow.expense.query
      : state.cashFlow.revenue.query
  );

  const entries = useSelector((state: RootState) =>
    type === 'EXPENSE'
      ? state.cashFlow.expense.list
      : state.cashFlow.revenue.list
  );

  const fetching = useSelector((state: RootState) =>
    type === 'EXPENSE'
      ? state.cashFlow.expense.fetching
      : state.cashFlow.revenue.fetching
  );

  const selected = useSelector((state: RootState) =>
    type === 'EXPENSE'
      ? state.cashFlow.expense.selected
      : state.cashFlow.revenue.selected
  );

  const fetchEntries = useCallback(() => {
    dispatch(
      type === 'EXPENSE'
        ? ExpensesActions.getExpenses()
        : RevenuesActions.getRevenues()
    );
  }, [type, dispatch]);

  const removeEntriesInBatch = useCallback(
    (ids: number[]) =>
      dispatch(
        type === 'EXPENSE'
          ? ExpensesActions.removeEntriesInBatch(ids)
          : RevenuesActions.removeEntriesInBatch(ids)
      ),
    [type, dispatch]
  );

  const setSelected = useCallback(
    (keys: Key[]) =>
      dispatch(
        type === 'EXPENSE'
          ? ExpensesActions.setSelectedExpanses(keys)
          : RevenuesActions.setSelectedExpanses(keys)
      ),
    [type, dispatch]
  );

  const setQuery = useCallback(
    (query: Partial<CashFlow.Query>) =>
      dispatch(
        type === 'EXPENSE'
          ? ExpensesActions.setQuery(query)
          : RevenuesActions.setQuery(query)
      ),
    [type, dispatch]
  );

  return {
    entries,
    fetching,
    fetchEntries,
    query,
    selected,
    removeEntriesInBatch,
    setSelected,
    setQuery,
  };
}

export default useCashFlow;
