import {
  Button,
  Divider,
  Modal,
  Row,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import { InfoCircleFilled, TagOutlined, CloseOutlined } from '@ant-design/icons';

import EntriesList from 'app/features/EntriesList';
import useCashFlow from 'core/hooks/useCashFlow';

import { CashFlow } from 'alex-holanda-sdk';
import { DoubleConfirm } from 'app/components/DoubleConfirm';
import { useCallback, useState } from 'react';
import EntryCategoryManager from 'app/features/EntryCategoryManager';

const { Title, Text } = Typography;

export default function CashFlowExpensesView() {
  const type: CashFlow.EntrySummary['type'] = 'EXPENSE';

  const { selected, removeEntriesInBatch } = useCashFlow(type);

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const openCategoryModal = useCallback(() => setShowCategoryModal(true), []);
  const closeCategoryModal = useCallback(() => setShowCategoryModal(false), []);

  return (
    <>
      <Modal
        visible={showCategoryModal}
        onCancel={closeCategoryModal}
        closeIcon={<CloseOutlined />}
        footer={null}
      >
        <EntryCategoryManager type={type} />
      </Modal>

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

      <Row justify={'space-between'}>
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
          <Button type={'primary'} size={'middle'} disabled={!selected.length}>
            Remover
          </Button>
        </DoubleConfirm>

        <Button
          onClick={openCategoryModal}
          type={'primary'}
          size={'middle'}
          icon={<TagOutlined />}
        >
          Categorias
        </Button>
      </Row>

      <EntriesList type={type} />
    </>
  );
}
