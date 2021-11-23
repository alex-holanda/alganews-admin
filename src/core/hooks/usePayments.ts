import { Payment } from 'alex-holanda-sdk';
import { Key } from 'antd/lib/table/interface';
import { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { RootState } from './../store/index';
import * as PaymentActions from './../store/Payment.slice';

export function usePayments() {
  const dispatch = useDispatch();

  const fetching = useSelector((state: RootState) => state.payment.fetching);
  const payments = useSelector((state: RootState) => state.payment.paginated);
  const query = useSelector((state: RootState) => state.payment.query);
  const selected = useSelector((state: RootState) => state.payment.selected);

  const approvePaymentsInBatch = useCallback(
    (ids: number[]) => {
      dispatch(PaymentActions.approvePaymentsInBatch(ids));
    },
    [dispatch]
  );

  const fetchPayments = useCallback(() => {
    dispatch(PaymentActions.getAllPayments());
  }, [dispatch]);

  const setQuery = useCallback(
    async (query: Payment.Query) => {
      await dispatch(PaymentActions.setQuery(query));
    },
    [dispatch]
  );

  const setSelected = useCallback(
    async (keys: Key[]) => {
      await dispatch(PaymentActions.storeSelectedKeys(keys));
    },
    [dispatch]
  );

  return {
    payments: payments?.content,
    totalElements: payments?.totalElements,
    fetchPayments,
    fetching,
    approvePaymentsInBatch,
    query,
    setQuery,
    selected,
    setSelected,
  };
}
