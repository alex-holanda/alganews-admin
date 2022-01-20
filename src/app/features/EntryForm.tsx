import { useCallback } from 'react';

import {
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  Divider,
  Space,
  Button,
} from 'antd';

import CurrencyInput from 'app/components/CurrencyInput';

import { CashFlow } from 'alex-holanda-sdk';

import { Moment } from 'moment';

type EntryInputForm = Omit<CashFlow.EntryInput, 'transactedOn'> & {
  transactedOn: Moment;
};

function EntryForm() {
  const [form] = Form.useForm();

  const handleFormSubmit = useCallback(
    (entry: EntryInputForm) => {
      console.log(entry);
      console.log(form);
    },
    [form]
  );

  return (
    <>
      <Form form={form} layout={'vertical'} onFinish={handleFormSubmit}>
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label={'Descrição'}
              name={'description'}
              rules={[
                {
                  required: true,
                  message: 'Campo obrigatório',
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
                  message: 'Campo obrigatório',
                },
              ]}
            >
              <Input placeholder={'E.g.: Pagamento mensal AWS'} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label={'Montante'}
              name={'amount'}
              rules={[
                {
                  required: true,
                  message: 'Campo obrigatório',
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
              label={'Data de entrada'}
              name={'transactedOn'}
              rules={[
                {
                  required: true,
                  message: 'Campo obrigatório',
                },
              ]}
            >
              <DatePicker format={'DD/MM/YYYY'} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ marginTop: 0 }} />

        <Row justify={'end'}>
          <Space>
            <Button>Cancelar</Button>
            <Button type={'primary'} htmlType={'submit'}>
              Cadastrar despesa
            </Button>
          </Space>
        </Row>
      </Form>
    </>
  );
}

export default EntryForm;
