import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Button, Popconfirm, Space, Table, Tag, Tooltip } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';

import { Payment } from 'alex-holanda-sdk';

import { usePayments } from '../../core/hooks/usePayments';
import confirm from 'antd/lib/modal/confirm';

export default function PaymentListView() {
  const { payments, fetchPayments } = usePayments();

  useEffect(() => {
    fetchPayments({ sort: ['scheduledTo', 'desc'], page: 0 });
  }, [fetchPayments]);
  return (
    <>
      <Table<Payment.Summary>
        dataSource={payments}
        rowKey={'id'}
        columns={[
          {
            dataIndex: 'id',
            title: '#',
          },
          {
            dataIndex: 'payee',
            title: 'Editor',
            render(payee: Payment.Summary['payee']) {
              return payee.name;
            },
          },
          {
            dataIndex: 'scheduledTo',
            title: 'Agendamento',
            align: 'center',
            render(date: string) {
              return new Date(date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });
            },
          },
          {
            dataIndex: 'accountingPeriod',
            title: 'Período',
            align: 'center',
            render(period: Payment.Summary['accountingPeriod']) {
              const starts = new Date(period.startsOn).toLocaleDateString(
                'pt-BR',
                {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                }
              );

              const ends = new Date(period.endsOn).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });
              return `${starts} - ${ends}`;
            },
          },
          {
            dataIndex: 'approvedAt',
            title: 'Aprovado',
            align: 'center',
            render(approvalDate: Payment.Summary['approvedAt']) {
              const approvalDateFormatted = new Date(
                approvalDate
              ).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              });

              return (
                <Tag color={approvalDate ? 'blue' : 'warning'}>
                  {approvalDate
                    ? `Aprovado em ${approvalDateFormatted}`
                    : 'Aguardando aprovação'}
                </Tag>
              );
            },
          },
          {
            dataIndex: 'id',
            title: 'Ações',
            align: 'center',
            render(id: number, payment) {
              return (
                <Space>
                  <Tooltip title={'Detalhar'} placement={'left'}>
                    <Link to={`${id}`}>
                      <Button size={'small'} icon={<EyeOutlined />} />
                    </Link>
                  </Tooltip>

                  <Popconfirm
                    title={'Remover agendamento?'}
                    onConfirm={() => {
                      confirm({
                        title: 'Remover agendamento',
                        content:
                          'Esta é uma ação irreversível. Ao remover um agendamento, ele não poderá ser recuperado!',
                        onOk() {
                          console.log('TODO: remover agendamento');
                        },
                      });
                    }}
                  >
                    <Tooltip
                      title={payment.canBeDeleted ? 'Remover' : 'Já aprovado'}
                      placement={'right'}
                    >
                      <Button
                        size={'small'}
                        icon={<DeleteOutlined />}
                        disabled={!payment.canBeDeleted}
                      />
                    </Tooltip>
                  </Popconfirm>
                </Space>
              );
            },
          },
        ]}
      />
    </>
  );
}
