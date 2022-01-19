import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../store';
import * as CategoryActions from '../store/EntriesCategory.slice';

import { CashFlow } from 'alex-holanda-sdk';

function useEntryCategories() {
  const dispatch = useDispatch();

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
    () => dispatch(CategoryActions.getCategories()),
    [dispatch]
  );

  const createCategory = useCallback(
    (category: CashFlow.CategoryInput) =>
      dispatch(CategoryActions.createCategory(category)),
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
