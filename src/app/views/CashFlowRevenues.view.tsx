import { CashFlow } from 'alex-holanda-sdk';
import { Button, Modal, Row } from 'antd';
import { DoubleConfirm } from 'app/components/DoubleConfirm';
import EntriesList from 'app/features/EntriesList';
import EntryCategoryManager from 'app/features/EntryCategoryManager';
import useCashFlow from 'core/hooks/useCashFlow';
import { useCallback, useState } from 'react';
import { TagOutlined, CloseOutlined } from '@ant-design/icons';

export default function CashFlowRevenuesView() {
  const type: CashFlow.CategorySummary['type'] = 'REVENUE';

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
        title={'Gerenciar categorias'}
        footer={null}
      >
        <EntryCategoryManager type={type} />
      </Modal>
      <h2>TODO: CashFlowRevenuesView</h2>

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
