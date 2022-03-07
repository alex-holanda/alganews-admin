import { useEffect, useState, useCallback } from 'react';

import {
  Row,
  Col,
  Table,
  Button,
  Form,
  Input,
  Modal,
  notification,
  Popconfirm,
} from 'antd';
import {
  DeleteOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';

import { CashFlow } from 'alex-holanda-sdk';

import useEntryCategories from 'core/hooks/useEntryCategories';
import { Forbidden } from 'app/components/Forbidden';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';

interface EntryCategoryManagerProps {
  type: CashFlow.EntrySummary['type'];
}

function EntryCategoryManager(props: EntryCategoryManagerProps) {
  const { expenses, revenues, fetching, fetchCategories, deleteCategory } =
    useEntryCategories();

  const [showCreationModal, setShowCreationModal] = useState(false);

  const openCreationModal = useCallback(() => setShowCreationModal(true), []);
  const closeCreationModal = useCallback(() => setShowCreationModal(false), []);

  const [forbidden, setForbidden] = useState(false);

  const { xs } = useBreakpoint();

  useEffect(() => {
    fetchCategories().catch((error) => {
      if (error?.data?.status === 403) {
        setForbidden(true);
        return;
      }

      throw error;
    });
  }, [fetchCategories]);

  if (forbidden) {
    return <Forbidden />;
  }

  return (
    <>
      <Modal
        visible={showCreationModal}
        onCancel={() => {
          closeCreationModal();
        }}
        title={'Adicionar categoria'}
        footer={null}
        destroyOnClose
      >
        <CategoryForm type={props.type} onSuccess={closeCreationModal} />
      </Modal>
      <Row justify={'space-between'} style={{ marginBottom: 16 }}>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => fetchCategories()}
          loading={fetching}
        >
          {xs ? 'Atualizar' : 'Atualizar categorias'}
        </Button>
        <Button
          onClick={openCreationModal}
          icon={<PlusCircleOutlined />}
          type={'primary'}
        >
          {xs ? 'Adicionar' : 'Adicionar categorias'}
        </Button>
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
            render(
              id: CashFlow.CategorySummary['id'],
              category: CashFlow.CategorySummary
            ) {
              return (
                <Popconfirm
                  title={'Remover categoria'}
                  onConfirm={async () => {
                    await deleteCategory(id);

                    notification.success({ message: 'Categoria removida' });
                  }}
                  disabled={!category.canBeDeleted}
                >
                  <Button
                    disabled={!category.canBeDeleted}
                    type={'text'}
                    size={'small'}
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              );
            },
          },
        ]}
      />
    </>
  );
}

interface CategoryFormProps {
  type: CashFlow.EntrySummary['type'];
  onSuccess: () => any;
}

function CategoryForm(props: CategoryFormProps) {
  const { type, onSuccess } = props;

  const [form] = Form.useForm<CashFlow.CategoryInput>();
  const { createCategory, fetching } = useEntryCategories();

  const handleFormSubmit = useCallback(
    async (categoryInput: CashFlow.CategoryInput) => {
      const newCategoryDTO: CashFlow.CategoryInput = {
        ...categoryInput,
        type,
      };

      await createCategory(newCategoryDTO);

      onSuccess();

      notification.success({
        message: 'Categoria cadastrada com sucesso',
      });
    },
    [createCategory, onSuccess, type]
  );

  return (
    <>
      <Form layout='vertical' onFinish={handleFormSubmit} form={form}>
        <Row justify='end'>
          <Col xs={24}>
            <Form.Item
              label={'Categoria'}
              name={'name'}
              rules={[
                {
                  required: true,
                  message: 'O nome da categoria é obrigatório',
                },
              ]}
            >
              <Input placeholder={'E.g.: Infra'} />
            </Form.Item>
          </Col>
          <Button
            type={'primary'}
            htmlType='submit'
            icon={<CheckCircleOutlined />}
            loading={fetching}
          >
            Cadastrar categoria
          </Button>
        </Row>
      </Form>
    </>
  );
}

export default EntryCategoryManager;
