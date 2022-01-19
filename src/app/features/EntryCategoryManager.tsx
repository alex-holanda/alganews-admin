import { useEffect, useState, useCallback } from 'react';

import { Row, Col, Table, Button, Form, Input, Modal } from 'antd';
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
        onCancel={closeCreationModal}
        title={'Adicionar categoria'}
        footer={null}
      >
        <CategoryForm />
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

function CategoryForm() {
  return (
    <>
      <Form layout='vertical'>
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
