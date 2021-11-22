import { useState, useCallback } from 'react';

import {
  Post,
  Payment,
  PaymentService,
  ResourceNotFoundError,
} from 'alex-holanda-sdk';

export function usePayment() {
  const [posts, setPosts] = useState<Post.WithEarnings[]>([]);
  const [payment, setPayment] = useState<Payment.Detailed>();
  const [paymentPreview, setPaymentPreview] = useState<Payment.Preview>();

  const [fetchingPosts, setFecthingPosts] = useState(false);
  const [fetchingPayment, setFetchingPayment] = useState(false);
  const [schedulingPayment, setSchedulingPayment] = useState(false);

  const [fetchingPaymentPreview, setFetchingPaymentPreview] = useState(false);

  const [notFound, setNotFound] = useState(false);

  const fetchPayment = useCallback(async (paymentId: number) => {
    setFetchingPayment(true);
    PaymentService.getExistingPayment(paymentId)
      .then(setPayment)
      .catch((error) => {
        if (error instanceof ResourceNotFoundError) {
          setNotFound(true);
        } else {
          throw error;
        }
      })
      .finally(() => setFetchingPayment(false));
  }, []);

  const clearPaymentPreview = useCallback(() => {
    setPaymentPreview(undefined);
  }, []);

  const fetchPaymentPreview = useCallback(
    async (paymentPreview: Payment.PreviewInput) => {
      setFetchingPaymentPreview(true);
      await PaymentService.getPaymentPreview(paymentPreview)
        .then(setPaymentPreview)
        .catch((error) => {
          clearPaymentPreview();
          throw error;
        })
        .finally(() => setFetchingPaymentPreview(false));
    },
    [clearPaymentPreview]
  );

  const fetchPosts = useCallback(
    async (paymentId: number, query?: Payment.Sort) => {
      setFecthingPosts(true);
      PaymentService.getExistingPaymentPosts(paymentId, query)
        .then(setPosts)
        .finally(() => setFecthingPosts(false));
    },
    []
  );

  const scheduledPayment = useCallback(async (paymentInput: Payment.Input) => {
    try {
      setSchedulingPayment(true);
      await PaymentService.insertNewPayment(paymentInput);
    } finally {
      setSchedulingPayment(false);
    }
  }, []);

  return {
    posts,
    fetchingPosts,
    fetchPosts,
    payment,
    fetchingPayment,
    fetchPayment,
    notFound,
    paymentPreview,
    fetchingPaymentPreview,
    fetchPaymentPreview,
    clearPaymentPreview,
    schedulingPayment,
    scheduledPayment,
  };
}
