import { Row, Table, Button, Typography } from 'antd';

import { CashFlow } from 'alex-holanda-sdk';

function EntryCategoryManager() {
  return (
    <>
      <Typography.Title level={3}>Categorias</Typography.Title>
      <Row justify={'space-between'}>
        <Button>Atualizar</Button>
        <Button>Adicionar</Button>
      </Row>
      <Table<CashFlow.CategorySummary> dataSource={[]} />
    </>
  );
}

export default EntryCategoryManager;
