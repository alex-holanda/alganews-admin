import { useEffect } from 'react';

import { Button, Space, Table, Tag } from 'antd';
import { DeleteOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';

import { CashFlow } from 'alex-holanda-sdk';

import useCashFlow from 'core/hooks/useCashFlow';
import { transformStringToDate } from 'core/util/transformStringToDate';
import { transformNumberToCurrency } from 'core/util/transformNumberToCurrency';

function EntriesList() {
  const { entries, fetchingEntries, fetchEntries } = useCashFlow();

  useEffect(() => {
    fetchEntries({
      type: 'EXPENSE',
      sort: ['transactedOn', 'desc'],
      yearMonth: '2021-12',
    });
  }, [fetchEntries]);

  return (
    <Table<CashFlow.EntrySummary>
      loading={fetchingEntries}
      rowKey={'id'}
      dataSource={entries}
      columns={[
        {
          dataIndex: 'description',
          title: 'Descrição',
          width: 300,
          ellipsis: true,
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
          render(id: number) {
            return (
              <Space>
                <Button
                  type={'text'}
                  size={'small'}
                  danger
                  icon={<DeleteOutlined />}
                />
                <Button type={'text'} size={'small'} icon={<EditOutlined />} />
                <Button type={'text'} size={'small'} icon={<EyeOutlined />} />
              </Space>
            );
          },
        },
      ]}
    />
  );
}

export default EntriesList;
