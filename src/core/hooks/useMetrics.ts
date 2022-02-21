import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AppDispatch, RootState } from '../store';
import * as MetricAcion from '../store/Metric.slice';
import transformDataIntoAntdChart from '../util/transformDataIntoAntdChart';

export function useMetrics() {
  const dispatch = useDispatch<AppDispatch>();
  const monthlyRevenuesExpenses = useSelector(
    (state: RootState) => state.metric.list
  );
  const fetching = useSelector((state: RootState) => state.metric.fetching);
  const forbidden = useSelector((state: RootState) => state.metric.forbidden);

  const fetchMonthlyRevenuesExpenses = useCallback(async () => {
    await dispatch(MetricAcion.getMonthlyRevenuesExpenses())
      .unwrap()
      .catch((error) => {
        console.log(error.message);
      });
  }, [dispatch]);

  return {
    data: transformDataIntoAntdChart(monthlyRevenuesExpenses),
    fetching,
    forbidden,
    fetchMonthlyRevenuesExpenses,
  };
}
