import { useState, useCallback } from 'react';

import { Payment, PaymentService } from 'alex-holanda-sdk';

export function usePayments() {
  const [payments, setPayments] = useState<Payment.Paginated>();
  const [fetching, setFetching] = useState(false);

  const [approvingPaymentsBatch, setApprovingPaymentsBatch] = useState(false);

  const fetchPayments = useCallback((query: Payment.Query) => {
    setFetching(true);
    PaymentService.getAllPayments(query)
      .then(setPayments)
      .finally(() => setFetching(false));
  }, []);

  const approvePaymentsBatch = useCallback(async (paymentIds: number[]) => {
    try {
      setApprovingPaymentsBatch(true);
      await PaymentService.approvePaymentsBatch(paymentIds);
    } finally {
      setApprovingPaymentsBatch(false);
    }
  }, []);

  return {
    payments: payments?.content,
    totalElements: payments?.totalElements,
    fetchPayments,
    fetching,
    approvingPaymentsBatch,
    approvePaymentsBatch,
  };
}
