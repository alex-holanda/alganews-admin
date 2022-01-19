import { useEffect } from 'react';

import { Row, Table, Button, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { CashFlow } from 'alex-holanda-sdk';

import useEntryCategories from 'core/hooks/useEntryCategories';

interface EntryCategoryManagerProps {
  type: CashFlow.EntrySummary['type'];
}

function EntryCategoryManager(props: EntryCategoryManagerProps) {
  const { expenses, revenues, fetching, fetchCategories } =
    useEntryCategories();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <>
      <Typography.Title level={3}>Categorias</Typography.Title>
      <Row justify={'space-between'} style={{marginBottom: 16}}>
        <Button>Atualizar</Button>
        <Button>Adicionar</Button>
      </Row>
      <Table<CashFlow.CategorySummary>
        rowKey={'id'}
        size={'small'}
        loading={fetching}
        dataSource={props.type === 'EXPENSE' ? expenses : revenues}
        columns={[
          {
            dataIndex: 'name',
            title: 'Descrição',
            width: 240,
          },
          {
            dataIndex: 'totalEntries',
            title: 'Vínculos',
            align: 'right',
          },
          {
            dataIndex: 'id',
            title: 'Ações',
            align: 'right',
            render(id: CashFlow.CategorySummary['id']) {
              return (
                <>
                  <Button
                    type={'text'}
                    size={'small'}
                    danger
                    icon={<DeleteOutlined />}
                  />
                </>
              );
            },
          },
        ]}
      />
    </>
  );
}

export default EntryCategoryManager;
