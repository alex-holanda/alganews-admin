import { Button, Divider, Row, Space, Tooltip, Typography } from 'antd';
import { InfoCircleFilled } from '@ant-design/icons';

import EntriesList from 'app/features/EntriesList';
import useCashFlow from 'core/hooks/useCashFlow';

import { CashFlow } from 'alex-holanda-sdk';
import { DoubleConfirm } from 'app/components/DoubleConfirm';

const { Title, Text } = Typography;

export default function CashFlowExpensesView() {
  const type: CashFlow.EntrySummary['type'] = 'EXPENSE';

  const { selected, removeEntriesInBatch } = useCashFlow(type);

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
        <DoubleConfirm
          disabled={!selected.length}
          popConfirmTitle={`Remover ${
            selected.length > 1
              ? 'entradas selecionadas'
              : 'entrada selecionada'
          }?`}
          modalTitle={'Remover entradas'}
          modalContent={
            'Remover uma ou mais entradas, pode gerar impacto negativo no gráfico de receitas e despesas da empresa. Essa é uma ação irreversível'
          }
          onConfirm={async () =>
            await removeEntriesInBatch(selected as number[])
          }
        >
          <Button type={'primary'} disabled={!selected.length}>
            Remover
          </Button>
        </DoubleConfirm>
      </Row>

      <EntriesList type={type} />
    </>
  );
}
