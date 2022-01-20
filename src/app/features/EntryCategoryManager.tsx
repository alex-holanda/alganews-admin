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
} from 'antd';
import { DeleteOutlined, CheckCircleOutlined } from '@ant-design/icons';

import { CashFlow } from 'alex-holanda-sdk';

import useEntryCategories from 'core/hooks/useEntryCategories';

interface EntryCategoryManagerProps {
  type: CashFlow.EntrySummary['type'];
}

function EntryCategoryManager(props: EntryCategoryManagerProps) {
  const { expenses, revenues, fetching, fetchCategories } =
    useEntryCategories();

  const [showCreationModal, setShowCreationModal] = useState(false);

  const openCreationModal = useCallback(() => setShowCreationModal(true), []);
  const closeCreationModal = useCallback(() => setShowCreationModal(false), []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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
        <Button>Atualizar</Button>
        <Button onClick={openCreationModal}>Adicionar</Button>
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

interface CategoryFormProps {
  type: CashFlow.EntrySummary['type'];
  onSuccess: () => any;
}

function CategoryForm(props: CategoryFormProps) {
  const { type, onSuccess } = props;

  const [form] = Form.useForm<CashFlow.CategoryInput>();
  const { createCategory } = useEntryCategories();

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
          >
            Cadastrar categoria
          </Button>
        </Row>
      </Form>
    </>
  );
}

export default EntryCategoryManager;
