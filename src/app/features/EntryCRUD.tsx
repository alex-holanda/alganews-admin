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
import EntryDetails from 'app/features/EntryDetails';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

const { Title, Text } = Typography;

interface EntryCRUDProps {
  type: CashFlow.EntrySummary['type'];
}

export default function EntryCRUD({ type }: EntryCRUDProps) {
  const { selected, removeEntriesInBatch, query, removeEntry } =
    useCashFlow(type);

  const [editingEntry, setEditingEntry] = useState<number | undefined>(
    undefined
  );

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const openCategoryModal = useCallback(() => setShowCategoryModal(true), []);
  const closeCategoryModal = useCallback(() => setShowCategoryModal(false), []);

  const [showFormModal, setShowFormModal] = useState(false);

  const openFormModal = useCallback(() => setShowFormModal(true), []);
  const closeFormModal = useCallback(() => setShowFormModal(false), []);

  const [detailedEntry, setDetailedEntry] = useState<number | undefined>(
    undefined
  );
  const [showDetailModal, setShowDetailModal] = useState(false);

  const openDetailModal = useCallback(() => setShowDetailModal(true), []);
  const closeDetailModal = useCallback(() => setShowDetailModal(false), []);

  const { xs } = useBreakpoint();

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
        onCancel={() => {
          closeFormModal();
          setEditingEntry(undefined);
        }}
        closeIcon={<CloseOutlined />}
        title={
          editingEntry
            ? `Atualizar ${type === 'EXPENSE' ? 'despesa' : 'receita'}`
            : `Cadastrar ${type === 'EXPENSE' ? 'despesa' : 'receita'}`
        }
        footer={null}
        destroyOnClose
      >
        <EntryForm
          type={type}
          editingEntry={editingEntry}
          onSuccess={() => {
            closeFormModal();

            notification.success({
              message: editingEntry
                ? `${
                    type === 'EXPENSE' ? 'Despesa' : 'Receita'
                  } atualizada com sucesso`
                : `${
                    type === 'EXPENSE' ? 'Despesa' : 'Receita'
                  } cadastrada com sucesso`,
            });
          }}
          onCancel={() => {
            closeFormModal();
            setEditingEntry(undefined);
          }}
        />
      </Modal>

      <Modal
        visible={showDetailModal}
        onCancel={() => {
          closeDetailModal();
        }}
        closeIcon={<CloseOutlined />}
        title={'Detalhes da despesa'}
        footer={null}
        destroyOnClose
      >
        {detailedEntry && <EntryDetails entryId={detailedEntry} />}
      </Modal>

      <Space direction={'vertical'}>
        <Title level={3}>
          {`Recuperando ${
            type === 'EXPENSE' ? 'despesas' : 'receitas'
          } de ${moment(query.yearMonth).format('MMMM [de] YYYY')}`}
        </Title>
        <Space>
          <Text>
            ?? poss??vel filtrar {type === 'EXPENSE' ? 'despesas' : 'receitas'}{' '}
            por m??s
          </Text>
          <Tooltip placement={'right'} title={'Use a coluna Data para filtrar'}>
            <InfoCircleFilled />
          </Tooltip>
        </Space>
      </Space>

      <Divider />

      <Row
        justify={'space-between'}
        style={{ flexDirection: xs ? 'column-reverse' : 'row' }}
      >
        <DoubleConfirm
          disabled={!selected.length}
          popConfirmTitle={`Remover ${
            selected.length > 1
              ? type === 'EXPENSE'
                ? 'despesas selecionadas?'
                : 'receitas selecionadas?'
              : type === 'EXPENSE'
              ? 'despesa selecionada?'
              : 'receita selecionada?'
          }`}
          modalTitle={
            type === 'EXPENSE' ? 'Remover despesas?' : 'Remover receitas?'
          }
          modalContent={
            type === 'EXPENSE'
              ? 'Remover uma ou mais despesas, pode gerar impacto negativo no gr??fico de receitas e despesas da empresa. Essa ?? uma a????o irrevers??vel'
              : 'Remover uma ou mais receitas, pode gerar impacto negativo no gr??fico de receitas e despesas da empresa. Essa ?? uma a????o irrevers??vel'
          }
          onConfirm={async () =>
            await removeEntriesInBatch(selected as number[])
          }
        >
          <Button
            style={{ marginTop: xs ? 12 : 0 }}
            danger={xs ? true : false}
            type={'primary'}
            size={'middle'}
            disabled={!selected.length}
          >
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
            {`Adicionar ${type === 'EXPENSE' ? 'despesa' : 'receita'}`}
          </Button>
        </Space>
      </Row>

      <EntriesList
        type={type}
        onEdit={(id) => {
          setEditingEntry(id);
          openFormModal();
        }}
        onRemove={removeEntry}
        onView={(id) => {
          setDetailedEntry(id);
          openDetailModal();
        }}
      />
    </>
  );
}
