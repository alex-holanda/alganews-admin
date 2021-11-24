import { useEffect } from 'react';
import { Redirect, useParams } from 'react-router';

import { Card, Divider, Space, Button, notification } from 'antd';
import { PrinterOutlined, CheckCircleOutlined } from '@ant-design/icons';

import { usePayment } from '../../core/hooks/usePayment';

import { PaymentHeader } from '../features/PaymentHeader';
import { PaymentPosts } from '../features/PaymentPosts';
import { PaymentBonus } from '../features/PaymentBonus';
import { NotFoundError } from '../components/NotFoundError';
import { usePageTitle } from '../../core/hooks/usePageTitle';
import { DoubleConfirm } from '../components/DoubleConfirm';
import { transformStringToDate } from '../../core/util/transformStringToDate';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

export function PaymentDetailsView() {
  usePageTitle('Detalhes do pagamento');

  const params = useParams<{ id: string }>();

  const {
    fetchPayment,
    fetchPosts,
    fetchingPayment,
    fetchingPosts,
    payment,
    posts,
    notFound,
    approvePayment,
    fetchingPaymentApprove,
  } = usePayment();

  const { xs } = useBreakpoint();

  useEffect(() => {
    if (!isNaN(Number(params.id))) {
      fetchPosts(Number(params.id));
      fetchPayment(Number(params.id));
    }
  }, [params, fetchPosts, fetchPayment]);

  if (isNaN(Number(params.id))) {
    return <Redirect to={'/pagamentos'} />;
  }

  if (notFound) {
    return (
      <>
        <Card>
          <NotFoundError
            title={'Pagamento não encontrado'}
            actionDestination={'/pagamentos'}
            actionTitle={'Voltar para a lista de pagamentos'}
          />
        </Card>
      </>
    );
  }

  return (
    <Space direction={'vertical'}>
      <Space
        direction={xs ? 'vertical' : 'horizontal'}
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <Button
          className='no-print'
          style={{ width: '100%' }}
          icon={<PrinterOutlined />}
          type={'primary'}
          onClick={window.print}
        >
          Imprimir
        </Button>

        <DoubleConfirm
          disabled={!payment?.canBeDeleted}
          popConfirmTitle={'Deseja aprovar este agendamento?'}
          modalTitle={'Ação irreversível'}
          modalContent={
            'Aprovar um agendamento de pagamento gera uma despesa que não pode ser removida do fluxo de caixa. Essa ação não poderá ser desfeita.'
          }
          onConfirm={async () => {
            await approvePayment(payment?.id!);

            notification.success({ message: 'Pagamento aprovado com sucesso' });
          }}
        >
          <Button
            className='no-print'
            style={{ width: '100%' }}
            disabled={!payment?.canBeDeleted}
            icon={<CheckCircleOutlined />}
            type={'primary'}
            loading={fetchingPaymentApprove}
            danger
          >
            {payment?.canBeDeleted
              ? 'Aprovar agendamento'
              : `Pagamento aprovado em ${transformStringToDate(
                  payment?.approvedAt!
                )}`}
          </Button>
        </DoubleConfirm>
      </Space>

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
    </Space>
  );
}
