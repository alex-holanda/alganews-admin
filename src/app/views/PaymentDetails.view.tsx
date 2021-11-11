import { useEffect } from 'react';
import { useParams } from 'react-router';

import { Card, Divider } from 'antd';

import { usePayment } from '../../core/hooks/usePayment';

import { PaymentHeader } from '../features/PaymentHeader';
import { PaymentPosts } from '../features/PaymentPosts';
import { PaymentBonus } from '../features/PaymentBonus';

export function PaymentDetailsView() {
  const params = useParams<{ id: string }>();

  const {
    fetchPayment,
    fetchPosts,
    fetchingPayment,
    fetchingPosts,
    payment,
    posts,
  } = usePayment();

  useEffect(() => {
    if (!isNaN(Number(params.id))) {
      fetchPosts(Number(params.id));
      fetchPayment(Number(params.id));
    }
  }, [params, fetchPosts, fetchPayment]);
  return (
    <>
      <Card>
        <PaymentHeader
          isLoading={fetchingPayment}
          editorId={payment?.payee.id}
          editorName={payment?.payee.name}
          periodStart={payment?.accountingPeriod.startsOn}
          periodEnd={payment?.accountingPeriod.endsOn}
          postsEarnings={payment?.earnings.totalAmount}
          totalEarnings={payment?.grandTotalAmount}
        />

        <Divider />

        <PaymentBonus bonus={payment?.bonuses} isLoading={fetchingPayment} />

        <Divider />

        <PaymentPosts posts={posts} isLoading={fetchingPosts} />
      </Card>
    </>
  );
}
