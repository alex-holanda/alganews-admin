import { useCallback, useEffect, useState } from 'react';

import {
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  Divider,
  Space,
  Button,
  notification,
  Skeleton,
} from 'antd';

import CurrencyInput from 'app/components/CurrencyInput';

import moment, { Moment } from 'moment';

import { CashFlow, CashFlowService } from 'alex-holanda-sdk';

import { useMemo } from 'react';

import useEntriesCategory from 'core/hooks/useEntryCategories';
import useCashFlow from 'core/hooks/useCashFlow';
import { Forbidden } from 'app/components/Forbidden';

type EntryInputForm = Omit<CashFlow.EntryInput, 'transactedOn'> & {
  transactedOn: Moment;
};

interface EntryFormProps {
  type: CashFlow.EntrySummary['type'];
  onSuccess: () => any;
  onCancel: () => any;
  editingEntry?: number | undefined;
}

function EntryForm({
  type,
  onSuccess,
  editingEntry,
  onCancel,
}: EntryFormProps) {
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const { revenues, expenses, fetching, fetchCategories } =
    useEntriesCategory();

  const {
    createEntry,
    fetching: fetchingEntries,
    updateEntry,
  } = useCashFlow(type);

  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (editingEntry) {
      setLoading(true);

      CashFlowService.getExistingEntry(editingEntry)
        .then((entry) => ({
          ...entry,
          transactedOn: moment(entry.transactedOn),
        }))
        .then(form.setFieldsValue)
        .finally(() => setLoading(false));
    }
  }, [editingEntry, form]);

  useEffect(() => {
    fetchCategories().catch((error) => {
      if (error?.data?.status === 403) {
        setForbidden(true);
        return;
      }

      throw error;
    });
  }, [fetchCategories]);

  const categories = useMemo(
    () => (type === 'EXPENSE' ? expenses : revenues),
    [type, revenues, expenses]
  );

  const handleFormSubmit = useCallback(
    async (entry: EntryInputForm) => {
      try {
        const newEntryDTO: CashFlow.EntryInput = {
          ...entry,
          transactedOn: entry.transactedOn.format('YYYY-MM-DD'),
          type,
        };

        editingEntry
          ? await updateEntry(editingEntry, newEntryDTO)
          : await createEntry(newEntryDTO);

        onSuccess();
      } catch (error) {
        if (error?.data?.objects) {
          form.setFields(
            error.data.objects.map((err: any) => {
              return {
                name: err.name
                  ?.split(/(\.|\[|\])/gi)
                  .filter(
                    (str: string) =>
                      str !== '.' && str !== '[' && str !== ']' && str !== ''
                  )
                  .map((str: string) =>
                    isNaN(Number(str)) ? str : Number(str)
                  ) as string[],
                errors: [err.userMessage],
              };
            })
          );
        } else {
          notification.error({
            message: error.message,
            description:
              error.data?.detail === 'Network Error'
                ? 'Erro na rede'
                : error.data?.detail || 'Houve um erro',
          });
        }
      }
    },
    [type, createEntry, onSuccess, form, editingEntry, updateEntry]
  );

  if (forbidden) {
    return <Forbidden />;
  }

  return loading ? (
    <>
      <Skeleton />
      <Skeleton title={false} />
      <Skeleton title={false} />
    </>
  ) : (
    <>
      <Form
        autoComplete={'off'}
        form={form}
        layout={'vertical'}
        onFinish={handleFormSubmit}
      >
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label={'Descri????o'}
              name={'description'}
              rules={[
                {
                  required: true,
                  message: 'Campo obrigat??rio',
                },
              ]}
            >
              <Input placeholder={'E.g.: Pagamento mensal AWS'} />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label={'Categoria'}
              name={['category', 'id']}
              rules={[
                {
                  required: true,
                  message: 'Campo obrigat??rio',
                },
              ]}
            >
              <Select
                placeholder={'Selecione uma categoria'}
                loading={fetching}
              >
                {categories.map((category) => (
                  <Select.Option key={category.id} value={category.id}>
                    {category.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label={'Montante'}
              name={'amount'}
              rules={[
                {
                  required: true,
                  message: 'Campo obrigat??rio',
                },
              ]}
            >
              <CurrencyInput
                onChange={(_, amount) =>
                  form.setFieldsValue({
                    amount,
                  })
                }
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label={type === 'EXPENSE' ? 'Data de sa??da' : 'Data de entrada'}
              name={'transactedOn'}
              rules={[
                {
                  required: true,
                  message: 'Campo obrigat??rio',
                },
              ]}
            >
              <DatePicker
                format={'DD/MM/YYYY'}
                style={{ width: '100%' }}
                disabledDate={(date) => {
                  return date.isAfter(moment());
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ marginTop: 0 }} />

        <Row justify={'end'}>
          <Space>
            <Button onClick={onCancel}>Cancelar</Button>
            <Button
              loading={fetchingEntries}
              type={'primary'}
              htmlType={'submit'}
            >
              {editingEntry
                ? type === 'EXPENSE'
                  ? 'Atualizar despesa'
                  : 'Atualizar receita'
                : type === 'EXPENSE'
                ? 'Cadastrar despesa'
                : 'Cadastrar receita'}
            </Button>
          </Space>
        </Row>
      </Form>
    </>
  );
}

export default EntryForm;
