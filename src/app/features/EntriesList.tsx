import { useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import { Button, Card, DatePicker, Space, Table, Tag, Tooltip } from 'antd';
import { DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';

import moment from 'moment';

import { CashFlow } from 'alex-holanda-sdk';

import useCashFlow from 'core/hooks/useCashFlow';
import { transformStringToDate } from 'core/util/transformStringToDate';
import { transformNumberToCurrency } from 'core/util/transformNumberToCurrency';
import { DoubleConfirm } from 'app/components/DoubleConfirm';

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

  useEffect(() => {
    fetchEntries();
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
          dataIndex: 'description',
          title: 'Descrição',
          width: 300,
          ellipsis: true,
          render(description: CashFlow.EntrySummary['description']) {
            return <Tooltip title={description}>{description}</Tooltip>;
          },
        },
        {
          dataIndex: 'category',
          title: 'Categoria',
          align: 'center',
          render(category: CashFlow.EntrySummary['category']) {
            return <Tag>{category.name}</Tag>;
          },
        },
        {
          dataIndex: 'transactedOn',
          title: 'Data',
          align: 'center',
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
          render: transformNumberToCurrency,
        },
        {
          dataIndex: 'id',
          title: 'Ações',
          align: 'right',
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
