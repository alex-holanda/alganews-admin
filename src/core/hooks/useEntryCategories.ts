import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AppDispatch, RootState } from 'core/store';
import * as CategoryActions from 'core/store/EntriesCategory.slice';

import { CashFlow } from 'alex-holanda-sdk';

function useEntryCategories() {
  const dispatch = useDispatch<AppDispatch>();

  const expenses = useSelector(
    (state: RootState) => state.cashFlow.category.expenses
  );
  const revenues = useSelector(
    (state: RootState) => state.cashFlow.category.revenues
  );
  const fetching = useSelector(
    (state: RootState) => state.cashFlow.category.fetching
  );

  const fetchCategories = useCallback(
    async () => await dispatch(CategoryActions.getCategories()),
    [dispatch]
  );

  const createCategory = useCallback(
    async (category: CashFlow.CategoryInput) =>
      await dispatch(CategoryActions.createCategory(category)).unwrap(),
    [dispatch]
  );

  return {
    expenses,
    revenues,
    fetching,
    fetchCategories,
    createCategory,
  };
}

export default useEntryCategories;
