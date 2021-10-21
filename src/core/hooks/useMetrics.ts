import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../store';
import * as MetricAcion from '../store/Metric.reducer';
import transformDataIntoAntdChart from '../util/transformDataIntoAntdChart';

export function useMetric() {
  const dispatch = useDispatch();
  const monthlyRevenuesExpenses = useSelector(
    (state: RootState) => state.metric.monthlyRevenuesExpenses
  );
  const fetching = useSelector((state: RootState) => state.metric.fetching);

  const fetchMonthlyRevenuesExpenses = useCallback(() => {
    dispatch(MetricAcion.getMonthlyRevenuesExpenses());
  }, [dispatch]);

  return {
    data: transformDataIntoAntdChart(monthlyRevenuesExpenses),
    fetching,
    fetchMonthlyRevenuesExpenses,
  };
}
