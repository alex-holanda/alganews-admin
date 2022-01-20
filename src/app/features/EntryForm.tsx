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

function EntryForm() {
  return (
    <>
      <Form layout={'vertical'}>
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item label={'Descrição'}>
              <Input placeholder={'E.g.: Pagamento mensal AWS'} />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label={'Categoria'}>
              <Input placeholder={'E.g.: Pagamento mensal AWS'} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label={'Montante'}>
              <CurrencyInput onChange={() => null} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label={'Data de entrada'}>
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
