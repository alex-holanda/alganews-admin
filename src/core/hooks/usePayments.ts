import { Payment, PaymentService } from 'alex-holanda-sdk';
import { useState, useCallback } from 'react';
export function usePayments() {
  const [payments, setPayments] = useState<Payment.Paginated>();

  const fetchPayments = useCallback((query: Payment.Query) => {
    PaymentService.getAllPayments(query).then(setPayments);
  }, []);

  return {
    payments: payments?.content,
    fetchPayments,
  };
}
