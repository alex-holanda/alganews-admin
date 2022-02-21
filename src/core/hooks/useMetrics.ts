import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../store';
import * as MetricAcion from '../store/Metric.slice';
import transformDataIntoAntdChart from '../util/transformDataIntoAntdChart';

export function useMetric() {
  const dispatch = useDispatch();
  const monthlyRevenuesExpenses = useSelector(
    (state: RootState) => state.metric.list
  );
  const fetching = useSelector((state: RootState) => state.metric.fetching);
  const forbidden = useSelector((state: RootState) => state.metric.forbidden);

  const fetchMonthlyRevenuesExpenses = useCallback(() => {
    dispatch(MetricAcion.getMonthlyRevenuesExpenses());
  }, [dispatch]);

  return {
    data: transformDataIntoAntdChart(monthlyRevenuesExpenses),
    fetching,
    forbidden,
    fetchMonthlyRevenuesExpenses,
  };
}
