import {
  Col,
  Form,
  Row,
  Select,
  DatePicker,
  Button,
  Input,
  Divider,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useForm } from 'antd/lib/form/Form';

import moment from 'moment';

import { Payment } from 'alex-holanda-sdk';

import { useUsers } from '../../core/hooks/useUsers';
import CurrencyInput from '../components/CurrencyInput';

export function PaymentForm() {
  const { editors } = useUsers();

  const [form] = useForm();

  return (
    <>
      <Form<Payment.Input>
        form={form}
        layout={'vertical'}
        onFinish={(form) => console.log(form)}
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
            <Form.Item label={'Período'} name={'_accountPeriod'}>
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
            todo: payment preview
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
                                  form.setFieldsValue({
                                    [field.name]: amount,
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
