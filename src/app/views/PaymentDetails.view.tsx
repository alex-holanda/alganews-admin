import { useEffect } from 'react';
import { useParams } from 'react-router';

import { Card, Descriptions, Divider, Typography, Table } from 'antd';

import { Post } from 'alex-holanda-sdk';

import { usePayment } from '../../core/hooks/usePayment';

import { PaymentHeader } from '../features/PaymentHeader';

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
          editorId={payment?.payee.id}
          editorName={payment?.payee.name}
          periodStart={payment?.accountingPeriod.startsOn}
          periodEnd={payment?.accountingPeriod.endsOn}
          postsEarnings={payment?.earnings.totalAmount}
          totalEarnings={payment?.grandTotalAmount}
        />

        <Divider />

        <Typography.Title level={2}>Bônus</Typography.Title>
        <Descriptions bordered size={'small'} column={1}>
          <Descriptions.Item label={'1 milhão de views em 1 dia'}>
            {'R$ 123,56'}
          </Descriptions.Item>
          <Descriptions.Item label={'1 milhão de views em 1 dia'}>
            {'R$ 123,56'}
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <Table<Post.WithEarnings>
          dataSource={[]}
          columns={[
            {
              dataIndex: 'title',
              title: 'Post',
              ellipsis: true,
            },
            {
              dataIndex: 'earnings.pricePerword',
              title: 'Preço por palavra',
            },
            {
              dataIndex: 'earning.words',
              title: 'Palavras',
            },
            {
              dataIndex: 'earnings.totalAmount',
              title: 'Total ganho nesse post',
            },
          ]}
        />
      </Card>
    </>
  );
}
