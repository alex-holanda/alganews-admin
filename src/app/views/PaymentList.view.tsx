import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  DatePicker,
  Descriptions,
} from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Key, SorterResult } from 'antd/lib/table/interface';

import { Payment } from 'alex-holanda-sdk';

import { usePayments } from '../../core/hooks/usePayments';
import { DoubleConfirm } from '../components/DoubleConfirm';

export default function PaymentListView() {
  const { payments, fetchPayments, totalElements, fetching } = usePayments();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [yearMonth, setYearMonth] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [sortingOrder, seteSortingOrder] = useState<
    'asc' | 'desc' | undefined
  >();
  const pageSize = 7;

  const { xs } = useBreakpoint();

  useEffect(() => {
    fetchPayments({
      scheduledToYearMonth: yearMonth,
      sort: ['scheduledTo', sortingOrder || 'desc'],
      page: page - 1,
      size: pageSize,
    });
  }, [fetchPayments, yearMonth, page, pageSize, sortingOrder]);
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
          <DoubleConfirm
            disabled={selectedRowKeys.length === 0}
            popConfirmTitle={
              selectedRowKeys.length === 1
                ? 'Você deseja aprovar o agendamento selecionado?'
                : 'Você deseja aprovar os agendamentos selecionados?'
            }
            modalTitle={'Aprovar agendamento'}
            modalContent={
              'Esta é uma ação irreversível. Ao aprovar, não poderá ser removido!'
            }
            onConfirm={() => {
              console.log('TODO: implement batch approval');
            }}
          >
            <Button
              type={'primary'}
              disabled={selectedRowKeys.length === 0}
              style={{ width: xs ? '100%' : 240 }}
            >
              Aprovar agendamentos
            </Button>
          </DoubleConfirm>

          <DatePicker.MonthPicker
            style={{ width: xs ? '100%' : '240px' }}
            onChange={(date) => {
              setYearMonth(date ? date.format('YYYY-MM') : undefined);
            }}
            format={'MMMM - YYYY'}
          />
        </Space>
      </Row>

      <Table<Payment.Summary>
        dataSource={payments}
        rowKey={'id'}
        loading={fetching}
        onChange={(p, f, sorter) => {
          const { order } = sorter as SorterResult<Payment.Summary>;
          order === 'ascend'
            ? seteSortingOrder('asc')
            : seteSortingOrder('desc');
        }}
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
                    {new Date(payment.scheduledTo).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
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

                      <DoubleConfirm
                        disabled={!payment.canBeDeleted}
                        popConfirmTitle={'Remover agendamento?'}
                        modalTitle={'Remover agendamento'}
                        modalContent={
                          'Esta é uma ação irreversível. Ao remover um agendamento, ele não poderá ser recuperado!'
                        }
                        onConfirm={() => {
                          console.log('TODO: remover agendamento');
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
                      </DoubleConfirm>
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
              return <Link to={`/usuarios/${payee.id}`}>{payee.name}</Link>;
            },
          },
          {
            dataIndex: 'scheduledTo',
            title: 'Agendamento',
            sorter(a, b) {
              return 0;
            },
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

                  <DoubleConfirm
                    disabled={!payment.canBeDeleted}
                    popConfirmTitle={'Remover agendamento'}
                    modalTitle={'Remover agendamento'}
                    modalContent={
                      'Esta é uma ação irreversível. Ao remover um agendamento, ele não poderá ser recuperado!'
                    }
                    onConfirm={() => {
                      console.log('TODO: remover agendamento');
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
                  </DoubleConfirm>
                </Space>
              );
            },
          },
        ]}
        pagination={{
          current: page,
          onChange: setPage,
          total: totalElements,
          pageSize: pageSize,
        }}
      />
    </>
  );
}
