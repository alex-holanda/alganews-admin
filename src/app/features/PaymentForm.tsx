import {
  Col,
  Form,
  Row,
  Select,
  DatePicker,
  Button,
  Input,
  Divider,
  Tabs,
  Descriptions,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';

import moment from 'moment';

import { Payment } from 'alex-holanda-sdk';

import { useUsers } from '../../core/hooks/useUsers';
import CurrencyInput from '../components/CurrencyInput';
import { useCallback, useState } from 'react';
import { TabPane } from 'rc-tabs';
import { FieldData } from 'rc-field-form/lib/interface';

export function PaymentForm() {
  const { editors } = useUsers();

  const [form] = useForm<Payment.Input>();
  const [activeTab, setActiveTab] = useState<'demonstrative' | 'bankAccount'>(
    'demonstrative'
  );

  const handleFormChange = useCallback(([field]: FieldData[]) => {
    if (Array.isArray(field.name)) {
      if (
        field.name.includes('payee') ||
        field.name.includes('_accountingPeriod') ||
        field.name.includes('bonuses')
      ) {
        console.log('É necessário atualizar à prévia de pagamento');
      }
    }
  }, []);

  return (
    <>
      <Form<Payment.Input>
        form={form}
        layout={'vertical'}
        onFinish={(form) => console.log(form)}
        onFieldsChange={handleFormChange}
      >
        <Row gutter={24}>
          <Col xs={24} sm={8}>
            <Form.Item label={'Editor'} name={['payee', 'id']}>
              <Select
                showSearch
                filterOption={(input, option) => {
                  return (
                    (option?.children as string)
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0 ||
                    (option?.children as string)
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  );
                }}
              >
                {editors.map((editor) => (
                  <Select.Option key={editor.id} value={editor.id}>
                    {editor.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item hidden name={['accountingPeriod', 'startsOn']}>
              <Input hidden />
            </Form.Item>
            <Form.Item hidden name={['accountingPeriod', 'endsOn']}>
              <Input hidden />
            </Form.Item>
            <Form.Item label={'Período'} name={'_accountingPeriod'}>
              <DatePicker.RangePicker
                format={'DD/MM/YYYY'}
                style={{ width: '100%' }}
                onChange={(date) => {
                  if (date !== null) {
                    const [startsOn, endsOn] = date as moment.Moment[];
                    form.setFieldsValue({
                      accountingPeriod: {
                        startsOn: startsOn?.format('YYYY-MM-DD'),
                        endsOn: endsOn?.format('YYYY-MM-DD'),
                      },
                    });
                  } else {
                    form.setFieldsValue({
                      accountingPeriod: {
                        startsOn: undefined,
                        endsOn: undefined,
                      },
                    });
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item label={'Agendamento'} name={'scheduledTo'}>
              <DatePicker
                showToday={false}
                disabledDate={(date) => {
                  return (
                    date.isBefore(moment()) ||
                    date.isAfter(moment().add(7, 'day'))
                  );
                }}
                format={'DD/MM/YYYY'}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          <Divider />

          <Col xs={24} sm={12}>
            <Tabs
              defaultActiveKey={'demonstrative'}
              activeKey={activeTab}
              onChange={(tab) =>
                setActiveTab(tab as 'demonstrative' | 'bankAccount')
              }
            >
              <TabPane key={'demonstrative'} tab={'Demonstrativo'} forceRender>
                <Descriptions
                  column={1}
                  bordered
                  labelStyle={{ width: 160 }}
                  size={'small'}
                >
                  <Descriptions.Item label={'Editor'}>
                    Daniel Bonifácio
                  </Descriptions.Item>

                  <Descriptions.Item label={'Período'}>
                    {'20/07/2021 á 30/07/2021'}
                  </Descriptions.Item>

                  <Descriptions.Item label={'Agendamento'}>
                    {' 05/08/2021'}
                  </Descriptions.Item>

                  <Descriptions.Item label={'Palavras'}>
                    {432}
                  </Descriptions.Item>

                  <Descriptions.Item label={'Ganhos'}>
                    {'R$ 23.432,00'}
                  </Descriptions.Item>

                  {[0].map((bonus, index) => {
                    return (
                      <Descriptions.Item label={'Bônus 1'} key={index}>
                        {'R$ 15.000,00'}
                      </Descriptions.Item>
                    );
                  })}

                  <Descriptions.Item label={'Ganhos'}>
                    {'R$ 7.432,00'}
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>
              <TabPane key={'bankAccount'} tab={'Dados bancários'} forceRender>
                <Descriptions
                  column={1}
                  bordered
                  labelStyle={{ width: 160 }}
                  size={'small'}
                >
                  <Descriptions.Item label={'Código do banco'}>
                    {'341'}
                  </Descriptions.Item>

                  <Descriptions.Item label={'Número da conta'}>
                    {'1065160'}
                  </Descriptions.Item>

                  <Descriptions.Item label={'Dígito da conta'}>
                    {'8'}
                  </Descriptions.Item>

                  <Descriptions.Item label={'Agência'}>
                    {'0001'}
                  </Descriptions.Item>

                  <Descriptions.Item label={'Tipo de conta'}>
                    {'Conta Corrente'}
                  </Descriptions.Item>
                </Descriptions>
              </TabPane>
            </Tabs>
          </Col>

          <Col xs={24} sm={12}>
            <Form.List name={'bonuses'}>
              {(fields, { add, remove }) => {
                return (
                  <>
                    {fields.map((field) => {
                      return (
                        <Row gutter={24} key={field.key}>
                          <Col xs={24} sm={14}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'title']}
                              label={'Descrição'}
                            >
                              <Input placeholder={'E.g.: 1 milhão de views'} />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={6}>
                            <Form.Item
                              {...field}
                              name={[field.name, 'amount']}
                              label={'Valor'}
                            >
                              <CurrencyInput
                                onChange={(a, amount) => {
                                  const { bonuses } = form.getFieldsValue();
                                  form.setFieldsValue({
                                    bonuses: bonuses?.map((bonus, index) => {
                                      return index === field.name
                                        ? {
                                            title: bonus.title,
                                            amount,
                                          }
                                        : bonus;
                                    }),
                                  });
                                }}
                              />
                            </Form.Item>
                          </Col>
                          <Col xs={24} sm={4}>
                            <Form.Item label={'Remover'}>
                              <Button
                                onClick={() => remove(field.name)}
                                danger
                                size={'small'}
                                icon={<DeleteOutlined />}
                              />
                            </Form.Item>
                          </Col>
                        </Row>
                      );
                    })}
                    <Button
                      type='dashed'
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Adicionar bônus
                    </Button>
                  </>
                );
              }}
            </Form.List>
          </Col>
        </Row>

        <Button htmlType={'submit'}>enviar</Button>
      </Form>
    </>
  );
}
