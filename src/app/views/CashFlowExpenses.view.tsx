import {
  Button,
  Divider,
  Modal,
  Row,
  Space,
  Tooltip,
  Typography,
  notification,
} from 'antd';
import {
  InfoCircleFilled,
  TagOutlined,
  CloseOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';

import EntriesList from 'app/features/EntriesList';
import useCashFlow from 'core/hooks/useCashFlow';

import { CashFlow } from 'alex-holanda-sdk';
import { DoubleConfirm } from 'app/components/DoubleConfirm';
import { useCallback, useState } from 'react';
import EntryCategoryManager from 'app/features/EntryCategoryManager';
import moment from 'moment';
import EntryForm from 'app/features/EntryForm';

const { Title, Text } = Typography;

export default function CashFlowExpensesView() {
  const type: CashFlow.EntrySummary['type'] = 'EXPENSE';

  const { selected, removeEntriesInBatch, query } = useCashFlow(type);

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const openCategoryModal = useCallback(() => setShowCategoryModal(true), []);
  const closeCategoryModal = useCallback(() => setShowCategoryModal(false), []);

  const [showFormModal, setShowFormModal] = useState(false);

  const openFormModal = useCallback(() => setShowFormModal(true), []);
  const closeFormModal = useCallback(() => setShowFormModal(false), []);

  return (
    <>
      <Modal
        visible={showCategoryModal}
        onCancel={closeCategoryModal}
        closeIcon={<CloseOutlined />}
        title={'Gerenciar categorias'}
        footer={null}
        destroyOnClose
      >
        <EntryCategoryManager type={type} />
      </Modal>

      <Modal
        visible={showFormModal}
        onCancel={closeFormModal}
        closeIcon={<CloseOutlined />}
        title={'Cadastrar despesa'}
        footer={null}
        destroyOnClose
      >
        <EntryForm
          type={type}
          onSuccess={() => {
            closeFormModal();

            notification.success({
              message: 'Entrada cadastrada com sucesso',
            });
          }}
        />
      </Modal>

      <Space direction={'vertical'}>
        <Title level={3}>
          {`Recuperando entradas de ${moment(query.yearMonth).format(
            'MMMM [de] YYYY'
          )}`}
        </Title>
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

        <Space>
          <Button
            onClick={openCategoryModal}
            type={'primary'}
            size={'middle'}
            icon={<TagOutlined />}
          >
            Categorias
          </Button>
          <Button
            onClick={openFormModal}
            type={'primary'}
            size={'middle'}
            icon={<PlusCircleOutlined />}
          >
            Adicionar despesa
          </Button>
        </Space>
      </Row>

      <EntriesList type={type} />
    </>
  );
}
