import { useState, useCallback } from 'react';

import { Payment, PaymentService } from 'alex-holanda-sdk';

export function usePayments() {
  const [payments, setPayments] = useState<Payment.Paginated>();
  const [fetching, setFetching] = useState(false);

  const fetchPayments = useCallback((query: Payment.Query) => {
    setFetching(true);
    PaymentService.getAllPayments(query)
      .then(setPayments)
      .finally(() => setFetching(false));
  }, []);

  return {
    payments: payments?.content,
    totalElements: payments?.totalElements,
    fetchPayments,
    fetching,
  };
}
