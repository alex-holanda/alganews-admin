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

  const fetchPaymentPreview = useCallback(
    async (paymentPreview: Payment.PreviewInput) => {
      setFetchingPaymentPreview(true);
      PaymentService.getPaymentPreview(paymentPreview)
        .then(setPaymentPreview)
        .finally(() => setFetchingPaymentPreview(false));
    },
    []
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
  };
}
