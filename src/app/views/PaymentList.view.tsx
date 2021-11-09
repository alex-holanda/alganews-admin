import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  DatePicker,
  Descriptions,
  Col,
} from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';

import { Payment } from 'alex-holanda-sdk';

import { usePayments } from '../../core/hooks/usePayments';
import confirm from 'antd/lib/modal/confirm';
import { Key } from 'antd/lib/table/interface';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

export default function PaymentListView() {
  const { payments, fetchPayments } = usePayments();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [yearMonth, setYearMonth] = useState<string | undefined>();

  const { xs } = useBreakpoint();

  useEffect(() => {
    fetchPayments({
      scheduledToYearMonth: yearMonth,
      sort: ['scheduledTo', 'desc'],
      page: 0,
    });
  }, [fetchPayments, yearMonth]);
  return (
    <>
      <Row align={'middle'} justify={'space-between'} gutter={24}>
        <Space
          direction={xs ? 'vertical' : 'horizontal'}
          style={{
            width: '100%',
            ...(!xs && { justifyContent: 'space-between' }),
          }}
        >
          <Popconfirm
            title={
              selectedRowKeys.length === 1
                ? 'Você deseja aprovar o agendamento selecionado?'
                : 'Você deseja aprovar os agendamentos selecionados?'
            }
            disabled={selectedRowKeys.length === 0}
            onConfirm={() => {
              confirm({
                title: 'Aprovar agendamentos',
                content:
                  'Esta é uma ação irreversível. Ao aprovar, não poderá ser removido!',
                onOk() {
                  console.log('TODO: implement batch approval');
                },
                cancelText: 'Cancelar',
              });
            }}
          >
            <Button
              type={'primary'}
              disabled={selectedRowKeys.length === 0}
              style={{ width: xs ? '100%' : 240 }}
            >
              Aprovar agendamentos
            </Button>
          </Popconfirm>

          <DatePicker.MonthPicker
            style={{ width: xs ? '100%' : '240px' }}
            onChange={(date) => {
              setYearMonth(date ? date.format('YYYY-MM') : undefined);
            }}
            format={'MMMM - YYYY'}
          />
        </Space>
      </Row>

      <Row>
        <Col span={24}>
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
                title: 'Agendamentos',
                responsive: ['xs'],
                render(payment: Payment.Summary) {
                  return (
                    <Descriptions column={1} size={'small'}>
                      <Descriptions.Item label={'Editor'}>
                        {payment.payee.name}
                      </Descriptions.Item>

                      <Descriptions.Item label={'Agendamento'}>
                        {new Date(payment.scheduledTo).toLocaleDateString(
                          'pt-BR',
                          {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          }
                        )}
                      </Descriptions.Item>

                      <Descriptions.Item label={'Período'}>
                        {`${new Date(
                          payment.accountingPeriod.startsOn
                        ).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })} - ${new Date(
                          payment.accountingPeriod.endsOn
                        ).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}`}
                      </Descriptions.Item>

                      <Descriptions.Item label={'Status'}>
                        {
                          <Tag color={payment.approvedAt ? 'blue' : 'warning'}>
                            {payment.approvedAt
                              ? `Aprovado em ${new Date(
                                  payment.approvedAt
                                ).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                })}`
                              : 'Aguardando aprovação'}
                          </Tag>
                        }
                      </Descriptions.Item>

                      <Descriptions.Item label={'Ações'}>
                        <Space>
                          <Tooltip title={'Detalhar'} placement={'left'}>
                            <Link to={`${payment.id}`}>
                              <Button size={'small'} icon={<EyeOutlined />} />
                            </Link>
                          </Tooltip>

                          <Popconfirm
                            title={'Remover agendamento?'}
                            disabled={!payment.canBeDeleted}
                            onConfirm={() => {
                              confirm({
                                title: 'Remover agendamento',
                                content:
                                  'Esta é uma ação irreversível. Ao remover um agendamento, ele não poderá ser recuperado!',
                                onOk() {
                                  console.log('TODO: remover agendamento');
                                },
                                cancelText: 'Cancelar',
                              });
                            }}
                          >
                            <Tooltip
                              title={
                                payment.canBeDeleted ? 'Remover' : 'Já aprovado'
                              }
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
                      </Descriptions.Item>
                    </Descriptions>
                  );
                },
              },
              {
                dataIndex: 'payee',
                title: 'Editor',
                responsive: ['sm'],
                width: 220,
                ellipsis: true,
                render(payee: Payment.Summary['payee']) {
                  return payee.name;
                },
              },
              {
                dataIndex: 'scheduledTo',
                title: 'Agendamento',
                align: 'center',
                width: 130,
                responsive: ['sm'],
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
                width: 200,
                responsive: ['sm'],
                render(period: Payment.Summary['accountingPeriod']) {
                  const starts = new Date(period.startsOn).toLocaleDateString(
                    'pt-BR',
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    }
                  );

                  const ends = new Date(period.endsOn).toLocaleDateString(
                    'pt-BR',
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    }
                  );
                  return `${starts} - ${ends}`;
                },
              },
              {
                dataIndex: 'approvedAt',
                title: 'Aprovado',
                align: 'center',
                width: 180,
                responsive: ['sm'],
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
                width: 100,
                responsive: ['sm'],
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
                        disabled={!payment.canBeDeleted}
                        onConfirm={() => {
                          confirm({
                            title: 'Remover agendamento',
                            content:
                              'Esta é uma ação irreversível. Ao remover um agendamento, ele não poderá ser recuperado!',
                            onOk() {
                              console.log('TODO: remover agendamento');
                            },
                            cancelText: 'Cancelar',
                          });
                        }}
                      >
                        <Tooltip
                          title={
                            payment.canBeDeleted ? 'Remover' : 'Já aprovado'
                          }
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
        </Col>
      </Row>
    </>
  );
}
