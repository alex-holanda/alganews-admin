import { Button, Divider, Row, Space, Tooltip, Typography } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';

import EntriesList from 'app/features/EntriesList';
import useCashFlow from 'core/hooks/useCashFlow';

import { CashFlow } from 'alex-holanda-sdk';

const { Title, Text } = Typography;

export default function CashFlowExpensesView() {
  const type: CashFlow.EntrySummary['type'] = 'EXPENSE';

  const { selected, setSelected } = useCashFlow(type);

  return (
    <>
      <Space direction={'vertical'}>
        <Title level={3}>Recuperando entradas do mês de agosto</Title>
        <Space>
          <Text>É possível filtrar lançamentos por mês</Text>
          <Tooltip placement={'right'} title={'Use a coluna Data para filtrar'}>
            <InfoCircleFilled />
          </Tooltip>
        </Space>
      </Space>

      <Divider />

      <Row>
        <Button type={'primary'} disabled={!selected.length}>
          Remover
        </Button>
      </Row>

      <EntriesList type={type} selected={selected} onSelect={setSelected} />
    </>
  );
}
