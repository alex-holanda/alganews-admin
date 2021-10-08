import { Form, Row, Col, Avatar, Input, DatePicker, Divider } from 'antd';
import { Select } from 'antd';
import ptBR from 'antd/es/date-picker/locale/pt_BR';

export default function UserForm() {
  return (
    <Form layout={'vertical'}>
      <Row gutter={24} align={'middle'}>
        <Col lg={4}>
          <Avatar size={128} />
        </Col>

        <Col lg={10}>
          <Form.Item label={'Nome'}>
            <Input placeholder={'E.g.: João Silva'} />
          </Form.Item>

          <Form.Item label={'Data de nascimento'}>
            <DatePicker
              locale={ptBR}
              placeholder={'Selecione uma data'}
              format={'DD/MM/YYYY'}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col lg={10}>
          <Form.Item label={'Bio'}>
            <Input.TextArea rows={5} />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Divider />
        </Col>

        <Col lg={12}>
          <Form.Item label={'Perfil'}>
            <Select placeholder={'Selecione um perfil'}>
              <Select.Option value={'EDITOR'}>Editor</Select.Option>
              <Select.Option value={'ASSISTENT'}>Assistente</Select.Option>
              <Select.Option value={'MANAGER'}>Gerente</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col lg={12}>
          <Form.Item label={'E-mail'}>
            <Input
              type={'email'}
              placeholder={'E.g.: contato@joao.silva.com'}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
