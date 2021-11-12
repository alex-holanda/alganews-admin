import { Col, Form, Row, Select, DatePicker } from 'antd';

import { Payment } from 'alex-holanda-sdk';

import { useUsers } from '../../core/hooks/useUsers';
import { useEffect } from 'react';

export function PaymentForm() {
  const { users } = useUsers();

  useEffect(() => {}, []);

  return (
    <>
      <Form<Payment.Input> layout={'vertical'}>
        <Row gutter={24}>
          <Col xs={24} sm={8}>
            <Form.Item label={'Editor'}>
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
                {users.map((user) => (
                  <Select.Option key={user.id} value={user.id}>
                    {user.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item label={'Período'}>
              <DatePicker.RangePicker
                format={'DD/MM/YYYY'}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item label={'Agendamento'}>
              <DatePicker format={'DD/MM/YYYY'} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
}
