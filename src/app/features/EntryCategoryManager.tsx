import { useEffect } from 'react';

import { Row, Table, Button, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { CashFlow } from 'alex-holanda-sdk';

import useEntryCategories from 'core/hooks/useEntryCategories';

function EntryCategoryManager() {
  const { expenses, revenues, fetching, fetchCategories } =
    useEntryCategories();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <>
      <Typography.Title level={3}>Categorias</Typography.Title>
      <Row justify={'space-between'}>
        <Button>Atualizar</Button>
        <Button>Adicionar</Button>
      </Row>
      <Table<CashFlow.CategorySummary>
        rowKey={'id'}
        dataSource={expenses}
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
