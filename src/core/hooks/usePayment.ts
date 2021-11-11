import { useState, useCallback } from 'react';

import { Post, Payment, PaymentService } from 'alex-holanda-sdk';

export function usePayment() {
  const [posts, setPosts] = useState<Post.WithEarnings>();
  const [payment, setPayment] = useState<Payment.Detailed>();

  const [fetchingPosts, setFecthingPosts] = useState(false);
  const [fetchingPayment, setFetchingPayment] = useState(false);

  const fetchPayment = useCallback(async (paymentId: number) => {
    setFetchingPayment(true);
    PaymentService.getExistingPayment(paymentId)
      .then(setPayment)
      .finally(() => setFetchingPayment(false));
  }, []);

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
  };
}
