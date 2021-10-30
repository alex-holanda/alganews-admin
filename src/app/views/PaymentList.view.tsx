import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Button, Popconfirm, Row, Space, Table, Tag, Tooltip } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';

import { Payment } from 'alex-holanda-sdk';

import { usePayments } from '../../core/hooks/usePayments';
import confirm from 'antd/lib/modal/confirm';
import { Key } from 'antd/lib/table/interface';

export default function PaymentListView() {
  const { payments, fetchPayments } = usePayments();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  useEffect(() => {
    fetchPayments({ sort: ['scheduledTo', 'desc'], page: 0 });
  }, [fetchPayments]);
  return (
    <>
      <Row>
        <Popconfirm
          title={
            selectedRowKeys.length === 1
              ? 'Você deseja aprovar o pagamento selecionado?'
              : 'Você deseja aprovar os pagamentos selecionados?'
          }
          onConfirm={() => {
            confirm({
              title: 'Aprovar pagamento',
              content:
                'Esta é uma ação irreversível. Ao aprovar um pagamento, ele não poderá ser removido!',
              onOk() {
                console.log('TODO: implement batch approval');
              },
            });
          }}
        >
          <Button type={'primary'} disabled={selectedRowKeys.length === 0}>
            Aprovar pagamentos
          </Button>
        </Popconfirm>
      </Row>
      <Table<Payment.Summary>
        dataSource={payments}
        rowKey={'id'}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
          getCheckboxProps(payment) {
            return !payment.canBeApproved ? { disabled: true } : {};
          },
        }}
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
