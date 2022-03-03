import { useEffect, useRef, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import {
  Button,
  Card,
  DatePicker,
  Descriptions,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import { DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';

import moment from 'moment';

import { CashFlow } from 'alex-holanda-sdk';

import useCashFlow from 'core/hooks/useCashFlow';
import { transformStringToDate } from 'core/util/transformStringToDate';
import { transformNumberToCurrency } from 'core/util/transformNumberToCurrency';
import { DoubleConfirm } from 'app/components/DoubleConfirm';
import { Forbidden } from 'app/components/Forbidden';

interface EntriesListProps {
  type: CashFlow.EntrySummary['type'];
  onEdit: (entryId: number) => any;
  onRemove: (entryId: number) => any;
  onView: (entryId: number) => any;
}

function EntriesList(props: EntriesListProps) {
  const location = useLocation();
  const history = useHistory();

  const { entries, fetching, fetchEntries, selected, setSelected, setQuery } =
    useCashFlow(props.type);

  const didMount = useRef(false);

  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    fetchEntries().catch((error) => {
      if (error?.data?.status === 403) {
        setForbidden(true);
        return;
      }

      throw error;
    });
  }, [fetchEntries]);

  useEffect(() => {
    if (didMount.current) {
      const params = new URLSearchParams(location.search);
      const yearMonth = params.get('yearMonth');

      if (yearMonth) {
        setQuery({
          yearMonth,
        });
      }
    } else {
      didMount.current = true;
    }
  }, [location.search, setQuery]);

  if (forbidden) {
    return (
      <div style={{ marginTop: 15 }}>
        <Forbidden />
      </div>
    );
  }

  return (
    <Table<CashFlow.EntrySummary>
      loading={fetching}
      rowKey={'id'}
      dataSource={entries}
      rowSelection={{
        selectedRowKeys: selected,
        onChange: setSelected,
        getCheckboxProps(record) {
          return !record.canBeDeleted ? { disabled: true } : {};
        },
      }}
      columns={[
        {
          responsive: ['xs'],
          title: props.type === 'EXPENSE' ? 'Despesas' : 'Receitas',
          render(entry: CashFlow.EntrySummary) {
            return (
              <>
                <Descriptions column={1} size={'small'}>
                  <Descriptions.Item label={'Descrição'}>
                    {entry.description}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Categoria'}>
                    <Tag>{entry.category.name}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label={'Data'}>
                    {transformStringToDate(entry.transactedOn)}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Valor'}>
                    {transformNumberToCurrency(entry.amount)}
                  </Descriptions.Item>
                  <Descriptions.Item label={'Ações'}>
                    <Space>
                      <DoubleConfirm
                        popConfirmTitle={`Remover ${
                          props.type === 'EXPENSE' ? 'despesa' : 'receita'
                        }?`}
                        modalTitle={`Deseja mesmo remover essa ${
                          props.type === 'EXPENSE' ? 'despesa' : 'receita'
                        }?`}
                        modalContent={`Remover uma ${
                          props.type === 'EXPENSE' ? 'despesa' : 'receita'
                        } pode gerar um impacto negativo no gráfico de receitas e despesas. Esta ação é irreversível.`}
                        disabled={!entry.canBeDeleted}
                        onConfirm={() => props.onRemove(entry.id)}
                      >
                        <Button
                          disabled={!entry.canBeDeleted}
                          type={'text'}
                          size={'small'}
                          danger
                          icon={<DeleteOutlined />}
                        />
                      </DoubleConfirm>
                      <Button
                        disabled={!entry.canBeEdited}
                        onClick={() => props.onEdit(entry.id)}
                        type={'text'}
                        size={'small'}
                        icon={<EditOutlined />}
                      />
                      <Button
                        onClick={() => props.onView(entry.id)}
                        type={'text'}
                        size={'small'}
                        icon={<EyeOutlined />}
                      />
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              </>
            );
          },
        },
        {
          dataIndex: 'description',
          title: 'Descrição',
          width: 300,
          ellipsis: true,
          responsive: ['sm'],
          render(description: CashFlow.EntrySummary['description']) {
            return <Tooltip title={description}>{description}</Tooltip>;
          },
        },
        {
          dataIndex: 'category',
          title: 'Categoria',
          align: 'center',
          width: 120,
          responsive: ['sm'],
          render(category: CashFlow.EntrySummary['category']) {
            return <Tag>{category.name}</Tag>;
          },
        },
        {
          dataIndex: 'transactedOn',
          title: 'Data',
          align: 'center',
          width: 120,
          responsive: ['sm'],
          filterDropdown() {
            return (
              <Card>
                <DatePicker.MonthPicker
                  format={'YYYY - MMMM'}
                  onChange={(date) => {
                    history.push({
                      search: `yearMonth=${
                        date?.format('YYYY-MM') || moment().format('YYYY-MM')
                      }`,
                    });
                  }}
                />
              </Card>
            );
          },
          render: transformStringToDate,
        },
        {
          dataIndex: 'amount',
          title: 'Valor',
          align: 'right',
          width: 120,
          responsive: ['sm'],
          render: transformNumberToCurrency,
        },
        {
          dataIndex: 'id',
          title: 'Ações',
          align: 'right',
          width: 120,
          responsive: ['sm'],
          render(id: number, entry: CashFlow.EntrySummary) {
            return (
              <Space>
                <DoubleConfirm
                  popConfirmTitle={`Remover ${
                    props.type === 'EXPENSE' ? 'despesa' : 'receita'
                  }?`}
                  modalTitle={`Deseja mesmo remover essa ${
                    props.type === 'EXPENSE' ? 'despesa' : 'receita'
                  }?`}
                  modalContent={`Remover uma ${
                    props.type === 'EXPENSE' ? 'despesa' : 'receita'
                  } pode gerar um impacto negativo no gráfico de receitas e despesas. Esta ação é irreversível.`}
                  disabled={!entry.canBeDeleted}
                  onConfirm={() => props.onRemove(id)}
                >
                  <Button
                    disabled={!entry.canBeDeleted}
                    type={'text'}
                    size={'small'}
                    danger
                    icon={<DeleteOutlined />}
                  />
                </DoubleConfirm>
                <Button
                  disabled={!entry.canBeEdited}
                  onClick={() => props.onEdit(id)}
                  type={'text'}
                  size={'small'}
                  icon={<EditOutlined />}
                />
                <Button
                  onClick={() => props.onView(id)}
                  type={'text'}
                  size={'small'}
                  icon={<EyeOutlined />}
                />
              </Space>
            );
          },
        },
      ]}
    />
  );
}

export default EntriesList;
